const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const db = require('../config/database');
const crypto = require('crypto');

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// Middleware to get user role and permissions
async function getUserRolePermissions(req, res, next) {
  try {
    const userId = req.user.id;
    
    // Get user role information
    const userQuery = `
      SELECT u.id, u.name, u.email, u.role_id, r.name as role_name, r.privileges 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.id = ?
    `;
    
    const [userRows] = await db.execute(userQuery, [userId]);
    
    if (!userRows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = userRows[0];
    
    // Get AI permissions for this role if role exists
    let permissions = [];
    if (user.role_id) {
      const permissionsQuery = `
        SELECT table_name, access_type, column_restrictions, row_filters, query_types 
        FROM ai_role_permissions 
        WHERE role_id = ?
      `;
      
      const [permissionRows] = await db.execute(permissionsQuery, [user.role_id]);
      permissions = permissionRows;
    }
    
    // Parse privileges
    let privileges = [];
    try {
      privileges = user.privileges ? JSON.parse(user.privileges) : [];
    } catch (e) {
      console.error('Error parsing user privileges:', e);
    }
    
    req.userRole = {
      ...user,
      privileges,
      aiPermissions: permissions.reduce((acc, perm) => {
        acc[perm.table_name] = {
          access_type: perm.access_type,
          column_restrictions: perm.column_restrictions ? JSON.parse(perm.column_restrictions) : null,
          row_filters: perm.row_filters ? JSON.parse(perm.row_filters) : null,
          query_types: perm.query_types ? JSON.parse(perm.query_types) : []
        };
        return acc;
      }, {})
    };
    
    next();
  } catch (error) {
    console.error('Error getting user role permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to create or get conversation
async function getOrCreateConversation(userId, type = 'general_chat') {
  try {
    // Try to get the most recent active conversation of this type
    const [conversations] = await db.execute(
      'SELECT id FROM conversations WHERE user_id = ? AND type = ? AND status = "active" ORDER BY updated_at DESC LIMIT 1',
      [userId, type]
    );
    
    if (conversations.length > 0) {
      return conversations[0].id;
    }
    
    // Create new conversation
    const title = type === 'data_analysis' ? 'Data Analysis' : 'AI Chat';
    const [result] = await db.execute(
      'INSERT INTO conversations (user_id, title, type, last_message_at) VALUES (?, ?, ?, NOW())',
      [userId, title, type]
    );
    
    return result.insertId;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}

// Function to save message
async function saveMessage(conversationId, senderType, content, metadata = null, responseTime = null, tokensUsed = null) {
  try {
    await db.execute(
      'INSERT INTO conversation_messages (conversation_id, sender_type, content, metadata, response_time_ms, tokens_used) VALUES (?, ?, ?, ?, ?, ?)',
      [conversationId, senderType, content, JSON.stringify(metadata), responseTime, tokensUsed]
    );
    
    // Update conversation last_message_at
    await db.execute(
      'UPDATE conversations SET last_message_at = NOW() WHERE id = ?',
      [conversationId]
    );
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

// Function to log AI usage
async function logAIUsage(userId, conversationId, queryType, roleId, responseType, executionTime, tokensUsed, dataAccessed, query) {
  try {
    const queryHash = crypto.createHash('sha256').update(query).digest('hex');
    
    await db.execute(
      'INSERT INTO ai_usage_logs (user_id, conversation_id, query_type, role_id, query_hash, response_type, execution_time_ms, tokens_used, data_accessed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, conversationId, queryType, roleId, queryHash, responseType, executionTime, tokensUsed, JSON.stringify(dataAccessed)]
    );
  } catch (error) {
    console.error('Error logging AI usage:', error);
  }
}

// Check if user has permission for data queries
function canAccessDataQueries(userRole) {
  const requiredPermissions = ['ai_business_queries', 'ai_analytics', 'ai_full_access', 'all'];
  return userRole.privileges.some(priv => requiredPermissions.includes(priv));
}

// Format role-specific error message
function getRoleAccessError(roleName) {
  const messages = {
    'agent': 'As a support agent, you can only ask basic questions about users and projects. Try asking about user verification status or project information.',
    'admin': 'As an admin, you have access to business intelligence queries but cannot access sensitive personal data or system administration functions.',
    'user': 'Regular users cannot access administrative data queries. Please ask general real estate questions instead.'
  };
  
  return messages[roleName] || 'You do not have permission to access this type of data query.';
}

// AI Chat endpoint with role-based access
router.post('/chat', authenticate, getUserRolePermissions, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { query, voice_enabled = false } = req.body;
    const userId = req.user.id;
    const userRole = req.userRole;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    console.log(`🤖 AI Chat Request from user ${userId} (${userRole.role_name}): ${query}`);

    // Get or create conversation
    const conversationId = await getOrCreateConversation(userId, 'general_chat');
    
    // Save user message
    await saveMessage(conversationId, 'user', query.trim());

    // Forward request to AI Flask service with user context
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/chat`, {
      query: query.trim(),
      voice_enabled,
      user_context: {
        id: userId,
        role: userRole.role_name,
        privileges: userRole.privileges
      }
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const executionTime = Date.now() - startTime;
    const responseContent = aiResponse.data.response || aiResponse.data;

    console.log('✅ AI Service Response:', aiResponse.data);

    // Save AI response
    await saveMessage(conversationId, 'ai_general', responseContent, {
      query_type: 'general_chat',
      execution_time_ms: executionTime,
      voice_enabled
    }, executionTime, aiResponse.data.tokens_used);

    // Log usage
    await logAIUsage(
      userId, 
      conversationId, 
      'general_chat', 
      userRole.role_id, 
      'success', 
      executionTime, 
      aiResponse.data.tokens_used || 0,
      { query_type: 'general_chat', sensitive_data: false },
      query
    );

    res.json({
      success: true,
      query,
      response: responseContent,
      audio_file: aiResponse.data.audio_file || null,
      conversation_id: conversationId,
      tokens_used: aiResponse.data.tokens_used || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    console.error('❌ AI Chat Error:', error.message);
    
    // Log failed usage
    if (req.user && req.userRole) {
      await logAIUsage(
        req.user.id, 
        null, 
        'general_chat', 
        req.userRole.role_id, 
        'error', 
        executionTime, 
        0,
        { error: error.message },
        req.body.query || ''
      );
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'AI service is currently unavailable'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || 'AI service error'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// AI Backoffice endpoint with role-based access control
router.post('/backoffice', authenticate, getUserRolePermissions, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { query } = req.body;
    const userId = req.user.id;
    const userRole = req.userRole;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    console.log(`📊 Backoffice AI Request from user ${userId} (${userRole.role_name}): ${query}`);

    // Check if user has permission for data queries
    if (!canAccessDataQueries(userRole)) {
      const executionTime = Date.now() - startTime;
      
      // Log access denied
      await logAIUsage(
        userId, 
        null, 
        'data_query', 
        userRole.role_id, 
        'access_denied', 
        executionTime, 
        0,
        { access_denied: true, reason: 'insufficient_privileges' },
        query
      );
      
      return res.status(403).json({
        success: false,
        error: getRoleAccessError(userRole.role_name),
        timestamp: new Date().toISOString(),
        role_limitation: true
      });
    }

    // Get or create conversation
    const conversationId = await getOrCreateConversation(userId, 'data_analysis');
    
    // Save user message
    await saveMessage(conversationId, 'user', query.trim());

    // Forward request to AI Flask service with role permissions
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/backoffice`, {
      query: query.trim(),
      user_id: userId,
      user_context: {
        id: userId,
        role: userRole.role_name,
        privileges: userRole.privileges,
        ai_permissions: userRole.aiPermissions
      }
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const executionTime = Date.now() - startTime;
    const responseData = aiResponse.data;

    console.log('✅ Backoffice AI Response:', responseData);

    // Save AI response
    await saveMessage(conversationId, 'ai_backoffice', responseData.response, {
      query_type: 'data_analysis',
      sql_query: responseData.sql_query,
      execution_time_ms: executionTime,
      data_count: responseData.data_count || 0
    }, executionTime, responseData.tokens_used);

    // Log usage
    await logAIUsage(
      userId, 
      conversationId, 
      'analytics', 
      userRole.role_id, 
      responseData.success !== false ? 'success' : 'error', 
      executionTime, 
      responseData.tokens_used || 0,
      {
        sql_query: responseData.sql_query,
        data_count: responseData.data_count || 0,
        sensitive_data: responseData.contains_sensitive_data || false
      },
      query
    );

    res.json({
      success: true,
      query,
      response: responseData.response,
      sql_query: responseData.sql_query || null,
      data_count: responseData.data_count || 0,
      conversation_id: conversationId,
      tokens_used: responseData.tokens_used || 0,
      role_permissions: {
        role: userRole.role_name,
        can_access_sensitive_data: userRole.privileges.includes('all') || userRole.privileges.includes('ai_full_access'),
        accessible_tables: Object.keys(userRole.aiPermissions)
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    console.error('❌ Backoffice AI Error:', error.message);
    
    // Log failed usage
    if (req.user && req.userRole) {
      await logAIUsage(
        req.user.id, 
        null, 
        'data_query', 
        req.userRole.role_id, 
        'error', 
        executionTime, 
        0,
        { error: error.message },
        req.body.query || ''
      );
    }

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        error: 'AI service is currently unavailable'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || 'AI service error',
        response: error.response.data.response || null
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get conversation history
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0, type } = req.query;
    
    let query = `
      SELECT c.id, c.title, c.type, c.status, c.created_at, c.updated_at, c.last_message_at,
             COUNT(cm.id) as message_count
      FROM conversations c 
      LEFT JOIN conversation_messages cm ON c.id = cm.conversation_id
      WHERE c.user_id = ? AND c.status = 'active'
    `;
    
    const params = [userId];
    
    if (type) {
      query += ' AND c.type = ?';
      params.push(type);
    }
    
    query += ' GROUP BY c.id ORDER BY c.last_message_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [conversations] = await db.execute(query, params);
    
    res.json({
      success: true,
      conversations,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        has_more: conversations.length === parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get conversation messages
router.get('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const { limit = 50, offset = 0 } = req.query;
    
    // Verify conversation belongs to user
    const [conversations] = await db.execute(
      'SELECT id FROM conversations WHERE id = ? AND user_id = ?',
      [conversationId, userId]
    );
    
    if (!conversations.length) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    const [messages] = await db.execute(
      `SELECT id, sender_type, content, metadata, response_time_ms, tokens_used, created_at 
       FROM conversation_messages 
       WHERE conversation_id = ? 
       ORDER BY created_at ASC 
       LIMIT ? OFFSET ?`,
      [conversationId, parseInt(limit), parseInt(offset)]
    );
    
    // Parse metadata
    const parsedMessages = messages.map(msg => ({
      ...msg,
      metadata: msg.metadata ? JSON.parse(msg.metadata) : null
    }));
    
    res.json({
      success: true,
      messages: parsedMessages,
      conversation_id: conversationId
    });
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const aiResponse = await axios.get(`${AI_SERVICE_URL}/api/health`, {
      timeout: 5000
    });

    res.json({
      success: true,
      ai_service: aiResponse.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI Health Check Error:', error.message);
    
    res.status(503).json({
      success: false,
      error: 'AI service is unavailable',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 
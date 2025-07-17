const express = require('express');
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit for audio files
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Send a message to the AI chatbot
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: The message to send to the AI
 *               voice_enabled:
 *                 type: boolean
 *                 description: Whether to enable voice response
 *                 default: false
 *     responses:
 *       200:
 *         description: AI response received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 response:
 *                   type: string
 *                 audio_file:
 *                   type: string
 *                   description: Audio file path if voice enabled
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { query, voice_enabled = false } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    console.log(`🤖 AI Chat Request from user ${req.user.id}: ${query}`);

    // Forward request to AI Flask service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/chat`, {
      query: query.trim(),
      voice_enabled
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ AI Service Response:', aiResponse.data);

    res.json({
      success: true,
      query,
      response: aiResponse.data.response || aiResponse.data,
      audio_file: aiResponse.data.audio_file || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI Chat Error:', error.message);
    
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

/**
 * @swagger
 * /api/ai/backoffice:
 *   post:
 *     summary: Send a natural language query to the backoffice AI for database insights
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 description: Natural language query for database analysis
 *     responses:
 *       200:
 *         description: Backoffice AI response received successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 query:
 *                   type: string
 *                 response:
 *                   type: string
 *                 sql_query:
 *                   type: string
 *                 data_count:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/backoffice', authenticate, async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    console.log(`📊 Backoffice AI Request from user ${req.user.id}: ${query}`);

    // Forward request to AI Flask service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/backoffice`, {
      query: query.trim(),
      user_id: req.user.id
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Backoffice AI Response:', aiResponse.data);

    res.json({
      success: true,
      query,
      response: aiResponse.data.response,
      sql_query: aiResponse.data.sql_query || null,
      data_count: aiResponse.data.data_count || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Backoffice AI Error:', error.message);
    
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

/**
 * @swagger
 * /api/ai/health:
 *   get:
 *     summary: Check AI service health
 *     tags: [AI]
 *     responses:
 *       200:
 *         description: AI service is healthy
 *       503:
 *         description: AI service is unavailable
 */
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

// Speech to text using OpenAI Whisper
router.post('/speech-to-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Create form data for OpenAI API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'audio.webm',
      contentType: req.file.mimetype
    });
    formData.append('model', req.body.model || 'whisper-1');
    
    if (req.body.language && req.body.language !== 'auto') {
      formData.append('language', req.body.language);
    }

    // Call OpenAI Whisper API
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        ...formData.getHeaders()
      },
      timeout: 30000 // 30 second timeout
    });

    res.json({
      success: true,
      text: response.data.text || ''
    });

  } catch (error) {
    console.error('Speech to text error:', error.response?.data || error.message);
    
    let errorMessage = 'Failed to convert speech to text';
    if (error.response?.status === 413) {
      errorMessage = 'Audio file too large. Please try a shorter recording.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid audio format. Please try again.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try with a shorter audio file.';
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage
    });
  }
});

// Text to speech using OpenAI TTS
router.post('/text-to-speech', async (req, res) => {
  try {
    const { input, model = 'tts-1', voice = 'nova', speed = 1.0 } = req.body;

    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Text input is required' });
    }

    if (input.length > 4096) {
      return res.status(400).json({ error: 'Text too long. Maximum 4096 characters allowed.' });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Call OpenAI TTS API
    const response = await axios.post('https://api.openai.com/v1/audio/speech', {
      model,
      input,
      voice,
      speed: Math.max(0.25, Math.min(4.0, speed)) // Clamp speed between 0.25 and 4.0
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer',
      timeout: 30000 // 30 second timeout
    });

    // Set appropriate headers for audio response
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length,
      'Cache-Control': 'no-cache'
    });

    res.send(response.data);

  } catch (error) {
    console.error('Text to speech error:', error.response?.data || error.message);
    
    let errorMessage = 'Failed to generate speech';
    if (error.response?.status === 400) {
      errorMessage = 'Invalid request. Please check your input.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage
    });
  }
});

module.exports = router; 
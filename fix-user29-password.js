const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function fixUser29Password() {
  let connection;
  
  try {
    console.log('🔧 Fixing User 29 password...');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Add your MySQL password if needed
      database: 'korpor_dev'
    });
    
    console.log('✅ Connected to database');
    
    // Check current password for User 29
    const [users] = await connection.execute(
      'SELECT id, email, password FROM users WHERE id = 29'
    );
    
    if (users.length === 0) {
      console.log('❌ User 29 not found');
      return;
    }
    
    const user = users[0];
    console.log(`📧 User: ${user.email}`);
    console.log(`🔑 Current password: ${user.password}`);
    
    // Check if password is already hashed
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      console.log('✅ Password is already hashed, no action needed');
      return;
    }
    
    // Hash the plain text password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log(`🔐 New hash: ${hashedPassword}`);
    
    // Update the password in database
    await connection.execute(
      'UPDATE users SET password = ? WHERE id = 29',
      [hashedPassword]
    );
    
    console.log('✅ Password updated successfully!');
    
    // Verify the update
    const [updatedUsers] = await connection.execute(
      'SELECT password FROM users WHERE id = 29'
    );
    
    console.log(`🔍 Verification: ${updatedUsers[0].password.substring(0, 20)}...`);
    
    // Test the hash
    const isValid = await bcrypt.compare('pasword123', updatedUsers[0].password);
    console.log(`🧪 Hash verification: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the fix
fixUser29Password(); 
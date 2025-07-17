const bcrypt = require("bcryptjs");
const { sequelize } = require("./src/config/db.config");
const User = require("./src/models/User");

async function fixPasswordHash() {
  try {
    console.log("🔧 Fixing password hash for user with plain text password...");
    
    // Connect to database
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Find user 29 (the one with plain text password)
    const user = await User.findByPk(29);
    
    if (!user) {
      console.log("❌ User 29 not found");
      return;
    }

    console.log(`📧 Found user: ${user.email}`);
    console.log(`🔑 Current password: ${user.password}`);

    // Check if password is already hashed (bcrypt hashes start with $2a$)
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      console.log("✅ Password is already hashed, no action needed");
      return;
    }

    // Hash the plain text password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log(`🔐 Generated hash: ${hashedPassword}`);

    // Update the user's password
    await user.update({ password: hashedPassword });
    console.log("✅ Password hash updated successfully!");

    // Verify the update
    const updatedUser = await User.findByPk(29);
    console.log(`🔍 Verification - New password hash: ${updatedUser.password}`);

    // Test the hash
    const isValid = await bcrypt.compare("pasword123", updatedUser.password);
    console.log(`🧪 Password verification test: ${isValid ? "✅ PASSED" : "❌ FAILED"}`);

  } catch (error) {
    console.error("❌ Error fixing password hash:", error);
  } finally {
    await sequelize.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the fix
fixPasswordHash(); 
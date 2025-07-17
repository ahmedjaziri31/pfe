const { sequelize } = require("../config/db.config");
const { rawQuery } = require("../config/db.config");

const checkAndUpdateUserRole = async (email, newRole = null) => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Check current user data
    const [users] = await rawQuery(
      `SELECT u.id, u.name, u.email, u.role_id, r.name as role_name 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = ?`,
      [email]
    );

    if (!users.length) {
      console.error(`User with email ${email} not found!`);
      return;
    }

    const user = users[0];
    console.log("\n=== Current User Info ===");
    console.log(`ID: ${user.id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role ID: ${user.role_id}`);
    console.log(`Role Name: ${user.role_name || 'No role assigned'}`);

    // Show available roles
    const [roles] = await rawQuery("SELECT id, name, description FROM roles");
    console.log("\n=== Available Roles ===");
    roles.forEach(role => {
      console.log(`${role.id}: ${role.name} - ${role.description}`);
    });

    // Update role if requested
    if (newRole) {
      const targetRole = roles.find(r => r.name === newRole);
      if (!targetRole) {
        console.error(`\nRole '${newRole}' not found!`);
        console.log(`Available roles: ${roles.map(r => r.name).join(', ')}`);
        return;
      }

      if (user.role_id === targetRole.id) {
        console.log(`\nUser already has role '${newRole}'. No update needed.`);
        return;
      }

      // Update the user's role
      await rawQuery(
        "UPDATE users SET role_id = ? WHERE id = ?",
        [targetRole.id, user.id]
      );

      console.log(`\n✅ Successfully updated user role to '${newRole}'!`);
      
      // Verify the update
      const [updatedUsers] = await rawQuery(
        `SELECT u.id, u.name, u.email, u.role_id, r.name as role_name 
         FROM users u 
         LEFT JOIN roles r ON u.role_id = r.id 
         WHERE u.email = ?`,
        [email]
      );
      
      const updatedUser = updatedUsers[0];
      console.log(`New role: ${updatedUser.role_name} (ID: ${updatedUser.role_id})`);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
};

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0];
const newRole = args[1]; // Optional: 'admin', 'superadmin', etc.

if (!email) {
  console.log("Usage: node check-user-role.js <email> [newRole]");
  console.log("Examples:");
  console.log("  node check-user-role.js user@example.com");
  console.log("  node check-user-role.js user@example.com admin");
  console.log("  node check-user-role.js user@example.com superadmin");
  process.exit(1);
}

// Run the script
checkAndUpdateUserRole(email, newRole); 
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Get current table structure
      const tableInfo = await queryInterface.describeTable("projects");
      console.log("Current projects table columns:", Object.keys(tableInfo));

      // Add missing columns one by one
      const columnsToAdd = [
        {
          name: "goal_amount",
          definition: {
            type: DataTypes.DECIMAL(18, 2),
            defaultValue: 0.0,
            allowNull: false,
          },
        },
        {
          name: "current_amount",
          definition: {
            type: DataTypes.DECIMAL(18, 2),
            defaultValue: 0.0,
            allowNull: false,
          },
        },
        {
          name: "status",
          definition: {
            type: DataTypes.ENUM(
              "Pending",
              "Active",
              "Funded",
              "Completed",
              "Cancelled",
            ),
            defaultValue: "Pending",
            allowNull: false,
          },
        },
        {
          name: "property_status",
          definition: {
            type: DataTypes.ENUM("available", "under_review", "sold_out", "rented"),
            defaultValue: "under_review",
            allowNull: false,
          },
        },
        {
          name: "location",
          definition: {
            type: DataTypes.STRING(255),
            allowNull: true,
          },
        },
        {
          name: "coordinates",
          definition: {
            type: DataTypes.GEOMETRY("POINT"),
            allowNull: true,
          },
        },
        {
          name: "address_details",
          definition: {
            type: DataTypes.JSON,
            allowNull: true,
          },
        },
        {
          name: "property_size",
          definition: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
          },
        },
        {
          name: "property_type",
          definition: {
            type: DataTypes.ENUM("residential", "commercial", "industrial", "land"),
            allowNull: true,
          },
        },
        {
          name: "bedrooms",
          definition: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
        },
        {
          name: "bathrooms",
          definition: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
        },
        {
          name: "construction_year",
          definition: {
            type: DataTypes.INTEGER,
            allowNull: true,
          },
        },
        {
          name: "amenities",
          definition: {
            type: DataTypes.JSON,
            allowNull: true,
          },
        },
        {
          name: "expected_roi",
          definition: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
          },
        },
        {
          name: "rental_yield",
          definition: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
          },
        },
        {
          name: "investment_period",
          definition: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "In months",
          },
        },
        {
          name: "minimum_investment",
          definition: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: true,
          },
        },
        {
          name: "image_url",
          definition: {
            type: DataTypes.STRING(255),
            allowNull: true,
          },
        },
        {
          name: "cloudinary_public_id",
          definition: {
            type: DataTypes.STRING(255),
            allowNull: true,
          },
        },
        {
          name: "created_by",
          definition: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
              model: "users",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
          },
        },
        {
          name: "featured",
          definition: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
        },
      ];

      // Add columns that don't exist
      for (const column of columnsToAdd) {
        if (!tableInfo[column.name]) {
          console.log(`Adding ${column.name} column to projects table`);
          await queryInterface.addColumn("projects", column.name, column.definition);
        } else {
          console.log(`Column ${column.name} already exists, skipping...`);
        }
      }

      // Add indexes
      const indexesToAdd = [
        {
          name: "idx_project_status",
          fields: ["status"],
        },
        {
          name: "idx_featured",
          fields: ["featured"],
        },
        {
          name: "idx_created_by",
          fields: ["created_by"],
        },
        {
          name: "idx_property_type",
          fields: ["property_type"],
        },
      ];

      for (const index of indexesToAdd) {
        try {
          await queryInterface.addIndex("projects", index.fields, {
            name: index.name,
          });
          console.log(`Added index ${index.name}`);
        } catch (err) {
          if (err.message.includes("Duplicate key name") || err.message.includes("already exists")) {
            console.log(`Index ${index.name} already exists, skipping...`);
          } else {
            throw err;
          }
        }
      }

      console.log("✅ Projects table migration completed successfully");
    } catch (error) {
      console.error("❌ Projects table migration failed:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    const indexesToRemove = [
      "idx_project_status",
      "idx_featured", 
      "idx_created_by",
      "idx_property_type",
    ];

    for (const indexName of indexesToRemove) {
      try {
        await queryInterface.removeIndex("projects", indexName);
      } catch (err) {
        console.log(`Index ${indexName} doesn't exist or already removed`);
      }
    }

    // Remove columns
    const columnsToRemove = [
      "goal_amount",
      "current_amount", 
      "status",
      "property_status",
      "location",
      "coordinates",
      "address_details",
      "property_size",
      "property_type",
      "bedrooms",
      "bathrooms",
      "construction_year",
      "amenities",
      "expected_roi",
      "rental_yield",
      "investment_period",
      "minimum_investment",
      "image_url",
      "cloudinary_public_id",
      "created_by",
      "featured",
    ];

    for (const columnName of columnsToRemove) {
      try {
        await queryInterface.removeColumn("projects", columnName);
      } catch (err) {
        console.log(`Column ${columnName} doesn't exist or already removed`);
      }
    }
  },
}; 
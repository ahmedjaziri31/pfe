const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate, checkRole } = require("../middleware/auth");
const { Op } = require("sequelize");
const { Transaction, User, Project, Investment } = require("../models");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         account_no:
 *           type: integer
 *         name:
 *           type: string
 *         surname:
 *           type: string
 *         email:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date
 *         is_verified:
 *           type: boolean
 *         role_id:
 *           type: integer
 *         approval_status:
 *           type: string
 *           enum: [unverified, pending, approved, rejected]
 *         profile_picture:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         role_name:
 *           type: string
 *         privileges:
 *           type: array
 *           items:
 *             type: string
 *
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             pages:
 *               type: integer
 *             currentPage:
 *               type: integer
 *             limit:
 *               type: integer
 */

/**
 * @swagger
 * /api/admin/registration-requests:
 *   get:
 *     summary: Get pending registration requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending users.
 */
router.get(
  "/registration-requests",
  authenticate,
  checkRole(["admin", "super admin"]),
  adminController.getRegistrationRequests,
);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with pagination and filters
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [unverified, pending, approved, rejected]
 *         description: Filter by approval status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, surname, email, or account number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of users with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a super admin
 *       500:
 *         description: Server error
 *
 * /api/admin/users/{userId}/approval:
 *   patch:
 *     summary: Update user approval status and role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *               roleId:
 *                 type: integer
 *                 description: Required when status is 'approved'
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a super admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
/*
router.get(
  "/users",
  authenticate,
  checkRole(["admin", "super admin"]),
  adminController.getAllUsers,
);
*/

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found.
 *       404:
 *         description: User not found.
 */
router.get(
  "/users/:id",
  authenticate,
  checkRole(["admin", "super admin"]),
  adminController.getUserById,
);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               role:
 *                 type: string
 *                 enum: [user, admin, super admin]
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Invalid input data.
 */
router.post(
  "/users",
  authenticate,
  checkRole(["admin", "super admin"]),
  adminController.createUser,
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 */
router.delete(
  "/users/:id",
  authenticate,
  checkRole(["admin", "super admin"]),
  adminController.deleteUser,
);

// Get all transactions with blockchain data for admin
router.get('/transactions', authenticate, checkRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      status,
      blockchainStatus,
      dateFrom,
      dateTo,
      includeUser = false,
      includeProject = false,
      includeBlockchain = false
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { description: { [Op.like]: `%${search}%` } },
        { reference: { [Op.like]: `%${search}%` } },
        { blockchain_hash: { [Op.like]: `%${search}%` } },
        { '$user.name$': { [Op.like]: `%${search}%` } },
        { '$user.email$': { [Op.like]: `%${search}%` } }
      ];
    }

    if (type && type !== 'all') {
      whereClause.type = type;
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (blockchainStatus && blockchainStatus !== 'all') {
      whereClause.blockchain_status = blockchainStatus;
    }

    if (dateFrom || dateTo) {
      whereClause.created_at = {};
      if (dateFrom) {
        whereClause.created_at[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.created_at[Op.lte] = new Date(dateTo + ' 23:59:59');
      }
    }

    // Build include array
    const include = [];
    
    if (includeUser === 'true') {
      include.push({
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'account_no'],
        required: false
      });
    }

    if (includeProject === 'true') {
      include.push({
        model: Project,
        as: 'project',
        attributes: ['id', 'name', 'property_type', 'location'],
        required: false,
        through: {
          model: Investment,
          attributes: []
        }
      });
    }

    // Fetch transactions
    const result = await Transaction.findAndCountAll({
      where: whereClause,
      include,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Format transactions
    const transactions = result.rows.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      type: tx.type,
      amount: parseFloat(tx.amount),
      currency: tx.currency,
      status: tx.status,
      description: tx.description,
      reference: tx.reference,
      balanceType: tx.balance_type,
      metadata: tx.metadata,
      processedAt: tx.processed_at,
      createdAt: tx.created_at,
      updatedAt: tx.updated_at,
      // Blockchain fields
      blockchainHash: tx.blockchain_hash,
      blockNumber: tx.block_number,
      gasUsed: tx.gas_used,
      blockchainStatus: tx.blockchain_status,
      contractAddress: tx.contract_address,
      // Related data
      user: tx.user ? {
        id: tx.user.id,
        name: tx.user.name,
        email: tx.user.email,
        accountNo: tx.user.account_no
      } : null,
      project: tx.project ? {
        id: tx.project.id,
        name: tx.project.name,
        propertyType: tx.project.property_type,
        location: tx.project.location
      } : null
    }));

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total: result.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(result.count / limit)
        },
        stats: {
          totalTransactions: result.count,
          withBlockchainHash: result.rows.filter(tx => tx.blockchain_hash).length,
          confirmedOnBlockchain: result.rows.filter(tx => tx.blockchain_status === 'confirmed').length,
          pendingOnBlockchain: result.rows.filter(tx => tx.blockchain_status === 'pending').length,
          failedOnBlockchain: result.rows.filter(tx => tx.blockchain_status === 'failed').length
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

// Get all projects with statistics for admin
router.get('/projects', authenticate, checkRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      propertyType,
      search,
      includeStats = false
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (propertyType && propertyType !== 'all') {
      whereClause.property_type = propertyType;
    }

    // Build include array
    const include = [];
    
    if (includeStats === 'true') {
      include.push({
        model: Investment,
        as: 'investments',
        attributes: ['id', 'amount', 'status', 'created_at'],
        required: false
      });
    }

    // Fetch projects
    const result = await Project.findAndCountAll({
      where: whereClause,
      include,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Format projects with statistics
    const projects = result.rows.map(project => {
      const projectData = {
        id: project.id,
        name: project.name,
        description: project.description,
        goalAmount: parseFloat(project.goal_amount),
        currentAmount: parseFloat(project.current_amount),
        status: project.status,
        propertyStatus: project.property_status,
        location: project.location,
        propertySize: project.property_size,
        propertyType: project.property_type,
        bedrooms: project.bedrooms,
        bathrooms: project.bathrooms,
        constructionYear: project.construction_year,
        expectedRoi: project.expected_roi,
        rentalYield: project.rental_yield,
        investmentPeriod: project.investment_period,
        minimumInvestment: parseFloat(project.minimum_investment),
        imageUrl: project.image_url,
        createdBy: project.created_by,
        featured: project.featured,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      };

      // Add statistics if requested
      if (includeStats === 'true' && project.investments) {
        const investments = project.investments;
        projectData.investmentCount = investments.length;
        projectData.completionPercentage = (projectData.currentAmount / projectData.goalAmount) * 100;
        projectData.confirmedInvestments = investments.filter(inv => inv.status === 'confirmed').length;
        projectData.totalInvestedAmount = investments
          .filter(inv => inv.status === 'confirmed')
          .reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
      }

      return projectData;
    });

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          total: result.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(result.count / limit)
        },
        stats: {
          totalProjects: result.count,
          activeProjects: result.rows.filter(p => p.status === 'Active').length,
          fundedProjects: result.rows.filter(p => p.status === 'Funded').length,
          completedProjects: result.rows.filter(p => p.status === 'Completed').length,
          totalValue: result.rows.reduce((sum, p) => sum + parseFloat(p.goal_amount), 0)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message
    });
  }
});

// Get all investments with user and project data for admin
router.get('/investments', authenticate, checkRole(['super_admin', 'admin']), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      projectId,
      userId,
      dateFrom,
      dateTo,
      includeUser = false,
      includeProject = false,
      includeTransaction = false
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { '$user.name$': { [Op.like]: `%${search}%` } },
        { '$user.email$': { [Op.like]: `%${search}%` } },
        { '$user.account_no$': { [Op.like]: `%${search}%` } },
        { '$project.name$': { [Op.like]: `%${search}%` } }
      ];
    }

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (projectId) {
      whereClause.project_id = projectId;
    }

    if (userId) {
      whereClause.user_id = userId;
    }

    if (dateFrom || dateTo) {
      whereClause.created_at = {};
      if (dateFrom) {
        whereClause.created_at[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.created_at[Op.lte] = new Date(dateTo + ' 23:59:59');
      }
    }

    // Build include array
    const include = [];
    
    if (includeUser === 'true') {
      include.push({
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email', 'account_no'],
        required: false
      });
    }

    if (includeProject === 'true') {
      include.push({
        model: Project,
        as: 'project',
        attributes: ['id', 'name', 'location', 'property_type', 'goal_amount', 'current_amount'],
        required: false
      });
    }

    if (includeTransaction === 'true') {
      include.push({
        model: Transaction,
        as: 'transaction',
        attributes: ['id', 'blockchain_hash', 'blockchain_status', 'block_number', 'gas_used'],
        required: false
      });
    }

    // Fetch investments
    const result = await Investment.findAndCountAll({
      where: whereClause,
      include,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });

    // Format investments
    const investments = result.rows.map(investment => ({
      id: investment.id,
      userId: investment.user_id,
      projectId: investment.project_id,
      amount: parseFloat(investment.amount),
      status: investment.status,
      currency: investment.currency,
      paymentMethod: investment.payment_method,
      transactionId: investment.transaction_id,
      createdAt: investment.created_at,
      updatedAt: investment.updated_at,
      // Related data
      user: investment.user ? {
        id: investment.user.id,
        name: investment.user.name,
        email: investment.user.email,
        accountNo: investment.user.account_no
      } : null,
      project: investment.project ? {
        id: investment.project.id,
        name: investment.project.name,
        location: investment.project.location,
        propertyType: investment.project.property_type,
        goalAmount: parseFloat(investment.project.goal_amount),
        currentAmount: parseFloat(investment.project.current_amount)
      } : null,
      transaction: investment.transaction ? {
        id: investment.transaction.id,
        blockchainHash: investment.transaction.blockchain_hash,
        blockchainStatus: investment.transaction.blockchain_status,
        blockNumber: investment.transaction.block_number,
        gasUsed: investment.transaction.gas_used
      } : null
    }));

    res.json({
      success: true,
      data: {
        investments,
        pagination: {
          total: result.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(result.count / limit)
        },
        stats: {
          totalInvestments: result.count,
          confirmedInvestments: result.rows.filter(inv => inv.status === 'confirmed').length,
          pendingInvestments: result.rows.filter(inv => inv.status === 'pending').length,
          totalAmount: result.rows
            .filter(inv => inv.status === 'confirmed')
            .reduce((sum, inv) => sum + parseFloat(inv.amount), 0),
          uniqueInvestors: new Set(result.rows.map(inv => inv.user_id)).size
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin investments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching investments',
      error: error.message
    });
  }
});

module.exports = router;

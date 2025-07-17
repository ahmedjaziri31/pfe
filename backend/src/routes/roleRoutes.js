const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { authenticate, checkRole } = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         privileges:
 *           type: array
 *           items:
 *             type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all available roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a super admin
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - privileges
 *             properties:
 *               name:
 *                 type: string
 *               privileges:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a super admin
 *       409:
 *         description: Role name already exists
 *       500:
 *         description: Server error
 *
 * /api/roles/{roleId}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a super admin
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               privileges:
 *                 type: array
 *                 items:
 *                   type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a super admin
 *       404:
 *         description: Role not found
 *       409:
 *         description: Role name already exists
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a super admin
 *       404:
 *         description: Role not found
 *       409:
 *         description: Role is in use and cannot be deleted
 *       500:
 *         description: Server error
 */
router.get(
  "/",
  authenticate,
  checkRole(["admin", "super admin"]),
  roleController.getAllRoles,
);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Get a specific role by ID
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the role to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role found.
 *       404:
 *         description: Role not found.
 */
router.get(
  "/:id",
  authenticate,
  checkRole(["admin", "super admin"]),
  roleController.getRoleById,
);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Role Management]
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
 *               privileges:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Role created successfully.
 */
router.post(
  "/",
  authenticate,
  checkRole(["admin", "super admin"]),
  roleController.createRole,
);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update a specific role by ID
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the role to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               privileges:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Role updated successfully.
 *       404:
 *         description: Role not found.
 */
router.put(
  "/:id",
  authenticate,
  checkRole(["admin", "super admin"]),
  roleController.updateRole,
);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a specific role by ID
 *     tags: [Role Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the role to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully.
 *       404:
 *         description: Role not found.
 */
router.delete(
  "/:id",
  authenticate,
  checkRole(["admin", "super admin"]),
  roleController.deleteRole,
);

module.exports = router;

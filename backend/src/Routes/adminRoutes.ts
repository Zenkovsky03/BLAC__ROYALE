import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import { requireAdmin } from "../Middleware/adminMiddleware.ts";
import { listUsers, patchUser, userDetails } from "../Controllers/adminController.ts";

const AdminRouter = Router();

/**
 * @swagger
 * /api/admin/list-users:
 *   get:
 *     summary: List all users with pagination and filtering
 *     description: Retrieve a paginated list of all users in the system with optional search and role filtering
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter users by email, username, name, or surname
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [NORMAL, ADMIN]
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: Successfully retrieved users list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       email:
 *                         type: string
 *                       username:
 *                         type: string
 *                       role:
 *                         type: string
 *                         enum: [NORMAL, ADMIN]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       _count:
 *                         type: object
 *                         properties:
 *                           sapperMaps:
 *                             type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
AdminRouter.get('/list-users', protect, requireAdmin, listUsers);

/**
 * @swagger
 * /api/admin/user-details/{id}:
 *   get:
 *     summary: Get detailed information about a specific user
 *     description: Retrieve comprehensive details of a user including wallet information and activity counts
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     dateOfBirth:
 *                       type: string
 *                       format: date-time
 *                     role:
 *                       type: string
 *                       enum: [NORMAL, ADMIN]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     wallet:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         balance:
 *                           type: number
 *                     _count:
 *                       type: object
 *                       properties:
 *                         sapperMaps:
 *                           type: integer
 *                         PasswordReset:
 *                           type: integer
 *       400:
 *         description: Bad request - User ID is required
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
AdminRouter.get('/user-details/:id', protect, requireAdmin, userDetails);

/**
 * @swagger
 * /api/admin/patch-user/{id}:
 *   patch:
 *     summary: Update user information
 *     description: Update user properties such as role, name, or surname. Admins cannot demote themselves.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [NORMAL, ADMIN]
 *                 description: User role
 *               name:
 *                 type: string
 *                 description: User's first name
 *               surname:
 *                 type: string
 *                 description: User's surname
 *           examples:
 *             changeRole:
 *               summary: Change user role to admin
 *               value:
 *                 role: ADMIN
 *             updateName:
 *               summary: Update user name
 *               value:
 *                 name: John
 *                 surname: Doe
 *             demoteUser:
 *               summary: Demote user to normal role
 *               value:
 *                 role: NORMAL
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     name:
 *                       type: string
 *                       nullable: true
 *                     surname:
 *                       type: string
 *                       nullable: true
 *                     role:
 *                       type: string
 *                       enum: [NORMAL, ADMIN]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Invalid input or cannot demote yourself
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
AdminRouter.patch('/patch-user/:id', protect, requireAdmin, patchUser);

export default AdminRouter;
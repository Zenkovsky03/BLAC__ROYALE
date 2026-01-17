import { Router } from 'express';
import { protect } from '../Middleware/auth.Middleware.ts';
import { requireAdmin } from "../Middleware/admin.Middleware.ts";
import {deleteUserAdmin, listUsers, patchUser, userDetails} from "../Controllers/admin.Controller.ts";

const AdminRouter = Router();

/**
 * @swagger
 * /api/admin/list-users:
 *   get:
 *     summary: List all users with pagination and filtering
 *     description: Retrieve a paginated list of all users in the system with optional search functionality and role-based filtering. Search works across email, username, name, and surname fields.
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
 *         description: Search term to filter users by email, username, name, or surname (case-insensitive)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [NORMAL, ADMIN]
 *         description: Filter users by their assigned role
 *     responses:
 *       200:
 *         description: Successfully retrieved paginated list of users with their basic information and activity counts
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
 *     description: Retrieve comprehensive details of a user including personal information, wallet details with balance and transaction history, and activity counts (sapper maps created, password reset attempts).
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
 *         description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved complete user details including wallet information and activity metrics
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
 *         description: Bad request - User ID parameter is required
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: User not found - No user exists with the provided ID
 *       500:
 *         description: Internal server error
 */
AdminRouter.get('/user-details/:id', protect, requireAdmin, userDetails);

/**
 * @swagger
 * /api/admin/patch-user/{id}:
 *   patch:
 *     summary: Update user information
 *     description: Partially update user properties including role, name, surname, username, and email. Multiple fields can be updated in a single request. Note that admins cannot demote themselves from the ADMIN role to prevent accidental lockout.
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
 *         description: Unique identifier of the user to update
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
 *                 description: User's role in the system
 *               name:
 *                 type: string
 *                 description: User's first name
 *               surname:
 *                 type: string
 *                 description: User's last name
 *               username:
 *                 type: string
 *                 description: User's unique username
 *               email:
 *                 type: string
 *                 description: User's email address
 *           examples:
 *             changeRole:
 *               summary: Promote user to admin
 *               value:
 *                 role: ADMIN
 *             updateName:
 *               summary: Update user's full name
 *               value:
 *                 name: John
 *                 surname: Doe
 *             demoteUser:
 *               summary: Demote user to normal role
 *               value:
 *                 role: NORMAL
 *             updateMultiple:
 *               summary: Update multiple fields at once
 *               value:
 *                 name: Jane
 *                 surname: Smith
 *                 email: jane.smith@example.com
 *     responses:
 *       200:
 *         description: User successfully updated with the provided information
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
 *         description: Bad request - Invalid field values, missing required parameters, or attempting self-demotion from admin role
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
 *         description: User not found - No user exists with the provided ID
 *       500:
 *         description: Internal server error
 */
AdminRouter.patch('/patch-user/:id', protect, requireAdmin, patchUser);

/**
 * @swagger
 * /api/admin/delete-user/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     description: Permanently deletes a user account and all associated data. This action is irreversible. Requires Bearer token authentication.
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
 *         description: The unique identifier of the user to delete
 *         example: "295c5390-72c6-4201-a0cd-1cd669fe8c57"
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "User deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Not authorized, no token"
 *       403:
 *         description: Forbidden - User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Access denied. Admin privileges required."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "User not found"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Server error"
 */
AdminRouter.delete('/delete-user/:id', protect, requireAdmin, deleteUserAdmin);

export default AdminRouter;
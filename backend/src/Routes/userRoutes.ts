import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import {register, login, profile, isAuthenticated, updateUsername, updateEmail, changePassword, deleteUser} from '../Controllers/authController.ts';
import {requestPasswordReset , verifyResetToken , resetPassword  } from '../Controllers/passwordResetController.ts';

const UserRouter = Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the authenticated user's profile information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: user@example.com
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:00.000Z
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Failed to fetch user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to fetch user profile.
 */
UserRouter.get('/profile', protect, profile )
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email, password, username, and date of birth. Users must be at least 18 years old. A wallet is automatically created for the new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - dateOfBirth
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: SecurePass123!
 *               username:
 *                 type: string
 *                 example: johndoe
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-15
 *                 description: User must be at least 18 years old
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newUser:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input, email already in use, or user too young
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already in use.
 *                 error:
 *                   type: string
 *                   example: Invalid email format
 *       500:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration failed.
 */
UserRouter.post('/register', register);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token valid for 2 hours
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT token valid for 2 hours
 *                 loggedInUser:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials.
 *       500:
 *         description: Login failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login failed.
 */
UserRouter.post('/login', login);
/**
 * @swagger
 * /api/users/update-username:
 *   patch:
 *     summary: Update username
 *     description: Updates the username for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: newusername
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username updated successfully.
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found.
 *       500:
 *         description: Failed to update username
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to update username.
 */
UserRouter.patch('/update-username', protect, updateUsername)
/**
 * @swagger
 * /api/users/update-email:
 *   patch:
 *     summary: Update user email
 *     description: Updates the email address for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: Email updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid email format or email is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email format
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email already in use
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
UserRouter.patch('/update-email', protect, updateEmail)
/**
 * @swagger
 * /api/users/changePassword:
 *   patch:
 *     summary: Change user password
 *     description: Changes the password for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPass123!
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: NewPass123!
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Invalid input or current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Current password is incorrect
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
UserRouter.patch('/changePassword', protect, changePassword)
/**
 * @swagger
 * /api/users/delete-user:
 *   delete:
 *     summary: Delete user account
 *     description: Permanently delete the authenticated user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
UserRouter.delete('/delete-user', protect, deleteUser);
/**
 * @swagger
 * /api/users/is-authenticated:
 *   get:
 *     summary: Check authentication status
 *     description: Verifies if the user is authenticated with a valid JWT token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Authenticated!
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
UserRouter.get('/is-authenticated', protect, isAuthenticated)

/**
 * @swagger
 * /api/users/reset/request-password-reset:
 *   patch:
 *     summary: Request password reset
 *     description: Sends a password reset email to the user's email address
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset link sent (returned even if email doesn't exist for security)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: A reset link has been sent
 *       400:
 *         description: Invalid or missing email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Valid email is required
 *       500:
 *         description: Internal server error
 */
UserRouter.patch('/reset/request-password-reset',  requestPasswordReset)
/**
 * @swagger
 * /api/users/reset/verifyResetToken:
 *   patch:
 *     summary: Verify password reset token
 *     description: Validates if a password reset token is valid and not expired
 *     tags: [Password Reset]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The password reset token to verify
 *         example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token is valid
 *                 valid:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired reset token
 *       500:
 *         description: Internal server error
 */
UserRouter.patch('/reset/verifyResetToken', verifyResetToken)
/**
 * @swagger
 * /api/users/reset/resetPassword:
 *   patch:
 *     summary: Reset password
 *     description: Resets the user's password using a valid reset token
 *     tags: [Password Reset]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token
 *                 example: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: The new password (must be at least 8 characters)
 *                 example: NewSecurePass123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid input, token expired, or password too short
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired reset token
 *       500:
 *         description: Internal server error
 */
UserRouter.patch('/reset/resetPassword', resetPassword)


export default UserRouter;
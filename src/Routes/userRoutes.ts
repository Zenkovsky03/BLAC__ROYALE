import { Router } from 'express';
import { protect } from '../Middleware/authMiddleware.ts';
import {register, login, profile, isAuthenticated} from '../Controllers/authController.ts';

const UserRouter = Router();

UserRouter.get('/profile', protect, profile )

UserRouter.post('/register', register);
UserRouter.post('/login', login);
UserRouter.get(/isAuthenticated/, protect, isAuthenticated)

export default UserRouter;
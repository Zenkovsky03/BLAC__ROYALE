import { Router } from 'express';
// @ts-ignore
import { protect } from '../Middleware/authMiddleware.ts';
// @ts-ignore
import {register, login, profile} from '../Controllers/authController.ts';

const UserRouter = Router();

UserRouter.get('/profile', protect, profile )

UserRouter.post('/register', register);
UserRouter.post('/login', login);

export default UserRouter;
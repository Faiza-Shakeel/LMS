import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.signIn);
router.post('/logout', verifyToken, authController.signOut);
router.get('/me', verifyToken, authController.getMe);

export default router;
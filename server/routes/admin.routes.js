import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

// Protect all admin routes
router.use(verifyToken, authorize('admin'));

// Create Instructor
router.post(
    '/instructors',
    adminController.createInstructor
);

export default router;
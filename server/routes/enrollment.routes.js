import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollment.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = Router();

// Only students enroll themselves — an instructor/admin enrolling
// someone else on their behalf would be a different, deliberately
// separate flow (not built here), not a role addition to this route.
router.post('/', verifyToken, authorize('student'), enrollmentController.enroll);

router.get('/my-courses', verifyToken, authorize('student'), enrollmentController.getMyCourses);

export default router;
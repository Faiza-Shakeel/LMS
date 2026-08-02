import { Router } from 'express';
import * as courseController from '../controllers/course.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { requireOwnership } from '../middleware/ownership.middleware.js';
import { requireEnrollment } from '../middleware/enrollment.middleware.js';

const router = Router();

// Ownership check reused across every route below that targets a
// specific existing course by :courseId.
const courseOwnership = requireOwnership({
    table: 'courses',
    idParam: 'courseId',
    select: 'id, instructor_id',
    getOwnerId: (row) => row.instructor_id,
});

// --- Public / any authenticated user -------------------------------------
router.get('/', verifyToken, courseController.listPublishedCourses);

// --- Instructor: own courses ----------------------------------------------
router.get(
    '/mine',
    verifyToken,
    authorize('instructor', 'admin'),
    courseController.listMyCourses
);

router.post(
    '/',
    verifyToken,
    authorize('instructor', 'admin'),
    courseController.createCourse
);

// Update/delete: must be instructor or admin AND must own the course
// (admins bypass the ownership check inside requireOwnership).
router.patch(
    '/:courseId',
    verifyToken,
    authorize('instructor', 'admin'),
    courseOwnership,
    courseController.updateCourse
);

router.delete(
    '/:courseId',
    verifyToken,
    authorize('instructor', 'admin'),
    courseOwnership,
    courseController.deleteCourse
);

// Adding a section is an ownership-gated write on the parent course.
router.post(
    '/:courseId/sections',
    verifyToken,
    authorize('instructor', 'admin'),
    courseOwnership,
    courseController.createSection
);

// --- Course content: owner instructor OR enrolled student OR admin -------
router.get(
    '/:courseId/content',
    verifyToken,
    requireEnrollment({ courseIdParam: 'courseId' }),
    courseController.getCourseContent
);

export default router;
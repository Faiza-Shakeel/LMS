import { Router } from 'express';
import * as courseController from '../controllers/course.controller.js';
import * as catalogController from '../controllers/courseCatalog.controller.js';
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
// Get All Courses + Search + Filter: all handled by one query-param-driven
// endpoint rather than separate routes (e.g. GET /courses?search=react&level=beginner&sort=price_low).
router.get('/', catalogController.getAllCourses);

// --- Instructor: own courses ----------------------------------------------
router.get(
    '/mine',
    verifyToken,
    authorize('instructor', 'admin'),
    courseController.listMyCourses
);

// Course Details — must be registered after '/mine' so that literal
// path isn't swallowed by this dynamic :courseId segment.
router.get('/:courseId', verifyToken, catalogController.getCourseDetails);

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
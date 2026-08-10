import { Router } from 'express';
import * as lessonController from '../controllers/lesson.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { requireOwnership } from '../middleware/ownership.middleware.js';

const router = Router();

// Create/List: ownership is resolved on the SECTION (from :sectionId in
// the URL), since that's the resource identified before a lesson exists.
// req.resource ends up being the section row either way.
const sectionOwnership = requireOwnership({
    table: 'sections',
    idParam: 'sectionId',
    select: 'id, course_id, courses(instructor_id)',
    getOwnerId: (row) => row.courses?.instructor_id,
});

// Edit/Delete: ownership is resolved on the LESSON itself (from
// :lessonId), walking two levels up — lesson -> section -> course —
// in a single nested-select query.
const lessonOwnership = requireOwnership({
    table: 'lessons',
    idParam: 'lessonId',
    select: 'id, section_id, title, position, sections(course_id, courses(instructor_id))',
    getOwnerId: (row) => row.sections?.courses?.instructor_id,
});

router.post(
    '/',
    verifyToken,
    authorize('instructor', 'admin'),
    sectionOwnership,
    lessonController.createLesson
);

router.get(
    '/',
    verifyToken,
    authorize('instructor', 'admin'),
    sectionOwnership,
    lessonController.getLessons
);

router.patch(
    '/:lessonId',
    verifyToken,
    authorize('instructor', 'admin'),
    lessonOwnership,
    lessonController.updateLesson
);

router.delete(
    '/:lessonId',
    verifyToken,
    authorize('instructor', 'admin'),
    lessonOwnership,
    lessonController.deleteLesson
);

export default router;
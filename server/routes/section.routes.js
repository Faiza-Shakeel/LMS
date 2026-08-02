import { Router } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';
import { requireOwnership } from '../middleware/ownership.middleware.js';

const router = Router();

// Sections have no instructor_id of their own — ownership is resolved by
// joining to the parent course and reading instructor_id off THAT row.
// Supabase's nested select ("courses(instructor_id)") does this in one
// query instead of two round trips.
const sectionOwnership = requireOwnership({
    table: 'sections',
    idParam: 'sectionId',
    select: 'id, course_id, title, position, courses(instructor_id)',
    getOwnerId: (row) => row.courses?.instructor_id,
});

router.patch(
    '/:sectionId',
    verifyToken,
    authorize('instructor', 'admin'),
    sectionOwnership,
    (req, res) => {
        // req.resource is the section row (with the nested course join)
        // already fetched by the ownership middleware — no re-query needed.
        res.status(200).json({ message: 'Authorized to edit this section', section: req.resource });
    }
);

router.delete(
    '/:sectionId',
    verifyToken,
    authorize('instructor', 'admin'),
    sectionOwnership,
    (req, res) => {
        res.status(200).json({ message: 'Authorized to delete this section', sectionId: req.resource.id });
    }
);

export default router;
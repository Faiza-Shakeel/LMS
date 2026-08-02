import { supabaseAdmin } from '../config/supabaseClient.js';

/**
 * Generic ownership guard. Fetches the target row and checks that the
 * requesting user owns it — either directly (e.g. courses.instructor_id)
 * or through a parent relation (e.g. sections -> courses.instructor_id),
 * using Supabase's nested-select syntax to resolve the parent in one query.
 *
 * Must run AFTER verifyToken (needs req.profile) and typically after an
 * authorize(...) role check, though it works standalone too.
 *
 * @param {object} config
 * @param {string} config.table        - table to fetch the resource from
 * @param {string} config.idParam      - route param holding the resource id (e.g. 'courseId')
 * @param {string} config.select       - Supabase select string, can include nested relations
 * @param {(row: object) => string} config.getOwnerId - extracts the owning user's id from the fetched row
 * @param {string[]} [config.bypassRoles] - roles that skip the ownership check entirely (default: ['admin'])
 *
 * On success, attaches the fetched row to req.resource so the controller
 * doesn't have to re-fetch it.
 *
 * Usage — direct ownership:
 *   requireOwnership({
 *     table: 'courses',
 *     idParam: 'courseId',
 *     select: 'id, instructor_id',
 *     getOwnerId: (row) => row.instructor_id,
 *   })
 *
 * Usage — ownership via parent (section belongs to a course belonging to an instructor):
 *   requireOwnership({
 *     table: 'sections',
 *     idParam: 'sectionId',
 *     select: 'id, course_id, courses(instructor_id)',
 *     getOwnerId: (row) => row.courses?.instructor_id,
 *   })
 */
export function requireOwnership({ table, idParam, select = '*', getOwnerId, bypassRoles = ['admin'] }) {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[idParam];

            if (!resourceId) {
                return res.status(400).json({ error: `Missing ${idParam} in request params` });
            }

            const { data, error } = await supabaseAdmin
                .from(table)
                .select(select)
                .eq('id', resourceId)
                .single();

            if (error || !data) {
                return res.status(404).json({ error: `Resource not found in ${table}` });
            }

            req.resource = data;

            // Admins (or whichever roles are configured) bypass the ownership
            // check but still get the resource attached to req above.
            if (bypassRoles.includes(req.profile.role)) {
                return next();
            }

            const ownerId = getOwnerId(data);

            if (ownerId !== req.profile.id) {
                return res.status(403).json({ error: 'You do not have permission to access this resource' });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
}
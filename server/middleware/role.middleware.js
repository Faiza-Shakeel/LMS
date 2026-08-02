/**
 * Restricts a route to one or more roles. Must run AFTER verifyToken,
 * since it relies on req.profile.role being already populated.
 *
 * Usage:
 *   router.post('/courses', verifyToken, authorize('instructor', 'admin'), controller)
 */
export function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.profile) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!allowedRoles.includes(req.profile.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}
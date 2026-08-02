import * as authService from '../services/auth.service.js';

/**
 * Verifies the Supabase access token sent in the Authorization header
 * (format: "Bearer <token>"). On success, attaches:
 *   req.user    -> the raw Supabase auth user (from auth.users)
 *   req.profile -> the public.users profile, including role name
 *
 * Any route that needs to know "who is this" or "what role are they"
 * should sit behind this middleware.
 */
export async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or malformed Authorization header' });
        }

        const token = authHeader.split(' ')[1];

        const user = await authService.verifyAccessToken(token);
        const profile = await authService.getUserProfile(user.id);

        if (!profile.isActive) {
            return res.status(403).json({ error: 'Account is deactivated' });
        }

        req.user = user;
        req.profile = profile;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
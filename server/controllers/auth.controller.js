import * as authService from '../services/auth.service.js';

export async function signUp(req, res, next) {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'password must be at least 8 characters' });
        }

        const data = await authService.signUp({ email, password, firstName, lastName });

        res.status(201).json({
            message: data.session
                ? 'Account created and signed in.'
                : 'Account created. Please check your email to confirm before signing in.',
            user: data.user,
            session: data.session, // null until email confirmation, if enabled
        });
    } catch (err) {
        next(err);
    }
}

export async function signIn(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        const data = await authService.signIn({ email, password });

        res.status(200).json({
            user: data.user,
            session: data.session, // { access_token, refresh_token, expires_at, ... }
        });
    } catch (err) {
        // Don't leak whether the email exists or the password was wrong
        res.status(401).json({ error: 'Invalid email or password' });
    }
}


export async function signOut(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        await authService.signOut(token);

        res.status(200).json({ message: 'Signed out successfully' });
    } catch (err) {
        next(err);
    }
}

export async function getMe(req, res) {
    // req.profile is populated by the verifyToken middleware
    res.status(200).json({ profile: req.profile });
}
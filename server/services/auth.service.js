import { supabaseAnon, supabaseAdmin } from '../config/supabaseClient.js';

/**
 * Creates a new auth.users identity via Supabase Auth and stores
 * first/last name in raw_user_meta_data, which the handle_new_user()
 * DB trigger reads to provision the matching public.users row
 * (defaulted to the 'student' role).
 */
export async function signUp({ email, password, firstName, lastName }) {
    const { data, error } = await supabaseAnon.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName ?? '',
                last_name: lastName ?? '',
            },
        },
    });

    if (error) throw error;
    // data.session is null if email confirmation is required before login
    return data;
}

/**
 * Authenticates against Supabase Auth and returns a session
 * (access_token + refresh_token) for the client to store.
 */
export async function signIn({ email, password }) {
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

/**
 * Revokes the session tied to the given access token.
 */
export async function signOut(accessToken) {
    if (!accessToken) return;
    const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);
    if (error) throw error;
}

/**
 * Verifies a JWT access token against Supabase Auth and returns the
 * underlying auth user if valid. Throws if the token is missing/expired/invalid.
 */
export async function verifyAccessToken(accessToken) {
    const { data, error } = await supabaseAnon.auth.getUser(accessToken);
    if (error || !data?.user) {
        throw new Error('Invalid or expired token');
    }
    return data.user;
}

/**
 * Fetches the public.users profile row (joined with its role name) for
 * a given auth user id. Uses the admin client since this must succeed
 * regardless of RLS — the middleware itself is what enforces access,
 * not this lookup.
 */
export async function getUserProfile(userId) {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('id, first_name, last_name, email, is_active, roles(name)')
        .eq('id', userId)
        .single();

    if (error) throw error;

    return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        isActive: data.is_active,
        role: data.roles?.name ?? null,
    };
}

/**
 * Triggers Supabase's built-in password recovery email. redirectTo must
 * be an allowed redirect URL in your Supabase project's Auth settings
 * (Dashboard → Authentication → URL Configuration), or Supabase will
 * reject it. Supabase itself doesn't reveal whether the email exists —
 * it responds the same way either way — which is what lets the
 * frontend show a generic "if an account exists..." message safely.
 */
export async function forgotPassword(email, redirectTo) {
    const { error } = await supabaseAnon.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
}

/**
 * Completes a password reset using the access token Supabase issues in
 * the recovery email link. Deliberately does NOT use supabaseAnon's
 * setSession() here — that would mutate the shared client's session
 * state, which is unsafe on a server handling concurrent requests from
 * different users. getUser(accessToken) is stateless/read-only, so it's
 * safe to call on the shared client; the actual password change goes
 * through supabaseAdmin, which can update any user by id directly.
 */
export async function resetPassword({ accessToken, password }) {
    const { data, error } = await supabaseAnon.auth.getUser(accessToken);
    if (error || !data?.user) {
        throw new Error('Invalid or expired reset link');
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
        password,
    });
    if (updateError) throw updateError;
}

/**
 * Admin-only operation: changes a user's role by name
 * ('admin' | 'instructor' | 'student'). Caller must already be
 * authorized as admin — this function does not check that itself.
 */
export async function updateUserRole(userId, roleName) {
    const { data: role, error: roleError } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .single();

    if (roleError || !role) throw new Error(`Unknown role: ${roleName}`);

    const { data, error } = await supabaseAdmin
        .from('users')
        .update({ role_id: role.id })
        .eq('id', userId)
        .select('id, first_name, last_name, email, role_id')
        .single();

    if (error) throw error;
    return data;
}
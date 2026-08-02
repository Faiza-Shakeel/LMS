import { supabaseAnon, supabaseAdmin } from '../config/supabaseClient.js';

/**
 * Creates a new auth.users identity via Supabase Auth and stores
 * first/last name in raw_user_meta_data, which the handle_new_user()
 * DB trigger reads to provision the matching public.users row
 * (defaulted to the 'student' role).
 */
export async function signUp({ email, password, firstName, lastName }) {
      // Check if email already exists in your users table
    const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (checkError) {
        throw checkError;
    }

    if (existingUser) {
        throw new Error('User already exists.');
    }

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
export async function createInstructor({
    email,
    password,
    firstName,
    lastName,
}) {
    // 1. Check if instructor role exists
    const { data: instructorRole, error: roleError } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', 'instructor')
        .single();

    if (roleError) {
          console.error("Role Error:", roleError);
        throw new Error('Instructor role not found.');
    }

    // 2. Check if user already exists
    const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (existingUser) {
        throw new Error('User already exists.');
    }

    // 3. Create auth user
    const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
            },
        });

    if (authError) {
        console.error('Error creating auth user:', authError);
        throw authError;
    }
    // 4. Insert into users table
    const { data: user, error: insertError } = await supabaseAdmin
    .from('users')
    .update({
        first_name: firstName,
        last_name: lastName,
        role_id: instructorRole.id,
    })
    .eq('id', authData.user.id);

    if (insertError) {
        // Roll back auth user
       
         console.error("Insert Error:", insertError);
        throw insertError;
    }

    return user;
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
//  * Admin-only operation: changes a user's role by name
//  * ('admin' | 'instructor' | 'student'). Caller must already be
//  * authorized as admin — this function does not check that itself.
//  */
// export async function updateUserRole(userId, roleName) {
//     const { data: role, error: roleError } = await supabaseAdmin
//         .from('roles')
//         .select('id')
//         .eq('name', roleName)
//         .single();

//     if (roleError || !role) throw new Error(`Unknown role: ${roleName}`);

//     const { data, error } = await supabaseAdmin
//         .from('users')
//         .update({ role_id: role.id })
//         .eq('id', userId)
//         .select('id, first_name, last_name, email, role_id')
//         .single();

//     if (error) throw error;
//     return data;
// }
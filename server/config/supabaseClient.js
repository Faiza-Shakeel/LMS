import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
        'Missing Supabase environment variables. Check your .env file against .env.example.'
    );
}

// Public/anon client: used for anything the end user is allowed to trigger
// directly — sign up, sign in, sign out, verifying a token.
//
// `global: { fetch }` pins the SDK to Node's native fetch. Without this,
// the SDK's own fetch auto-detection can pick an internal implementation
// that fails silently on some Windows setups (AuthRetryableFetchError
// with no useful detail), even though native fetch works fine directly.
export const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  
});

// Privileged client: bypasses Row Level Security entirely. Only ever used
// inside trusted server-side code (profile lookups, role changes).
// NEVER expose SUPABASE_SERVICE_ROLE_KEY or this client to the frontend.
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
});
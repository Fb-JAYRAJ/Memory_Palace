import { supabase } from "./supabase";

/**
 * Create a new user account
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Login with email + password
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Logout current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get currently authenticated user
 */
export async function getUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Subscribe to auth changes (login / logout)
 * Returns an unsubscribe function
 */
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });

  return data.subscription;
}

import { createClient as createServerClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  const supabase = await createServerClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getCurrentSession() {
  const supabase = await createServerClient();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message, success: false };
    }

    return { data, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return { error: message, success: false };
  }
}

export async function signIn(email: string, password: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message, success: false };
    }

    return { data, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return { error: message, success: false };
  }
}

export async function signOut() {
  const supabase = await createServerClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message, success: false };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return { error: message, success: false };
  }
}

export async function resetPassword(email: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return { error: error.message, success: false };
    }

    return { data, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return { error: message, success: false };
  }
}

export async function updatePassword(password: string) {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { error: error.message, success: false };
    }

    return { data, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return { error: message, success: false };
  }
}

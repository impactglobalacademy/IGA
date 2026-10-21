import { createClient as createServerClient } from '@/lib/supabase/server';

// ============================================================================
// PROGRAMMES
// ============================================================================

export async function getPublishedProgrammes() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('programmes')
    .select('*')
    .eq('status', 'published')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programmes:', error);
    return [];
  }

  return data || [];
}

export async function getProgrammeBySlug(slug: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('programmes')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching programme:', error);
    return null;
  }

  return data;
}

export async function getProgrammeById(id: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('programmes')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching programme:', error);
    return null;
  }

  return data;
}

export async function getAllProgrammes() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('programmes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all programmes:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// ENROLMENTS
// ============================================================================

export async function getUserEnrolments(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('enrolments')
    .select('id, status, created_at, programme_id, programmes(id, title, slug, category, short_description)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching enrolments:', error);
    return [];
  }

  return data || [];
}

export async function checkUserEnrolment(userId: string, programmeId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('enrolments')
    .select('id')
    .eq('user_id', userId)
    .eq('programme_id', programmeId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking enrolment:', error);
  }

  return !!data;
}

export async function createEnrolment(userId: string, programmeId: string) {
  const supabase = await createServerClient();

  // Check if already enrolled
  const existingEnrolment = await checkUserEnrolment(userId, programmeId);
  if (existingEnrolment) {
    return { error: 'Already enrolled in this programme', success: false };
  }

  const { data, error } = await supabase
    .from('enrolments')
    .insert([
      {
        user_id: userId,
        programme_id: programmeId,
        status: 'active',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating enrolment:', error);
    return { error: error.message, success: false };
  }

  return { data, success: true };
}

// ============================================================================
// PROFILES
// ============================================================================

export async function getUserProfile(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Record<string, any>,
) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return { error: error.message, success: false };
  }

  return { data, success: true };
}

// ============================================================================
// NEWSLETTER
// ============================================================================

export async function subscribeNewsletter(email: string, name?: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([
      {
        email,
        full_name: name || null,
        subscribed_at: new Date(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error subscribing to newsletter:', error);
    return { error: error.message, success: false };
  }

  return { data, success: true };
}

// ============================================================================
// FACULTY
// ============================================================================

export async function getFaculty() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching faculty:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// EVENTS
// ============================================================================

export async function getUpcomingEvents() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data || [];
}

export async function getPastEvents() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .lt('event_date', new Date().toISOString())
    .order('event_date', { ascending: false });

  if (error) {
    console.error('Error fetching past events:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// RESOURCES
// ============================================================================

export async function getResources(category?: string) {
  const supabase = await createServerClient();

  let query = supabase.from('resources').select('*');

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('created_at', {
    ascending: false,
  });

  if (error) {
    console.error('Error fetching resources:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// IMPACT STORIES
// ============================================================================

export async function getImpactStories() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('impact_stories')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching impact stories:', error);
    return [];
  }

  return data || [];
}

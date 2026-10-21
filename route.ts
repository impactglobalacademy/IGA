import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

interface EnrolmentRequest {
  programme_id: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to enrol' },
        { status: 401 },
      );
    }

    // Parse request body
    const body: EnrolmentRequest = await request.json();

    if (!body.programme_id) {
      return NextResponse.json(
        { error: 'Programme ID is required' },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verify programme exists and is published
    const { data: programme, error: progError } = await supabase
      .from('programmes')
      .select('id, title')
      .eq('id', body.programme_id)
      .eq('status', 'published')
      .single();

    if (progError || !programme) {
      return NextResponse.json(
        { error: 'Programme not found or not available' },
        { status: 404 },
      );
    }

    // Check for existing enrolment (RLS will still be enforced)
    const { data: existingEnrolment } = await supabase
      .from('enrolments')
      .select('id')
      .eq('user_id', user.id)
      .eq('programme_id', body.programme_id)
      .single();

    if (existingEnrolment) {
      return NextResponse.json(
        { error: 'You are already enrolled in this programme' },
        { status: 409 },
      );
    }

    // Create enrolment
    const { data: enrolment, error: enrolError } = await supabase
      .from('enrolments')
      .insert([
        {
          user_id: user.id,
          programme_id: body.programme_id,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (enrolError) {
      console.error('Enrolment creation error:', enrolError);
      return NextResponse.json(
        { error: 'Failed to create enrolment' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: `Successfully enrolled in ${programme.title}`,
        enrolment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Enrolment API error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const supabase = await createClient();

    const { data: enrolments, error } = await supabase
      .from('enrolments')
      .select(
        'id, status, created_at, programme_id, programmes(id, title, slug, category, short_description)',
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrolments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch enrolments' },
        { status: 500 },
      );
    }

    return NextResponse.json({ enrolments }, { status: 200 });
  } catch (error) {
    console.error('Enrolments GET error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 },
    );
  }
}

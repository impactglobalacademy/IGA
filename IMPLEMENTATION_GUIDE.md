# IMPACT Global Academy - Complete Implementation Guide

## Overview

This document provides a complete roadmap for implementing the IMPACT Global Academy digital platform. The foundation has been built with key infrastructure, components, and pages. This guide walks through setup, database configuration, and remaining implementations.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Database Schema](#database-schema)
3. [Authentication Setup](#authentication-setup)
4. [Remaining Pages](#remaining-pages)
5. [Components Reference](#components-reference)
6. [Deployment Checklist](#deployment-checklist)

---

## Project Setup

### 1. Initial Setup

```bash
# Navigate to project directory
cd impact-global-academy

# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - RESEND_API_KEY
```

### 2. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 3. Production Build

```bash
npm run build
npm start
```

---

## Database Schema

### Create Tables in Supabase

Navigate to **Supabase Dashboard → SQL Editor** and execute the following SQL scripts:

#### 1. Profiles Table (Auto-created with auth trigger)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  role TEXT DEFAULT 'learner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create index
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 2. Programmes Table

```sql
CREATE TABLE IF NOT EXISTS public.programmes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  duration_weeks INTEGER,
  investment_usd DECIMAL(10, 2),
  investment_ngn DECIMAL(12, 2),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published programmes are viewable by everyone." ON public.programmes
  FOR SELECT USING (status = 'published');

CREATE INDEX idx_programmes_status ON public.programmes(status);
CREATE INDEX idx_programmes_category ON public.programmes(category);
CREATE INDEX idx_programmes_featured ON public.programmes(featured);
CREATE INDEX idx_programmes_slug ON public.programmes(slug);

CREATE TRIGGER update_programmes_updated_at BEFORE UPDATE ON public.programmes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 3. Enrolments Table

```sql
CREATE TABLE IF NOT EXISTS public.enrolments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  programme_id UUID NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, programme_id)
);

ALTER TABLE public.enrolments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own enrolments." ON public.enrolments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrolments." ON public.enrolments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrolments." ON public.enrolments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_enrolments_user ON public.enrolments(user_id);
CREATE INDEX idx_enrolments_programme ON public.enrolments(programme_id);
CREATE INDEX idx_enrolments_status ON public.enrolments(status);

CREATE TRIGGER update_enrolments_updated_at BEFORE UPDATE ON public.enrolments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 4. Newsletter Subscribers Table

```sql
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);
```

#### 5. Faculty Table

```sql
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  expertise TEXT[] DEFAULT ARRAY[]::TEXT[],
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty profiles are viewable by everyone." ON public.faculty
  FOR SELECT USING (true);
```

#### 6. Events Table

```sql
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  format TEXT CHECK (format IN ('online', 'in-person', 'hybrid')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone." ON public.events
  FOR SELECT USING (true);
```

#### 7. Resources Table

```sql
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT CHECK (resource_type IN ('article', 'guide', 'video', 'template', 'ebook')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone." ON public.resources
  FOR SELECT USING (true);
```

#### 8. Impact Stories Table

```sql
CREATE TABLE IF NOT EXISTS public.impact_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  story_content TEXT,
  author_name TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published stories are viewable by everyone." ON public.impact_stories
  FOR SELECT USING (published = true);
```

### Insert Sample Programmes

```sql
INSERT INTO public.programmes (title, slug, category, short_description, description, featured, status, duration_weeks, investment_usd, investment_ngn)
VALUES
  (
    'Leadership Acceleration Program',
    'lap-leadership-acceleration',
    'lap',
    'Master advanced leadership strategies and build influence as a business leader.',
    'A comprehensive 6-week programme for emerging and established leaders seeking to master high-performance leadership strategies, systems thinking, coaching, and ethical decision-making.',
    true,
    'published',
    6,
    500,
    750000
  ),
  (
    'Business Acceleration Program',
    'bap-business-acceleration',
    'bap',
    'Scale your business with innovative strategies and market penetration tactics.',
    'An 8-week intensive programme for entrepreneurs and business owners focusing on business innovation, digital strategies, financial intelligence, and ethical entrepreneurship.',
    true,
    'published',
    8,
    750,
    1125000
  ),
  (
    'Campus Activation Program',
    'cap-campus-activation',
    'cap',
    'Empower student leaders and early-career professionals for success.',
    'A 4-week programme designed for university students and early-career professionals focusing on personal leadership, goal setting, productivity, and networking.',
    true,
    'published',
    4,
    200,
    300000
  );
```

---

## Authentication Setup

### 1. Enable Email Authentication in Supabase

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Enable **Email**
3. Configure email settings (optional but recommended)

### 2. Auth Callback Handler

Create `/app/auth/callback/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

---

## Remaining Pages

### List of Pages to Create

Here's the complete file structure and key pages to implement:

```
app/
├── page.tsx                          # ✅ DONE
├── about/
│   └── page.tsx                     # ✅ DONE
├── programmes/
│   ├── page.tsx                     # TODO - List all programmes
│   └── [slug]/
│       └── page.tsx                 # TODO - Individual programme detail
├── dashboard/
│   └── page.tsx                     # TODO - Learner dashboard
├── profile/
│   └── page.tsx                     # TODO - User profile
├── login/
│   └── page.tsx                     # TODO - Login page
├── register/
│   └── page.tsx                     # TODO - Registration page
├── impact-path/
│   └── page.tsx                     # TODO - IMPACT Path framework
├── resources/
│   └── page.tsx                     # TODO - Learning resources
├── events/
│   └── page.tsx                     # TODO - Events listing
├── faculty/
│   └── page.tsx                     # TODO - Faculty directory
├── organisations/
│   └── page.tsx                     # TODO - B2B offerings
├── partnerships/
│   └── page.tsx                     # TODO - Partnership opportunities
├── impact-stories/
│   └── page.tsx                     # TODO - Case studies/testimonials
├── contact/
│   └── page.tsx                     # TODO - Contact form
├── privacy/
│   └── page.tsx                     # TODO - Privacy policy
├── terms/
│   └── page.tsx                     # TODO - Terms of service
└── api/
    ├── contact/
    │   └── route.ts                 # ✅ DONE
    └── enrolments/
        └── route.ts                 # ✅ DONE
```

### Key Page Templates

#### Programmes Listing Page

Create `/app/programmes/page.tsx` with:
- List all published programmes from database
- Category filtering
- Search functionality
- Card layout with programme details
- CTA buttons linking to detail pages

#### Programme Detail Page

Create `/app/programmes/[slug]/page.tsx` with:
- Fetch programme by slug
- Display full programme details
- Enrolment button (authenticated users only)
- Related programmes
- CTA sections

#### Dashboard Page

Create `/app/dashboard/page.tsx` with:
- Authenticated users only (redirect to login if not)
- Display user's enrolled programmes
- Learning progress (foundation for LMS)
- Quick links to IMPACT Path
- Account settings shortcut

#### Login Page

Create `/app/login/page.tsx` with:
- Email/password form
- Validation
- Error handling
- Redirect to dashboard on success
- Link to register and reset password

#### Register Page

Create `/app/register/page.tsx` with:
- Full name, email, password fields
- Password confirmation
- Validation
- Email verification flow
- Terms acceptance

---

## Components Reference

### Existing Components

#### UI Components
- `Button` - Reusable button with variants (primary, secondary, outline, ghost, danger, success)
- `Input` - Form input with validation, labels, icons
- `Card` - Container component with CardHeader, CardContent, CardFooter
- `Alert` - Message component with 4 types (info, success, warning, error)
- `Badge` - Label/tag component with color variants
- `Loading` - LoadingSpinner, LoadingPage, Skeleton, SkeletonCard
- `EmptyState` - No data state with icon and CTA

#### Layout Components
- `Header` - Global header with navigation (responsive mobile menu)
- `Footer` - Global footer with navigation and links
- `RootLayout` - Wrapper providing Header/Footer to all pages

### Creating New Components

Structure for feature-specific components:

```typescript
// components/programmes/ProgrammeCard.tsx
export default function ProgrammeCard({ programme }) {
  return (
    <Card className="hover">
      {/* content */}
    </Card>
  );
}

// components/dashboard/MyProgrammes.tsx
export default function MyProgrammes({ enrolments }) {
  return (
    <div>
      {/* Enrolled programmes list */}
    </div>
  );
}
```

---

## Utility Functions

All utility functions are in `/lib/utils.ts` and `/lib/db.ts`:

### Database Functions (lib/db.ts)
- `getPublishedProgrammes()` - Fetch all published programmes
- `getProgrammeBySlug(slug)` - Fetch single programme
- `getUserEnrolments(userId)` - Get user's enrolments
- `createEnrolment(userId, programmeId)` - Create enrolment
- `getUserProfile(userId)` - Fetch user profile
- `updateUserProfile(userId, updates)` - Update profile

### Auth Functions (lib/auth.ts)
- `getCurrentUser()` - Get authenticated user
- `signUp(email, password, fullName)` - Register
- `signIn(email, password)` - Login
- `signOut()` - Logout
- `resetPassword(email)` - Password reset
- `updatePassword(password)` - Change password

### Utility Functions (lib/utils.ts)
- `formatCurrency(amount, currency)` - Format money
- `formatDate(date)` - Format dates
- `isValidEmail(email)` - Validate email
- `isStrongPassword(password)` - Check password strength
- `getProgrammeCategoryLabel(category)` - Get readable category name
- `getProgrammeCategoryColor(category)` - Get badge color for category

---

## Styling & Customization

### Tailwind Configuration

All colors, spacing, and design tokens are configured in `tailwind.config.ts`:

- **Primary Color**: Navy Blue (`#1A2A40` from logo)
- **Secondary Color**: Gold (`#D4A574` from logo)
- **Neutral Palette**: Slate grays for backgrounds, text, borders

### CSS Variables

Custom CSS variables are in `app/globals.css` for easier overrides:

```css
--color-primary-950: #1a2a40;
--color-secondary-950: #d4a574;
```

### Dark Mode (Optional)

To add dark mode support, update `tailwind.config.ts`:

```typescript
const config: Config = {
  darkMode: 'class',
  // ... rest of config
};
```

---

## Environment Variables

Create `.env.local` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=your-resend-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Deployment Checklist

### Pre-Deployment

- [ ] All pages created and tested
- [ ] Database tables created with RLS policies
- [ ] Environment variables configured
- [ ] `npm run build` passes without errors
- [ ] All links verified
- [ ] Forms tested (contact, login, register, enrolment)
- [ ] Mobile responsiveness checked
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] SEO metadata added to all pages
- [ ] 404 page created
- [ ] Privacy & Terms pages created
- [ ] Logo added to `/public/logo.png`
- [ ] Favicon added to `/public/favicon.ico`

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - RESEND_API_KEY
```

### Production Setup

1. Update Supabase auth redirect URL in Supabase dashboard
2. Configure CORS for your domain
3. Enable HTTPS
4. Set up monitoring/analytics
5. Configure email domain for Resend (if not using default)
6. Test all authentication flows in production
7. Verify database backups are configured

---

## Common Tasks

### Add a New Programme

1. Go to Supabase Dashboard
2. Insert record in `programmes` table:
   - title, slug, category, short_description, description
   - featured, status ('published'), duration_weeks
   - investment_usd, investment_ngn

### Create a New Page

1. Create file in appropriate directory: `/app/path/page.tsx`
2. Add metadata export for SEO
3. Use `RootLayout` in app/layout.tsx (wraps automatically)
4. Import components from `/components`
5. Use utility functions from `/lib`

### Add Navigation Link

Update navigation arrays in:
- `components/layout/Header.tsx` - `navLinks`
- `components/layout/Footer.tsx` - footer section links

### Customize Colours

Edit `tailwind.config.ts` → `theme.extend.colors`

All components use Tailwind classes, so changes cascade automatically.

---

## Support & Next Steps

### After Launch

1. **Monitor Performance**: Check Core Web Vitals
2. **Gather Feedback**: User testing and improvements
3. **LMS Features**: Implement course modules, lessons, progress tracking
4. **Payments**: Integrate Paystack/Flutterwave for paid programmes
5. **Certificates**: Implement certificate generation and distribution
6. **Admin Dashboard**: Build admin interface for content management
7. **Analytics**: Track user behaviour and programme effectiveness

### Resources

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Tailwind Docs: https://tailwindcss.com/docs

---

**Document Version**: 1.0  
**Last Updated**: August 2026  
**Status**: Complete Foundation Ready for Implementation

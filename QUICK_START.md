# IMPACT Global Academy - Quick Start Guide

Get up and running in 10 minutes.

## Step 1: Prerequisites (2 minutes)

Ensure you have:
- ✅ Node.js 24.x+ (check: `node --version`)
- ✅ npm 11.x+ (check: `npm --version`)
- ✅ Supabase account (sign up at supabase.com)
- ✅ Resend account (sign up at resend.com)
- ✅ Code editor (VS Code, WebStorm, etc.)
- ✅ Git (optional but recommended)

## Step 2: Create Supabase Project (3 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: impact-global-academy
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
4. Wait for project to initialize (~2 minutes)
5. Once ready, go to **Settings → API**
6. Copy and save:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Setup Resend (1 minute)

1. Go to [resend.com](https://resend.com) and sign in
2. Navigate to **API Keys**
3. Copy your API key → `RESEND_API_KEY`

## Step 4: Project Setup (2 minutes)

### Terminal Commands

```bash
# Navigate to project directory
cd impact-global-academy

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### Edit `.env.local`

Open `.env.local` and paste your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_xxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Step 5: Setup Database (3 minutes)

1. Go back to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **+ New Query**
4. Copy this SQL script and paste it:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE INDEX idx_profiles_email ON public.profiles(email);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PROGRAMMES TABLE
-- ============================================================================

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
CREATE INDEX idx_programmes_slug ON public.programmes(slug);

CREATE TRIGGER update_programmes_updated_at BEFORE UPDATE ON public.programmes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ENROLMENTS TABLE
-- ============================================================================

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

CREATE TRIGGER update_enrolments_updated_at BEFORE UPDATE ON public.enrolments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers(email);

-- ============================================================================
-- INSERT SAMPLE PROGRAMMES
-- ============================================================================

INSERT INTO public.programmes (
  title, slug, category, short_description, description, 
  featured, status, duration_weeks, investment_usd, investment_ngn
) VALUES
  (
    'Leadership Acceleration Program',
    'leadership-acceleration-program',
    'lap',
    'Master advanced leadership strategies and build influence as a business leader.',
    'A comprehensive 6-week programme for emerging and established leaders seeking to master high-performance leadership strategies.',
    true,
    'published',
    6,
    500,
    750000
  ),
  (
    'Business Acceleration Program',
    'business-acceleration-program',
    'bap',
    'Scale your business with innovative strategies and market penetration tactics.',
    'An 8-week intensive programme for entrepreneurs and business owners focusing on business innovation.',
    true,
    'published',
    8,
    750,
    1125000
  ),
  (
    'Campus Activation Program',
    'campus-activation-program',
    'cap',
    'Empower student leaders and early-career professionals for success.',
    'A 4-week programme designed for university students and early-career professionals.',
    true,
    'published',
    4,
    200,
    300000
  );
```

5. Click **"Run"** (or ⌘ Enter / Ctrl Enter)
6. Wait for success message

## Step 6: Configure Auth (30 seconds)

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Enable **Email** (should be on by default)
3. Optional: Configure email settings

## Step 7: Run Development Server (1 minute)

```bash
# Start the server
npm run dev
```

You should see:
```
> ready - started server on 0.0.0.0:3000
```

## Step 8: Test the Site

Open browser to `http://localhost:3000`

You should see:
- ✅ Homepage loads
- ✅ Header with navigation
- ✅ Featured programmes
- ✅ Footer with links

### Test Authentication

1. Click **Create Account** (top right)
2. Enter email, password, name
3. Click **Register**
4. Check your email for verification link
5. Click verification link
6. You should be redirected to dashboard
7. Click **Sign Out**

### Test Contact Form

1. Go to `/contact`
2. Fill in form
3. Click **Send**
4. Check email for confirmation

## ✅ You're Done!

Your IMPACT Global Academy site is now running!

## 🎯 Next Steps

### Immediate

- [ ] Customize contact email in `app/api/contact/route.ts`
- [ ] Add your logo to `/public/logo.png`
- [ ] Add your favicon to `/public/favicon.ico`
- [ ] Update Resend domain settings

### Short Term (1-2 weeks)

- [ ] Create remaining pages (programmes, dashboard, etc.)
- [ ] Add more sample programmes to database
- [ ] Create faculty profiles
- [ ] Add events and resources
- [ ] Write privacy & terms pages

### Medium Term (1 month)

- [ ] Test on mobile thoroughly
- [ ] Run accessibility audit
- [ ] Set up analytics
- [ ] Optimize images
- [ ] Deploy to Vercel

### Long Term (3+ months)

- [ ] Add LMS features (course modules, lessons)
- [ ] Implement certificates
- [ ] Add payment processing
- [ ] Build admin dashboard
- [ ] Advanced analytics

## 🆘 Troubleshooting

### "Cannot find module" errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection error

- Check `.env.local` has correct credentials
- Verify Supabase project is active (check dashboard)
- Ensure IP is whitelisted (usually automatic)

### Email not sending

- Verify `RESEND_API_KEY` in `.env.local`
- Check Resend dashboard for API key validity
- Resend free tier: verify recipient email

### Port 3000 already in use

```bash
# Use different port
npm run dev -- -p 3001
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 📞 Get Help

- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Tailwind docs: https://tailwindcss.com/docs
- See `IMPLEMENTATION_GUIDE.md` for detailed guide

## 🚀 Deploy to Production

When ready to go live:

```bash
# Test production build
npm run build

# Deploy to Vercel
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard and you're live!

---

**Congratulations!** 🎉 Your IMPACT Global Academy platform is ready!

Next: See `IMPLEMENTATION_GUIDE.md` for building out remaining features.

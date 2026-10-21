import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Users, Zap, Globe, Award } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { getPublishedProgrammes } from '@/lib/db';
import { getProgrammeCategoryLabel } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

const lightValues = [
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Leadership with Purpose',
    description:
      'Empowering individuals to lead with vision, integrity, and ethical excellence',
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Innovation & Growth',
    description:
      'Encouraging disruptive thinking, digital transformation, and continuous learning',
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Global Impact',
    description:
      'Equipping professionals with a cross-cultural mindset for worldwide influence',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Holistic Development',
    description:
      'Building capacity through mentorship, strategic empowerment, and faith integration',
  },
];

const programmes = [
  {
    id: '1',
    title: 'Leadership Acceleration Program',
    category: 'lap',
    short_description:
      'Master advanced leadership strategies and build influence as a business leader.',
    featured: true,
    duration: '6 weeks',
    investment: '$500',
  },
  {
    id: '2',
    title: 'Business Acceleration Program',
    category: 'bap',
    short_description:
      'Scale your business with innovative strategies and market penetration tactics.',
    featured: true,
    duration: '8 weeks',
    investment: '$750',
  },
  {
    id: '3',
    title: 'Campus Activation Program',
    category: 'cap',
    short_description:
      'Empower student leaders and early-career professionals for success.',
    featured: true,
    duration: '4 weeks',
    investment: '$200',
  },
];

export default async function HomePage() {
  const publishedProgrammes = await getPublishedProgrammes();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-80 h-80 bg-secondary-950 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-80 h-80 bg-secondary-950 rounded-full opacity-10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              size="lg"
              className="mb-6 bg-secondary-950 text-white border-secondary-800"
            >
              <Sparkles className="w-4 h-4" />
              Welcome to IMPACT Global Academy
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Equipping Leaders for Global Transformation
            </h1>

            <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
              Transform your leadership, master business strategy, and create lasting impact. 
              Join thousands of leaders, entrepreneurs, and professionals advancing their 
              purpose-driven journey with IMPACT Global Academy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/programmes">
                <Button variant="secondary" size="lg" className="gap-2">
                  Explore Programmes
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/impact-path">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-950 gap-2"
                >
                  Discover IMPACT Path
                </Button>
              </Link>
            </div>

            <p className="text-sm text-slate-300">
              ✓ Industry-leading curriculum • ✓ Expert mentorship • ✓ Global community
            </p>
          </div>
        </div>
      </section>

      {/* What is IMPACT Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-950 mb-4">
            What Does I.M.P.A.C.T. Stand For?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our framework represents the core pillars guiding every learner's journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              letter: 'I',
              title: 'Intentional',
              description: 'Deliberate, strategic action toward meaningful goals',
            },
            {
              letter: 'M',
              title: 'Mastery',
              description: 'Deep expertise and excellence in your field',
            },
            {
              letter: 'P',
              title: 'Purpose',
              description: 'Clear mission guiding your professional journey',
            },
            {
              letter: 'A',
              title: 'Advancement',
              description: 'Continuous growth and career progression',
            },
            {
              letter: 'C',
              title: 'Capacity',
              description: 'Building skills and organizational capability',
            },
            {
              letter: 'T',
              title: 'Transformation',
              description: 'Lasting change in individuals and organizations',
            },
          ].map((item, idx) => (
            <Card key={idx} className="text-center p-6 hover">
              <div className="w-12 h-12 mx-auto mb-4 bg-secondary-950 text-white rounded-lg flex items-center justify-center font-bold text-lg">
                {item.letter}
              </div>
              <h3 className="font-bold text-primary-950 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* L.I.G.H.T. Values Section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-950 mb-4">
              Our Core Values - L.I.G.H.T.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do and every programme we deliver
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {lightValues.map((value, idx) => (
              <Card key={idx} className="p-8">
                <div className="text-secondary-950 mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-primary-950 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programmes Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-950 mb-2">
              Featured Programmes
            </h2>
            <p className="text-lg text-slate-600">
              Choose your learning path and start your transformation
            </p>
          </div>
          <Link href="/programmes">
            <Button variant="outline" size="md" className="hidden sm:inline-flex gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programmes.map((programme) => (
            <Card key={programme.id} className="flex flex-col hover h-full">
              <CardContent className="flex-1 flex flex-col">
                <Badge
                  variant="primary"
                  size="sm"
                  className="w-fit mb-4"
                >
                  {getProgrammeCategoryLabel(programme.category)}
                </Badge>

                <h3 className="text-xl font-bold text-primary-950 mb-2 line-clamp-2">
                  {programme.title}
                </h3>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                  {programme.short_description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-sm font-medium text-slate-700">
                    ⏱️ {programme.duration}
                  </span>
                  <span className="text-sm font-medium text-secondary-950">
                    💰 {programme.investment}
                  </span>
                </div>
              </CardContent>

              <div className="px-6 py-4 border-t border-slate-200">
                <Link href={`/programmes/${programme.id}`}>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full gap-2"
                  >
                    View Programme
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link href="/programmes" className="w-full block">
            <Button variant="outline" size="lg" className="w-full gap-2">
              View All Programmes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose IMPACT Section */}
      <section className="bg-primary-950 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose IMPACT Global Academy?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              We're not just another online learning platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Industry-Proven Curriculum',
                description:
                  'Built on years of research and tested with thousands of successful leaders worldwide',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Expert Mentorship',
                description:
                  'Learn directly from industry leaders, entrepreneurs, and transformational coaches',
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: 'Global Community',
                description:
                  'Connect with purpose-driven professionals and leaders across the world',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-950 rounded-lg mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-950 mb-4">
            Ready to Transform Your Leadership?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join hundreds of leaders making real impact. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button variant="primary" size="lg" className="gap-2">
                Create Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

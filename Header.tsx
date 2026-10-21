'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

interface HeaderProps {
  isAuthenticated: boolean;
  userEmail?: string;
}

export default function Header({
  isAuthenticated: initialAuth,
  userEmail: initialEmail,
}: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [userEmail, setUserEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail(undefined);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(undefined);
    setMobileMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Programmes', href: '/programmes' },
    { label: 'IMPACT Path', href: '/impact-path' },
    { label: 'Resources', href: '/resources' },
    { label: 'Events', href: '/events' },
    { label: 'Faculty', href: '/faculty' },
    { label: 'Organisations', href: '/organisations' },
    { label: 'Partnerships', href: '/partnerships' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center gap-2 group"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-950 to-primary-800 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <span className="font-bold text-white text-sm md:text-base">
                IGA
              </span>
            </div>
            <span className="hidden sm:block font-bold text-primary-950 text-sm md:text-base lg:text-lg">
              IMPACT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-primary-950 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {isAuthenticated ? (
              <>
                {/* Desktop Auth Menu */}
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-error-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>

                {/* Mobile Auth Menu */}
                <div className="md:hidden flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" size="sm">
                      Create Account
                    </Button>
                  </Link>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="md:hidden flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-slate-700 hover:text-primary-950 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoading}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="space-y-2 px-2 pt-2 border-t border-slate-200">
                <Link href="/register" className="block">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

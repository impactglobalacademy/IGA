'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-secondary-950 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-sm">IGA</span>
              </div>
              <h3 className="font-bold text-lg">IMPACT</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Equipping leaders for global transformation through innovative
              learning and real-world impact.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-base mb-4">Platform</h4>
            <ul className="space-y-2">
              {[
                { label: 'About', href: '/about' },
                { label: 'Programmes', href: '/programmes' },
                { label: 'IMPACT Path', href: '/impact-path' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning */}
          <div>
            <h4 className="font-semibold text-base mb-4">Learning</h4>
            <ul className="space-y-2">
              {[
                { label: 'Resources', href: '/resources' },
                { label: 'Events', href: '/events' },
                { label: 'Faculty', href: '/faculty' },
                { label: 'Impact Stories', href: '/impact-stories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partnerships */}
          <div>
            <h4 className="font-semibold text-base mb-4">Collaborate</h4>
            <ul className="space-y-2">
              {[
                { label: 'Organisations', href: '/organisations' },
                { label: 'Partnerships', href: '/partnerships' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-base mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@impactglobalacademy.com"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  hello@impact.academy
                </a>
              </li>
              <li>
                <a
                  href="tel:+234800000000"
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +234 (0) 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {currentYear} IMPACT Global Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

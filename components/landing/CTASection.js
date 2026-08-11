'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

export default function CTASection() {
  const { user } = useAuth();

  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-margin-mobile text-center relative z-10">
        <h2 className="font-display-lg text-deep-navy mb-6">
          {user ? 'Ready for your next match?' : 'Ready to find your perfect fit?'}
        </h2>
        <p className="text-slate-gray text-body-lg mb-12">
          {user
            ? 'Keep your profile current and check in on new opportunities matched to your resume.'
            : 'Join over 2 million professionals who have used JobMatch to secure their dream roles at top-tier companies globally.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={user ? '/matches' : '/register'}
            className="bg-electric-blue text-white px-10 py-5 rounded-xl font-button text-lg shadow-xl hover:shadow-electric-blue/30 transition-all"
          >
            {user ? 'View My Matches' : 'Create Free Account'}
          </Link>
          <Link
            href="/jobs/search"
            className="bg-white border border-border-subtle text-deep-navy px-10 py-5 rounded-xl font-button text-lg hover:bg-surface-container-low transition-all"
          >
            Explore Job Board
          </Link>
        </div>
      </div>
    </section>
  );
}
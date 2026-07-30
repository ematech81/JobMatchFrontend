import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-margin-mobile text-center relative z-10">
        <h2 className="font-display-lg text-deep-navy mb-6">
          Ready to find your perfect fit?
        </h2>
        <p className="text-slate-gray text-body-lg mb-12">
          Join over 2 million professionals who have used JobMatch to secure their
          dream roles at top-tier companies globally.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-electric-blue text-white px-10 py-5 rounded-xl font-button text-lg shadow-xl hover:shadow-electric-blue/30 transition-all"
          >
            Create Free Account
          </Link>
          <Link
            href="/jobs"
            className="bg-white border border-border-subtle text-deep-navy px-10 py-5 rounded-xl font-button text-lg hover:bg-surface-container-low transition-all"
          >
            Explore Job Board
          </Link>
        </div>
      </div>
    </section>
  );
}
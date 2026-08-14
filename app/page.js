import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import LiveStats from '@/components/landing/LiveStats';
import FeaturesBento from '@/components/landing/FeaturesBento';
import PricingPreview from '@/components/landing/PricingPreview';
import FaqPreview from '@/components/landing/FaqPreview';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

// The only page in the app that's actually public now that job
// search/detail are fully gated behind login + resume + subscription (see
// app/jobs/search/page.js) — this is what has to carry SEO for generic
// "job website" / "job search" discovery. Structured data here helps Google
// understand the site as an entity; it's not a ranking guarantee — that
// still depends on backlinks, domain age, and competition, none of which a
// code change can move.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'JobMatch',
      url: 'https://jobmatch.com',
      description: 'A job website that matches you to remote jobs and career opportunities by AI.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://jobmatch.com/jobs/search?country={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      name: 'JobMatch',
      url: 'https://jobmatch.com',
      logo: 'https://jobmatch.com/jobMatch-logo.png',
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <LiveStats />
        <FeaturesBento />
        <PricingPreview />
        <FaqPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
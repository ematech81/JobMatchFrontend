import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import FeaturesBento from '@/components/landing/FeaturesBento';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturesBento />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
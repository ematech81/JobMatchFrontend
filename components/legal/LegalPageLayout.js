import Header from '@/components/landing/Header';
import SlimFooter from '@/components/layout/SlimFooter';

export default function LegalPageLayout({ title, updatedAt, children }) {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 md:px-margin-mobile py-stack-lg">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-deep-navy mb-2">
          {title}
        </h1>
        {updatedAt && <p className="text-slate-gray text-body-sm mb-stack-lg">Last updated {updatedAt}</p>}
        <div>{children}</div>
      </main>
      <SlimFooter />
    </>
  );
}

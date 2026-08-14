import Link from 'next/link';
import { FAQS } from '@/lib/faqs';

const PREVIEW_COUNT = 4;

export default function FaqPreview() {
  const preview = FAQS.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-stack-lg">
      <div className="max-w-3xl mx-auto px-margin-mobile">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-headline-lg text-headline-lg text-deep-navy">Common Questions</h2>
        </div>

        <div className="space-y-4">
          {preview.map(({ q, a }) => (
            <div key={q} className="bg-white border border-border-subtle rounded-xl p-6">
              <h3 className="font-headline-md text-deep-navy text-lg mb-2">{q}</h3>
              <p className="text-slate-gray text-body-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/help" className="text-electric-blue font-bold hover:underline inline-flex items-center gap-2">
            See all FAQs
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

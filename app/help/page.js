import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';
import { FAQS } from '@/lib/faqs';

export const metadata = {
  title: 'Help Center',
  description: 'Answers to common questions about JobMatch — matching, subscriptions, and your account.',
};

export default function HelpPage() {
  return (
    <LegalPageLayout title="Help Center">
      <LegalSection>
        {FAQS.map(({ q, a }) => (
          <div key={q} className="border-b border-border-subtle pb-4 last:border-0">
            <h3 className="font-headline-md text-headline-md text-deep-navy text-lg mb-1">{q}</h3>
            <p>{a}</p>
          </div>
        ))}
      </LegalSection>
    </LegalPageLayout>
  );
}

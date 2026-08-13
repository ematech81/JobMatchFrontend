import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

export const metadata = {
  title: 'Help Center',
  description: 'Answers to common questions about JobMatch — matching, subscriptions, and your account.',
};

const FAQS = [
  {
    q: 'How does job matching actually work?',
    a: 'We score every open role against your resume’s desired titles and skills — title overlap counts for 60% of the score, skill overlap for 40%. Every match shows exactly which skills matched, so it’s never a black box.',
  },
  {
    q: 'Do I upload a resume, or build one?',
    a: 'Either. Upload an existing PDF or DOCX and we’ll parse it automatically, or use the guided builder to create one from scratch by answering a few questions. Both lead to the same matching engine.',
  },
  {
    q: 'Why do I need to subscribe before seeing my matches?',
    a: 'After onboarding, we scan and show you how many matches we found — subscribing is what unlocks the actual job list and details. See our Terms of Service for current plans and pricing.',
  },
  {
    q: 'How do I cancel my subscription or ask about a charge?',
    a: 'Email us at info@techsphereapp.com with your account email and we’ll take care of it.',
  },
  {
    q: 'How do I stop getting match emails?',
    a: 'Go to Profile → Account Settings and turn off Email Notifications. You’ll still see new matches in-app either way.',
  },
  {
    q: 'How do I change my password or update my profile?',
    a: 'Everything lives on your Profile page — Personal Info, Job Preferences, Skills, and Account Settings (for password changes) are all editable there.',
  },
  {
    q: 'Can I get a copy of my data, or delete my account?',
    a: 'Both, any time, from Profile → Privacy & Security. Data export downloads a JSON file of your account, resume, and matches. Account deletion is permanent and requires your password to confirm.',
  },
  {
    q: 'Still stuck?',
    a: 'Reach out at info@techsphereapp.com — a real person reads every message.',
  },
];

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

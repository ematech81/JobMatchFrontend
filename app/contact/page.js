import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the JobMatch team.',
};

export default function ContactPage() {
  return (
    <LegalPageLayout title="Contact Us">
      <LegalSection>
        <p>
          For support, billing, privacy requests, or anything else — email us directly and we&apos;ll get
          back to you.
        </p>
      </LegalSection>

      <LegalSection>
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-stack-lg flex flex-col sm:flex-row sm:items-center justify-between gap-stack-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-electric-blue text-3xl">mail</span>
            <div>
              <p className="font-label-md text-label-md text-slate-gray uppercase">Email</p>
              <a href="mailto:info@techsphereapp.com" className="font-headline-md text-headline-md text-deep-navy hover:text-electric-blue transition-colors">
                info@techsphereapp.com
              </a>
            </div>
          </div>
          <a
            href="mailto:info@techsphereapp.com"
            className="bg-electric-blue text-white px-6 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all text-center"
          >
            Send an Email
          </a>
        </div>
      </LegalSection>

      <LegalSection title="Before you write in">
        <p>
          A lot of common questions — how matching works, how to cancel a plan, how to delete your
          account — are already answered in our <a href="/help">Help Center</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

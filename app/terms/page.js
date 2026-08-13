import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

export const metadata = {
  title: 'Terms of Service',
  description: 'The terms that govern your use of JobMatch.',
};

const UPDATED_AT = 'August 13, 2026';

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" updatedAt={UPDATED_AT}>
      <LegalSection>
        <p>
          These terms govern your use of JobMatch. By creating an account, you agree to them. If you
          don&apos;t agree, don&apos;t use the service.
        </p>
      </LegalSection>

      <LegalSection title="1. Eligibility">
        <p>
          You must be able to form a legally binding contract in your jurisdiction to create an account.
          The information you give us when registering — email, name, and anything you add to your resume
          — must be accurate.
        </p>
      </LegalSection>

      <LegalSection title="2. Your Account">
        <p>
          You&apos;re responsible for keeping your password secure and for anything that happens under your
          account. Tell us immediately at{' '}
          <a href="mailto:info@techsphereapp.com">info@techsphereapp.com</a> if you suspect unauthorized
          access.
        </p>
      </LegalSection>

      <LegalSection title="3. What JobMatch Is (and Isn't)">
        <p>
          JobMatch parses your resume, scores it against job listings sourced from third-party job data
          providers, and shows you the results. We are not a recruiter, staffing agency, or employer, and
          we are not a party to any application or hiring process. Every listing links out to its original
          source — what happens after you click &quot;Apply&quot; is between you and that third party.
        </p>
        <p>
          We don&apos;t guarantee that any match will result in an interview, offer, or job, and we don&apos;t
          guarantee the accuracy or availability of any third-party job listing.
        </p>
      </LegalSection>

      <LegalSection title="4. Subscriptions & Payment">
        <p>Access to job matches and listings requires an active subscription. Current plans:</p>
        <ul>
          <li><strong>7-Day Trial</strong> — $5, charged immediately as a one-time payment, for 7 days of full access.</li>
          <li><strong>Monthly</strong> — $10, billed every 30 days for continued access.</li>
        </ul>
        <p>
          Payments are processed by our third-party payment processor, KoraPay — we don&apos;t handle or
          store your card details ourselves. Fees are non-refundable except where required by applicable
          law. To cancel a subscription or ask about a charge, email{' '}
          <a href="mailto:info@techsphereapp.com">info@techsphereapp.com</a>.
        </p>
        <p>Plans and pricing may change — we&apos;ll update this page if they do.</p>
      </LegalSection>

      <LegalSection title="5. Acceptable Use">
        <p>You agree not to:</p>
        <ul>
          <li>Scrape, bulk-download, or systematically extract job listings or other users&apos; data from JobMatch.</li>
          <li>Create an account with false information or impersonate someone else.</li>
          <li>Interfere with, disrupt, or attempt to gain unauthorized access to the platform or other users&apos; accounts.</li>
          <li>Use JobMatch for any unlawful purpose.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <p>
          The JobMatch platform, its design, and its underlying technology are ours. The content of your
          resume — your experience, skills, and everything you write — is yours; we use it only to provide
          the matching service, as described in our <a href="/privacy">Privacy Policy</a>.
        </p>
      </LegalSection>

      <LegalSection title="7. Termination">
        <p>
          You can delete your account at any time from Profile → Privacy & Security — this is permanent
          and immediate. We may suspend or terminate accounts that violate these terms.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimer & Limitation of Liability">
        <p>
          JobMatch is provided &quot;as is,&quot; without warranties of any kind. We don&apos;t guarantee
          uninterrupted or error-free service, or any particular employment outcome. To the fullest extent
          permitted by law, JobMatch is not liable for indirect, incidental, or consequential damages
          arising from your use of the platform.
        </p>
      </LegalSection>

      <LegalSection title="9. Governing Law">
        <p>
          [Governing jurisdiction to be specified.] This section will be finalized to reflect the
          jurisdiction JobMatch operates under.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to These Terms">
        <p>
          If we make material changes, we&apos;ll update the date at the top of this page. Continued use of
          JobMatch after a change means you accept the update.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          Questions about these terms? Email <a href="mailto:info@techsphereapp.com">info@techsphereapp.com</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

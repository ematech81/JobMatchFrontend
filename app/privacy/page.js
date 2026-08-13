import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How JobMatch collects, uses, and protects your data.',
};

const UPDATED_AT = 'August 13, 2026';

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updatedAt={UPDATED_AT}>
      <LegalSection>
        <p>
          This policy explains what JobMatch (&quot;we,&quot; &quot;us&quot;) collects when you use the
          platform, why, and what control you have over it. It&apos;s written to match what the product
          actually does, not a generic template — if something here doesn&apos;t match your experience of
          the app, tell us at <a href="mailto:info@techsphereapp.com">info@techsphereapp.com</a>.
        </p>
      </LegalSection>

      <LegalSection title="1. Information We Collect">
        <p><strong>Account information:</strong> email address, password (stored as a one-way bcrypt hash — we never store or can retrieve your actual password), full name, and preferred country.</p>
        <p><strong>Resume data:</strong> if you upload a resume, we send the file to our parsing provider (Affinda) to extract your skills, work experience, education, and desired job titles. We store the extracted data, not the original file — once parsing completes, the file itself isn&apos;t retained. If you build a resume manually instead, we store what you enter directly.</p>
        <p><strong>Usage data:</strong> job preferences, skills, saved jobs, and match results generated from scoring your resume against job listings.</p>
        <p><strong>Payment data:</strong> if you subscribe, payment is processed by our payment processor, KoraPay. We store the plan you chose, the amount, and a transaction reference — never your card or bank details, which KoraPay handles directly.</p>
        <p><strong>Communications:</strong> if you contact us, we keep that correspondence to respond and for our records.</p>
      </LegalSection>

      <LegalSection title="2. How We Use Your Information">
        <ul>
          <li>To create and secure your account.</li>
          <li>To match your resume against job listings and show you the results.</li>
          <li>To send you match notifications by email, if you&apos;ve turned that on (Profile → Account Settings) — you can turn it off any time.</li>
          <li>To send account-related emails, like verifying your address.</li>
          <li>To process subscription payments and maintain your access.</li>
          <li>To respond when you contact us.</li>
        </ul>
        <p>We don&apos;t sell your personal data, and we don&apos;t use it for third-party advertising.</p>
      </LegalSection>

      <LegalSection title="3. Third-Party Services We Use">
        <p>Certain features are only possible because we send limited data to specialized providers:</p>
        <ul>
          <li><strong>Affinda</strong> — parses uploaded resume files into structured data.</li>
          <li><strong>Job data providers (including JSearch/RapidAPI)</strong> — the source of the job listings we match you against.</li>
          <li><strong>Brevo</strong> — delivers the transactional emails we send (verification, match alerts).</li>
          <li><strong>KoraPay</strong> — processes subscription payments.</li>
          <li><strong>MongoDB Atlas</strong> — hosts our database.</li>
        </ul>
        <p>Each only receives what it needs to do its job — we don&apos;t hand over your full profile to providers that don&apos;t need it.</p>
      </LegalSection>

      <LegalSection title="4. Cookies">
        <p>
          We use one cookie: a mirror of your login session, used only so our server can check you&apos;re
          signed in before serving a protected page. We don&apos;t use third-party tracking or advertising
          cookies.
        </p>
      </LegalSection>

      <LegalSection title="5. Data Retention & Deletion">
        <p>
          We keep your data while your account is active. You can permanently delete your account,
          resume, matches, and subscription record at any time from Profile → Privacy & Security — this
          is irreversible and takes effect immediately.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights">
        <ul>
          <li><strong>Access &amp; export</strong> — download a copy of your account, resume, and match data as a file from Profile → Privacy & Security.</li>
          <li><strong>Correction</strong> — update your name, country, resume, and preferences directly from your Profile.</li>
          <li><strong>Deletion</strong> — permanently delete your account and associated data at any time.</li>
          <li><strong>Opt out of email</strong> — turn off match notification emails from Account Settings; verification and essential account emails still apply.</li>
        </ul>
      </LegalSection>

      <LegalSection title="7. Data Security">
        <p>
          Passwords are hashed with bcrypt and never stored in plain text. Email verification and
          account-recovery tokens are stored as one-way hashes, not the raw value sent to you. No method
          of transmission or storage is 100% secure, but these are the concrete measures in place.
        </p>
      </LegalSection>

      <LegalSection title="8. Children's Privacy">
        <p>JobMatch is not directed at children, and we don&apos;t knowingly collect data from anyone under 16.</p>
      </LegalSection>

      <LegalSection title="9. International Data Transfers">
        <p>
          Our infrastructure and service providers may process data outside your country of residence. By
          using JobMatch, you understand your information may be transferred to and processed in other
          countries.
        </p>
      </LegalSection>

      <LegalSection title="10. Changes to This Policy">
        <p>
          If we make material changes, we&apos;ll update the date at the top of this page. Continued use of
          JobMatch after a change means you accept the update.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Us">
        <p>
          Questions about this policy or your data? Email{' '}
          <a href="mailto:info@techsphereapp.com">info@techsphereapp.com</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

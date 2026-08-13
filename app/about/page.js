import LegalPageLayout from '@/components/legal/LegalPageLayout';
import LegalSection from '@/components/legal/LegalSection';

export const metadata = {
  title: 'About Us',
  description: 'JobMatch is an AI-powered job matching platform — upload or build a resume and get matched with real, verified job listings.',
};

export default function AboutPage() {
  return (
    <LegalPageLayout title="About JobMatch">
      <LegalSection>
        <p>
          JobMatch is a job-matching platform built around one idea: your resume should do the searching
          for you. Upload an existing resume or build one from scratch with our guided builder, and we
          match it against live job listings by title and skill overlap — not keyword-stuffed guesswork.
        </p>
      </LegalSection>

      <LegalSection title="What we actually do">
        <ul>
          <li>Parse uploaded resumes to extract your skills, experience, and desired roles.</li>
          <li>Score your profile against real job listings sourced from third-party job data providers.</li>
          <li>Surface the matches, with the specific skills and title overlap behind each score — not a black box.</li>
          <li>Let you save jobs, track your profile strength, and manage everything from one dashboard.</li>
        </ul>
      </LegalSection>

      <LegalSection title="What we don't do">
        <p>
          We don&apos;t guarantee a job offer, and we&apos;re not the employer for any listing on the
          platform — every job links out to its original source. We also don&apos;t sell your data; see
          our <a href="/privacy">Privacy Policy</a> for exactly what we collect and why.
        </p>
      </LegalSection>

      <LegalSection title="Get in touch">
        <p>
          Questions, feedback, or something not working right? Reach us at{' '}
          <a href="mailto:info@techsphereapp.com">info@techsphereapp.com</a> or visit our{' '}
          <a href="/contact">Contact page</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProfileStrengthCard from '@/components/dashboard/ProfileStrengthCard';
import Footer from '@/components/landing/Footer';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileHeaderCard from '@/components/profile/ProfileHeaderCard';
import PersonalInfoCard from '@/components/profile/PersonalInfoCard';
import JobPreferencesCard from '@/components/profile/JobPreferencesCard';
import ResumeSummaryCard from '@/components/profile/ResumeSummaryCard';
import SkillsCard from '@/components/profile/SkillsCard';
import AccountSettingsCard from '@/components/profile/AccountSettingsCard';
import PrivacySecurityCard from '@/components/profile/PrivacySecurityCard';
import { useAuth } from '@/lib/AuthContext';
import { getMyResume, ApiError } from '@/lib/apiClient';

function ProfileContent() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadResume = useCallback(() => {
    // A missing resume is an expected state, not an error — every card
    // below renders its own empty state for it, same as the dashboard.
    return getMyResume()
      .then(setResumeData)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setResumeData(null);
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

  // Cards that edit resume fields (skills, desired titles) call this with
  // the server's response so every card reflects the save immediately,
  // instead of each one guessing at the new derived state (strength, etc.)
  // itself.
  const handleResumeChange = (updated) => {
    setResumeData((prev) => ({ ...prev, resume: updated }));
  };

  const resume = resumeData?.resume;

  return (
    <>
      <DashboardHeader />

      <main className="max-w-container-max mx-auto px-4 md:px-margin-mobile py-stack-lg pt-24">
        <EmailVerificationBanner />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
          <aside className="lg:col-span-3 space-y-stack-md">
            <ProfileSidebar />
            {resumeData?.strength && <ProfileStrengthCard strength={resumeData.strength} />}
          </aside>

          <div className="lg:col-span-9 space-y-stack-lg">
            {error && <p className="text-error text-body-md py-stack-lg text-center">{error}</p>}

            {loading ? (
              <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 animate-pulse h-64" />
            ) : (
              <>
                <ProfileHeaderCard user={user} resume={resume} />
                <PersonalInfoCard />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
                  <JobPreferencesCard resume={resume} onResumeChange={handleResumeChange} />
                  <ResumeSummaryCard resume={resume} />
                </div>

                <SkillsCard resume={resume} onResumeChange={handleResumeChange} />

                <AccountSettingsCard />
                <PrivacySecurityCard />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}

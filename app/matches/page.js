'use client';

import { useCallback, useEffect, useState } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ActiveResumeCard from '@/components/dashboard/ActiveResumeCard';
import QuickLinksCard from '@/components/dashboard/QuickLinksCard';
import FeaturedMatchCard from '@/components/dashboard/FeaturedMatchCard';
import MatchCard from '@/components/dashboard/MatchCard';
import LiveMatchFeed from '@/components/dashboard/LiveMatchFeed';
import ProfileStrengthCard from '@/components/dashboard/ProfileStrengthCard';
import Footer from '@/components/landing/Footer';
import { getMyMatches, getMyResume, ApiError } from '@/lib/apiClient';
import { getSocket } from '@/lib/socket';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Shapes a Match document into the feed's item contract. */
function matchToFeedItem(match, { isNew = false } = {}) {
  return {
    id: match._id,
    score: match.score,
    jobTitle: match.jobId?.job_title,
    employer: match.jobId?.employer_name,
    jobPublicId: match.jobId?.job_id,
    matchedAt: match.matchedAt,
    isNew,
  };
}

function DashboardContent() {
  const [matches, setMatches] = useState(null);
  const [feed, setFeed] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  const loadMatches = useCallback(async () => {
    const [ranked, recent] = await Promise.all([
      getMyMatches({ sort: 'score', limit: 50 }),
      getMyMatches({ sort: 'recent', limit: 10 }),
    ]);
    setMatches(ranked.matches || []);
    setFeed((recent.matches || []).map((m) => matchToFeedItem(m)));
  }, []);

  useEffect(() => {
    loadMatches().catch((err) =>
      setError(err instanceof ApiError ? err.message : 'Failed to load matches')
    );

    // A missing resume is an expected state, not an error — the sidebar
    // renders its own empty state for it.
    getMyResume()
      .then(setResumeData)
      .catch(() => setResumeData(null))
      .finally(() => setResumeLoading(false));
  }, [loadMatches]);

  // One socket subscription for the whole dashboard: it both prepends to the
  // activity feed and refreshes the grid, so the two panels cannot drift apart.
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleNewMatch = (payload) => {
      setFeed((prev) => [
        {
          id: payload.matchId,
          score: payload.score,
          jobTitle: payload.jobTitle,
          employer: payload.employer,
          jobPublicId: null,
          matchedAt: new Date().toISOString(),
          isNew: true,
        },
        ...(prev || []),
      ]);
      loadMatches().catch(() => {});
    };

    setConnected(socket.connected);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_match', handleNewMatch);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_match', handleNewMatch);
    };
  }, [loadMatches]);

  const [featured, ...rest] = matches || [];
  const newMatchCount = (feed || []).filter(
    (item) => Date.now() - new Date(item.matchedAt).getTime() < DAY_MS
  ).length;

  return (
    <>
      <DashboardHeader newMatchCount={newMatchCount} />

      <main className="pt-24 pb-stack-lg px-4 md:px-margin-mobile max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <aside className="lg:col-span-3 space-y-stack-md order-2 lg:order-1">
            <ActiveResumeCard
              resume={resumeData?.resume}
              totalExperienceMonths={resumeData?.totalExperienceMonths}
              loading={resumeLoading}
            />
            <QuickLinksCard />
          </aside>

          <div className="lg:col-span-9 space-y-stack-lg order-1 lg:order-2">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-stack-md">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-deep-navy">
                  Top Matches for You
                </h1>
                <p className="text-slate-gray font-body-md mt-1">
                  {resumeData?.resume?.desiredTitles?.length
                    ? `Based on your ${resumeData.resume.desiredTitles[0]} profile.`
                    : 'Add a resume to start getting matched.'}
                </p>
              </div>

              {matches?.length > 0 && (
                <div className="flex items-center gap-stack-sm p-stack-sm bg-match-success/10 border border-match-success/20 rounded-lg">
                  <span className="material-symbols-outlined text-match-success animate-pulse-soft">
                    rocket_launch
                  </span>
                  <span className="text-match-success font-bold text-body-sm">
                    {matches.length} active match{matches.length === 1 ? '' : 'es'}
                  </span>
                </div>
              )}
            </header>

            {error && (
              <p className="text-error text-body-md py-stack-lg text-center">{error}</p>
            )}

            {!error && matches === null && (
              <p className="text-slate-gray text-body-md py-stack-lg text-center">
                Loading matches…
              </p>
            )}

            {matches?.length === 0 && (
              <p className="text-slate-gray text-body-md py-stack-lg text-center">
                No matches yet. Upload or build your resume to get matched with jobs.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {featured && <FeaturedMatchCard match={featured} />}

              <LiveMatchFeed items={feed || []} loading={feed === null} connected={connected} />

              {rest.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))}

              {resumeData?.strength && <ProfileStrengthCard strength={resumeData.strength} />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function MatchesPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { redirectForAccessError } from '@/lib/accessGate';
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
  const router = useRouter();
  const [matches, setMatches] = useState(null);
  const [feed, setFeed] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [error, setError] = useState(null);
  // DashboardContent only ever mounts client-side (RequireAuth gates it
  // behind a client-only auth check, same as ResumeBuilderProvider) — so
  // reading the socket's current state directly here is safe, and means the
  // effect below never needs to set this synchronously itself, just react
  // to connect/disconnect events.
  const [connected, setConnected] = useState(() => getSocket()?.connected ?? false);

  const loadMatches = useCallback(async () => {
    const [ranked, recent] = await Promise.all([
      getMyMatches({ sort: 'score', limit: 50 }),
      getMyMatches({ sort: 'recent', limit: 10 }),
    ]);
    setMatches(ranked.matches || []);
    setFeed((recent.matches || []).map((m) => matchToFeedItem(m)));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await loadMatches();
      } catch (err) {
        // A user who lands here without onboarding/subscribing shouldn't
        // normally be possible anymore (RedirectIfAuthed + RequireAuth catch
        // it earlier), but this is the real enforcement — direct navigation,
        // a stale tab, whatever gets them here still gets bounced correctly.
        if (redirectForAccessError(err, router)) return;
        setError(err instanceof ApiError ? err.message : 'Failed to load matches');
      }
    })();

    // A missing resume is an expected state, not an error — the sidebar
    // renders its own empty state for it.
    getMyResume()
      .then(setResumeData)
      .catch(() => setResumeData(null))
      .finally(() => setResumeLoading(false));
  }, [loadMatches, router]);

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

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('new_match', handleNewMatch);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('new_match', handleNewMatch);
    };
  }, [loadMatches]);

  // matches is already sorted by score (see loadMatches), so the next two
  // after the featured one are genuinely "closest match" — they fill the
  // empty space beside the featured card instead of leaving it blank, since
  // that card is short (self-start) next to the tall live feed.
  const [featured, runnerUp, thirdPlace, ...rest] = matches || [];
  // "New in the last 24h" inherently needs the current time — there's no
  // pure way to express "now" in a render function, and useMemo doesn't
  // exempt Date.now() from this rule either (verified — still flags inside
  // the memo callback). A render that's a few ms stale on this badge is
  // harmless; wrapping it in an effect+ref just to satisfy the linter would
  // add real complexity for no practical benefit.
  const newMatchCount = (feed || []).filter(
    // eslint-disable-next-line react-hooks/purity
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter items-start">
              <div className="md:col-span-2 xl:col-span-2 flex flex-col gap-gutter">
                {featured && <FeaturedMatchCard match={featured} />}

                {(runnerUp || thirdPlace) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter">
                    {runnerUp && <MatchCard match={runnerUp} />}
                    {thirdPlace && <MatchCard match={thirdPlace} />}
                  </div>
                )}
              </div>

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

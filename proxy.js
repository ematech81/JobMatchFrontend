import { NextResponse } from 'next/server';

/**
 * Route gate.
 *
 * Product rule: nothing but the landing page is reachable before registering or
 * signing in. Hiding nav links is not enough — /jobs/search and /jobs/[jobId]
 * are server components that would otherwise fetch and return job data to
 * anyone typing the URL. This blocks the request before any of that runs.
 *
 * This is an optimistic check on the presence of the auth cookie, which is all
 * proxy should do (per Next's guidance, it is not a session-management layer).
 * Real authorization stays on the API, which verifies the JWT on every request.
 */
// /verify-email is public too — the link in the email may be opened on a
// device/browser that was never signed in (the token itself, not the
// session, is what proves mailbox ownership; see authController.verifyEmail).
// The footer content pages (about/privacy/terms/help/contact) are public on
// principle — a Privacy Policy or Terms of Service you can't read without an
// account defeats the point, and they're linked from the signed-out landing
// page's own footer.
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/verify-email',
  '/about',
  '/privacy',
  '/terms',
  '/help',
  '/contact'
];

export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next();

  const isAuthed = Boolean(request.cookies.get('jm_auth')?.value);
  if (isAuthed) return NextResponse.next();

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Everything except Next internals, the favicon, and static assets in /public.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};

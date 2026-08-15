'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Renders Google's own button (via Identity Services' renderButton), not a
 * custom-styled one — Google doesn't support arbitrary custom styling for
 * this flow, only theme/size/shape options. A real deviation from the
 * original mockup's matching-pixel button, but the secure/correct
 * integration path, not a corner cut.
 */
function GoogleButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);

  const handleCredential = (response) => {
    setError(null);
    loginWithGoogle(response.credential)
      .then(() => {
        // RedirectIfAuthed (wrapping login/register) resolves the real
        // destination — onboarding/subscribe/matches — once `user` updates;
        // this is just a reasonable default in the meantime, same pattern
        // LoginForm already uses for password sign-in.
        router.push(searchParams.get('redirect') || '/matches');
      })
      .catch((err) => setError(err.message));
  };

  const initGoogleButton = () => {
    if (!window.google || !buttonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      // Fills the card now that it's the only button (no LinkedIn alongside
      // it to split the row with) — Google's button takes a pixel width, not
      // a percentage, so this measures the actual available space instead of
      // guessing a fixed number that would look off on narrower cards.
      width: buttonRef.current.offsetWidth || 320,
    });
  };

  useEffect(() => {
    // Script may already be loaded from a previous mount (login <-> register
    // navigation) — Script's onLoad won't re-fire for an already-loaded src.
    if (window.google) initGoogleButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!GOOGLE_CLIENT_ID) {
    // Not configured yet (no real Client ID) — disabled rather than a
    // broken interactive button.
    return (
      <button
        type="button"
        disabled
        title="Coming soon"
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-border-subtle rounded-lg opacity-50 cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-electric-blue">google</span>
        <span className="font-button text-body-sm">Google</span>
      </button>
    );
  }

  return (
    <div className="w-full">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initGoogleButton} />
      <div ref={buttonRef} className="w-full flex justify-center" />
      {error && <p className="text-error text-body-sm mt-2">{error}</p>}
    </div>
  );
}

// LinkedIn sign-in was removed — not something this app uses. Google is the
// only social sign-in method.
export default function SocialLoginButtons() {
  return <GoogleButton />;
}

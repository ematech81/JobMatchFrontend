'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { changePassword, updateMe, resendVerification } from '@/lib/apiClient';

const MIN_PASSWORD_LENGTH = 8;

/**
 * Change Password is real (PATCH /auth/me/password, verified against the
 * current password server-side). Email notifications is a real, persisted
 * toggle too — it gates the digest email matchingService sends on new
 * matches (see notifyNewMatches), not a placeholder switch.
 */
export default function AccountSettingsCard() {
  const { user, updateUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [notifSaving, setNotifSaving] = useState(false);
  const [notifError, setNotifError] = useState(null);

  const [resending, setResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [resendError, setResendError] = useState(null);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`New password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const toggleEmailNotifications = async () => {
    setNotifError(null);
    setNotifSaving(true);
    const next = !user?.emailNotifications;
    try {
      const { user: updated } = await updateMe({ emailNotifications: next });
      updateUser(updated);
    } catch (err) {
      setNotifError(err.message || 'Failed to update notification preference.');
    } finally {
      setNotifSaving(false);
    }
  };

  const handleResend = async () => {
    setResendError(null);
    setResending(true);
    try {
      await resendVerification();
      setResendSent(true);
    } catch (err) {
      setResendError(err.message || 'Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <section
      id="account-settings"
      className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 scroll-mt-24"
    >
      <h2 className="font-headline-md text-headline-md text-deep-navy mb-6">Account Settings</h2>

      <div className="flex items-start justify-between gap-stack-md mb-8 pb-8 border-b border-border-subtle">
        <div>
          <h3 className="font-label-md text-label-md text-slate-gray uppercase mb-1">Email Verification</h3>
          {user?.emailVerified ? (
            <p className="text-body-sm text-match-success flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              {user.email} is verified.
            </p>
          ) : (
            <>
              <p className="text-body-sm text-slate-gray">{user?.email} is not verified yet.</p>
              {resendError && <p className="text-error text-body-sm mt-1">{resendError}</p>}
            </>
          )}
        </div>
        {!user?.emailVerified && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resendSent}
            className="shrink-0 border-2 border-electric-blue text-electric-blue px-5 py-2.5 rounded-lg font-button text-body-sm hover:bg-electric-blue/5 transition-all disabled:opacity-50"
          >
            {resendSent ? 'Email sent' : resending ? 'Sending…' : 'Resend verification email'}
          </button>
        )}
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 mb-8 pb-8 border-b border-border-subtle">
        <h3 className="font-label-md text-label-md text-slate-gray uppercase">Change Password</h3>

        {passwordError && (
          <p className="text-error text-body-sm bg-error-container/40 border border-error/20 rounded-lg px-4 py-3">
            {passwordError}
          </p>
        )}
        {passwordSuccess && (
          <p className="text-match-success text-body-sm bg-match-success/10 border border-match-success/20 rounded-lg px-4 py-3">
            Password updated.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <div className="md:col-span-2">
            <label className="font-label-md text-label-md text-slate-gray block mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="font-label-md text-label-md text-slate-gray block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="font-label-md text-label-md text-slate-gray block mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={passwordSaving}
          className="bg-electric-blue text-white px-6 py-2.5 rounded-lg font-button text-body-sm hover:bg-secondary transition-all disabled:opacity-50"
        >
          {passwordSaving ? 'Updating…' : 'Update Password'}
        </button>
      </form>

      <div className="flex items-start justify-between gap-stack-md">
        <div>
          <h3 className="font-label-md text-label-md text-slate-gray uppercase mb-1">Email Notifications</h3>
          <p className="text-body-sm text-slate-gray">
            Get an email when new job matches come in. You&apos;ll still see them in-app either way.
          </p>
          {notifError && <p className="text-error text-body-sm mt-2">{notifError}</p>}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={!!user?.emailNotifications}
          onClick={toggleEmailNotifications}
          disabled={notifSaving}
          className={`shrink-0 w-12 h-7 rounded-full transition-colors relative disabled:opacity-50 ${
            user?.emailNotifications ? 'bg-electric-blue' : 'bg-border-subtle'
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              user?.emailNotifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </section>
  );
}

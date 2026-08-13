'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { exportMyData, deleteAccount } from '@/lib/apiClient';

export default function PrivacySecurityCard() {
  const { logout } = useAuth();
  const router = useRouter();

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const [confirming, setConfirming] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const blob = await exportMyData();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jobmatch-data-export.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err.message || 'Failed to export your data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteAccount(deletePassword);
      logout();
      router.push('/');
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete your account. Please try again.');
      setDeleting(false);
    }
  };

  return (
    <section
      id="privacy-security"
      className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 scroll-mt-24"
    >
      <h2 className="font-headline-md text-headline-md text-deep-navy mb-6">Privacy &amp; Security</h2>

      <div className="flex items-start justify-between gap-stack-md mb-8 pb-8 border-b border-border-subtle">
        <div>
          <h3 className="font-label-md text-label-md text-slate-gray uppercase mb-1">Export Your Data</h3>
          <p className="text-body-sm text-slate-gray">
            Download your account, resume, and match data as a JSON file.
          </p>
          {exportError && <p className="text-error text-body-sm mt-2">{exportError}</p>}
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="shrink-0 border-2 border-border-subtle text-deep-navy px-5 py-2.5 rounded-lg font-button text-body-sm hover:bg-surface-container-low transition-all disabled:opacity-50"
        >
          {exporting ? 'Preparing…' : 'Export Data'}
        </button>
      </div>

      <div>
        <h3 className="font-label-md text-label-md text-error uppercase mb-1">Delete Account</h3>
        <p className="text-body-sm text-slate-gray mb-4">
          Permanently deletes your account, resume, matches, and subscription. This cannot be undone.
        </p>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="border-2 border-error text-error px-5 py-2.5 rounded-lg font-button text-body-sm hover:bg-error-container/40 transition-all"
          >
            Delete Account
          </button>
        ) : (
          <form
            onSubmit={handleDelete}
            className="bg-error-container/20 border border-error/20 rounded-lg p-stack-md space-y-3"
          >
            <p className="text-body-sm text-deep-navy font-medium">
              Enter your password to confirm — this is permanent.
            </p>
            {deleteError && <p className="text-error text-body-sm">{deleteError}</p>}
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Your password"
              className="w-full max-w-sm bg-white border border-border-subtle rounded-md px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={deleting}
                className="bg-error text-white px-5 py-2.5 rounded-lg font-button text-body-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Permanently Delete My Account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  setDeletePassword('');
                  setDeleteError(null);
                }}
                disabled={deleting}
                className="text-slate-gray px-5 py-2.5 rounded-lg font-button text-body-sm hover:bg-surface-container-low transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

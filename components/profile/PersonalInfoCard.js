'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { updateMe } from '@/lib/apiClient';
import { COUNTRIES, toBackendCountry, fromBackendCountry } from '@/lib/ResumeBuilderContext';

/**
 * Full Name and Location save for real, via PATCH /auth/me (added
 * alongside this page — there was no account-update endpoint before).
 * Phone and Bio stay editable but unsaved: there's no phone field on the
 * User model at all, and no bio field anywhere in the schema — same
 * "editable for review, dropped on save" treatment already established for
 * Phone/Dates/Description on the resume upload Verify screen.
 */
export default function PersonalInfoCard() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [location, setLocation] = useState(() => fromBackendCountry(user?.preferredCountry));
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const startEditing = () => {
    setFullName(user?.fullName || '');
    setLocation(fromBackendCountry(user?.preferredCountry));
    setError(null);
    setEditing(true);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const { user: updated } = await updateMe({
        fullName: fullName.trim(),
        preferredCountry: toBackendCountry(location),
      });
      updateUser(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="personal-info" className="bg-surface-container-lowest border border-border-subtle rounded-xl p-8 scroll-mt-24">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-headline-md text-headline-md text-deep-navy">Personal Information</h2>
        {editing ? (
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="text-electric-blue hover:underline font-button disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        ) : (
          <button type="button" onClick={startEditing} className="text-electric-blue hover:underline font-button">
            Edit
          </button>
        )}
      </div>

      {error && (
        <p className="mb-4 text-error text-body-sm bg-error-container/40 border border-error/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg mb-8">
        <div>
          <label className="font-label-md text-label-md text-slate-gray block mb-1">Full Name</label>
          {editing ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          ) : (
            <p className="font-body-md text-deep-navy font-medium">{user?.fullName || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="font-label-md text-label-md text-slate-gray block mb-1">Email Address</label>
          <p className="font-body-md text-deep-navy font-medium">{user?.email}</p>
          {editing && <p className="font-body-sm text-body-sm text-slate-gray mt-1">Synced from your account</p>}
        </div>

        <div>
          <label className="font-label-md text-label-md text-slate-gray block mb-1">Phone Number</label>
          {editing ? (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 012-3456"
              className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          ) : (
            <p className="font-body-md text-deep-navy font-medium">{phone || 'Not set'}</p>
          )}
        </div>

        <div>
          <label className="font-label-md text-label-md text-slate-gray block mb-1">Location</label>
          {editing ? (
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          ) : (
            <p className="font-body-md text-deep-navy font-medium">
              {fromBackendCountry(user?.preferredCountry)
                ? COUNTRIES.find((c) => c.value === fromBackendCountry(user?.preferredCountry))?.label
                : 'Not set'}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="font-label-md text-label-md text-slate-gray block mb-1">Professional Bio</label>
        {editing ? (
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="A few sentences about your experience and what you're looking for..."
            className="w-full bg-white border border-border-subtle rounded-md px-3 py-2 font-body-md focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent resize-none"
          />
        ) : (
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            {bio || 'Add a short bio so recruiters know more about you.'}
          </p>
        )}
      </div>

      {editing && (
        <p className="font-body-sm text-body-sm text-slate-gray mt-4">
          Phone and bio aren&apos;t saved yet — full name and location are.
        </p>
      )}
    </section>
  );
}

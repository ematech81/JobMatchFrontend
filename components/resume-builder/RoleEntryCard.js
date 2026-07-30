'use client';

export default function RoleEntryCard({ role, index, onChange, onRemove, canRemove }) {
  const handleField = (field, value) => {
    onChange(index, { ...role, [field]: value });
  };

  const handleCurrentToggle = (checked) => {
    onChange(index, { ...role, current: checked, endDate: checked ? '' : role.endDate });
  };

  return (
    <div className="role-entry relative group p-6 rounded-lg border border-border-subtle bg-white hover:border-electric-blue/30 transition-all duration-200">
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute top-4 right-4 text-slate-gray hover:text-error transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        <div className="space-y-1">
          <label className="font-label-md text-label-md text-deep-navy block">Job Title</label>
          <input
            type="text"
            value={role.title}
            onChange={(e) => handleField('title', e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all font-body-md"
          />
        </div>

        <div className="space-y-1">
          <label className="font-label-md text-label-md text-deep-navy block">Company</label>
          <input
            type="text"
            value={role.company}
            onChange={(e) => handleField('company', e.target.value)}
            placeholder="e.g. TechCorp Solutions"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all font-body-md"
          />
        </div>

        <div className="space-y-1">
          <label className="font-label-md text-label-md text-deep-navy block">Start Date</label>
          <input
            type="month"
            value={role.startDate}
            onChange={(e) => handleField('startDate', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all font-body-md"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center mb-1">
            <label className="font-label-md text-label-md text-deep-navy block">End Date</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={role.current}
                onChange={(e) => handleCurrentToggle(e.target.checked)}
                className="rounded text-electric-blue focus:ring-electric-blue w-4 h-4"
              />
              <span className="text-body-sm font-body-sm text-slate-gray">Current Role</span>
            </label>
          </div>
          <input
            type="month"
            value={role.endDate}
            disabled={role.current}
            onChange={(e) => handleField('endDate', e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg border border-outline-variant
              focus:ring-2 focus:ring-electric-blue focus:border-electric-blue
              outline-none transition-all font-body-md
              ${role.current ? 'opacity-50 bg-surface-container-low' : ''}
            `}
          />
        </div>

        <div className="md:col-span-2 space-y-1">
          <label className="font-label-md text-label-md text-deep-navy block">
            Key Accomplishments
          </label>
          <textarea
            rows={3}
            value={role.accomplishments}
            onChange={(e) => handleField('accomplishments', e.target.value)}
            placeholder="Describe your impact..."
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-electric-blue focus:border-electric-blue outline-none transition-all font-body-md"
          />
        </div>
      </div>
    </div>
  );
}
export default function SocialLoginButtons() {
    return (
      <div className="grid grid-cols-2 gap-stack-md">
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 border border-border-subtle rounded-lg hover:bg-surface-container-low transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-electric-blue">google</span>
          <span className="font-button text-body-sm">Google</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 py-3 px-4 border border-border-subtle rounded-lg hover:bg-surface-container-low transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-secondary">work</span>
          <span className="font-button text-body-sm">LinkedIn</span>
        </button>
      </div>
    );
  }
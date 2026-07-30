import Link from 'next/link';

export default function AuthFooter() {
  return (
    <footer className="w-full py-4 px-margin-mobile bg-surface-container-low border-t border-border-subtle">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-sm">
        <p className="font-body-sm text-body-sm text-slate-gray">
          © {new Date().getFullYear()} JobMatch Professional. All rights reserved.
        </p>
        <div className="flex gap-stack-md">
          <Link href="/privacy" className="font-label-md text-label-md text-slate-gray hover:text-electric-blue transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="font-label-md text-label-md text-slate-gray hover:text-electric-blue transition-colors">
            Terms of Service
          </Link>
          <Link href="/help" className="font-label-md text-label-md text-slate-gray hover:text-electric-blue transition-colors">
            Help Center
          </Link>
        </div>
      </div>
    </footer>
  );
}
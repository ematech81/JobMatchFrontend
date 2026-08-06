import Image from 'next/image';
import Link from 'next/link';

/**
 * Simplified header for the linear resume-upload flow — brand anchor + an exit
 * hatch, no nav links. Distinct from Header/DashboardHeader/etc. on purpose:
 * this flow shouldn't offer a way to wander off mid-upload.
 */
export default function UploadFlowHeader() {
  return (
    <header className="w-full bg-surface-container-lowest border-b border-border-subtle py-4 px-6 md:px-gutter sticky top-0 z-50">
      <div className="max-w-container-max mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/jobMatch-logo.png"
            alt="JobMatch Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain rounded-md"
          />
          <span className="font-headline-md text-headline-md font-bold text-primary">JobMatch</span>
        </Link>

        <Link
          href="/"
          className="text-on-surface-variant hover:text-electric-blue transition-colors font-label-md text-label-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
          Cancel
        </Link>
      </div>
    </header>
  );
}

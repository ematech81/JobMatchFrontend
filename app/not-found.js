import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <Image
        src="/jobMatch-logo.png"
        alt="JobMatch"
        width={64}
        height={64}
        className="h-16 w-16 rounded-lg object-contain mb-stack-lg"
      />
      <h1 className="font-headline-lg text-headline-lg text-deep-navy mb-stack-sm">Page not found</h1>
      <p className="text-slate-gray font-body-md mb-stack-lg max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
      >
        Back to home
      </Link>
    </main>
  );
}


import Image from 'next/image';
import Link from 'next/link';

const LINKS = [
  ['About Us', '/about'],
  ['Privacy Policy', '/privacy'],
  ['Terms of Service', '/terms'],
  ['Help Center', '/help'],
  ['Contact', '/contact'],
];

export default function SlimFooter() {
  return (
    <footer className="bg-surface-container-low border-t border-border-subtle mt-stack-lg">
      <div className="w-full py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-stack-md">
        <Link href="/" className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary">
          <Image src="/jobMatch-logo.png" alt="JobMatch" width={32} height={32} className="h-8 w-8 rounded-md object-contain" />
          JobMatch
        </Link>
        <div className="flex gap-gutter flex-wrap justify-center">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-slate-gray font-label-md text-label-md hover:text-secondary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
        <p className="text-slate-gray font-body-sm text-body-sm">
          © {new Date().getFullYear()} JobMatch Professional. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
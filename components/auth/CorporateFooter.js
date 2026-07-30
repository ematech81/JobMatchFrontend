import Image from 'next/image';
import Link from 'next/link';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLs1zjOOjJfZ7yftrw8HMQMOrQKdLivYJcjd0fn7pKLVZoB0PgUJolCR2JvFrb65gUdzZ_OobAZcZvK3M8CZTThU_TZLb5R7m9p-ECrrA9SgeGDyZDfWkAGcjea1t_og3fhVuBceuu6tG7Iz2g8eassbFs3lSmOhj3fegYILM-B66dEdamGO7AjgE-nrsDs3zJezMH1ulDGBdxqGqRfzWrGbbsyGENEN40Ai0vSkPbeSHJGhe4w1DnaYdg';

const LINKS = [
  ['About Us', '/about'],
  ['Privacy Policy', '/privacy'],
  ['Terms of Service', '/terms'],
  ['Help Center', '/help'],
  ['Contact', '/contact'],
];

export default function CorporateFooter() {
  return (
    <footer className="w-full py-stack-lg px-margin-mobile md:px-gutter max-w-container-max mx-auto border-t border-border-subtle">
      <div className="flex flex-col md:flex-row justify-between items-center gap-stack-md text-slate-gray">
        <div className="flex items-center gap-2">
          <Image
            src={LOGO_URL}
            alt="JobMatch"
            width={24}
            height={24}
            className="h-6 w-6 grayscale opacity-60"
          />
          <p className="font-body-sm text-body-sm">
            © {new Date().getFullYear()} JobMatch Professional. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-gutter">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="font-label-md text-label-md hover:text-secondary transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
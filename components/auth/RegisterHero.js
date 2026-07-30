import Image from 'next/image';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AP1WRLs1zjOOjJfZ7yftrw8HMQMOrQKdLivYJcjd0fn7pKLVZoB0PgUJolCR2JvFrb65gUdzZ_OobAZcZvK3M8CZTThU_TZLb5R7m9p-ECrrA9SgeGDyZDfWkAGcjea1t_og3fhVuBceuu6tG7Iz2g8eassbFs3lSmOhj3fegYILM-B66dEdamGO7AjgE-nrsDs3zJezMH1ulDGBdxqGqRfzWrGbbsyGENEN40Ai0vSkPbeSHJGhe4w1DnaYdg';

export default function RegisterHero() {
  return (
    <div className="hidden md:flex flex-col space-y-stack-lg pr-stack-lg">
      <div className="flex items-center space-x-stack-sm">
        <Image
          src={LOGO_URL}
          alt="JobMatch Logo"
          width={48}
          height={48}
          className="h-12 w-12 object-contain rounded-lg"
        />
        <span className="font-headline-lg text-headline-lg text-primary tracking-tight">
          JobMatch
        </span>
      </div>

      <div className="space-y-stack-md">
        <h1 className="font-display-lg text-display-lg text-primary leading-tight">
          Unlock your <span className="text-electric-blue">career potential</span> with precision.
        </h1>
        <p className="font-body-lg text-slate-gray max-w-md">
          Join 2 million+ professionals matching with their dream roles using our AI-driven talent system.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-stack-md pt-stack-md">
        <div className="p-stack-md bg-white border border-border-subtle rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-electric-blue mb-2">speed</span>
          <h3 className="font-label-md text-label-md text-primary">Fast Matching</h3>
          <p className="font-body-sm text-slate-gray">Connect with top recruiters in minutes.</p>
        </div>
        <div className="p-stack-md bg-white border border-border-subtle rounded-xl shadow-sm">
          <span className="material-symbols-outlined text-match-success mb-2">verified</span>
          <h3 className="font-label-md text-label-md text-primary">Verified Jobs</h3>
          <p className="font-body-sm text-slate-gray">100% legitimate corporate listings.</p>
        </div>
      </div>
    </div>
  );
}
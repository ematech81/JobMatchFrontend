import Image from 'next/image';
import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Hero() {
  return (
    <section className="relative min-h-[870px] flex items-center pt-16 hero-mesh overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile w-full grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center relative z-10">
        <div className="space-y-stack-lg">
          <div className="inline-flex items-center gap-stack-sm bg-white border border-border-subtle px-4 py-1.5 rounded-full shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-match-success animate-pulse" />
            <span className="font-label-md text-label-md text-slate-gray">
              8,249 active jobs posted today
            </span>
          </div>

          <h1 className="font-display-lg text-display-lg text-deep-navy leading-tight">
            Your next career move, <span className="text-electric-blue">matched by AI.</span>
          </h1>

          <p className="font-body-lg text-body-lg text-slate-gray max-w-xl">
            We connect top-tier professionals with high-growth companies using
            real-time algorithmic matching. Build your profile once, get matched forever.
          </p>

          <SearchBar />

          <div className="flex flex-wrap gap-stack-md pt-4">
            <Link
              href="/resume/upload"
              className="group flex items-center gap-3 bg-electric-blue text-white px-8 py-4 rounded-xl font-button shadow-lg hover:shadow-electric-blue/20 transition-all"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                upload_file
              </span>
              Upload Resume
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/resume/build"
              className="flex items-center gap-3 bg-white border-2 border-electric-blue text-electric-blue px-8 py-4 rounded-xl font-button hover:bg-surface-container-low transition-all"
            >
              <span className="material-symbols-outlined">edit_document</span>
              Build Your Resume
            </Link>
          </div>
        </div>

        {/* Abstract Visual */}
        <div className="relative hidden lg:block">
          <div className="relative z-10 space-y-6">
            <div className="glass-card p-6 rounded-2xl shadow-xl w-72 absolute -top-12 -left-12 animate-bounce-slow">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-lg text-electric-blue">
                  <span className="material-symbols-outlined">work</span>
                </div>
                <span className="bg-match-success/10 text-match-success text-xs font-bold px-2 py-1 rounded">
                  98% Match
                </span>
              </div>
              <h3 className="font-headline-md text-[18px] text-deep-navy mb-1">
                Senior Product Designer
              </h3>
              <p className="text-slate-gray text-sm">Innovate Systems • New York</p>
            </div>

            <div className="glass-card p-6 rounded-2xl shadow-xl w-72 ml-auto mt-24">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKBq3548taR4dyr4hJOwLLDwTM6eMpYCyDGLelmRjKMwH3aAyQlRvaW4-t7wI-Vq9gFagczjSYKm8c7Lg5iRWZspNmfd9WqiFczMv6hAdjb9lqGkc5CcWIs48_3XZkKTLFK-T31AEdaZkSUDfOzCrnd1VQy8ervYvxga4zh3n0EoejzmbzH1WDIaVl6_E1rjwmtC-_08FMEdJ-GwypcU1SpGbPcAdyhAJbhm-TeW26-d48FMc_CYPg8xE93I_Ac7Py2iUQf2EJrzg"
                    alt="Alex Thompson profile photo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-deep-navy">Alex Thompson</h4>
                  <p className="text-slate-gray text-xs">Resume Uploaded</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-100 rounded-full">
                  <div className="h-full w-3/4 bg-electric-blue rounded-full" />
                </div>
                <p className="text-[10px] text-slate-gray text-right">Analyzing Skills... 75%</p>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl shadow-xl w-64 absolute -bottom-12 left-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-match-success">verified_user</span>
                <span className="text-xs font-bold text-deep-navy">Verified Opportunity</span>
              </div>
              <p className="text-slate-gray text-xs">
                3 recruiters from top tech firms viewed your profile today.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
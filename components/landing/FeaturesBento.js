import Image from 'next/image';
import Link from 'next/link';

export default function FeaturesBento() {
  return (
    <section className="py-stack-lg bg-white border-y border-border-subtle">
      <div className="max-w-container-max mx-auto px-margin-mobile">
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-headline-lg text-headline-lg text-deep-navy">
            Precision Matching Features
          </h2>
          <p className="text-slate-gray max-w-2xl mx-auto">
            Skip the noise. Our platform focuses on quality, relevancy, and speed to
            get you hired faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="md:col-span-2 group relative overflow-hidden bg-surface-container-low rounded-3xl p-8 transition-all hover:shadow-2xl hover:-translate-y-1">
            <div className="relative z-10 max-w-sm">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-6">
                <span
                  className="material-symbols-outlined text-electric-blue text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
              </div>
              <h3 className="font-headline-md text-deep-navy mb-4">
                Real-Time Algorithmic Matching
              </h3>
              <p className="text-slate-gray body-md mb-6">
                Our proprietary engine analyzes 50+ data points in milliseconds. As
                soon as a job is posted that fits your profile, you're the first to know.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-deep-navy font-medium">
                  <span className="material-symbols-outlined text-match-success">check_circle</span>
                  Instant skill-gap analysis
                </li>
                <li className="flex items-center gap-3 text-deep-navy font-medium">
                  <span className="material-symbols-outlined text-match-success">check_circle</span>
                  Competitive salary benchmarking
                </li>
              </ul>
            </div>
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-40 group-hover:opacity-60 transition-opacity hidden md:block">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXxmqZNz1LV8pb9YSvhMPOsb3fonz3HmENnWSdkxF4XuhU3MP1HJDbWlkS6Osy1BKbbW4xtwbdsJ4rlxlUomGKbmfyLevIFDA3xMtLEWjT5mep1KTcM-iW4dyvSZyoD-qLukMS7HCx5fMtEK4o1N-sQzSPM8KYCsSAumheJ5JRAy_JX8BCeNhnoTiE7gJKMUjU2mRS8sSGwoJqQDkgH4eZ88JlaYTfIHz8QBAuMZPI7VLuQMcLXqmTxKBD457MyNhI2FEV3gHq0Lk"
                alt="Data visualization of algorithmic job matching"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-deep-navy text-white rounded-3xl p-8 flex flex-col justify-between hover:shadow-2xl transition-all">
            <div>
              <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white text-3xl">public</span>
              </div>
              <h3 className="font-headline-md text-white mb-4">Global Reach, Local Depth</h3>
              <p className="text-white/70 body-md">
                Browse hyper-local roles in over 150 countries with built-in visa
                sponsorship filters.
              </p>
            </div>
            <div className="mt-8">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-deep-navy bg-slate-300 overflow-hidden relative">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDHmenN63xiBAFC2Up8-jbAEv03uQQHrQnOk0jwRq8wLUIQKY9Kpl2VRlOuyrWL816mbW9xbDDnFOG_SNWgTTl66YMosUM4SNVY7N7x5dvYhUiyI9Xgf38bCcd68h_6CrXcXgWJ1_SrTDDu0TVmzjcU6DaHwVZSj7diGXQiDT3hMwz4I_-0P21GA8gGYDOga_j2Thjkf6RAzzoifqxLv7aXTaQUhNjPl9lRq2ZM2HNtPWBtbt9Hmm330UeJ2kiEmZCVkv_RXiZ3e4"
                    alt="Professional using JobMatch"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-deep-navy bg-slate-400" />
                <div className="w-8 h-8 rounded-full border-2 border-deep-navy bg-slate-500" />
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-deep-navy bg-electric-blue text-[10px] font-bold">
                  +140
                </div>
              </div>
              <p className="mt-3 text-xs text-white/50">Used by professionals worldwide</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-border-subtle rounded-3xl p-8 hover:shadow-2xl transition-all">
            <div className="bg-surface-container w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-deep-navy text-3xl">auto_fix_high</span>
            </div>
            <h3 className="font-headline-md text-deep-navy mb-4">Resume Optimizer</h3>
            <p className="text-slate-gray body-md mb-6">
              Our AI builder formats your experience to bypass ATS filters while
              highlighting your unique strengths to human recruiters.
            </p>
            <Link
              href="/resume/build"
              className="text-electric-blue font-bold flex items-center gap-2 group"
            >
              Try the builder
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="md:col-span-2 bg-surface-container-highest/30 rounded-3xl p-8 flex items-center justify-between gap-gutter overflow-hidden">
            <div className="flex-1">
              <h3 className="font-headline-md text-deep-navy mb-4">Verified Companies Only</h3>
              <p className="text-slate-gray body-md">
                We vet every single employer to ensure you're applying to real, active
                roles at legitimate companies. No spam, no ghosting.
              </p>
            </div>
            <div className="hidden sm:grid grid-cols-2 gap-4 flex-shrink-0">
              {['TECHCORP', 'NEXUS', 'GLOBAL', 'VANTAGE'].map((name) => (
                <div
                  key={name}
                  className="w-20 h-12 bg-white rounded shadow-sm flex items-center justify-center grayscale opacity-60"
                >
                  <span className="text-xs font-black text-slate-gray">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
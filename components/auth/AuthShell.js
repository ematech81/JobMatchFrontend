import Image from 'next/image';
import AuthFooter from './AuthFooter';

export default function AuthShell({ children, badge, headline, description, stats }) {
  return (
    <>
      <main className="flex-grow flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-[480px] flex flex-col justify-center items-center px-margin-mobile md:px-gutter bg-surface-container-lowest z-10 shadow-xl py-stack-lg">
          <div className="w-full max-w-[360px] flex flex-col gap-stack-lg">
            {children}
          </div>
        </div>

        <div className="hidden md:flex flex-grow relative overflow-hidden kinetic-bg items-center justify-center">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCdbihbWhF7XzBNeg36EEbyq6q7v8gwBPWVtSm81bb9Te3osoMeHumqmQAKl-AttsLqvrQXL7K4cvNyMCCcCBmGTVolhoWiY6TCLEy9VoLN1ijpNVO3gg7vk8Q5a1uNZEwqDZR9_o87SzI-FK5u7GdkSNTEUowoQU5WcDHJOxKJgaeeLaMIY2c82EuRCiCRBCDjniftRBT-YX7X3pTcoo4qxSHSNkEhlTrGbXOF8NOgoCB-7-xyv_GV')",
            }}
          />
          <div className="relative z-10 p-stack-lg max-w-lg backdrop-blur-md bg-white/40 border border-white/40 rounded-xl shadow-2xl mx-gutter">
            <div className="flex flex-col gap-stack-md">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-match-success"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  stars
                </span>
                <span className="font-label-md text-label-md text-deep-navy uppercase tracking-widest">
                  {badge}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-deep-navy">{headline}</h2>
              <p className="font-body-lg text-body-lg text-on-primary-fixed-variant leading-relaxed">
                {description}
              </p>

              {stats && (
                <div className="grid grid-cols-2 gap-stack-md mt-4 border-t border-deep-navy/10 pt-stack-md">
                  {stats.map(([value, label]) => (
                    <div key={label}>
                      <p className="font-display-lg text-headline-lg text-electric-blue">{value}</p>
                      <p className="text-body-sm text-slate-gray">{label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-10 right-10 flex gap-2">
            <div className="w-3 h-3 bg-match-success rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-electric-blue/50 rounded-full animate-pulse [animation-delay:75ms]" />
            <div className="w-3 h-3 bg-electric-blue/20 rounded-full animate-pulse [animation-delay:150ms]" />
          </div>
        </div>
      </main>

      <AuthFooter />
    </>
  );
}
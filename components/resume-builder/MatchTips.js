export default function MatchTips() {
    return (
      <div className="mt-stack-lg flex flex-col md:flex-row gap-stack-md w-full max-w-4xl">
        <div className="flex-1 glass-card p-6 rounded-xl border-l-4 border-l-match-success">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-match-success/10 text-match-success rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                bolt
              </span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-deep-navy">
                Real-time Match Power
              </h4>
              <p className="text-body-sm font-body-sm text-slate-gray">
                Adding detailed experience will reveal matching positions immediately.
              </p>
            </div>
          </div>
        </div>
  
        <div className="flex-1 glass-card p-6 rounded-xl border-l-4 border-l-electric-blue">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-electric-blue/10 text-electric-blue rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                lightbulb
              </span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md text-deep-navy">Resume Tip</h4>
              <p className="text-body-sm font-body-sm text-slate-gray">
                Focus on quantifiable results (e.g. &quot;Increased revenue by 15%&quot;).
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
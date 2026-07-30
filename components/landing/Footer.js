import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-deep-navy text-on-secondary w-full pt-16 pb-8">
      <div className="max-w-container-max mx-auto px-margin-mobile">
        <div className="flex flex-col md:flex-row justify-between items-start gap-stack-lg mb-16">
          <div className="max-w-xs space-y-4">
            <span className="font-headline-md text-headline-md text-on-secondary font-bold">
              JobMatch
            </span>
            <p className="text-on-secondary-container opacity-80 text-body-sm">
              Empowering world-class talent to find high-impact careers through
              precision technology and human-centric design.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-stack-lg">
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-on-secondary-container opacity-50">
                Platform
              </h4>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="text-on-secondary-container opacity-80 hover:opacity-100 transition-opacity">Find Jobs</Link></li>
                <li><Link href="/resume/build" className="text-on-secondary-container opacity-80 hover:opacity-100 transition-opacity">Resume Builder</Link></li>
                <li><Link href="/companies" className="text-on-secondary-container opacity-80 hover:opacity-100 transition-opacity">Companies</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-on-secondary-container opacity-50">
                Support
              </h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-on-secondary-container opacity-80 hover:opacity-100 transition-opacity">Help Center</Link></li>
                <li><Link href="/contact" className="text-on-secondary-container opacity-80 hover:opacity-100 transition-opacity">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-on-secondary-container opacity-80 hover:opacity-100 transition-opacity">Privacy</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-on-secondary-container opacity-50">
                Social
              </h4>
              <div className="flex gap-4">
                <a href="#" className="text-on-secondary-container opacity-80 hover:text-white transition-all">
                  <span className="material-symbols-outlined">link</span>
                </a>
                <a href="#" className="text-on-secondary-container opacity-80 hover:text-white transition-all">
                  <span className="material-symbols-outlined">share</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-stack-md text-body-sm">
          <p className="opacity-60">© {new Date().getFullYear()} JobMatch Inc. All rights reserved.</p>
          <div className="flex gap-stack-lg">
            <Link href="/privacy" className="opacity-60 hover:opacity-100 transition-opacity">Privacy Policy</Link>
            <Link href="/terms" className="opacity-60 hover:opacity-100 transition-opacity">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
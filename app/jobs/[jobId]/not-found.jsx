
import Link from 'next/link';
import SlimFooter from '@/components/layout/SlimFooter';

export default function NotFound() {
  return (
    <>
      <main className="max-w-container-max mx-auto px-margin-mobile py-stack-lg min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-stack-md">
          Job not found
        </h1>
        <p className="text-slate-gray text-body-md mb-stack-lg">
          This role may have been filled or removed.
        </p>
        <Link
          href="/jobs/search"
          className="bg-electric-blue text-white px-8 py-3 rounded-lg font-button text-button hover:shadow-lg transition-all"
        >
          Browse all jobs
        </Link>
      </main>
      <SlimFooter />
    </>
  );
}
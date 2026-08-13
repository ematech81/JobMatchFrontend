export default function LegalSection({ title, children }) {
  return (
    <section className="mb-stack-lg">
      {title && <h2 className="font-headline-md text-headline-md text-deep-navy mb-stack-sm">{title}</h2>}
      <div className="space-y-4 text-slate-gray font-body-md text-body-md leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-electric-blue [&_a]:hover:underline">
        {children}
      </div>
    </section>
  );
}

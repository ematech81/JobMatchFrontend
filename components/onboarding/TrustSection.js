import Image from 'next/image';

export default function TrustSection() {
  return (
    <div className="mt-16 pt-16 border-t border-border-subtle max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-stack-lg">
      <div className="text-center md:text-left">
        <p className="font-label-md text-label-md text-slate-gray mb-2 uppercase tracking-widest">
          Global Partnerships
        </p>
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="h-8 w-24 bg-slate-400 rounded-md" />
          <div className="h-8 w-32 bg-slate-400 rounded-md" />
          <div className="h-8 w-28 bg-slate-400 rounded-md" />
        </div>
      </div>

      <div className="bg-white/50 border border-border-subtle p-6 rounded-xl flex items-center gap-4 max-w-sm">
        <div className="flex -space-x-2">
          <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgxvdPFIH2rzvs_FR5J0Wl3N21o4Edb1uLQUdItbehQTGhEexXVHoULS2BxPDIGpJQt894vPJbZPCphJlJZyWGxsMbpH365WWkrK5OcwIIeM7-lISY7JiRFLLjX_UlycT-rkZnmeTfGS7ZD439ciIBs_HlTE7NY47cBR5Ida2oSLV23Mhw5c-x5lrTSHP9vt8HHudJSki_0Nl7y5jJ__nTtwAJb8wOPoy_Uut34Re0X-ID2PW5tHi6dZrNSk34EteTqBQLiUPUx4E"
              alt="Professional user"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJfrtE_IOL5hLIx_fyiYxi90bF91BGwII5KltWCV8tzZOFBRp7xOL5iXqvYr4LlfPhKNJyNbWg-GTzaiosjkbN6OTPLjREIVGSd7qPm53mx-B3ldZpsit6VcO_jGSJ8uOMi4Dk5CEWHSLNCts2vI-1f4MF_H8jXr6REm8bHRIg9Wq6cFxnCs6rD1jAeASQFeAftRyaDRHA1AeO-YRrtubf8jDsDwbWzU18xaqUQCx5V9uDKdHhTzCKB0FcIyt902ec7LhL5keK6Dg"
              alt="Professional user"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center font-bold text-[10px]">
            +2k
          </div>
        </div>
        <div>
          <p className="font-body-sm text-deep-navy font-semibold">Join 50k+ professionals</p>
          <p className="text-body-sm text-slate-gray">Matched with Fortune 500 companies.</p>
        </div>
      </div>
    </div>
  );
}
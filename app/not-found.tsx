import { ArrowLeft } from 'lucide-react';
// FIX: Remove 'next/link' to prevent context errors in static build
// import Link from 'next/link'; 

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-50">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-tight">
          Page Not Found
        </h2>
        <p className="text-white/60">
          The weather coordinates you are looking for do not exist.
        </p>
        {/* Use standard <a> tag instead of Link for absolute safety */}
        <a 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition-all border border-white/5 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Return to Radar
        </a>
      </div>
    </div>
  );
}
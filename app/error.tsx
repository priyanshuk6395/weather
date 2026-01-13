'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <p className="opacity-60 text-sm max-w-xs mx-auto">
          {error.message || "An unexpected error occurred in the simulation."}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
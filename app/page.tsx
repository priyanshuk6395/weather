import { Suspense } from 'react'; // 1. Import Suspense
import { getWeatherForecast } from '@/lib/weather-service';
import { TimeTravelLayout } from '@/components/time-travel-layout';
import { SearchBox } from '@/components/search-box';

export default async function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ city?: string, name?: string }> 
}) {
  const params = await searchParams;
  const locationQuery = params.city || 'London'; // Default
  const displayName = params.name;

  const forecast = await getWeatherForecast(locationQuery, displayName);

  // Fallback UI if API totally fails
  if (!forecast || forecast.length === 0) {
    return (
      <main className="relative h-screen w-full bg-[#0f141e] text-white overflow-hidden">
        {/* 2. Wrap SearchBox in Suspense */}
        <Suspense fallback={<div className="h-16" />}>
          <SearchBox />
        </Suspense>
        
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4 text-center">
          <div className="p-4 rounded-full bg-red-500/10 text-red-400">
            {/* SVG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          </div>
          <h1 className="text-2xl font-bold">Weather Unavailable</h1>
          <p className="opacity-60 max-w-md">
            We couldn't find weather data. Try searching for a major city.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative">
      {/* 3. Wrap SearchBox in Suspense here too */}
      <Suspense fallback={<div className="absolute top-6 left-0 right-0 z-50 h-14" />}>
        <SearchBox />
      </Suspense>

      <TimeTravelLayout forecast={forecast} />
    </main>
  );
}
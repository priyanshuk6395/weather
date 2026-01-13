'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Wind } from 'lucide-react';
import { DetailGrid } from './detail-grid';
import { AstroGraph } from './astro-graph';
import { AtmosphericNoise } from './atmospheric-noise';
import { DetailedWeather } from '@/lib/weather-utils';
import dynamic from 'next/dynamic';

const WeatherCanvas = dynamic(() => import('./weather-canvas').then(mod => mod.WeatherCanvas), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-transparent" /> 
});

export const TimeTravelLayout = ({ forecast }: { forecast: DetailedWeather[] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const w = forecast[activeIdx];

  const getGradient = () => {
    if (!w.isDay) return 'from-[#0f2027] to-[#2c5364]'; 
    if (w.condition === 'CLEAR') return 'from-[#2980b9] to-[#6dd5fa]';
    if (w.condition === 'RAIN') return 'from-[#373B44] to-[#4286f4]';
    if (w.condition === 'STORM') return 'from-[#232526] to-[#414345]';
    if (w.condition === 'SNOW') return 'from-[#E0EAFC] to-[#CFDEF3]';
    return 'from-[#bdc3c7] to-[#2c3e50]';
  };

  return (
    <div className="relative w-full min-h-screen font-sans text-white">
      
      <div className={`fixed inset-0 transition-colors duration-1000 bg-gradient-to-b ${getGradient()}`}>
        <WeatherCanvas 
            condition={w.condition} 
            windSpeed={w.windSpeed} 
            windDirection={w.windDirection} 
            isDay={w.isDay} 
        />
        <AtmosphericNoise />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <AnimatePresence mode='wait'>
            <motion.div 
              key={w.timeLabel}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              {/* Location Name Display */}
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2 drop-shadow-lg">
                {w.locationName}
              </h2>

              <div className="text-xl uppercase tracking-widest opacity-80 mb-2">
                {activeIdx === 0 ? 'Now' : w.timeLabel}
              </div>
              <h1 className="text-9xl font-bold tracking-tighter">
                {w.temp}°
              </h1>
              <p className="text-2xl font-light opacity-90">
                {w.condition}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-30 pt-[100vh]">
        <div className="bg-gradient-to-t from-[#0f0c29] via-[#0f0c29]/90 to-transparent min-h-screen pb-20">
          <div className="container mx-auto px-4 -mt-32 mb-20 relative z-40">
             <div className="flex flex-col items-center gap-6">
                <AstroGraph sunrise={w.sunriseTime} sunset={w.sunsetTime} currentTime={w.rawTime} />
                <DetailGrid weather={w} />
             </div>
          </div>
          <div className="flex flex-col items-center gap-24 mt-20 pb-[40vh]">
             <div className="text-white/50 text-sm animate-bounce flex items-center gap-2">
               <ArrowDown size={16} /> Timeline Forecast
             </div>
             {forecast.map((snap, i) => (
                <motion.div 
                  key={i}
                  onViewportEnter={() => setActiveIdx(i)}
                  viewport={{ amount: 0.5, margin: "-10% 0px -10% 0px" }}
                  className={`
                    w-full max-w-md p-6 rounded-2xl border transition-all duration-500 backdrop-blur-md
                    ${i === activeIdx ? 'bg-white/10 border-white/50 scale-105 opacity-100' : 'bg-black/20 border-white/5 opacity-40 scale-95'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold">{snap.timeLabel}</div>
                      <div className="text-sm opacity-60">{snap.condition}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-light">{snap.temp}°</div>
                      <div className="flex items-center gap-1 text-xs opacity-50 mt-1 justify-end">
                        <Wind size={12} /> {snap.windSpeed} km/h
                      </div>
                    </div>
                  </div>
                </motion.div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
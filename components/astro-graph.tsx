'use client';

import React from 'react';

export const AstroGraph = ({ sunrise, sunset, currentTime }: { sunrise: string, sunset: string, currentTime: string }) => {
  const start = new Date(sunrise).getTime() || 0;
  const end = new Date(sunset).getTime() || 0;
  const now = new Date(currentTime).getTime() || 0;
  
  // Calculate progress 0 to 1
  let progress = 0;
  if (end > start) {
    progress = (now - start) / (end - start);
  }
  progress = Math.max(0, Math.min(1, progress));

  // --- SVG COORDINATE SYSTEM ---
  // We use a fixed viewBox (0 0 200 100) that scales to fit any width.
  // The curve goes from (0, 100) to (200, 100) peaking at (100, 20).
  const width = 200;
  const height = 100;
  const padding = 20; // Space for the sun icon so it doesn't get cut off
  
  // Bezier Curve: Start(0,100) -> Control(100, -50) -> End(200,100)
  // We adjust Y by 'padding' so the bottom is at 100-padding
  const baseY = height - padding;
  const peakY = -40; // Control point pulls curve up

  // Calculate Sun Position on the Curve using Quadratic Bezier formula
  // B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const t = progress;
  
  // X is linear for this simple visualization
  const sunX = t * width;
  
  // Y follows the curve math (Simplified Sine approximation for visual smoothness)
  // Peak is at 0.5. 
  const amplitude = baseY - 20; // Height of the arc
  const sunY = baseY - (Math.sin(t * Math.PI) * amplitude);

  const formatTime = (timeStr: string) => {
    try {
      return new Date(timeStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch { return '--:--'; }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 w-full max-w-md">
      
      <div className="flex justify-between text-xs text-white/50 mb-2 font-mono tracking-widest uppercase">
        <span>Sunrise {formatTime(sunrise)}</span>
        <span>Sunset {formatTime(sunset)}</span>
      </div>

      <div className="relative w-full aspect-[2.5/1]">
        <svg 
          viewBox={`-10 0 ${width + 20} ${height}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* 1. Horizon Line */}
          <line x1="0" y1={baseY} x2={width} y2={baseY} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* 2. The Trajectory (Dashed) */}
          {/* Q x1 y1, x, y (Control Point, End Point) */}
          <path 
            d={`M 0,${baseY} Q ${width/2},${peakY} ${width},${baseY}`} 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeDasharray="4 4" 
            opacity="0.3" 
          />

          {/* 3. The Sun (Grouped SVG elements) */}
          <g transform={`translate(${sunX}, ${sunY})`}>
            {/* Glow Effect */}
            <circle r="12" fill="#FDB813" opacity="0.3" filter="blur(4px)" />
            {/* Core Sun */}
            <circle r="6" fill="#FDB813" />
            {/* Sun Rays (Simple Cross) */}
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#FDB813" strokeWidth="2" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#FDB813" strokeWidth="2" />
          </g>
        </svg>
      </div>
      
      <div className="text-center -mt-2">
        <p className="text-white/80 text-sm font-medium">Sun Position</p>
      </div>
    </div>
  );
};
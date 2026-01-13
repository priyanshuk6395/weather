'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WeatherCanvasProps {
  condition: string;
  windSpeed: number;
  windDirection: number;
  isDay: boolean;
}

export const WeatherCanvas: React.FC<WeatherCanvasProps> = ({ condition, windSpeed, windDirection }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State to track if we should animate
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 1. PERFORMANCE: Detect Mobile & Off-screen status
  useEffect(() => {
    // Detect Mobile (simplistic check for < 768px)
    setIsMobile(window.innerWidth < 768);

    // Observer: Only animate when user is looking at the hero section
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    
    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Hint browser to optimize for speed
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let animationId: number;
    
    // --- Frame Throttling Logic ---
    let lastTime = 0;
    const fpsLimit = isMobile ? 30 : 60; // 30fps on mobile saves massive battery
    const fpsInterval = 1000 / fpsLimit;

    // --- Math Setup ---
    const windRad = (windDirection - 90) * (Math.PI / 180);
    const forceMultiplier = Math.min(windSpeed, 40) / 10; 
    const windX = Math.cos(windRad) * forceMultiplier;
    const windY = 0.5 + Math.abs(Math.sin(windRad) * forceMultiplier * 0.2);

    // --- Particle System ---
    class Particle {
      x: number; y: number; z: number; length: number; speed: number;
      
      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.z = Math.random() * 0.5 + 0.5; // Depth (0.5 to 1.0)
        this.speed = (Math.random() * 5 + 5) * this.z; 
        this.length = (Math.random() * 10 + 5) * this.z;
      }

      update(w: number, h: number) {
        this.x += windX * this.speed;
        this.y += windY * this.speed;
        
        // Wrap logic
        if (this.y > h) { this.y = -20; this.x = Math.random() * w; }
        if (this.x > w) this.x = 0;
        if (this.x < 0) this.x = w;
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.strokeStyle = `rgba(255, 255, 255, ${0.4 * this.z})`;
        c.lineWidth = 1.5 * this.z;
        c.moveTo(this.x, this.y);
        c.lineTo(this.x - (windX * 2), this.y + this.length);
        c.stroke();
      }
    }

    // --- Init ---
    const particles: Particle[] = [];
    
    // Massive optimization: 400 particles on Desktop, only 50 on Mobile
    const baseCount = condition === 'RAIN' || condition === 'STORM' ? 400 : 50;
    const count = isMobile ? Math.min(baseCount, 50) : baseCount;

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas.width, canvas.height));
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    window.addEventListener('resize', resize);
    resize();

    // --- Render Loop (With Throttling) ---
    const render = (currentTime: number) => {
      animationId = requestAnimationFrame(render);
      
      // 1. Pause if scrolled away
      if (!isVisible) return;

      // 2. Throttle FPS
      const elapsed = currentTime - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = currentTime - (elapsed % fpsInterval);

      // 3. Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (condition !== 'CLEAR' && condition !== 'CLOUDY') {
        particles.forEach(p => {
          p.update(canvas.width, canvas.height);
          p.draw(ctx);
        });
      }
    };
    
    render(0);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [condition, windSpeed, windDirection, isVisible, isMobile]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 w-full h-full pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
"use client";
import { useEffect, useState, useRef } from "react";

export default function PathfinderHUD() {
  const [distance, setDistance] = useState(84);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Countdown logic for the distance meter
  useEffect(() => {
    const interval = setInterval(() => {
      setDistance((prev) => (prev > 12 ? prev - 1 : 12));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Watermark Killer: Loops the video before the Arena AI logo appears
  const handleVideoUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 10) {
      videoRef.current.currentTime = 0; 
      videoRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-mono selection:bg-cyan-900">
      
      {/* Background First-Person Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onTimeUpdate={handleVideoUpdate}
        className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
        src="/nav-video.mp4" 
      />

      {/* AR Scanline Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

      {/* Main HUD Overlay */}
      <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between pointer-events-none text-cyan-400">
        
        {/* Top Header - Responsive Text */}
        <div className="flex justify-between items-start border-b border-cyan-800/50 pb-2">
          <div>
            <h1 className="text-sm sm:text-2xl font-black tracking-widest text-red-500 animate-pulse leading-none">
              ACTIVE CRISIS PROTOCOL
            </h1>
            <p className="text-[10px] sm:text-sm tracking-widest text-cyan-200 mt-1">OPR: RESPONDER 01 // SECTOR 7</p>
          </div>
          <div className="text-right">
            <h2 className="text-xs sm:text-xl font-bold tracking-widest">SYS.INTEGRITY: 98%</h2>
            <p className="text-[10px] sm:text-sm text-cyan-200">ENV: HOSTILE</p>
          </div>
        </div>

        {/* Center Reticle & Navigation */}
        <div className="flex-grow flex items-center justify-center relative">
          {/* Target Reticle - Smaller on Mobile */}
          <div className="w-48 h-48 sm:w-64 sm:h-64 border border-cyan-500/30 rounded-full flex items-center justify-center relative">
            <div className="w-4 h-4 border-t-2 border-l-2 border-cyan-400 absolute top-0 left-0" />
            <div className="w-4 h-4 border-t-2 border-r-2 border-cyan-400 absolute top-0 right-0" />
            <div className="w-4 h-4 border-b-2 border-l-2 border-cyan-400 absolute bottom-0 left-0" />
            <div className="w-4 h-4 border-b-2 border-r-2 border-cyan-400 absolute bottom-0 right-0" />
            <div className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
          </div>

          {/* Navigation Path System */}
          <div className="absolute bottom-4 sm:bottom-10 right-1/2 sm:right-1/4 transform translate-x-1/2 bg-black/60 p-3 sm:p-4 border border-cyan-500/50 backdrop-blur-sm rounded">
            <p className="text-[9px] sm:text-xs tracking-widest mb-2 text-center">4-WAY INTERSECTION AHEAD</p>
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 mx-auto">
              <div className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-cyan-900" />
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-cyan-900" />
              <div className="absolute bottom-0 top-1/2 left-1/2 w-1 -translate-x-1/2 bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <div className="absolute right-1/2 left-0 top-1/2 h-1 -translate-y-1/2 bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-green-400 text-xs sm:text-base font-bold text-center mt-2 animate-pulse uppercase">Proceed Left</p>
          </div>
        </div>

        {/* Bottom Footer Data - Scaled for Small Screens */}
        <div className="flex justify-between items-end gap-2">
          <div className="bg-black/70 p-3 sm:p-4 border-l-4 border-red-500 backdrop-blur-md max-w-[80%] sm:max-w-none">
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">Target Destination</p>
            <p className="text-sm sm:text-2xl font-bold text-white truncate uppercase">Lobby (Fallback)</p>
            <p className="text-xs sm:text-lg text-red-400 mt-1 font-bold">DISTANCE: {distance} METERS</p>
          </div>

          {/* Data Bars - Hidden on mobile to save space */}
          <div className="hidden sm:flex gap-2">
            <div className="h-12 w-6 bg-cyan-900/40 border border-cyan-500/50 flex items-end">
              <div className="w-full bg-cyan-400 animate-pulse" style={{ height: '80%' }} />
            </div>
            <div className="h-12 w-6 bg-cyan-900/40 border border-cyan-500/50 flex items-end">
              <div className="w-full bg-cyan-400 animate-pulse" style={{ height: '40%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
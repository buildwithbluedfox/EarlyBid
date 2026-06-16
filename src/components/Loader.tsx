import React from 'react';

export default function Loader({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center pointer-events-auto"
      style={{ backgroundColor: '#ffffff', zIndex: 99999 }}
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* The Base Grainy Planet */}
        <div className="absolute inset-2 rounded-full overflow-hidden shadow-[0_0_50px_rgba(27,103,179,0.4)] bg-black">
          {/* Liquid Blob 1 */}
          <div 
            className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%] bg-[#4ba1fa] opacity-80 blur-2xl mix-blend-screen"
            style={{ animation: 'liquid-blob-1 1.2s ease-in-out infinite alternate' }}
          ></div>
          {/* Liquid Blob 2 */}
          <div 
            className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%] bg-[#1B67B3] opacity-80 blur-2xl mix-blend-screen"
            style={{ animation: 'liquid-blob-2 1.5s ease-in-out infinite alternate-reverse' }}
          ></div>
          {/* Film Grain Texture Overlay */}
          <div 
            className="absolute inset-[-50%] mix-blend-overlay"
            style={{ 
              opacity: 0.15, 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              animation: 'grain-flow 3s linear infinite'
            }}
          ></div>
        </div>

        {/* The Growing Stroke Circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#1B67B3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="301.59"
            strokeDashoffset="301.59"
            style={{ animation: 'draw-circle 1s cubic-bezier(0.65, 0, 0.35, 1) forwards' }}
          />
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes draw-circle {
          0% { stroke-dashoffset: 301.59; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes liquid-blob-1 {
          0% { transform: translate(0, 0) scale(1); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          33% { transform: translate(15%, 5%) scale(1.1); border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
          66% { transform: translate(-5%, 15%) scale(0.9); border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
          100% { transform: translate(0, 0) scale(1); border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
        }
        @keyframes liquid-blob-2 {
          0% { transform: translate(0, 0) scale(1); border-radius: 50% 50% 50% 70% / 50% 50% 70% 50%; }
          33% { transform: translate(-10%, -15%) scale(0.95); border-radius: 30% 70% 70% 30% / 50% 30% 50% 70%; }
          66% { transform: translate(10%, 5%) scale(1.05); border-radius: 60% 40% 30% 70% / 70% 50% 30% 50%; }
          100% { transform: translate(0, 0) scale(1); border-radius: 50% 50% 50% 70% / 50% 50% 70% 50%; }
        }
        @keyframes grain-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-5%, -5%); }
        }
      `}} />
    </div>
  );
}

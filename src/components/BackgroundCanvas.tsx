import React from 'react';

interface BackgroundCanvasProps {
  isPlaying: boolean;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ isPlaying }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Tricolor Cinematic Aurora Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B2600] via-[#3A1400] to-[#042817] transition-all duration-1000" />

      {/* Saffron Glowing Blob (Top Right) */}
      <div
        className={`absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FF671F] via-[#FF9933] to-transparent opacity-60 blur-[100px] transition-transform duration-1000 ${
          isPlaying ? 'scale-110 animate-pulse' : 'scale-100'
        }`}
      />

      {/* Deep Navy / Ashoka Chakra Ambient Light (Center) */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-blue-900/40 via-indigo-950/50 to-blue-900/30 blur-[120px] transition-transform duration-1000 ${
          isPlaying ? 'scale-125' : 'scale-100'
        }`}
      />

      {/* Emerald Green Glowing Blob (Bottom Left) */}
      <div
        className={`absolute -bottom-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#046A38] via-[#138808] to-transparent opacity-65 blur-[110px] transition-transform duration-1000 ${
          isPlaying ? 'scale-110 animate-pulse' : 'scale-100'
        }`}
      />

      {/* Subtle Ashoka Chakra 24-spoke Background Mandala Graphic */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <svg
          viewBox="0 0 100 100"
          className={`w-[600px] h-[600px] text-blue-200 transition-transform duration-[60s] ease-linear ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '60s' }}
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x2 = 50 + 46 * Math.cos(rad);
            const y2 = 50 + 46 * Math.sin(rad);
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="0.8"
              />
            );
          })}
        </svg>
      </div>

      {/* Grain / Noise Overlay for Cinematic Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

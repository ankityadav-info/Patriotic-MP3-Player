import React, { useState } from 'react';
import { Volume2, Flag, Truck } from 'lucide-react';

export const PatrioticBadge: React.FC = () => {
  const [playedHorn, setPlayedHorn] = useState(false);

  const playHornSound = () => {
    setPlayedHorn(true);
    setTimeout(() => setPlayedHorn(false), 800);

    // Synthesize a brief classic Indian truck horn sound using Web Audio API
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(320, ctx.currentTime);
        osc2.frequency.setValueAtTime(400, ctx.currentTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.6);
        osc2.stop(ctx.currentTime + 0.6);
      }
    } catch {
      // ignore audio context restrictions if blocked
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-start gap-3">
      

      {/* Jai Hind badge */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 text-white/80 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
        <span className="text-orange-300 font-semibold">जय हिन्द!</span>
        <span className="text-emerald-400 font-semibold">Jai Hind!</span>
      </div>
    </div>
  );
};

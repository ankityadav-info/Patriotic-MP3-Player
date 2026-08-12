import React, { useState, useEffect } from 'react';
import { Volume2, Radio, Info, Sparkles, Flag, Disc } from 'lucide-react';

interface HeaderBarProps {
  onToggleVisualizer: () => void;
  showVisualizer: boolean;
  onOpenInfoModal: () => void;
  isPlaying: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onToggleVisualizer,
  showVisualizer,
  onOpenInfoModal,
  isPlaying,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [listenerCount, setListenerCount] = useState<number>(1947);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).toLowerCase()
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate subtle listener count drift around 1947 (India's Independence Year)
  useEffect(() => {
    const interval = setInterval(() => {
      setListenerCount((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(1940, prev + delta);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 text-xs font-medium tracking-wide text-white/90 select-none">
      {/* Left: Clock */}
      <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="font-mono text-sm tracking-wider font-semibold text-amber-100/90">
          {timeStr || '3:24 pm'}
        </span>
      </div>

      {/* Center: Live Patriots Counter */}
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 shadow-xl text-emerald-300">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-white tracking-wide">
          {listenerCount.toLocaleString()}
        </span>
        <span className="text-white/70 font-normal">Live</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleVisualizer}
          title={showVisualizer ? 'Hide Visualizer' : 'Show Visualizer'}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs transition-all duration-300 border ${
            showVisualizer
              ? 'bg-gradient-to-r from-orange-500/80 via-white/80 to-emerald-500/80 text-black font-semibold border-white/40 shadow-lg shadow-orange-500/20'
              : 'bg-black/30 hover:bg-black/50 text-white/90 border-white/10'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Visualizer</span>
        </button>

        <button
          onClick={onOpenInfoModal}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white border border-white/10 transition-all duration-200"
          title="About & Lyrics"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

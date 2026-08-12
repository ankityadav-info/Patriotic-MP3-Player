import React from 'react';
import { Song } from '../types';
import { X, Play, Pause, Music, Disc2, Radio, Sparkles } from 'lucide-react';

interface PlaylistDrawerProps {
  songs: Song[];
  currentSong: Song;
  isPlaying: boolean;
  onSelectSong: (song: Song) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PlaylistDrawer: React.FC<PlaylistDrawerProps> = ({
  songs,
  currentSong,
  isPlaying,
  onSelectSong,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="relative w-full max-w-xl max-h-[85vh] flex flex-col bg-stone-900/90 backdrop-blur-2xl border border-white/20 rounded-t-3xl sm:rounded-3xl shadow-2xl text-white overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tricolor accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Disc2 className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white font-sans">Patriotic Playlist</h2>
              <p className="text-xs text-white/60">{songs.length} Classics • Pure High Quality Audio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Songs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {songs.map((song, index) => {
            const isCurrent = song.id === currentSong.id;
            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className={`group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-gradient-to-r from-orange-500/20 via-stone-800/80 to-emerald-500/20 border-amber-400/50 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15'
                }`}
              >
                {/* Track Index or Playing Indicator */}
                <div className="w-6 text-center text-xs font-mono text-white/50 group-hover:text-amber-400">
                  {isCurrent && isPlaying ? (
                    <span className="flex items-center justify-center gap-0.5 text-amber-400">
                      <span className="w-1 h-3 bg-amber-400 rounded-full animate-pulse" />
                      <span className="w-1 h-4 bg-amber-300 rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-amber-400 rounded-full animate-pulse delay-150" />
                    </span>
                  ) : (
                    <span>0{index + 1}</span>
                  )}
                </div>

                {/* Cover Art */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={song.coverArt}
                    alt={song.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                      isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-5 h-5 text-amber-400 fill-amber-400" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-sm truncate ${
                      isCurrent ? 'text-amber-300 font-bold' : 'text-white'
                    }`}
                  >
                    {song.title}
                  </h3>
                  <p className="text-xs text-white/60 truncate">
                    {song.movie} • {song.singers}
                  </p>
                </div>

                {/* Duration */}
                <div className="text-right text-xs font-mono text-white/50">
                  {song.duration}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-black/40 border-t border-white/10 text-center text-xs text-amber-200/80 font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Vande Mataram • Hail the Motherland</span>
        </div>
      </div>
    </div>
  );
};

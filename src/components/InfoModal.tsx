import React from 'react';
import { Song } from '../types';
import { X, Heart, Flag, Music, Share2 } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, currentSong }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn select-none">
      <div
        className="relative w-full max-w-lg bg-stone-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl text-white overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">Song Details & Trivia</h2>
              <p className="text-xs text-white/60">Tiranga Patriotic Music Experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm">
          {/* Song Card Summary */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <img
              src={currentSong.coverArt}
              alt={currentSong.title}
              className="w-16 h-16 rounded-xl object-cover shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <h3 className="font-bold text-amber-300 text-base">{currentSong.title}</h3>
              <p className="text-xs text-white/80 mt-0.5">
                <span className="font-semibold text-white">Movie:</span> {currentSong.movie} ({currentSong.year})
              </p>
              <p className="text-xs text-white/70 mt-0.5">
                <span className="font-semibold text-white">Singers:</span> {currentSong.singers}
              </p>
            </div>
          </div>

          {/* Lyrics Snippet */}
          {currentSong.lyricsSnippet && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-100 italic font-serif leading-relaxed text-center">
              "{currentSong.lyricsSnippet}"
            </div>
          )}

          {/* About Indian Tricolor Theme */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-white/80 leading-relaxed">
            <p className="font-semibold text-emerald-400 flex items-center gap-1.5 text-sm">
              <Heart className="w-4 h-4 fill-emerald-400" />
              <span>Indian Tricolor Theme & Audio Player</span>
            </p>
            <p>
              This web app celebrates the spirit of India with high quality 320 Kbps patriotic tracks, inspiring quotes in Devanagari and English, and an authentic highway music vibe.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-white/50 border-t border-white/10">
              <span>Saffron • White • Green</span>
              <span>Jai Hind • Vande Mataram</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 font-semibold text-black text-xs hover:scale-105 transition-transform"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

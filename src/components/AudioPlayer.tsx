import React, { useState, useEffect, useRef } from 'react';
import { Song, RepeatMode } from '../types';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  ListMusic,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface AudioPlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onSkipNext: () => void;
  onSkipPrevious: () => void;
  onTogglePlaylist: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: RepeatMode;
  onToggleRepeat: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSong,
  isPlaying,
  onPlayPauseToggle,
  onSkipNext,
  onSkipPrevious,
  onTogglePlaylist,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  audioRef,
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
      setHasError(false);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef, currentSong]);

  // Handle Seekbar change
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    setCurrentTime(seekTo);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTo;
    }
  };

  // Handle Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMute = !isMuted;
      audioRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 flex justify-center select-none">
      {/* Floating Glass Pill Container matched to reference visual */}
      <div className="relative w-full max-w-2xl bg-black/55 backdrop-blur-2xl border border-white/20 rounded-full sm:rounded-[32px] p-2.5 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3 text-white transition-all duration-300 hover:border-amber-400/40 hover:shadow-amber-500/10">
        {/* Left Side: Thumbnail + Song Details + Progress */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Circular Thumbnail with Spinning Vinyl Effect when Playing */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-2 border-white/20 bg-stone-900 group">
            <img
              src={currentSong.coverArt}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '10s' }}
              referrerPolicy="no-referrer"
            />
            {/* Center vinyl hole visual */}
            <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-stone-900 border border-amber-400/80 shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>

            {/* Loading / Error overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
            )}
            {hasError && (
              <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center" title="Audio load issue">
                <AlertCircle className="w-5 h-5 text-red-200" />
              </div>
            )}
          </div>

          {/* Song Title, Movie, Progress */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white truncate font-sans tracking-wide">
                {currentSong.title}
              </h3>
              <span className="text-[11px] font-mono text-white/70 flex-shrink-0">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </span>
            </div>

            <p className="text-xs text-amber-200/80 truncate font-medium mt-0.5">
              {currentSong.movie} • {currentSong.singers}
            </p>

            {/* Custom Seekbar Slider matching glass aesthetic */}
            <div className="relative mt-2 flex items-center group/seek">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 group-hover/seek:h-2 transition-all"
                style={{
                  background: `linear-gradient(to right, #FF9933 0%, #FFFFFF ${progressPercent / 2}%, #138808 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Player Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Shuffle Toggle */}
          <button
            onClick={onToggleShuffle}
            className={`p-2 rounded-full transition-all duration-200 hidden sm:flex ${
              isShuffle
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title={isShuffle ? 'Shuffle ON' : 'Shuffle OFF'}
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Repeat Toggle */}
          <button
            onClick={onToggleRepeat}
            className={`p-2 rounded-full transition-all duration-200 hidden sm:flex ${
              repeatMode !== 'off'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>

          {/* Skip Previous */}
          <button
            onClick={onSkipPrevious}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          {/* Main Play / Pause Button (Large White Circle matched to image) */}
          <button
            onClick={onPlayPauseToggle}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black hover:bg-amber-100 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-black" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-black text-black" />
            ) : (
              <Play className="w-5 h-5 fill-black text-black ml-0.5" />
            )}
          </button>

          {/* Skip Next */}
          <button
            onClick={onSkipNext}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          {/* Volume Popup / Toggle */}
          <div className="relative hidden md:block">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Volume Control"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {showVolumeSlider && (
              <div
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute bottom-12 right-0 p-3 bg-stone-900/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl flex items-center gap-2 animate-fadeIn"
              >
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            )}
          </div>

          {/* Playlist Drawer Toggle */}
          <button
            onClick={onTogglePlaylist}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Open Playlist"
          >
            <ListMusic className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

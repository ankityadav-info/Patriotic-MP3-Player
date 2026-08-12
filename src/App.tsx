import React, { useState, useRef, useEffect } from 'react';
import { SONGS } from './data/songs';
import { Song, RepeatMode } from './types';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { HeaderBar } from './components/HeaderBar';
import { PatrioticBadge } from './components/PatrioticBadge';
import { PatrioticQuotesView } from './components/PatrioticQuotesView';
import { AudioVisualizer } from './components/AudioVisualizer';
import { AudioPlayer } from './components/AudioPlayer';
import { PlaylistDrawer } from './components/PlaylistDrawer';
import { InfoModal } from './components/InfoModal';

export default function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [showVisualizer, setShowVisualizer] = useState<boolean>(true);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = SONGS[currentSongIndex] || SONGS[0];

  // Handle Play/Pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log('Audio playback user interaction required', err));
    }
  };

  // Skip Next Track
  const handleSkipNext = () => {
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * SONGS.length);
      if (randomIndex === currentSongIndex) {
        randomIndex = (currentSongIndex + 1) % SONGS.length;
      }
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
    }
  };

  // Skip Previous Track
  const handleSkipPrevious = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      // If played > 3s, restart current song
      audioRef.current.currentTime = 0;
    } else {
      setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
    }
  };

  // Handle Track Selection from Playlist
  const handleSelectSong = (song: Song) => {
    const idx = SONGS.findIndex((s) => s.id === song.id);
    if (idx !== -1) {
      setCurrentSongIndex(idx);
    }
    setIsPlaylistOpen(false);
  };

  // When currentSongIndex changes, load and play new audio if already playing
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentSong.audioUrl;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentSongIndex]);

  // Track Ended Handler
  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all' || currentSongIndex < SONGS.length - 1 || isShuffle) {
      handleSkipNext();
    } else {
      setIsPlaying(false);
    }
  };

  // Toggle Repeat Mode ('off' -> 'all' -> 'one' -> 'off')
  const handleToggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  // Global Keyboard Shortcuts (Space bar to toggle play, arrows to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSkipNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSkipPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentSongIndex, isShuffle]);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden text-white font-sans selection:bg-orange-500 selection:text-white">
      {/* Background Canvas */}
      <BackgroundCanvas isPlaying={isPlaying} />

      {/* Top Header Bar */}
      <HeaderBar
        onToggleVisualizer={() => setShowVisualizer(!showVisualizer)}
        showVisualizer={showVisualizer}
        onOpenInfoModal={() => setIsInfoOpen(true)}
        isPlaying={isPlaying}
      />

      {/* Left Floating Highway Badge */}
      <PatrioticBadge />

      {/* Main Center Area: Quotes + Visualizer */}
      <main className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-4 z-10 my-auto">
        {/* Patriotic Quotes Display (Positioned right above the player UI) */}
        <PatrioticQuotesView currentSongTitle={currentSong.title} />

        {/* Dynamic Visualizer Bar */}
        <AudioVisualizer isPlaying={isPlaying} isVisible={showVisualizer} />
      </main>

      {/* Floating Audio Player Bar */}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPauseToggle={togglePlayPause}
        onSkipNext={handleSkipNext}
        onSkipPrevious={handleSkipPrevious}
        onTogglePlaylist={() => setIsPlaylistOpen(!isPlaylistOpen)}
        isShuffle={isShuffle}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        repeatMode={repeatMode}
        onToggleRepeat={handleToggleRepeat}
        audioRef={audioRef}
      />

      {/* Hidden Audio Element */}
      <audio ref={audioRef} onEnded={handleEnded} preload="metadata">
        <source src={currentSong.audioUrl} type="audio/mpeg" />
      </audio>

      {/* Playlist Drawer */}
      <PlaylistDrawer
        songs={SONGS}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onSelectSong={handleSelectSong}
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        currentSong={currentSong}
      />
    </div>
  );
}

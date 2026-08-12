import React, { useState, useEffect } from 'react';
import { PATRIOTIC_QUOTES } from '../data/quotes';
import { Quote } from '../types';
import { RefreshCw, Quote as QuoteIcon, Languages, Sparkles, Copy, Check } from 'lucide-react';

interface PatrioticQuotesViewProps {
  currentSongTitle?: string;
}

export const PatrioticQuotesView: React.FC<PatrioticQuotesViewProps> = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const filteredQuotes =
    selectedCategory === 'All'
      ? PATRIOTIC_QUOTES
      : PATRIOTIC_QUOTES.filter((q) => q.category === selectedCategory);

  const currentQuote: Quote = filteredQuotes[currentIndex % filteredQuotes.length] || PATRIOTIC_QUOTES[0];

  useEffect(() => {
    if (!isAutoRotate) return;
    const interval = setInterval(() => {
      handleNextQuote();
    }, 10000);
    return () => clearInterval(interval);
  }, [isAutoRotate, filteredQuotes.length, currentIndex]);

  const handleNextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredQuotes.length);
      setIsAnimating(false);
    }, 250);
  };

  const handlePrevQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredQuotes.length) % filteredQuotes.length);
      setIsAnimating(false);
    }, 250);
  };

  const handleCopy = () => {
    const textToCopy = `"${currentQuote.hindiText}" — ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['All', 'Poetry', 'Slogans', 'Freedom Fighters', 'Patriotic Spirit'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6 z-10 flex flex-col items-center select-none">
      {/* Category Pills & Quick Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 text-black font-semibold border-white/50 shadow-md scale-105'
                : 'bg-black/30 hover:bg-black/50 text-white/70 border-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

        <button
          onClick={() => setShowEnglish(!showEnglish)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors ${
            showEnglish
              ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
              : 'bg-black/30 text-white/60 border-white/10'
          }`}
          title="Toggle English Translation"
        >
          <Languages className="w-3 h-3" />
          <span>{showEnglish ? 'Eng ON' : 'Eng OFF'}</span>
        </button>

        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-colors ${
            isAutoRotate
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-black/30 text-white/60 border-white/10'
          }`}
          title="Toggle Auto-rotation"
        >
          <Sparkles className="w-3 h-3" />
          <span>{isAutoRotate ? 'Auto' : 'Manual'}</span>
        </button>
      </div>

      {/* Main Quote Box */}
      <div className="relative w-full text-center px-6 py-6 sm:py-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl group transition-all duration-300 hover:border-amber-400/30">
        {/* Subtle Decorative Quotes Icon */}
        <QuoteIcon className="absolute top-4 left-4 w-8 h-8 text-amber-500/20 pointer-events-none" />
        <QuoteIcon className="absolute bottom-4 right-4 w-8 h-8 text-emerald-500/20 rotate-180 pointer-events-none" />

        {/* Content Container with Animation */}
        <div
          className={`transition-all duration-300 transform ${
            isAnimating ? 'opacity-0 scale-95 translate-y-1' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          {/* Devanagari / Hindi Quote */}
          <p className="text-xl sm:text-2xl md:text-3xl font-serif tracking-wide text-amber-100/95 leading-relaxed font-semibold drop-shadow-md">
            "{currentQuote.hindiText}"
          </p>

          {/* English Translation */}
          {showEnglish && (
            <p className="mt-3 text-sm sm:text-base text-white/80 font-sans italic max-w-2xl mx-auto leading-normal">
              {currentQuote.englishText}
            </p>
          )}

          {/* Author Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-orange-500/20 via-white/10 to-emerald-500/20 border border-white/10 text-xs font-medium text-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span>— {currentQuote.author}</span>
            <span className="text-white/40 text-[10px]">({currentQuote.category})</span>
          </div>
        </div>

        {/* Next/Prev & Actions Toolbar inside Quote Box */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={handlePrevQuote}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            title="Previous Quote"
          >
            ←
          </button>

          <button
            onClick={handleNextQuote}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-medium transition-all"
            title="Random Patriotic Quote"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnimating ? 'animate-spin' : ''}`} />
            <span>Next Quote</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            title="Copy Quote"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleNextQuote}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-colors"
            title="Next Quote"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

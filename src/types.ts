export interface Song {
  id: string;
  title: string;
  movie: string;
  singers: string;
  year: string;
  duration: string; // formatted default e.g. "7:08"
  audioUrl: string;
  coverArt: string; // image or vector design URL
  accentColor: string; // for individual song subtle aura
  lyricsSnippet?: string;
}

export interface Quote {
  id: string;
  hindiText: string;
  englishText: string;
  author: string;
  category: 'Freedom Fighters' | 'Poetry' | 'Slogans' | 'Patriotic Spirit';
}

export type RepeatMode = 'off' | 'all' | 'one';

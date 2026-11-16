export type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';

export type ChapterId = 1 | 2 | 3 | 4;

export interface AdventureStats {
  cluesFound: number;
  totalClues: number;
  stealthSpottedCount: number;
  heistSabotageScore: number;
  captainApproval: number;
  completedChapters: ChapterId[];
}

export interface ChapterMeta {
  id: ChapterId;
  shortLabel: string;
  title: string;
  location: string;
  summary: string;
  imagePath: string;
  imageAlt: string;
}

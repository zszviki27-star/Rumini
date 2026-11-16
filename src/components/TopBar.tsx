import {CHAPTERS} from '../data/storyData';
import type {ChapterId, GameState} from '../types/game';

interface TopBarProps {
  gameState: GameState;
  activeChapter: ChapterId;
  onSelectChapter: (id: ChapterId) => void;
  onRestart: () => void;
  onGoHome: () => void;
}

export function TopBar({
  gameState,
  activeChapter,
  onSelectChapter,
  onRestart,
  onGoHome,
}: TopBarProps) {
  return (
    <header className="w-full border-b border-slate-800/80 bg-[#0B1320]/95 backdrop-blur-sm">
      <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={onGoHome}
          className="font-display text-xl font-bold tracking-tight text-[#F4EFE6] hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 rounded"
        >
          Rumini · Egérváros
        </button>

        <nav
          aria-label="Fejezetek"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
        >
          {CHAPTERS.map((chapter) => {
            const isCurrent = gameState === 'PLAYING' && activeChapter === chapter.id;
            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onSelectChapter(chapter.id)}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
                  isCurrent
                    ? 'border-amber-400 text-amber-300 font-semibold'
                    : 'border-transparent text-slate-300 hover:text-[#F4EFE6] hover:border-slate-600'
                }`}
              >
                {chapter.shortLabel}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={gameState === 'TITLE_MENU' ? () => onSelectChapter(1) : onRestart}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-600 text-[#0B1320] hover:bg-amber-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            {gameState === 'TITLE_MENU' ? 'Kaland indítása' : 'Újrajátszás'}
          </button>
        </div>
      </div>
    </header>
  );
}

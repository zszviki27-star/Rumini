import {useState} from 'react';
import {Volume2, VolumeX} from 'lucide-react';
import {Chapter1Bazaar} from './components/scenes/Chapter1Bazaar';
import {Chapter2Heist} from './components/scenes/Chapter2Heist';
import {Chapter3Capture} from './components/scenes/Chapter3Capture';
import {Chapter4Captain} from './components/scenes/Chapter4Captain';
import {RoundSummary} from './components/RoundSummary';
import {TitleScreen} from './components/TitleScreen';
import {TopBar} from './components/TopBar';
import {CHAPTERS} from './data/storyData';
import type {AdventureStats, ChapterId, GameState} from './types/game';
import {soundFx} from './utils/sound';

const INITIAL_STATS: AdventureStats = {
  cluesFound: 0,
  totalClues: 3,
  stealthSpottedCount: 0,
  heistSabotageScore: 0,
  captainApproval: 0,
  completedChapters: [],
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [activeChapter, setActiveChapter] = useState<ChapterId>(1);
  const [stats, setStats] = useState<AdventureStats>(INITIAL_STATS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [runKey, setRunKey] = useState(0);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundFx.enabled = next;
    setSoundEnabled(next);
  };

  const handleStartOrSelectChapter = (chapterId: ChapterId) => {
    setActiveChapter(chapterId);
    setGameState('PLAYING');
    setRunKey((k) => k + 1);
  };

  const handleRestart = () => {
    setStats(INITIAL_STATS);
    setActiveChapter(1);
    setGameState('PLAYING');
    setRunKey((k) => k + 1);
  };

  const handleGoHome = () => {
    setGameState('TITLE_MENU');
  };

  const markChapterComplete = (id: ChapterId) => {
    setStats((prev) => ({
      ...prev,
      completedChapters: prev.completedChapters.includes(id)
        ? prev.completedChapters
        : [...prev.completedChapters, id],
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1320] text-[#F4EFE6]">
      <TopBar
        gameState={gameState}
        activeChapter={activeChapter}
        onSelectChapter={handleStartOrSelectChapter}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
      />

      {gameState === 'TITLE_MENU' && (
        <TitleScreen
          onStartAdventure={() => handleStartOrSelectChapter(1)}
          onJumpToChapter={handleStartOrSelectChapter}
        />
      )}

      {gameState === 'PLAYING' && (
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-8 space-y-6">
          {/* Workspace HUD Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2 p-1 rounded-lg bg-[#131F33] border border-slate-800 overflow-x-auto">
              {CHAPTERS.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => handleStartOrSelectChapter(ch.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeChapter === ch.id
                      ? 'bg-amber-600 text-[#0B1320] font-semibold'
                      : 'text-slate-300 hover:text-[#F4EFE6]'
                  }`}
                >
                  {ch.shortLabel}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-5 text-xs text-slate-300">
              <span className="font-mono-num">
                Teljesítve: {stats.completedChapters.length}/4
              </span>
              <span className="text-slate-700" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                onClick={handleToggleSound}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>Hang be</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-500" />
                    <span>Hang ki</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {activeChapter === 1 && (
            <Chapter1Bazaar
              key={`c1-${runKey}`}
              onComplete={(cluesFound, spottedCount) => {
                setStats((prev) => ({
                  ...prev,
                  cluesFound,
                  stealthSpottedCount: spottedCount,
                  completedChapters: prev.completedChapters.includes(1)
                    ? prev.completedChapters
                    : [...prev.completedChapters, 1],
                }));
                setActiveChapter(2);
              }}
            />
          )}

          {activeChapter === 2 && (
            <Chapter2Heist
              key={`c2-${runKey}`}
              onComplete={(sabotageScore) => {
                setStats((prev) => ({
                  ...prev,
                  heistSabotageScore: sabotageScore,
                  completedChapters: prev.completedChapters.includes(2)
                    ? prev.completedChapters
                    : [...prev.completedChapters, 2],
                }));
                setActiveChapter(3);
              }}
            />
          )}

          {activeChapter === 3 && (
            <Chapter3Capture
              key={`c3-${runKey}`}
              onComplete={() => {
                markChapterComplete(3);
                setActiveChapter(4);
              }}
            />
          )}

          {activeChapter === 4 && (
            <Chapter4Captain
              key={`c4-${runKey}`}
              onComplete={(captainApproval) => {
                setStats((prev) => ({
                  ...prev,
                  captainApproval,
                  completedChapters: prev.completedChapters.includes(4)
                    ? prev.completedChapters
                    : [...prev.completedChapters, 4],
                }));
                setGameState('ROUND_SUMMARY');
              }}
            />
          )}
        </main>
      )}

      {gameState === 'ROUND_SUMMARY' && (
        <RoundSummary
          stats={stats}
          onRestart={handleRestart}
          onReviewChapter={handleStartOrSelectChapter}
        />
      )}

      <footer className="mt-auto border-t border-slate-800/70 py-5 px-6 text-center text-xs text-slate-500">
        Rumini – Egérváros és a Szélkirálynő · Interaktív magyar kalandtörténet
      </footer>
    </div>
  );
}

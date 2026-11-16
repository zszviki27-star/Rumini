import {useCallback, useEffect, useState} from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Eye,
  Flag,
  Package,
  ShieldCheck,
} from 'lucide-react';
import {BAZAAR_CLUES, CHAPTERS} from '../../data/storyData';
import {soundFx} from '../../utils/sound';
import {StoryImage} from '../StoryImage';

interface Chapter1BazaarProps {
  onComplete: (cluesFound: number, spottedCount: number) => void;
}

interface Pos {
  x: number;
  y: number;
}

const COLS = 8;
const ROWS = 5;

// Cover positions: spice sacks, fabric crates, wooden barrels
const COVER_TILES: Pos[] = [
  {x: 1, y: 1},
  {x: 1, y: 3},
  {x: 2, y: 2},
  {x: 3, y: 0},
  {x: 3, y: 4},
  {x: 4, y: 2},
  {x: 5, y: 1},
  {x: 5, y: 3},
  {x: 6, y: 2},
];

// Overheard clues along the market stalls
const CLUE_LOCATIONS: {pos: Pos; index: number}[] = [
  {pos: {x: 2, y: 1}, index: 0},
  {pos: {x: 4, y: 3}, index: 1},
  {pos: {x: 6, y: 1}, index: 2},
];

const EXIT_POS: Pos = {x: 7, y: 2};

function isSamePos(a: Pos, b: Pos): boolean {
  return a.x === b.x && a.y === b.y;
}

function isCover(pos: Pos): boolean {
  return COVER_TILES.some((c) => isSamePos(c, pos));
}

export function Chapter1Bazaar({onComplete}: Chapter1BazaarProps) {
  const chapter = CHAPTERS[0];
  const [playerPos, setPlayerPos] = useState<Pos>({x: 0, y: 2});
  const [tick, setTick] = useState(0);
  const [collectedClues, setCollectedClues] = useState<number[]>([]);
  const [spottedCount, setSpottedCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Indulj el a bazár bejáratától! Használd a nyilakat vagy kattints a szomszédos mezőkre.',
  );
  const [justSpotted, setJustSpotted] = useState(false);
  const [reachedExit, setReachedExit] = useState(false);

  // Gang lookout cycles every 4 ticks: 0-1 moving forward, 2 turning (warning), 3 looking back!
  const phase = tick % 4;
  const lookoutState: 'HALAD' | 'FORDUL' | 'FIGYEL' =
    phase === 3 ? 'FIGYEL' : phase === 2 ? 'FORDUL' : 'HALAD';

  // Gang X advances gently or patrols near the alley ahead
  const gangX = Math.min(7, 3 + Math.floor(tick / 3) % 4);

  const attemptMove = useCallback(
    (dx: number, dy: number) => {
      if (reachedExit) return;
      const nx = playerPos.x + dx;
      const ny = playerPos.y + dy;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;

      const nextPos = {x: nx, y: ny};
      const nextTick = tick + 1;
      const nextPhase = nextTick % 4;
      const nextLooking = nextPhase === 3;

      setTick(nextTick);

      // Check if caught in open lane while Rizsa's lookout turns around
      if (nextLooking && !isCover(nextPos) && nextPos.x >= 2 && nextPos.x <= 6) {
        soundFx.playAlert();
        setSpottedCount((c) => c + 1);
        setJustSpotted(true);
        // Duck back to nearest safe cover or start
        setPlayerPos({x: Math.max(0, nextPos.x - 1), y: 2});
        setStatusMessage(
          'Hoppá! Rizsa hátrapillantott, amíg a nyílt utcán voltál! Gyorsan bújj fűszeres zsák vagy hordó mögé!',
        );
        return;
      }

      setJustSpotted(false);
      soundFx.playStep();
      setPlayerPos(nextPos);

      // Check clue pickup
      const clueHere = CLUE_LOCATIONS.find(
        (c) => isSamePos(c.pos, nextPos) && !collectedClues.includes(c.index),
      );
      if (clueHere) {
        soundFx.playClue();
        setCollectedClues((prev) => [...prev, clueHere.index]);
        setStatusMessage(`Kihallgatott suttogás: ${BAZAAR_CLUES[clueHere.index]}`);
      } else if (isCover(nextPos)) {
        setStatusMessage('Biztonságban vagy a bódé takarásában. Innen nyugodtan figyelheted őket.');
      } else if (nextPhase === 2) {
        setStatusMessage('Vigyázat! Rizsa egyik embere hátrafelé fordul a következő lépésnél!');
      } else {
        setStatusMessage('Kövesd őket halkan a bazár keleti kijárata felé.');
      }

      if (isSamePos(nextPos, EXIT_POS)) {
        soundFx.playClue();
        setReachedExit(true);
        setStatusMessage(
          'Sikerült! Észrevétlenül követted Rizsát és bandáját egészen a kikötői kocsmáig!',
        );
      }
    },
    [playerPos, tick, collectedClues, reachedExit],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (reachedExit) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        attemptMove(0, -1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        attemptMove(0, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        attemptMove(-1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        attemptMove(1, 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [attemptMove, reachedExit]);

  const playerInCover = isCover(playerPos);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Storybook Illustration & Overheard Clues */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video">
          <StoryImage
            src={chapter.imagePath}
            alt={chapter.imageAlt}
            title={chapter.title}
            className="w-full h-full"
          />
        </div>

        <div className="bg-[#131F33] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-amber-300/90">{chapter.location}</p>
            <h2 className="font-display text-2xl font-bold text-[#F4EFE6]">{chapter.title}</h2>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{chapter.summary}</p>

          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Kihallgatott nyomok</span>
              <span className="font-mono-num text-amber-300 font-semibold">
                {collectedClues.length}/{BAZAAR_CLUES.length}
              </span>
            </div>
            <ul className="space-y-2">
              {BAZAAR_CLUES.map((clueText, index) => {
                const found = collectedClues.includes(index);
                return (
                  <li
                    key={clueText}
                    className={`text-xs px-3 py-2 rounded-lg border ${
                      found
                        ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-200'
                        : 'bg-[#0E1828] border-slate-800 text-slate-400'
                    }`}
                  >
                    {found ? clueText : `${index + 1}. suttogás – még rejtve a bazárban`}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive 2D Stealth Alley */}
      <div className="lg:col-span-7 bg-[#131F33] border border-slate-800 rounded-xl p-6 space-y-5">
        {/* Status & Lookout HUD */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 font-semibold ${
                justSpotted
                  ? 'text-red-400'
                  : playerInCover
                    ? 'text-emerald-400'
                    : 'text-amber-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Rumini: {justSpotted ? 'LEBUKTÁL' : playerInCover ? 'FEDEZÉKBEN' : 'NYÍLT UTCA'}
              </span>
            </span>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <span
              className={`inline-flex items-center gap-1.5 font-semibold ${
                lookoutState === 'FIGYEL'
                  ? 'text-red-400'
                  : lookoutState === 'FORDUL'
                    ? 'text-amber-300'
                    : 'text-slate-300'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Rizsa őrszeme: {lookoutState}</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono-num">
            Lebukások: <span className="text-[#F4EFE6] font-semibold">{spottedCount}</span>
          </div>
        </div>

        {/* 8x5 Interactive Bazaar Alley Grid */}
        <div
          className="grid grid-cols-8 gap-1.5 sm:gap-2 p-3 rounded-xl bg-[#0B1320] border border-slate-800"
          role="grid"
          aria-label="Egérvárosi bazár térkép"
        >
          {Array.from({length: ROWS}).map((_, y) =>
            Array.from({length: COLS}).map((__, x) => {
              const pos = {x, y};
              const isPlayer = isSamePos(playerPos, pos);
              const cover = isCover(pos);
              const clue = CLUE_LOCATIONS.find(
                (c) => isSamePos(c.pos, pos) && !collectedClues.includes(c.index),
              );
              const isExit = isSamePos(EXIT_POS, pos);
              const isGang = x === gangX && y === 2 && !isPlayer;
              const isSightZone =
                lookoutState === 'FIGYEL' && !cover && x >= 2 && x <= 6;
              const isAdjacent =
                Math.abs(playerPos.x - x) + Math.abs(playerPos.y - y) === 1;

              return (
                <button
                  key={`${x}-${y}`}
                  type="button"
                  disabled={!isAdjacent || reachedExit}
                  onClick={() => {
                    if (isAdjacent) {
                      attemptMove(x - playerPos.x, y - playerPos.y);
                    }
                  }}
                  aria-label={`Mező ${x + 1}, ${y + 1}${cover ? ' fedezék' : ''}${isExit ? ' kijárat' : ''}`}
                  className={`relative aspect-square min-h-[42px] rounded-lg border flex flex-col items-center justify-center text-xs transition-transform duration-150 ${
                    isPlayer
                      ? 'bg-amber-500 border-amber-300 text-[#0B1320] font-bold scale-105 shadow-md cursor-default'
                      : isExit
                        ? 'bg-emerald-900/50 border-emerald-500/70 text-emerald-200 hover:bg-emerald-800/60'
                        : isSightZone
                          ? 'bg-red-950/60 border-red-700/50 text-red-200'
                          : cover
                            ? 'bg-[#253349] border-slate-600 text-slate-200'
                            : 'bg-[#131F33] border-slate-800/80 text-slate-400'
                  } ${isAdjacent && !reachedExit ? 'ring-1 ring-amber-400/50 hover:border-amber-400 cursor-pointer' : ''}`}
                >
                  {isPlayer ? (
                    <span className="font-display font-bold text-sm">R</span>
                  ) : isExit ? (
                    <Flag className="w-4 h-4 text-emerald-300" />
                  ) : isGang ? (
                    <span className="font-semibold text-[11px] text-amber-300">Rizsa</span>
                  ) : clue ? (
                    <span className="w-3 h-3 rounded-full bg-amber-400" title="Suttogás" />
                  ) : cover ? (
                    <Package className="w-4 h-4 text-slate-300" />
                  ) : null}
                </button>
              );
            }),
          )}
        </div>

        {/* Legend & Live Narrative Feedback */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Rumini (R)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-slate-300" /> Fedezék (zsák / hordó)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Nyom (suttogás)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-emerald-300" /> Kijárat a kocsmához
          </span>
        </div>

        <div className="p-4 rounded-lg bg-[#0E1828] border border-slate-800 text-sm text-slate-200">
          {statusMessage}
        </div>

        {/* Controls & Completion CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2" aria-label="Irányítógombok">
            <button
              type="button"
              disabled={reachedExit}
              onClick={() => attemptMove(-1, 0)}
              aria-label="Lépés balra"
              className="w-11 h-11 rounded-lg bg-[#1A2942] hover:bg-[#233757] disabled:opacity-40 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={reachedExit}
              onClick={() => attemptMove(0, -1)}
              aria-label="Lépés fel"
              className="w-11 h-11 rounded-lg bg-[#1A2942] hover:bg-[#233757] disabled:opacity-40 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={reachedExit}
              onClick={() => attemptMove(0, 1)}
              aria-label="Lépés le"
              className="w-11 h-11 rounded-lg bg-[#1A2942] hover:bg-[#233757] disabled:opacity-40 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={reachedExit}
              onClick={() => attemptMove(1, 0)}
              aria-label="Lépés jobbra"
              className="w-11 h-11 rounded-lg bg-[#1A2942] hover:bg-[#233757] disabled:opacity-40 border border-slate-700 flex items-center justify-center text-slate-200 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {reachedExit && (
            <button
              type="button"
              onClick={() => onComplete(collectedClues.length, spottedCount)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B1320] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tovább a Hétágú Szigonyhoz</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import {Anchor, RotateCcw} from 'lucide-react';
import {CHAPTERS} from '../data/storyData';
import type {AdventureStats, ChapterId} from '../types/game';
import {StoryImage} from './StoryImage';

interface RoundSummaryProps {
  stats: AdventureStats;
  onRestart: () => void;
  onReviewChapter: (id: ChapterId) => void;
}

export function RoundSummary({stats, onRestart, onReviewChapter}: RoundSummaryProps) {
  const rankTitle =
    stats.cluesFound === stats.totalClues && stats.stealthSpottedCount === 0
      ? 'Mesterfelderítő és hajósinas'
      : 'Frissen fogadott hajósinas';

  return (
    <main className="max-w-[1100px] mx-auto px-6 py-10 space-y-8">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#131F33] border border-slate-800 rounded-xl overflow-hidden">
        <div className="lg:col-span-6 min-h-[300px]">
          <StoryImage
            src={CHAPTERS[3].imagePath}
            alt={CHAPTERS[3].imageAlt}
            title="A Szélkirálynő fedélzete"
            className="w-full h-full min-h-[300px]"
            scrim
          />
        </div>

        <div className="lg:col-span-6 p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-medium text-emerald-400">
              Küldetés teljesítve · A Szélkirálynő kikötőből kifutásra kész
            </p>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-[#F4EFE6]">
              Rumini a Szélkirálynő hajósinasa lett!
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Hiába próbálta Rizsa bandája meglovasítani a Hétágú Szigony cégérét, és hiába kapták el
              elsőre Ruminit a kikötői őrök: Bojtos Benedek kapitány meglátta benne a bátor,
              éles eszű tengerészt. Új élet vár a nyílt tengeren!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Bazári nyomok</p>
              <p className="font-mono-num text-2xl font-semibold text-amber-300 mt-1">
                {stats.cluesFound}/{stats.totalClues}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Lebukások</p>
              <p className="font-mono-num text-2xl font-semibold text-[#F4EFE6] mt-1">
                {stats.stealthSpottedCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Kapitányi bizalom</p>
              <p className="font-mono-num text-2xl font-semibold text-emerald-400 mt-1">
                {stats.captainApproval}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Új rang</p>
              <p className="text-sm font-semibold text-[#F4EFE6] mt-2 flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{rankTitle}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-[#0B1320] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Újrajátszás</span>
            </button>
            <button
              type="button"
              onClick={() => onReviewChapter(1)}
              className="px-5 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-[#F4EFE6] text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Vissza az 1. fejezethez
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

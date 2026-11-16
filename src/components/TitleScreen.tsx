import {Anchor, ArrowRight, BookOpen} from 'lucide-react';
import {CHAPTERS} from '../data/storyData';
import type {ChapterId} from '../types/game';
import {StoryImage} from './StoryImage';

interface TitleScreenProps {
  onStartAdventure: () => void;
  onJumpToChapter: (id: ChapterId) => void;
}

export function TitleScreen({onStartAdventure, onJumpToChapter}: TitleScreenProps) {
  return (
    <main className="max-w-[1280px] mx-auto px-6 py-10 space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#131F33] border border-slate-800 rounded-xl p-8">
          <div className="space-y-5">
            <p className="text-sm font-medium text-amber-300/90">
              Egérváros · Interaktív kalandregény
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight text-[#F4EFE6]">
              Rumini és a Hétágú Szigony
            </h1>
            <p className="text-base leading-relaxed text-slate-300">
              Egy alkonyati séta során Rumini gyanús suttogásra lesz figyelmes Egérváros
              bazárjában. Kövesd Rizsát és bandáját a bódék között, akadályozd meg a Hétágú
              Szigony cégérének elrablását, és állj helyt Bojtos Benedek kapitány előtt!
            </p>
          </div>

          <div className="pt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onStartAdventure}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-[#0B1320] font-semibold text-base transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                <span>Kaland indítása</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onJumpToChapter(4)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-[#F4EFE6] text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
              >
                <Anchor className="w-4 h-4 text-amber-400" />
                <span>Ugrás a Szélkirálynőre</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>4 játszható jelenet · Nyomkövetés, akció és döntések</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="h-full min-h-[320px] rounded-xl overflow-hidden border border-slate-800">
            <StoryImage
              src={CHAPTERS[0].imagePath}
              alt={CHAPTERS[0].imageAlt}
              title="Egérvárosi bazár"
              className="w-full h-full min-h-[320px]"
              scrim
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="chapters-heading" className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
          <h2 id="chapters-heading" className="font-display text-2xl font-semibold text-[#F4EFE6]">
            A történet négy állomása
          </h2>
          <span className="text-xs text-slate-400">Válassz jelenetet vagy haladj sorban</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onJumpToChapter(chapter.id)}
              className="group text-left bg-[#131F33] hover:bg-[#192841] border border-slate-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-colors flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              <div className="aspect-video w-full overflow-hidden">
                <StoryImage
                  src={chapter.imagePath}
                  alt={chapter.imageAlt}
                  title={chapter.title}
                  className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs text-amber-300/90 font-medium">{chapter.shortLabel}</p>
                  <h3 className="font-display text-lg font-semibold text-[#F4EFE6] group-hover:text-amber-200 transition-colors">
                    {chapter.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                    {chapter.summary}
                  </p>
                </div>
                <p className="pt-3 text-xs font-medium text-slate-400 group-hover:text-amber-300 transition-colors">
                  Jelenet megnyitása
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

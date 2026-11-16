import {useState} from 'react';
import {ArrowRight, ShieldAlert, UserCheck} from 'lucide-react';
import {CHAPTERS} from '../../data/storyData';
import {soundFx} from '../../utils/sound';
import {StoryImage} from '../StoryImage';

interface Chapter3CaptureProps {
  onComplete: () => void;
}

const ESCAPE_OPTIONS = [
  {
    id: 'barrels',
    label: 'Megpróbálsz elbújni a félreállított kis kocsi és a hordók mögött',
    result:
      'Puva még idejében eltűnik a sötétben, de téged két lámpásos kikötői őr közrefog a kis kocsi mellett. Amikor megragadnak, azonnal felkiáltasz: „Eresszenek el, én nem tartozom a bandába!”',
  },
  {
    id: 'alley',
    label: 'Balra iramodsz a halpiac sikátora felé',
    result:
      'Megpróbálsz eliszkolni, de a kocsmáros észreveszi a kis kocsit és elkiáltja magát. A kikötői őrség körbevesz, mire te határozottan védekezel: „Semmi közöm hozzájuk, én nem tartozom a bandába!”',
  },
  {
    id: 'guard',
    label: 'Átugorsz a kis kocsi rúdja felett az őr mellett',
    result:
      'Majdnem sikerül, de a nehéz rézcégér láncába botlasz, és az őrmester megragadja a gallérodat. Azonnal közbeszólsz: „Tévedés, én nem tartozom a bandába!”',
  },
];

const DEFENSE_OPTIONS = [
  {
    id: 'truth',
    label: '„Én nem tartozom a bandába! Rizsáék akarták ellopni a cégért, én csak meg akartam menteni a kocsival!”',
    reply:
      'Kocsmáros: „Minden tolvaj ezt mondja, kölyök! Itt állsz a földön fekvő szigony és egy üres kézikocsi mellett!”',
  },
  {
    id: 'clues',
    label: '„Higgyenek nekem, nem tartozom a bandába! A bazárban hallottam ki Rizsa tervét!”',
    reply:
      'Őrmester: „Majd a tömlöcben lesz időd bizonygatni, kisegér! Indulás!” — ám ekkor mély, nyugodt hang csendíti le a teret.',
  },
];

export function Chapter3Capture({onComplete}: Chapter3CaptureProps) {
  const chapter = CHAPTERS[2];
  const [escapeChoice, setEscapeChoice] = useState<string | null>(null);
  const [defenseChoice, setDefenseChoice] = useState<string | null>(null);

  const selectedEscape = ESCAPE_OPTIONS.find((o) => o.id === escapeChoice);
  const selectedDefense = DEFENSE_OPTIONS.find((o) => o.id === defenseChoice);

  const handleEscape = (id: string) => {
    soundFx.playAlert();
    setEscapeChoice(id);
  };

  const handleDefense = (id: string) => {
    soundFx.playClue();
    setDefenseChoice(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-xl overflow-hidden border border-slate-800 aspect-video">
          <StoryImage
            src={chapter.imagePath}
            alt={chapter.imageAlt}
            title={chapter.title}
            className="w-full h-full"
          />
        </div>

        <div className="bg-[#131F33] border border-slate-800 rounded-xl p-6 space-y-3">
          <p className="text-xs font-medium text-amber-300/90">{chapter.location}</p>
          <h2 className="font-display text-2xl font-bold text-[#F4EFE6]">{chapter.title}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">{chapter.summary}</p>
        </div>
      </div>

      <div className="lg:col-span-7 bg-[#131F33] border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-red-400">
            <ShieldAlert className="w-4 h-4" />
            <span>
              Állapot:{' '}
              {defenseChoice
                ? 'BOJTOS BENEDEK KÖZBELÉP'
                : escapeChoice
                  ? 'ELKAPTAK A KIKÖTŐI ŐRÖK'
                  : 'KÖRVEVETTEK'}
            </span>
          </span>
          <span className="text-xs text-slate-400">3. jelenet</span>
        </div>

        {/* Step 1: Escape Attempt */}
        <div className="space-y-3">
          <h3 className="font-display text-lg font-semibold text-[#F4EFE6]">
            1. A csörömpölésre kirohan a kocsmáros és az őrök. Merre mozdulsz?
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {ESCAPE_OPTIONS.map((opt) => {
              const isSelected = escapeChoice === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={escapeChoice !== null}
                  onClick={() => handleEscape(opt.id)}
                  className={`text-left px-4 py-3.5 rounded-lg border text-sm transition-colors ${
                    isSelected
                      ? 'bg-red-950/50 border-red-500/70 text-[#F4EFE6]'
                      : escapeChoice !== null
                        ? 'bg-[#0E1828]/60 border-slate-800 text-slate-500'
                        : 'bg-[#0E1828] hover:bg-[#192841] border-slate-700 text-slate-200 cursor-pointer'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {selectedEscape && (
            <div className="p-4 rounded-lg bg-red-950/30 border border-red-800/50 text-sm text-red-100 leading-relaxed">
              {selectedEscape.result}
            </div>
          )}
        </div>

        {/* Step 2: Defense before the crowd */}
        {escapeChoice && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="font-display text-lg font-semibold text-[#F4EFE6]">
              2. Az őrök lefogtak. Mit válaszolsz a vádakra?
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {DEFENSE_OPTIONS.map((opt) => {
                const isSelected = defenseChoice === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={defenseChoice !== null}
                    onClick={() => handleDefense(opt.id)}
                    className={`text-left px-4 py-3.5 rounded-lg border text-sm transition-colors ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/70 text-[#F4EFE6]'
                        : defenseChoice !== null
                          ? 'bg-[#0E1828]/60 border-slate-800 text-slate-500'
                          : 'bg-[#0E1828] hover:bg-[#192841] border-slate-700 text-slate-200 cursor-pointer'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {selectedDefense && (
              <div className="p-4 rounded-lg bg-[#0E1828] border border-slate-700 text-sm text-slate-200 space-y-2">
                <p>{selectedDefense.reply}</p>
                <p className="text-amber-300 font-medium flex items-center gap-2 pt-1">
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>
                    „Álljunk csak meg egy szóra!” — A tömegből előlép Bojtos Benedek, a Szélkirálynő
                    kapitánya.
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {defenseChoice && (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onComplete}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B1320] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Találkozás Bojtos Benedekkel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

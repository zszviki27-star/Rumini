import {useState} from 'react';
import {AlertTriangle, ArrowRight, ShoppingCart, Timer} from 'lucide-react';
import {CHAPTERS} from '../../data/storyData';
import {soundFx} from '../../utils/sound';
import {StoryImage} from '../StoryImage';
import {CartHeist3DScene} from './three/CartHeist3DScene';

interface Chapter2HeistProps {
  onComplete: (sabotageScore: number) => void;
}

interface CartPushStep {
  id: number;
  label: string;
  actionText: string;
  dialogue: string;
  outcomeText: string;
  cartProgress: number;
}

const PUSH_STEPS: CartPushStep[] = [
  {
    id: 1,
    label: '1. nekirugaszkodás · A macskaköves utcán',
    actionText: 'Kis kocsi meglökése a bazár sarkától',
    dialogue:
      'Puva: „Nyikorog a tengely, Rumini, de csak toljuk! Ha aláérünk, pontosan a kocsira pottyan a cégér!”',
    outcomeText:
      'A kis kocsi zörögve megindul a macskaköveken, miközben Rizsáék fent már az első láncot oldják.',
    cartProgress: 28,
  },
  {
    id: 2,
    label: '2. nekirugaszkodás · Kerülő a hordók között',
    actionText: 'Áttolni a kis kocsit a lámpások felé',
    dialogue:
      'Rumini: „Gyorsabban, Puva! Már csak egy lánc tartja a szigonyt, mindjárt leszakad!”',
    outcomeText:
      'Már látjátok a kocsma sárga ablakait — a második lánc is enged, a nehéz cégér veszélyesen kileng!',
    cartProgress: 56,
  },
  {
    id: 3,
    label: '3. nekirugaszkodás · Utolsó méterek a cégér alá',
    actionText: 'Teljes erőből betolni a kocsit a cégér alá',
    dialogue:
      'Puva: „Jaj, nem érünk oda időben! A szemünk láttára szakad el az utolsó lánc!”',
    outcomeText:
      'Késő! Hiába futottatok teljes erőből, pár lépéssel a célzóna előtt elpattan a lánc, és a hatalmas szigony fülsiketítő csörömpöléssel a macskakőre zuhan a kocsi előtt!',
    cartProgress: 76,
  },
];

export function Chapter2Heist({onComplete}: Chapter2HeistProps) {
  const chapter = CHAPTERS[1];
  const [stepIndex, setStepIndex] = useState(0);
  const [crashed, setCrashed] = useState(false);

  const currentStep = PUSH_STEPS[Math.min(stepIndex, PUSH_STEPS.length - 1)];
  const completedCount = crashed ? PUSH_STEPS.length : stepIndex;
  const cartProgress = crashed
    ? PUSH_STEPS[2].cartProgress
    : stepIndex === 0
      ? 6
      : PUSH_STEPS[stepIndex - 1].cartProgress;

  const handlePushCart = () => {
    if (crashed) return;
    if (stepIndex < PUSH_STEPS.length - 1) {
      soundFx.playStep();
      setStepIndex((prev) => prev + 1);
    } else {
      soundFx.playCrash();
      setCrashed(true);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Narrative & Reference Card */}
      <div className="lg:col-span-4 space-y-5">
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

      {/* Right Interactive 3D Viewport & Controls */}
      <div className="lg:col-span-8 bg-[#131F33] border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold">
            {crashed ? (
              <span className="inline-flex items-center gap-1.5 text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Állapot: NEM ÉRTETEK ODA IDŐBEN · A CÉGÉR LEZUHANT</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <Timer className="w-4 h-4" />
                <span>Állapot: VERSENYFUTÁS A KIS KOCSIVAL ({completedCount}/3)</span>
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono-num">
            Út megtéve: {cartProgress}% / 100%
          </span>
        </div>

        {/* Real-time 3D WebGL Scene */}
        <CartHeist3DScene
          cartProgress={cartProgress}
          completedSteps={completedCount}
          crashed={crashed}
        />

        {/* Dialogue & Action Bar */}
        <div className="space-y-3">
          {stepIndex > 0 && (
            <div className="p-4 rounded-lg bg-[#0E1828] border border-slate-800 space-y-1.5">
              <p className="text-xs font-semibold text-amber-300">
                {crashed ? PUSH_STEPS[2].dialogue : PUSH_STEPS[stepIndex - 1].dialogue}
              </p>
              <p className="text-sm text-slate-200">
                {crashed ? PUSH_STEPS[2].outcomeText : PUSH_STEPS[stepIndex - 1].outcomeText}
              </p>
            </div>
          )}

          {!crashed ? (
            <div className="p-5 rounded-xl bg-[#0E1828] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-amber-300">{currentStep.label}</p>
                <p className="text-sm font-medium text-[#F4EFE6]">{currentStep.actionText}</p>
              </div>
              <button
                type="button"
                onClick={handlePushCart}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-[#0B1320] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Kocsi tolása</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => onComplete(100)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B1320] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Tovább a kikötő térre</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

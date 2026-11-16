import {useState} from 'react';
import {Anchor, Award, Check, CheckCircle2} from 'lucide-react';
import {CHAPTERS} from '../../data/storyData';
import {soundFx} from '../../utils/sound';
import {StoryImage} from '../StoryImage';

interface Chapter4CaptainProps {
  onComplete: (captainApproval: number) => void;
}

const CAPTAIN_QUESTIONS = [
  {
    id: 'q1',
    prompt:
      'Bojtos Benedek: „Kifizettem a cégér javítását, mert hiszek neked, hogy nem tartozol Rizsa bandájához. Mondd csak, fiacskám: miért eredtél egyedül a nyomukba?”',
    choices: [
      {
        id: 'a',
        text: '„Gyanúsak voltak a bazárban, és Puvával meg akartuk menteni a cégért!”',
        feedback:
          'Bojtos Benedek elmosolyodik: „Bátor szív és éles szem! Pont ilyen legényre van szükség.”',
        bonus: 50,
      },
      {
        id: 'b',
        text: '„Nem hagyhattam, hogy ellopják a Hétágú Szigony cégérét!”',
        feedback:
          'Bojtos Benedek bólint: „Derék dolog, hogy egyedül is kiálltál az igazadért!”',
        bonus: 45,
      },
    ],
  },
  {
    id: 'q2',
    prompt:
      'Bojtos Benedek: „Jóra való kölyöknek látszol! Ne akarj közéjük tartozni! Munkát ajánlok a hajómon. Nehéz a munka és sok. De ha jól dolgozol, fizetést is kapsz, igazi tengerész lehetsz!”',
    choices: [
      {
        id: 'a',
        text: '„Elfogadom, kapitány úr! Nem félek a nehéz munkától, hajósinas leszek a Szélkirálynőn!”',
        feedback:
          'Bojtos Benedek kezet nyújt: „Akkor üdvözöllek a Szélkirálynő legénységében, Rumini!”',
        bonus: 50,
      },
      {
        id: 'b',
        text: '„Igazi tengerész akarok lenni! Köszönöm a bizalmát, kapitány úr!”',
        feedback:
          'Bojtos Benedek felnevet: „Derék beszéd! Fogd a matrózzsákodat, és irány a palló!”',
        bonus: 50,
      },
    ],
  },
];

const BOARDING_TASKS = [
  {id: 'knot', label: 'Kikötőkötél oldása a rakparton'},
  {id: 'bag', label: 'Matrózzsák felvitele a hajópallón'},
  {id: 'log', label: 'Rumini nevének beírása a hajónaplóba'},
];

export function Chapter4Captain({onComplete}: Chapter4CaptainProps) {
  const chapter = CHAPTERS[3];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const q1Done = Boolean(answers.q1);
  const q2Done = Boolean(answers.q2);
  const allTasksDone = completedTasks.length === BOARDING_TASKS.length;

  const approvalScore =
    (answers.q1 === 'a' ? 50 : answers.q1 ? 45 : 0) +
    (answers.q2 ? 50 : 0);

  const handleSelectAnswer = (qid: string, cid: string) => {
    soundFx.playClue();
    setAnswers((prev) => ({...prev, [qid]: cid}));
  };

  const handleToggleTask = (taskId: string) => {
    if (completedTasks.includes(taskId)) return;
    const next = [...completedTasks, taskId];
    setCompletedTasks(next);
    if (next.length === BOARDING_TASKS.length) {
      soundFx.playShipBell();
    } else {
      soundFx.playStep();
    }
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
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300">
            <Anchor className="w-4 h-4" />
            <span>
              Állapot:{' '}
              {allTasksDone
                ? 'HAJÓSINASNAK FELFOGADVA'
                : q2Done
                  ? 'FELSZÁLLÁS A HAJÓRA'
                  : 'BESZÉLGETÉS A KAPITÁNNYAL'}
            </span>
          </span>
          <span className="text-xs text-slate-400 font-mono-num">
            Bizalom: {approvalScore}%
          </span>
        </div>

        {/* Question 1 & 2 */}
        <div className="space-y-5">
          {CAPTAIN_QUESTIONS.map((q, idx) => {
            if (idx === 1 && !q1Done) return null;
            const chosenId = answers[q.id];
            const chosenObj = q.choices.find((c) => c.id === chosenId);

            return (
              <div key={q.id} className="space-y-3">
                <p className="text-sm font-medium text-[#F4EFE6] leading-relaxed">{q.prompt}</p>
                <div className="grid grid-cols-1 gap-2.5">
                  {q.choices.map((c) => {
                    const isSelected = chosenId === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        disabled={Boolean(chosenId)}
                        onClick={() => handleSelectAnswer(q.id, c.id)}
                        className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500/70 text-[#F4EFE6]'
                            : chosenId
                              ? 'bg-[#0E1828]/50 border-slate-800 text-slate-500'
                              : 'bg-[#0E1828] hover:bg-[#192841] border-slate-700 text-slate-200 cursor-pointer'
                        }`}
                      >
                        {c.text}
                      </button>
                    );
                  })}
                </div>
                {chosenObj && (
                  <p className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-800/40 rounded-lg px-3.5 py-2.5">
                    {chosenObj.feedback}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Boarding Checklist */}
        {q2Done && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="font-display text-lg font-semibold text-[#F4EFE6]">
              Első hajósinasi teendők a Szélkirálynőn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BOARDING_TASKS.map((task) => {
                const done = completedTasks.includes(task.id);
                return (
                  <button
                    key={task.id}
                    type="button"
                    disabled={done}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-4 rounded-xl border text-left text-xs font-medium flex flex-col justify-between gap-3 transition-colors ${
                      done
                        ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200'
                        : 'bg-[#0E1828] hover:bg-[#192841] border-slate-700 text-slate-200 cursor-pointer'
                    }`}
                  >
                    <span>{task.label}</span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold">
                      {done ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Elvégezve</span>
                        </>
                      ) : (
                        <span className="text-amber-300">Kattints a végrehajtáshoz</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {allTasksDone && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
            <p className="text-sm text-amber-200 flex items-center gap-2 font-medium">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>A Szélkirálynő harangja megkondul — Rumini hivatalosan is hajósinas!</span>
            </p>
            <button
              type="button"
              onClick={() => onComplete(approvalScore)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#0B1320] font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kaland lezárása</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

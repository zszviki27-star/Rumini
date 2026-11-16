import type {ChapterMeta} from '../types/game';

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 1,
    shortLabel: '1. A bazár',
    title: 'Nyomozás Egérváros bazárján át',
    location: 'Egérváros · Fűszeres és Szövetes Bazár',
    summary:
      'Rumini kiszúrja a sötét csuklyás Rizsát és két társát a lámpafényes bódék között. Kövesd őket észrevétlenül a fűszeres zsákok takarásában!',
    imagePath: '/src/assets/images/rumini_bazaar_scene_1794827445651.jpg',
    imageAlt:
      'Egérváros alkonyati bazárja fűszeres zsákokkal, színes sátrakkal és a hordó mögül leselkedő Ruminivel',
  },
  {
    id: 2,
    shortLabel: '2. A cégér',
    title: 'A Hétágú Szigony cégére',
    location: 'Kikötői negyed · A Hétágú Szigony kocsma',
    summary:
      'Rizsáék le akarják lopni a Hétágú Szigony cégérét. Rumini Puvával egy kis kocsit tol a helyszínre, hogy arra essen a nehéz cégér — de vajon odaérnek időben?',
    imagePath: '/src/assets/images/het_agu_szigony_tavern_1794827444080.jpg',
    imageAlt:
      'A Hétágú Szigony kocsma faépülete éjjel, díszes hétágú szigony cégérrel és fa létrával',
  },
  {
    id: 3,
    shortLabel: '3. A lebukás',
    title: 'A terv balul sül el',
    location: 'Kikötő tér · A lezuhant cégér mellett',
    summary:
      'Rumini és Puva nem érnek oda időben a kis kocsival: a cégér nagy csörömpöléssel a macskakőre zuhan. Rizsáék és Puva elmenekülnek a sötétbe, Ruminit viszont elkapják az őrök.',
    imagePath: '/src/assets/images/rumini_caught_guards_1794827444410.jpg',
    imageAlt:
      'Kikötői őrök lámpásokkal és a kötényes kocsmáros körbeveszik Ruminit a lehullott cégér mellett',
  },
  {
    id: 4,
    shortLabel: '4. Szélkirálynő',
    title: 'Bojtos Benedek és a Szélkirálynő',
    location: 'Egérvárosi rakpart · A Szélkirálynő pallója',
    summary:
      'A tömegből előlép Bojtos Benedek kapitány. Átlátja a helyzetet, tisztázza Ruminit, majd próbára teszi, és felfogadja hajósinasnak a Szélkirálynőre!',
    imagePath: '/src/assets/images/szelkiralyno_captain_deck_1794827445285.jpg',
    imageAlt:
      'Bojtos Benedek kapitány a holdfényes kikötőben kezet nyújt Rumininek a Szélkirálynő pallóján',
  },
];

export const BAZAAR_CLUES = [
  '„Senki ne szóljon egy szót se! Éjfélkor találkozunk a sarkon.”',
  '„A Hétágú Szigony aranyozott rézcégére egy vagyont ér a feketepiacon!”',
  '„Hozzátok a hosszú kötelet és a létrát, gyorsan leszereljük a láncról!”',
];

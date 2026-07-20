import type { CFMLResult, CFMLAnswers } from "@/src/lib/scoring";
import type { SPDimensionScore } from "@/src/data/sp-config/types";

export type Concept = {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  images: string[];
  sector: string;
  tags: string[];
  cfml: number;
  sp: number;
  spResponses: number;
  cfmlLevelsPassed?: number;
  cfmlCompletedAt?: string;
  spWindowStart?: string;
  spWindowEnd?: string;
  positioningNotes?: string;
  author: { name: string; handle: string };
  createdAt: string;
  cfmlDetail?: {
    perLevelScores: CFMLResult["perLevelScores"];
    levelConsolidation: CFMLResult["levelConsolidation"];
    answers: CFMLAnswers;
  };
  spDimensions?: SPDimensionScore[];
};

export const SECTORS = [
  "Mobilità e trasporti",
  "Salute e benessere",
  "Casa e abitare",
  "Cura della persona",
  "Lavoro e produttività",
  "Educazione e apprendimento",
  "Comunicazione e media",
  "Cibo e cucina",
  "Abbigliamento e accessori",
  "Sport e tempo libero",
  "Ambiente e sostenibilità",
  "Sicurezza e protezione",
  "Inclusione e accessibilità",
  "Cultura e intrattenimento",
  "Servizi e pubblica utilità",
] as const;

export type Sector = (typeof SECTORS)[number];

export function getQuadrant(c: Concept): "Q1" | "Q2" | "Q3" | "Q4" {
  if (c.cfml >= 50 && c.sp >= 50) return "Q1";
  if (c.cfml < 50 && c.sp >= 50) return "Q2";
  if (c.cfml >= 50 && c.sp < 50) return "Q3";
  return "Q4";
}

export const concepts: Concept[] = [
  // ── Concept reali (allineati al DB) ─────────────────────────────────────
  {
    id: "shu",
    number: "03",
    title: "SHU",
    tagline: "Oggetto speculativo relazionale",
    description:
      "SHU è un oggetto speculativo che indaga la relazione tra corpo e presenza dell'altro, mettendo in scena una forma d'uso ambigua e sensoriale più che funzionale.",
    images: [],
    sector: "Cultura e intrattenimento",
    tags: ["speculative design", "corpo", "relazione"],
    cfml: 100,
    sp: 62.0,
    spResponses: 25,
    author: { name: "Diego Reggiani", handle: "diegoreggiani" },
    createdAt: "2026-04-01",
  },
  {
    id: "cubit",
    number: "01",
    title: "Cubit",
    tagline: "Pista per biglie modulare",
    description:
      "Cubit è una pista per biglie modulare pensata come strumento di gioco e regolazione per persone neurodivergenti. I moduli si compongono liberamente per costruire percorsi sempre nuovi, offrendo un'esperienza tattile e ripetibile.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Lavoro e produttività",
    tags: ["gioco", "neurodivergenza", "modularità"],
    cfml: 91,
    sp: 84.3,
    spResponses: 25,
    author: { name: "Lorenzo Romano", handle: "lorenzoromano" },
    createdAt: "2025-10-03",
  },
  {
    id: "hapto",
    number: "02",
    title: "Hapto",
    tagline: "Manopola aptica per motocicletta",
    description:
      "Hapto è una manopola aptica per motocicletta che traduce informazioni di guida e pericoli stradali in feedback tattili sul comando, permettendo al motociclista di restare concentrato sulla strada.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Sicurezza e protezione",
    tags: ["mobilità", "aptica", "sicurezza"],
    cfml: 46,
    sp: 84.0,
    spResponses: 25,
    author: { name: "Francesco Scaramuzzi", handle: "francescoscaramuzzi" },
    createdAt: "2025-11-12",
  },
  // ── Q1 (cfml≥50, sp≥50) ────────────────────────────────────────────────
  {
    id: "lunare",
    number: "NR. 0321",
    title: "LUNARE",
    tagline: "Circadian light companion",
    description:
      "Lunare è una lampada da comodino che sincronizza la propria temperatura di colore e intensità con il ciclo circadiano dell'utente. Attraverso un algoritmo di apprendimento adattivo, il dispositivo impara le abitudini di sonno in due settimane e anticipa il risveglio con una sequenza di alba artificiale. La scocca è in ceramica porosa che diffonde aromi rilassanti in fase serale. Una singola carica a induzione dura novanta giorni.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Casa e abitare",
    tags: ["home", "sleep", "light", "wellness", "circadian", "ceramic"],
    cfml: 72,
    sp: 63,
    spResponses: 55,
    author: { name: "Sofia Bianchi", handle: "@sofiabianchi" },
    createdAt: "2025-12-01",
  },
  {
    id: "puls",
    number: "NR. 0587",
    title: "PULS",
    tagline: "Continuous hydration monitor",
    description:
      "Puls è una patch sottocutanea non invasiva che misura il livello di idratazione tramite bioimpedenza a bassa frequenza. I dati vengono trasmessi via Bluetooth a uno smartwatch o smartphone con aggiornamenti ogni cinque minuti. Il form factor è simile a un cerotto e dura sette giorni prima di richiedere sostituzione. Lo strato adesivo è sviluppato per pelli sensibili e non lascia residui. L'app visualizza trend giornalieri e invia notifiche personalizzate prima che la disidratazione si manifesti.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Salute e benessere",
    tags: ["health", "wearable", "hydration", "biometric", "patch", "iot"],
    cfml: 58,
    sp: 71,
    spResponses: 34,
    author: { name: "Davide Russo", handle: "@daviderusso" },
    createdAt: "2026-01-15",
  },
  {
    id: "arco",
    number: "NR. 0462",
    title: "ARCO",
    tagline: "Smart posture training band",
    description:
      "Arco è una fascia elastica da tronco che monitora la postura durante le ore lavorative tramite una rete di sensori IMU distribuiti lungo la spina dorsale. Il sistema vibra dolcemente quando rileva uno scostamento prolungato dalla postura neutrale, allenando progressivamente la muscolatura posturale. Un pannello di resoconto settimanale mostra l'evoluzione del comportamento posturale nel tempo. Il tessuto tecnico è lavabile in lavatrice e il modulo elettronico si sfila in un secondo.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Cura della persona",
    tags: ["health", "posture", "wearable", "workplace", "imu", "textile"],
    cfml: 61,
    sp: 58,
    spResponses: 47,
    author: { name: "Elena Conti", handle: "@elenaconti" },
    createdAt: "2025-09-20",
  },
  {
    id: "flowr",
    number: "NR. 0733",
    title: "FLOWR",
    tagline: "Urban vertical garden kit",
    description:
      "Flowr è un kit di giardinaggio verticale per ambienti domestici urbani, composto da pannelli idroponici modulari con sistema di irrigazione automatica. I pannelli si installano su qualsiasi parete attraverso un sistema a binario invisibile e supportano erbe aromatiche, insalate e piccoli ortaggi. Il serbatoio integrato autonomo ha una capacità di tre litri, sufficiente per due settimane senza intervento manuale. Un sensore di umidità e luce segnala all'app quando intervenire.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Cibo e cucina",
    tags: ["food", "garden", "urban", "hydroponics", "home", "sustainability"],
    cfml: 67,
    sp: 74,
    spResponses: 62,
    author: { name: "Valentina Greco", handle: "@valentinagreco" },
    createdAt: "2026-02-08",
  },
  {
    id: "kero",
    number: "NR. 0815",
    title: "KERO",
    tagline: "Children emotion reading toy",
    description:
      "Kero è un peluche interattivo per bambini da 3 a 8 anni dotato di sensori di pressione e microfoni che interpretano il tono emotivo del bambino. Risponde con espressioni facciali LED e suoni calibrati per confortare o stimolare il gioco. Il personaggio ha una narrativa propria che evolve nel tempo attraverso aggiornamenti via NFC dallo smartphone del genitore. Tutti i dati vengono processati localmente, senza connessione cloud, per tutelare la privacy dei più piccoli.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Cura della persona",
    tags: ["kids", "emotion", "toy", "interactive", "privacy", "nfc"],
    cfml: 53,
    sp: 66,
    spResponses: 29,
    author: { name: "Chiara Moretti", handle: "@chiaramoretti" },
    createdAt: "2025-08-14",
  },
  {
    id: "silo",
    number: "NR. 0691",
    title: "SILO",
    tagline: "Smart pantry inventory system",
    description:
      "Silo è un sistema di contenitori intelligenti per dispensa che traccia automaticamente le quantità di cibo attraverso celle di peso integrate nella base. Un hub centrale aggrega i dati di tutti i contenitori e genera liste della spesa in tempo reale sull'app abbinata. Il design è pensato per impilabilità e uniformità estetica: tutti i moduli sono cilindrici in vetro borosilicato con tappo in alluminio. Le ricette suggerite sono calibrate sugli ingredienti presenti in dispensa in quel momento.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Cibo e cucina",
    tags: ["food", "smart-home", "iot", "kitchen", "inventory", "sustainability"],
    cfml: 55,
    sp: 60,
    spResponses: 44,
    author: { name: "Francesca Palumbo", handle: "@francescapalumbo" },
    createdAt: "2026-03-11",
  },
  {
    id: "treko",
    number: "NR. 0248",
    title: "TREKO",
    tagline: "Lightweight trail navigation pod",
    description:
      "Treko è un piccolo dispositivo da clip che si aggancia alla spallina dello zaino e proietta una freccia direzionale laser sul terreno davanti all'escursionista. Funziona offline tramite mappe topografiche precaricate e un modulo GPS a basso consumo. L'autonomia è di quarantotto ore con due batterie AA standard. La scocca in policarbonato con guarnizioni IP67 resiste a pioggia, sabbia e urti. È pensato per chi vuole navigare in montagna senza guardare lo schermo del telefono.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Sport e tempo libero",
    tags: ["sport", "outdoor", "navigation", "gps", "hiking", "laser"],
    cfml: 70,
    sp: 52,
    spResponses: 38,
    author: { name: "Andrea Lombardi", handle: "@andrealombardi" },
    createdAt: "2025-07-30",
  },

  // ── Q2 (cfml<50, sp≥50) ────────────────────────────────────────────────
  {
    id: "0273",
    number: "NR. 0507",
    title: "SGLØR",
    tagline: "Ambient sound masking device",
    description:
      "Sglør è un diffusore acustico da parete che genera campi di mascheramento sonoro adattivi per garantire la privacy delle conversazioni negli open space. Il sistema analizza in tempo reale i livelli di rumore ambientale e calibra la frequenza e il volume del rumore di fondo prodotto. Il form factor piatto lo rende installabile come un quadro, e la scocca è disponibile in versione fonoassorbente rivestita di feltro. Non richiede app né connessione: è completamente plug-and-play.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Casa e abitare",
    tags: ["workspace", "acoustic", "privacy", "open-space", "sound", "office"],
    cfml: 44,
    sp: 95,
    spResponses: 26,
    cfmlLevelsPassed: 3,
    cfmlCompletedAt: "2026-05-12",
    spWindowStart: "2026-05-02",
    spWindowEnd: "2026-05-11",
    positioningNotes:
      "Sglør si posiziona nel quadrante della promessa simbolica: l'immaginario d'uso che attiva è molto più maturo del suo stato tecnico. L'oggetto comunica gioco, ritualità e domesticità con grande forza, ma il funzionamento è ancora in fase di verifica iniziale.\n\nLa risposta emotiva è alta e la lettura del ruolo è chiara: chi lo osserva capisce subito cosa fa e si proietta nell'uso. Il punto debole resta il consolidamento tecnico, da costruire prima che il quadro d'uso possa stabilizzarsi.",
    author: { name: "Luca Ricci", handle: "@lucarricci" },
    createdAt: "2025-10-28",
  },
  {
    id: "grogolix",
    number: "NR. 0663",
    title: "GROGOLIX",
    tagline: "Fermented food starter kit",
    description:
      "Grogolix è un kit domestico per la fermentazione di alimenti che include un vaso di fermentazione in ceramica smaltata, una bilancia di precisione integrata nel coperchio e un termometro wireless. L'app companion guida l'utente passo a passo nella preparazione di kefir, kombucha, kimchi e altri fermentati attraverso ricette con tempistiche adattive. I sensori monitorano pH e temperatura e inviano avvisi quando è il momento di intervenire. Il design è volutamente analogico nell'estetica, artigianale e caldo.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Cibo e cucina",
    tags: ["food", "fermentation", "health", "kitchen", "iot", "ceramic", "diy"],
    cfml: 34,
    sp: 76,
    spResponses: 53,
    author: { name: "Beatrice Marini", handle: "@beatricemarini" },
    createdAt: "2025-06-17",
  },
  {
    id: "velox",
    number: "NR. 0399",
    title: "VELOX",
    tagline: "E-bike torque booster module",
    description:
      "Velox è un modulo retrofit che si installa in trenta minuti su qualsiasi bicicletta da strada per trasformarla in una e-bike leggera. Il sistema è centrato su un motore mid-drive da 250 W integrato nel movimento centrale, abbinato a una batteria da 300 Wh nascosta nel tubo del sellino. Il peso aggiuntivo totale è di 2,4 kg. Un display minimal sul manubrio mostra autonomia residua e modalità di assistenza. L'aggiornamento firmware avviene via OTA dallo smartphone.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Mobilità e trasporti",
    tags: ["mobility", "ebike", "cycling", "retrofit", "urban", "motor"],
    cfml: 42,
    sp: 68,
    spResponses: 71,
    author: { name: "Roberto Caruso", handle: "@robertocaruso" },
    createdAt: "2025-05-22",
  },
  {
    id: "mira",
    number: "NR. 0855",
    title: "MIRA",
    tagline: "Blind spot cycling mirror",
    description:
      "Mira è uno specchietto retrovisore per bicicletta con display AR integrato che sovrappone avvisi visivi ai riflessi reali. Un sensore radar da 24 GHz rileva i veicoli in avvicinamento fino a 70 metri e colora lo specchio di rosso in funzione dell'urgenza. Il montaggio è compatibile con qualsiasi manubrio standard e non richiede utensili. La batteria ricaricabile dura sei settimane con uso quotidiano. Il peso è inferiore a 80 grammi.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Sicurezza e protezione",
    tags: ["mobility", "cycling", "safety", "radar", "ar", "urban"],
    cfml: 47,
    sp: 59,
    spResponses: 33,
    author: { name: "Silvia De Luca", handle: "@silvideluca" },
    createdAt: "2026-01-29",
  },
  {
    id: "thera",
    number: "NR. 0142",
    title: "THERA",
    tagline: "Heat therapy wrist sleeve",
    description:
      "Thera è un manicotto da polso a terapia termica programmabile per chi soffre di sindrome del tunnel carpale o artrite. Il tessuto tecnico integra resistenze in grafene che si attivano tramite un'app con tre protocolli preimpostati: riscaldamento lento, impulsi termici e cicli caldo-freddo. Il design è slim, indossabile sotto i vestiti durante il lavoro. Il ricaricamento avviene via USB-C e dura due ore per sessione. È CE-certificato come dispositivo medico di classe I.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Salute e benessere",
    tags: ["health", "therapy", "wearable", "thermal", "textile", "medical"],
    cfml: 38,
    sp: 82,
    spResponses: 19,
    author: { name: "Paola Galli", handle: "@paolagalli" },
    createdAt: "2025-04-05",
  },
  {
    id: "nomi",
    number: "NR. 0774",
    title: "NOMI",
    tagline: "AI meal planning assistant",
    description:
      "Nomi è un dispositivo fisico da cucina a forma di tablet verticale che funge da assistente alla pianificazione pasti. Integra una telecamera che legge le etichette nutrizionali e gli ingredienti freschi, e un modello linguistico locale che genera piani settimanali personalizzati per obiettivi calorici e preferenze alimentari. Non richiede connessione internet per l'uso base. Lo schermo è touch e mostra le ricette passo a passo con timer integrati. Il dispositivo si integra opzionalmente con i sistemi di consegna della spesa.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Cibo e cucina",
    tags: ["food", "ai", "nutrition", "kitchen", "privacy", "meal-planning"],
    cfml: 46,
    sp: 57,
    spResponses: 22,
    author: { name: "Matteo Ferretti", handle: "@matteoferretti" },
    createdAt: "2026-02-20",
  },
  {
    id: "bruma",
    number: "NR. 0938",
    title: "BRUMA",
    tagline: "Fog collection water harvester",
    description:
      "Bruma è un collettore d'acqua atmosferica per aree ad alta umidità o nebbia, pensato per installazioni rurali e periurbane. La mesh polimerica tridimensionale brevettata cattura le goccioline di nebbia e le convoglia verso un serbatoio da 20 litri. Il dispositivo non richiede energia elettrica ed è costruito interamente in materiali riciclabili. Una versione domestica da balcone può raccogliere fino a 2 litri al giorno in condizioni di nebbia moderata. Il progetto ha una forte vocazione di accessibilità economica.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Inclusione e accessibilità",
    tags: ["energy", "water", "sustainability", "off-grid", "rural", "climate"],
    cfml: 41,
    sp: 53,
    spResponses: 15,
    author: { name: "Giorgio Esposito", handle: "@giorgioesposito" },
    createdAt: "2025-09-03",
  },

  // ── Q3 (cfml≥50, sp<50) ────────────────────────────────────────────────
  {
    id: "volta",
    number: "NR. 0281",
    title: "VOLTA",
    tagline: "Kinetic energy floor tile",
    description:
      "Volta è una piastrella piezoelettrica per pavimenti di aree ad alto traffico pedonale che converte i passi in energia elettrica. Ogni piastrella da 30×30 cm genera fino a 5 W di picco sotto il peso di un adulto. L'energia viene immagazzinata in un supercondensatore integrato o ceduta alla rete locale tramite microinverter. Il rivestimento superiore è in gomma riciclata ad alta durabilità, disponibile in dieci colori. Il sistema è pensato per stazioni metro, aeroporti e centri commerciali.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Servizi e pubblica utilità",
    tags: ["energy", "piezoelectric", "floor", "harvesting", "urban", "infrastructure"],
    cfml: 68,
    sp: 37,
    spResponses: 18,
    author: { name: "Simone Ferrari", handle: "@simoneferrari" },
    createdAt: "2025-11-25",
  },
  {
    id: "deko",
    number: "NR. 0614",
    title: "DEKO",
    tagline: "Customizable modular fashion accessory",
    description:
      "Deko è una linea di accessori moda modulari in resina stampata a SLA che consente all'utente di assemblare borse, cinture e bigiotteria da componenti intercambiabili. I ganci di connessione brevettati permettono di aggiungere o rimuovere elementi in pochi secondi, trasformando una clutch in tracolla o una collana in bracciale. Il catalogo conta oltre duecento moduli disponibili in sei finiture. Ogni componente è numerato e tracciabile con chip NFC per certificare l'origine e la composizione del materiale.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Abbigliamento e accessori",
    tags: ["fashion", "modular", "accessories", "3d-print", "nfc", "customization"],
    cfml: 57,
    sp: 44,
    spResponses: 31,
    author: { name: "Alessia Bruno", handle: "@alessiabruno" },
    createdAt: "2025-06-30",
  },
  {
    id: "scope",
    number: "NR. 0489",
    title: "SCOPE",
    tagline: "AR learning microscope for schools",
    description:
      "Scope è un microscopio ottico per uso scolastico dotato di fotocamera ad alta risoluzione e modulo AR che sovrappone annotazioni didattiche al vetrino osservato in tempo reale sul tablet abbinato. Il software di riconoscimento automatico identifica cellule, batteri e microorganismi e li etichetta con schede informative interattive. Il corpo è in ABS rinforzato pensato per resistere all'uso quotidiano in classe. La batteria ricaricabile lo rende completamente wireless. Il curriculum integrato copre il programma scientifico dalle medie alle superiori.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Educazione e apprendimento",
    tags: ["education", "ar", "science", "school", "microscope", "interactive"],
    cfml: 63,
    sp: 41,
    spResponses: 24,
    author: { name: "Irene Messina", handle: "@irenemessina" },
    createdAt: "2026-03-02",
  },
  {
    id: "pluto",
    number: "NR. 0752",
    title: "PLUTO",
    tagline: "Pet activity and health tracker",
    description:
      "Pluto è un collare smart per cani e gatti che monitora attività fisica, sonno, temperatura corporea e frequenza cardiaca. Il modulo è impermeabile IPX8, pesa 18 grammi e si aggancia a qualsiasi collare esistente. Il rilevamento GPS con geofencing avvisa il proprietario se l'animale esce da un'area definita. L'autonomia è di quindici giorni. I dati si sincronizzano automaticamente con l'app che offre un diario di salute condivisibile con il veterinario.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Cura della persona",
    tags: ["leisure", "pet", "wearable", "gps", "health", "iot"],
    cfml: 71,
    sp: 46,
    spResponses: 58,
    author: { name: "Nicola Serra", handle: "@nicolaserra" },
    createdAt: "2025-08-01",
  },
  {
    id: "forma",
    number: "NR. 0367",
    title: "FORMA",
    tagline: "Biofeedback sport performance glove",
    description:
      "Forma è un guanto da allenamento che misura la forza di presa, la sudorazione e la temperatura cutanea durante sessioni di arrampicata, ginnastica e sport da combat. I sensori flessibili sono integrati nel palmo senza compromettere la sensibilità tattile. Un algoritmo di fatica muscolare suggerisce pause e variazioni del carico di allenamento in tempo reale tramite earpiece Bluetooth. Il guanto è lavabile fino a cinquanta cicli senza perdita di precisione dei sensori.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Sport e tempo libero",
    tags: ["sport", "biofeedback", "glove", "performance", "climbing", "textile"],
    cfml: 59,
    sp: 43,
    spResponses: 36,
    author: { name: "Lorenzo Coppola", handle: "@lorenzocoppola" },
    createdAt: "2025-12-18",
  },
  {
    id: "riso",
    number: "NR. 0127",
    title: "RISO",
    tagline: "Risograph inspired home printer",
    description:
      "Riso è una stampante domestica compatta ispirata alla Risograph che riproduce l'estetica della stampa a stencil con inchiostri a base soia intercambiabili. Ogni cartuccia monocolore costa un quinto rispetto all'equivalente inkjet e produce cinquecento fogli. Il design è volutamente meccanico e visibile: il meccanismo di stampa è esposto sotto una campana in vetro temperato. Il software companion genera automaticamente separazioni di colore ottimizzate per lo stile risografico. Supporta formati da A6 a A4.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Cultura e intrattenimento",
    tags: ["workspace", "print", "design", "risograph", "sustainable", "creative"],
    cfml: 52,
    sp: 35,
    spResponses: 17,
    author: { name: "Filippo Riva", handle: "@filipporiva" },
    createdAt: "2025-07-14",
  },
  {
    id: "nuvol",
    number: "NR. 0543",
    title: "NUVOL",
    tagline: "Portable air quality personal monitor",
    description:
      "Nuvol è un dispositivo tascabile delle dimensioni di un accendino che misura in tempo reale PM2.5, CO₂, VOC e umidità dell'aria circostante. Il display e-ink mostra un indice di qualità aggregato su scala cromatica. I dati contribuiscono anonimamente a una mappa crowdsourced della qualità dell'aria urbana accessibile a tutti. L'autonomia è di tre giorni con una singola carica. La scocca è in alluminio riciclato con finitura sabbiata disponibile in otto colori.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Ambiente e sostenibilità",
    tags: ["health", "air-quality", "iot", "urban", "crowdsourcing", "portable"],
    cfml: 66,
    sp: 49,
    spResponses: 42,
    author: { name: "Martina Fontana", handle: "@martinafontana" },
    createdAt: "2026-01-07",
  },

  // ── Q4 (cfml<50, sp<50) ────────────────────────────────────────────────
  {
    id: "nodo",
    number: "NR. 0076",
    title: "NODO",
    tagline: "Wireless mesh speaker network",
    description:
      "Nodo è un sistema di speaker sferici da 8 cm che si connettono automaticamente in una rete mesh multi-room senza bisogno di un hub centrale. Ogni nodo riconosce la propria posizione nell'ambiente tramite time-of-flight ultrasonico e calibra il mix audio per una diffusione omogenea. Il rivestimento è in silicone antimacchia disponibile in sei colori neutri. La ricarica avviene tramite base magnetica. Tre nodi sono sufficienti per coprire un appartamento di 60 mq.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Comunicazione e media",
    tags: ["home", "audio", "mesh", "wireless", "speaker", "iot"],
    cfml: 48,
    sp: 39,
    spResponses: 27,
    author: { name: "Gianluca Mancini", handle: "@gianlucamancini" },
    createdAt: "2025-05-09",
  },
  {
    id: "pixel",
    number: "NR. 0883",
    title: "PIXEL",
    tagline: "Programmable textile display patch",
    description:
      "Pixel è una patch tessile flessibile da 10×10 cm con matrice LED a bassa potenza programmabile via smartphone. Si applica su qualsiasi indumento tramite velcro termoadesivo e consente di visualizzare testi, icone animate o messaggi personalizzati in movimento. Il display è visibile anche alla luce diretta del sole. La batteria sottile dura otto ore ed è ricaricabile in sessanta minuti. È pensata per uso sportivo, eventi, e per chi vuole esprimere identità visiva attraverso l'abbigliamento.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Abbigliamento e accessori",
    tags: ["fashion", "led", "wearable", "textile", "display", "customization"],
    cfml: 36,
    sp: 28,
    spResponses: 12,
    author: { name: "Sara Gentile", handle: "@saragentile" },
    createdAt: "2025-04-22",
  },
  {
    id: "dropo",
    number: "NR. 0956",
    title: "DROPO",
    tagline: "Last mile cargo drone dock",
    description:
      "Dropo è una stazione di atterraggio compatta per droni di consegna last-mile, progettata per installazione su balconi e terrazze condominiali. Il dock include un sistema di ancoraggio automatico, ricarica rapida in venti minuti e un vano sicuro per i pacchi. Un'app di gestione consente di autorizzare le consegne e monitorare lo stato del drone in volo. Il sistema è compatibile con i principali operatori di logistica aerea civile. Il design è compatto e discreto per minimizzare l'impatto estetico.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Servizi e pubblica utilità",
    tags: ["mobility", "drone", "logistics", "last-mile", "urban", "infrastructure"],
    cfml: 29,
    sp: 44,
    spResponses: 10,
    author: { name: "Tommaso Russo", handle: "@tommasorusso" },
    createdAt: "2026-03-25",
  },
  {
    id: "calmo",
    number: "NR. 0198",
    title: "CALMO",
    tagline: "Anxiety relief breath trainer",
    description:
      "Calmo è un piccolo dispositivo palmare che guida la respirazione diaframmatica attraverso resistenza fisica variabile all'inspirazione. Una luce LED perimetrale pulsa al ritmo ottimale calcolato sull'HRV dell'utente, rilevata tramite un sensore PPG nella zona di contatto. Sessioni di cinque minuti al giorno sono sufficienti per abbassare i livelli di cortisolo. Il materiale è silicone medicale morbido, pensato per essere tenuto in mano anche in ambienti di lavoro senza attirare attenzione. Nessuna app richiesta per l'uso base.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Salute e benessere",
    tags: ["health", "mental-health", "breathing", "anxiety", "wearable", "hrv"],
    cfml: 43,
    sp: 33,
    spResponses: 21,
    author: { name: "Cristina Leone", handle: "@cristinaleone" },
    createdAt: "2025-10-11",
  },
  {
    id: "krono",
    number: "NR. 0835",
    title: "KRONO",
    tagline: "Focus time physical scheduler",
    description:
      "Krono è un orologio da tavolo fisico con corona rotante che imposta blocchi di tempo per sessioni di focus, pause e riunioni. Una corona analogica seleziona la durata, un LED colorato comunica lo stato attuale a colleghi e familiari senza parole. Al termine di ogni blocco, una vibrazione gentile segnala il cambio. Il dispositivo si sincronizza con Google Calendar e Notion via Wi-Fi per aggiornare automaticamente la propria visualizzazione. Il case è in noce massello tornito.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Lavoro e produttività",
    tags: ["workspace", "focus", "time-management", "analog", "iot", "wood"],
    cfml: 47,
    sp: 42,
    spResponses: 35,
    author: { name: "Emanuele Costa", handle: "@emanuelecosta" },
    createdAt: "2025-12-29",
  },
  {
    id: "molo",
    number: "NR. 0722",
    title: "MOLO",
    tagline: "Floating garden island module",
    description:
      "Molo è un modulo galleggiante in polietilene espanso riciclato per la creazione di isole verdi su laghi, stagni e bacini artificiali. Ogni modulo esagonale da un metro di diametro si aggancia agli altri tramite connettori flessibili e supporta un substrato per piante palustri o ortaggi. Il sistema favorisce la biodiversità acquatica creando zone d'ombra e habitat per pesci e anfibi. È pensato sia per parchi pubblici sia per proprietà private. La manutenzione richiede un intervento annuale.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Ambiente e sostenibilità",
    tags: ["energy", "sustainability", "water", "garden", "biodiversity", "outdoor"],
    cfml: 38,
    sp: 27,
    spResponses: 13,
    author: { name: "Riccardo Vitale", handle: "@riccardovitale" },
    createdAt: "2026-02-14",
  },
  {
    id: "duna",
    number: "NR. 0059",
    title: "DUNA",
    tagline: "Tactile coding kit for children",
    description:
      "Duna è un kit di programmazione tangibile per bambini dai 5 anni composto da blocchi fisici colorati che rappresentano istruzioni logiche. I bambini compongono sequenze sul tappeto di gioco e un robot tartaruga da 15 cm esegue il programma costruito. Non ci sono schermi: tutta l'interazione avviene nel mondo fisico. Il kit include quaranta blocchi, tre missioni stampate su cartoncino e una guida per insegnanti. Il materiale è legno di faggio certificato FSC.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Educazione e apprendimento",
    tags: ["education", "kids", "coding", "tangible", "screen-free", "wood"],
    cfml: 44,
    sp: 31,
    spResponses: 16,
    author: { name: "Veronica Marini", handle: "@veronicamarini" },
    createdAt: "2025-07-03",
  },
  {
    id: "onda",
    number: "NR. 0612",
    title: "ONDA",
    tagline: "Wearable surf performance analyzer",
    description:
      "Onda è un sistema di due sensori impermeabili da attaccare alla tavola da surf e alla caviglia del surfista per analizzare traiettorie, velocità di drop, manovre e tempo in acqua. I dati vengono elaborati e visualizzati sull'app entro dieci secondi dall'uscita dall'acqua, con clip video automaticamente sincronizzati con i picchi di performance. Il modulo è autoalimentato tramite pannello solare flessibile integrato nella cover. Compatibile con tavole shortboard, longboard e foil.",
    images: ["/concepts/placeholder.jpg"],
    sector: "Sport e tempo libero",
    tags: ["sport", "surf", "wearable", "analytics", "solar", "waterproof"],
    cfml: 32,
    sp: 45,
    spResponses: 20,
    author: { name: "Giacomo Ferrara", handle: "@giacomoferrara" },
    createdAt: "2025-09-15",
  },
];

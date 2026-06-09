export const CFML_LEVELS = [
  {
    level: 1,
    title: "Principio definito",
    levelTooltip: null,
    questions: [
      { code: "1A", text: "È chiaro che cosa deve fare il prodotto?", tooltip: null },
      {
        code: "1B",
        text: "È chiaro cosa fa funzionare il prodotto?",
        tooltip:
          "Può essere un fenomeno fisico (gravità, calore, elettricità, magnetismo), una proprietà del materiale (elasticità, rigidità, impermeabilità), o una relazione geometrica (forma, inclinazione, incastro). Non serve un linguaggio tecnico: basta che tu sappia identificare cosa permette al prodotto di svolgere la sua funzione.",
      },
    ],
  },
  {
    level: 2,
    title: "Struttura definita",
    levelTooltip: null,
    questions: [
      {
        code: "2A",
        text: "Le parti principali del prodotto sono state identificate?",
        tooltip: null,
      },
      {
        code: "2B",
        text: "È chiaro come questi elementi interagiscono per funzionare?",
        tooltip: null,
      },
      {
        code: "2C",
        text: "Sono già stati individuati materiali, componenti o soluzioni tecniche plausibili?",
        tooltip: null,
      },
    ],
  },
  {
    level: 3,
    title: "Funzione verificata",
    levelTooltip: null,
    questions: [
      {
        code: "3A",
        text: "La funzione principale è stata testata almeno una volta?",
        tooltip: "Anche con una dimostrazione o prototipo semplice.",
      },
      {
        code: "3B",
        text: "La prova dimostra che il principio funziona in modo coerente?",
        tooltip: null,
      },
      {
        code: "3C",
        text: "Sono stati identificati i principali rischi tecnici o punti critici del funzionamento?",
        tooltip: null,
      },
    ],
  },
  {
    level: 4,
    title: "Prototipo fisico",
    levelTooltip: null,
    questions: [
      {
        code: "4A",
        text: "Esiste un prototipo del prodotto che permette di testarne il funzionamento complessivo?",
        tooltip: "Non solo il nucleo funzionale.",
      },
      {
        code: "4B",
        text: "Il prototipo è stato testato da diversi utenti?",
        tooltip: null,
      },
    ],
  },
  {
    level: 5,
    title: "Prototipo in ambiente rilevante",
    levelTooltip:
      "Ovvero il contesto reale (o molto simile) in cui il prodotto verrà usato, con le sue condizioni e dinamiche: spazi, persone, attività, vincoli.",
    questions: [
      {
        code: "5A",
        text: "Il prototipo è stato provato in uno scenario vicino a quello d'uso previsto?",
        tooltip: null,
      },
      {
        code: "5B",
        text: "Forma, materiali, dimensioni e assemblaggio sono compatibili con il funzionamento nel contesto rilevante?",
        tooltip:
          "Ovvero, forma, dimensioni, materiali e assemblaggio sono plausibili per quel contesto e non ne intralciano il funzionamento.",
      },
      {
        code: "5C",
        text: "Il prototipo funziona senza che tu debba intervenire manualmente in modo continuo?",
        tooltip:
          "Non si blocca, non si rompe, non richiede aggiustamenti durante l'uso o correzioni continue.",
      },
    ],
  },
  {
    level: 6,
    title: "Definizione e replicabilità",
    levelTooltip: null,
    questions: [
      {
        code: "6A",
        text: "Le scelte principali di forma, componenti, materiali e funzionamento sono ormai definite in modo stabile?",
        tooltip: null,
      },
      {
        code: "6B",
        text: "Può essere ricostruito ottenendo le stesse prestazioni?",
        tooltip: null,
      },
      {
        code: "6C",
        text: "Il prodotto può essere considerato un concept maturo, anche se non ancora industrializzato o diffuso?",
        tooltip: null,
      },
    ],
  },
] as const;

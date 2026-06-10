import type { SPConfig } from "./types";

const spConfigV1_2026_06: SPConfig = {
  version: "v1_2026-06",
  minResponses: 10,
  scaleMin: 1,
  scaleMax: 7,
  dimensions: [
    {
      id: "estetica",
      number: 1,
      title: "Segnali estetici",
      description: "Reazione visiva immediata al concept.",
      method: "semantic_differential",
      items: [
        {
          id: "E1",
          poleLow: "Trascurato",
          poleHigh: "Curato",
          reverseScored: false,
        },
        {
          id: "E2",
          poleLow: "Fragile",
          poleHigh: "Robusto",
          reverseScored: false,
        },
        {
          id: "E3",
          poleLow: "Ostile",
          poleHigh: "Amichevole",
          reverseScored: false,
        },
        {
          id: "E4",
          poleLow: "Convenzionale",
          poleHigh: "Originale",
          reverseScored: false,
        },
        {
          id: "E5",
          poleLow: "Complesso",
          poleHigh: "Semplice",
          reverseScored: false,
          tooltip:
            "Riguarda la densità visiva. Non riguarda né l'ordine né la qualità.",
        },
      ],
    },
    {
      id: "ruolo",
      number: 2,
      title: "Ruolo e categoria",
      description: "Capire cosa è il concept e a cosa serve.",
      method: "likert",
      items: [
        {
          id: "R1",
          statement: "Capisco chiaramente che cosa sia questo concept.",
          reverseScored: false,
        },
        {
          id: "R2",
          statement: "Capisco chiaramente a cosa serve.",
          reverseScored: false,
        },
        {
          id: "R3",
          statement:
            "Riesco a immaginare come e in quali situazioni lo userei.",
          reverseScored: false,
        },
        {
          id: "R4",
          statement: "È chiaro per chi è pensato.",
          reverseScored: false,
        },
        {
          id: "R5",
          statement: "Saprei spiegarlo in modo semplice a qualcun altro.",
          reverseScored: false,
          openTextField: {
            label: "Se vuoi, scrivi come lo spiegheresti:",
            placeholder: "Spiega il concept con parole tue…",
            required: false,
          },
        },
      ],
    },
    {
      id: "identita",
      number: 3,
      title: "Significato identitario e sociale",
      description: "Cosa il concept dice di chi lo usa.",
      method: "likert",
      items: [
        {
          id: "I1",
          statement: "Mi riconoscerei in questo concept.",
          reverseScored: false,
        },
        {
          id: "I2",
          statement:
            "Preferirei che gli altri non sapessero che lo uso o lo possiedo.",
          reverseScored: true,
        },
        {
          id: "I3",
          statement:
            "Usare questo concept mi valorizzerebbe agli occhi degli altri.",
          reverseScored: false,
        },
        {
          id: "I4",
          statement: "Lo userebbe il tipo di persona che vorrei essere.",
          reverseScored: false,
        },
      ],
    },
    {
      id: "morale",
      number: 4,
      title: "Significato morale e normativo",
      description: "Cosa è considerato accettabile usarlo.",
      method: "likert",
      items: [
        {
          id: "M1",
          statement:
            "Nel complesso, questo concept mi sembra eticamente accettabile.",
          reverseScored: false,
        },
        {
          id: "M2",
          statement:
            "Il suo uso mi sembra rispettoso verso le persone coinvolte.",
          reverseScored: false,
        },
        {
          id: "M3",
          statement:
            "Nel contesto descritto, l'uso di questo concept mi sembra socialmente accettato e appropriato.",
          reverseScored: false,
        },
      ],
    },
    {
      id: "relazionale",
      number: 5,
      title: "Significato relazionale",
      description: "Come il concept si pone rispetto a chi lo usa.",
      method: "likert",
      items: [
        {
          id: "L1",
          statement: "Questo concept mi lascerebbe il controllo su come usarlo.",
          reverseScored: false,
        },
        {
          id: "L2",
          statement:
            "Questo concept resterebbe discreto, senza imporsi nel quotidiano.",
          reverseScored: false,
        },
        {
          id: "L3",
          statement:
            "Questo concept rispetterebbe il mio spazio personale e la mia privacy.",
          reverseScored: false,
        },
        {
          id: "L4",
          statement: "Saprei cosa aspettarmi da questo concept usandolo.",
          reverseScored: false,
        },
      ],
    },
    {
      id: "emozione",
      number: 6,
      title: "Risposta emotiva",
      description: "L'affetto che il concept lascia.",
      method: "semantic_differential",
      items: [
        {
          id: "A1",
          poleLow: "Annoiato",
          poleHigh: "Affascinato",
          reverseScored: false,
        },
        {
          id: "A2",
          poleLow: "Infastidito",
          poleHigh: "Attratto",
          reverseScored: false,
        },
        {
          id: "A3",
          poleLow: "Scettico",
          poleHigh: "Colpito",
          reverseScored: false,
        },
        {
          id: "A4",
          poleLow: "Inquieto",
          poleHigh: "Rassicurato",
          reverseScored: false,
        },
      ],
    },
  ],
};

export default spConfigV1_2026_06;

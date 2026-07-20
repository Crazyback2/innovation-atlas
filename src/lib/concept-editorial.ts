import type { Concept } from "@/src/data/concepts";

export const CONCEPT_EDITORIAL: Record<string, Partial<Concept>> = {
  // Cubit
  "22811dc5-b058-4df0-a8a3-f53db6178073": {
    number: "01",
    tagline:
      "Pista per biglie modulare in legno che accompagna il bambino con disturbo dell'attenzione.",
    tags: ["gioco", "neurodivergenza", "modularita'"],
    author: { name: "Lorenzo Romano", handle: "lorenzoromano" },
  },
  // Hapto
  "fad41e8a-ab6e-4b54-b9e8-bf802050207c": {
    number: "02",
    tagline:
      "Manopola smart per motocicletta che traduce i pericoli circostanti in feedback aptici direzionali.",
    tags: ["mobilita'", "aptica", "sicurezza"],
    author: { name: "Francesco Scaramuzzi", handle: "francescoscaramuzzi" },
  },
  // SHU
  "e11e5c3a-19f8-429e-ae7e-aa8c95b4dedf": {
    number: "03",
    tagline:
      "Prodotto speculativo che interroga il ruolo della tecnologia nell'abbraccio.",
    tags: ["speculative design", "corpo", "relazione"],
    author: { name: "Diego Reggiani", handle: "diegoreggiani" },
  },
};

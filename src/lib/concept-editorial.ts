import type { Concept } from "@/src/data/concepts";

export const CONCEPT_EDITORIAL: Record<string, Partial<Concept>> = {
  // Cubit
  "22811dc5-b058-4df0-a8a3-f53db6178073": {
    number: "01",
    tagline: "Pista per biglie modulare",
    tags: ["gioco", "neurodivergenza", "modularità"],
    author: { name: "Lorenzo Romano", handle: "lorenzoromano" },
    positioningNotes:
      "Cubit si colloca praticamente sulla diagonale, in alto. I due quadri sono maturati nella stessa misura: il quadro di funzionamento e il quadro d'uso sono avanzati di pari passo, il prodotto è quasi completo e l'immaginario che lo accompagna è ormai assestato.\n\nÈ la posizione rara dell'innovazione coerente: nessun asse in ritardo, niente da correggere. L'indicazione che se ne ricava non è lavorare su una delle due dimensioni, ma passare alle fasi che la matrice non misura, come mercato, norme e sostenibilità.",
  },
  // Hapto
  "fad41e8a-ab6e-4b54-b9e8-bf802050207c": {
    number: "02",
    tagline: "Manopola aptica per motocicletta",
    tags: ["mobilità", "aptica", "sicurezza"],
    author: { name: "Francesco Scaramuzzi", handle: "francescoscaramuzzi" },
    positioningNotes:
      "Hapto si colloca ben sopra la diagonale: il simbolico è in netto anticipo sull'artefatto. I rispondenti già capiscono il concept, lo desiderano e lo legittimano, ma il prodotto è fermo a metà strada.\n\nÈ l'asincronia classica del quadro d'uso che precede quello di funzionamento. Il rischio è la disillusione, ma l'asse in ritardo è quello tecnico, il più direttamente controllabile dal progettista.",
  },
  // SHU
  "e11e5c3a-19f8-429e-ae7e-aa8c95b4dedf": {
    number: "03",
    tagline: "Oggetto speculativo relazionale",
    tags: ["speculative design", "corpo", "relazione"],
    author: { name: "Diego Reggiani", handle: "diegoreggiani" },
    positioningNotes:
      "Per coordinate SHU cade nel quadrante alto, ma lo scarto tra i due assi rivela un divario ampio: l'artefatto è completamente definito, il quadro simbolico non è assestato.\n\nL'informazione vera sta nella dispersione delle risposte, che colloca il concept in due quadranti diversi a seconda del rispondente. La matrice segnala di intervenire sul simbolico, ma qui il quadro non è assestato perché il concept è stato costruito per non assestarlo.",
  },
};

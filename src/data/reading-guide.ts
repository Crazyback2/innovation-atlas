export type ReadingGuideSection = {
  title: string;
  body: string;
};

/**
 * Guida statica alla lettura dei risultati (hub privata).
 * Solo contenuto: riscrivere qui senza toccare i componenti.
 */
export const READING_GUIDE: ReadingGuideSection[] = [
  {
    title: "Come leggere il punteggio CFML",
    body: "Segnaposto: il punteggio CFML misura la maturita funzionale del concept lungo sei livelli di consolidamento. Riscrivere questa sezione con la guida definitiva.",
  },
  {
    title: "Come leggere il punteggio SP",
    body: "Segnaposto: il punteggio SP sintetizza la percezione simbolica media del campione sulle sei dimensioni. Riscrivere questa sezione con la guida definitiva.",
  },
  {
    title: "Come leggere la posizione nella matrice",
    body: "Segnaposto: la matrice incrocia CFML e SP e colloca il concept in un quadrante. Riscrivere questa sezione con la guida definitiva.",
  },
  {
    title: "Cosa i due punteggi non dicono",
    body: "Segnaposto: CFML e SP non dicono da soli se il concept va portato avanti, ne' sostituiscono il giudizio di chi lo conosce. Riscrivere questa sezione con la guida definitiva.",
  },
];

export type QuadrantId = "Q1" | "Q2" | "Q3" | "Q4";

/**
 * Copy interpretativa per la hub privata.
 * Deterministica su (quadrante, cfml, sp).
 */
export function getPrivateQuadrantCopy(
  quadrant: QuadrantId,
  cfml: number,
  sp: number
): string {
  switch (quadrant) {
    case "Q1":
      return `Maturita funzionale e percezione simbolica avanzano insieme. Il quadro di funzionamento e il quadro d'uso sono sincronizzati: cio' che il concept fa e cio' che il concept significa per chi lo incontra puntano nella stessa direzione. Con CFML ${cfml} e SP ${sp} il concept non presenta asincronia tecnico-sociale rilevante. La lettura utile non riguarda piu' il colmare uno scarto, ma il verificare che la coerenza regga anche fuori dalle condizioni di presentazione in cui la SP e' stata raccolta.`;
    case "Q2":
      return `La percezione corre davanti al funzionamento. Con SP ${sp} a fronte di CFML ${cfml} il concept attiva un immaginario d'uso gia' forte mentre il quadro tecnico e' ancora in costruzione. E' l'asincronia tipica dei concept che convincono prima di funzionare: il rischio non e' l'indifferenza ma la distanza tra cio' che viene promesso e cio' che il concept e' oggi in grado di sostenere. La direzione di lavoro indicata dalla matrice e' consolidare le evidenze funzionali senza disperdere la forza simbolica gia' acquisita.`;
    case "Q3":
      return `Il funzionamento e' avanti rispetto alla percezione. Con CFML ${cfml} a fronte di SP ${sp} il concept e' tecnicamente definito ma non ha ancora trovato la forma con cui rendersi leggibile a chi lo incontra. L'asincronia qui non e' tecnica ma simbolica: le prestazioni esistono, il racconto d'uso no. La lettura utile riguarda le condizioni di presentazione, il contesto proposto e il linguaggio con cui il concept viene mostrato, prima che le sue caratteristiche funzionali.`;
    case "Q4":
      return `Entrambi gli assi sono sotto la soglia. Con CFML ${cfml} e SP ${sp} il concept e' in una fase iniziale su tutti e due i quadri: il funzionamento non e' ancora verificato e l'immaginario d'uso non si e' ancora formato. La posizione non e' un giudizio negativo ma una fotografia di stadio: e' la condizione normale di un concept agli inizi. La matrice non indica qui una direzione prioritaria, perche' entrambi i fronti sono aperti.`;
  }
}

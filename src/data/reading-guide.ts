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
    body: "Il risultato primario non è il numero, ma il livello di consolidamento raggiunto: da L0 a L6, indica fino a dove il quadro di funzionamento è effettivamente solido. Il punteggio 0–100 è una lettura più fine, che misura la qualità del consolidamento all'interno del percorso compilato: il suo margine di variazione dipende dalla densità delle risposte Parzialmente nei livelli chiusi e dall'avanzamento sul livello successivo, quello ancora aperto. I due valori sono correlati per costruzione, perché la regola di blocco impedisce di accedere a un livello senza aver consolidato il precedente. Va infine ricordato che la CFML è autovalutativa: la compili tu, e ogni risposta affermativa vale quanto l'evidenza progettuale concreta che la sostiene.",
  },
  {
    title: "Come leggere il punteggio SP",
    body: "Il profilo viene prima del totale. Le sei dimensioni conservano ciascuna il proprio punteggio, e due concept con la stessa media possono avere profili opposti: è la forma del radar, non la sua area, a contenere l'informazione. Più del valore assoluto di una singola dimensione conta lo scarto tra i picchi e gli avvallamenti. Un valore basso non è automaticamente una debolezza: può segnalare che quella dimensione è poco pertinente al tipo di concept in esame. Il profilo va poi letto insieme al campione che lo ha prodotto: sotto le dieci risposte la stima non sostiene una lettura puntuale, e la dimensione del punto sulla matrice traduce visivamente questa confidenza. La percezione misurata è sempre quella suscitata dallo stimulus pack, non dal concept in astratto.",
  },
  {
    title: "Come leggere la posizione nella matrice",
    body: "L'ascissa porta la CFML, l'ordinata la SP; la soglia è fissata convenzionalmente a 50 su entrambi gli assi, con una fascia di prudenza tra 45 e 55 entro cui la collocazione non può dirsi stabile. I quattro quadranti sono concept allineato, dove i due quadri hanno maturato insieme; promessa simbolica, dove l'immaginario d'uso precede la tecnica; in cerca di senso, dove la tecnica precede il significato; idea embrionale, dove nessuno dei due assi ha ancora raggiunto una promessa riconoscibile. La distanza dalla diagonale misura l'ampiezza dell'asincronia tecnico-sociale, il suo segno la direzione. La piattaforma colloca, non giudica: la posizione dice dove il concept si trova rispetto ai due quadri, non quanto vale.",
  },
  {
    title: "Cosa i due punteggi non dicono",
    body: "I due assi hanno statuto diverso. La CFML descrive uno stato di fatto tecnico, in linea di principio verificabile; la SP descrive la risposta che il concept suscita in date condizioni di presentazione. Il primo dice dove il concept è, il secondo come viene visto: la scala comune non cancella questa differenza. La CFML, inoltre, è tarata su concept di prodotto fisico, dove prototipo e ambiente d'uso hanno un riferimento materiale chiaro. Nessuno dei due punteggi predice l'esito di mercato, che dipende anche da prezzo, infrastrutture, regolazione ed eventi esterni ai due quadri. E la collocazione è un'istantanea: registra lo stato al momento della valutazione, non la traiettoria. Lo strumento orienta la decisione progettuale; non la sostituisce.",
  },
];

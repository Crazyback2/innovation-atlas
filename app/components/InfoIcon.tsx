// Icona informativa condivisa — cerchietto con "i", usata nelle intestazioni
// degli assi della matrice /archivio (SP e CFML) e riusata come affordance
// informativa altrove (es. etichetta PLACEHOLDER nell'hero dei concept).
export default function InfoIcon() {
  return (
    <div className="w-[18px] h-[18px] rounded-full border border-accent-secondary flex items-center justify-center shrink-0">
      <span className="font-mono text-[11px] text-accent-secondary leading-none">i</span>
    </div>
  );
}

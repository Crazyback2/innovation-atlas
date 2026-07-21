/** Indice 1–3 stabile per concept id (stesso SVG a ogni refresh). */
export function getBozzaPlaceholderIndex(conceptId: string): 1 | 2 | 3 {
  let hash = 0;
  for (let i = 0; i < conceptId.length; i++) {
    hash = (hash * 31 + conceptId.charCodeAt(i)) >>> 0;
  }
  return ((hash % 3) + 1) as 1 | 2 | 3;
}

export function getBozzaPlaceholderSrc(conceptId: string): string {
  return `/bozza/${getBozzaPlaceholderIndex(conceptId)}.svg`;
}

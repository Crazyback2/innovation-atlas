export function getCfmlBand(score: number): string {
  if (score < 25) return "Concept abbozzato";
  if (score < 50) return "Concept credibile";
  if (score < 75) return "Concept prototipato";
  return "Concept consolidato";
}

export function getSpBand(score: number): string {
  if (score < 25) return "Incoerente";
  if (score < 50) return "Frammentato";
  if (score < 75) return "Coerente";
  return "Risonante";
}

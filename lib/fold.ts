// Search key for Turkish and English text: lowercase with Turkish casing rules,
// strip combining marks (ş → s, ğ → g, ö → o) and map dotless ı to i, so
// "iletisim" matches "İletişim".
export function fold(text: string): string {
  return text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ı/g, 'i');
}

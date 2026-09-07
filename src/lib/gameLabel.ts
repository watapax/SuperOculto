export function shortGameYear(year: number): string {
  return year < 2000 ? `'${year % 100}` : `${year}`
}

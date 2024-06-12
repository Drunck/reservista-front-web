export function formatDate(date: Date, locale: string = navigator.language): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short", // "short" for abbreviated month names like Jan, Feb, etc.
    day: "2-digit", // "2-digit" for leading zero on day
  }).format(date);
}
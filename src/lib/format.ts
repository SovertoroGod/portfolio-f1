const MONTH = new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" });

export function formatDate(iso: string) {
  return MONTH.format(new Date(`${iso}T00:00:00Z`));
}

export function monthsBetween(from: string, to: string | null, now = new Date()) {
  const start = new Date(`${from}T00:00:00Z`);
  const end = to ? new Date(`${to}T00:00:00Z`) : now;
  let months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
  if (end.getUTCDate() < start.getUTCDate()) months -= 1;
  return Math.max(0, months);
}

export function formatMonths(months: number) {
  if (months < 1) return "under a month";
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (!years) return `${months} mo`;
  return remainder ? `${years} yr ${remainder} mo` : `${years} yr`;
}

export function stintLength(from: string, to: string | null, now = new Date()) {
  return formatMonths(monthsBetween(from, to, now));
}

const DAY_MS = 86_400_000;

export type CalendarDate = string & { readonly __calendarDate: unique symbol };

/** Validate date components before allowing JavaScript to normalize them. */
export function parseCalendarDate(value: unknown): CalendarDate | undefined {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return undefined;

  // setUTCFullYear avoids Date.UTC's special treatment of years 0–99.
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return undefined;
  }
  return value as CalendarDate;
}

/** UTC is only an arithmetic coordinate here; these values represent calendar days. */
export function daysBetween(start: CalendarDate, end: CalendarDate): number {
  return (Date.parse(`${end}T00:00:00.000Z`) - Date.parse(`${start}T00:00:00.000Z`)) / DAY_MS;
}

export function addCalendarDays(start: CalendarDate, days: number): CalendarDate {
  if (!Number.isInteger(days)) throw new RangeError('Calendar offsets must be whole days.');
  const value = new Date(Date.parse(`${start}T00:00:00.000Z`) + days * DAY_MS).toISOString().slice(0, 10);
  const result = parseCalendarDate(value);
  if (!result) throw new RangeError('The resulting date is outside the supported calendar.');
  return result;
}

/** Called by the future UI, never implicitly by validation or the score engine. */
export function localCalendarDate(now: Date): CalendarDate {
  const value = `${String(now.getFullYear()).padStart(4, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const result = parseCalendarDate(value);
  if (!result) throw new RangeError('A valid current date is required.');
  return result;
}

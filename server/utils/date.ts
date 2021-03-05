declare const DateISO8601Symbol: unique symbol;
export type DateISO8601 = string & { [DateISO8601Symbol]: never };

export const toISO8601 = (date: Date): DateISO8601 => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return date.toISOString() as any;
};

export const fromISO8601 = (str: DateISO8601): Date => {
  return new Date(Date.parse(str));
};

export const toISO8601Nullable = (date: Date | null): DateISO8601 | null => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return date instanceof Date ? (date.toISOString() as any) : null;
};

export const fromISO8601Nullable = (str: DateISO8601 | null): Date | null => {
  if (typeof str === "string") return new Date(Date.parse(str));
  return null;
};

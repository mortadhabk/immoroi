export const toNumber = (value: string | number, fallback = 0) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  const sanitized = value.replace(/[\s\u202F\u00A0]/g, '').replace(',', '.');
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const nonNegative = (value: number) => (value < 0 ? 0 : value);

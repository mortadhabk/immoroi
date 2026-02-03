export const toNumber = (value: string | number, fallback = 0) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const nonNegative = (value: number) => (value < 0 ? 0 : value);

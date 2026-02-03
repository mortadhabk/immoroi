export const eur = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const numberFr = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const formatCurrency = (value: number) => eur.format(value || 0);
export const formatNumber = (value: number) => numberFr.format(value || 0);

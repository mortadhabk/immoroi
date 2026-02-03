const percentFr = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export const formatPercentAnnual = (rate: number) => `${percentFr.format(rate * 100)} %`;

import type { Apartment } from '../../models/apartment';

const REQUIRED_FIELDS: Array<{ key: string; label: string; check: (a: Apartment) => boolean }> = [
  { key: 'name', label: 'Nom du bien', check: (a) => a.name.trim().length > 0 },
  { key: 'city', label: 'Ville', check: (a) => a.city.trim().length > 0 },
  { key: 'purchasePrice', label: "Prix d'achat", check: (a) => a.purchasePrice > 0 },
  { key: 'loanYears', label: 'Durée du prêt', check: (a) => a.loanYears > 0 },
  { key: 'downPayment', label: 'Apport', check: (a) => a.downPayment >= 0 },
  { key: 'revenues', label: 'Revenus mensuels', check: (a) => a.revenues.some((r) => r.monthlyAmount > 0) },
  { key: 'charges', label: 'Charges annuelles', check: (a) => a.charges.some((c) => c.amount > 0) },
  { key: 'worksCost', label: 'Travaux', check: (a) => a.worksCost >= 0 },
];

export const completionFor = (apt: Apartment) => {
  const missing = REQUIRED_FIELDS.filter((field) => !field.check(apt)).map((f) => f.label);
  const total = REQUIRED_FIELDS.length;
  const filled = total - missing.length;
  return { filled, total, ratio: Math.round((filled / total) * 100), missing };
};

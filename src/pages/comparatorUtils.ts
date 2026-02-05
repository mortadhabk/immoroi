import type { Apartment } from '../models/apartment';
import type { InvestmentMetrics } from '../services/calculations/calculations';
import { computeInvestmentMetrics, getMissingEssentials } from '../services/calculations/calculations';

export type ComparatorRow = {
  id: string;
  name: string;
  city: string;
  metrics: InvestmentMetrics;
  missing: ReturnType<typeof getMissingEssentials>;
  isComplete: boolean;
};

export type ComparatorFilters = {
  showCompleteOnly: boolean;
  status: 'all' | 'complete' | 'incomplete';
  city: string;
  cashflow: 'all' | 'positive' | 'negative';
  minNetYield: number;
};

export const buildComparatorRows = (apartments: Apartment[]): ComparatorRow[] =>
  apartments.map((apt) => {
    const missing = getMissingEssentials(apt);
    const isComplete = missing.length === 0;
    return {
      id: apt.id,
      name: apt.name || 'Nouveau bien',
      city: apt.city || 'Ville à renseigner',
      metrics: computeInvestmentMetrics(apt),
      missing,
      isComplete,
    };
  });

export const applyComparatorFilters = (
  rows: ComparatorRow[],
  filters: ComparatorFilters
) => {
  return rows.filter((row) => {
    if (filters.showCompleteOnly && !row.isComplete) return false;
    if (filters.status === 'complete' && !row.isComplete) return false;
    if (filters.status === 'incomplete' && row.isComplete) return false;
    if (filters.city && row.city !== filters.city) return false;
    if (filters.cashflow === 'positive' && row.metrics.cashFlowMonthAfterDebt < 0) return false;
    if (filters.cashflow === 'negative' && row.metrics.cashFlowMonthAfterDebt >= 0) return false;
    if (filters.minNetYield > 0 && row.metrics.netYieldPercent < filters.minNetYield) return false;
    return true;
  });
};

export const computeScore = (row: ComparatorRow): number => {
  if (!row.isComplete) return 0;
  const cashflowScore = Math.max(0, Math.min(40, row.metrics.cashFlowMonthAfterDebt / 20));
  const yieldScore = Math.max(0, Math.min(35, row.metrics.netYieldPercent * 5));
  const creditScore = Math.max(0, Math.min(15, 30 - row.metrics.costTotalCredit / 10000));
  const dscrScore = Math.max(0, Math.min(10, row.metrics.dscr * 5));
  return Math.round(cashflowScore + yieldScore + creditScore + dscrScore);
};

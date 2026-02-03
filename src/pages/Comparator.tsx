import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { usePortfolioStore } from '../store/portfolioStore';
import { calculateApartmentMetrics } from '../services/calculations/calculations';
import { formatCurrency, formatNumber } from '../utils/format/currency';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';

const columns = [
  { key: 'name', label: 'Appartement' },
  { key: 'netYieldPercent', label: 'Rendement net %' },
  { key: 'grossYieldPercent', label: 'Rendement brut %' },
  { key: 'cashFlowMonth', label: 'Cashflow mensuel' },
  { key: 'monthlyPayment', label: 'Mensualité' },
  { key: 'totalRevenues', label: 'Revenus annuels' },
  { key: 'totalCharges', label: 'Charges annuelles' },
];

type SortKey = (typeof columns)[number]['key'];

type Row = {
  id: string;
  name: string;
  netYieldPercent: number;
  grossYieldPercent: number;
  cashFlowMonth: number;
  monthlyPayment: number;
  totalRevenues: number;
  totalCharges: number;
};

export const Comparator = () => {
  const { apartments } = usePortfolioStore();
  const [sortKey, setSortKey] = useState<SortKey>('netYieldPercent');
  const [sortAsc, setSortAsc] = useState(false);

  const rows: Row[] = useMemo(
    () =>
      apartments.map((apt) => {
        const m = calculateApartmentMetrics(apt);
        return {
          id: apt.id,
          name: apt.name,
          netYieldPercent: m.netYieldPercent,
          grossYieldPercent: m.grossYieldPercent,
          cashFlowMonth: m.cashFlowMonth,
          monthlyPayment: m.monthlyPayment,
          totalRevenues: m.totalRevenues,
          totalCharges: m.totalCharges,
        };
      }),
    [apartments]
  );

  const sorted = useMemo(() => {
    const data = [...rows];
    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'string' || typeof vb === 'string') {
        return String(va).localeCompare(String(vb));
      }
      return sortAsc ? Number(va) - Number(vb) : Number(vb) - Number(va);
    });
    return data;
  }, [rows, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Comparateur"
        description="Comparez facilement les biens pour prendre une décision rapide."
      />

      <SectionCard
        title="Tableau comparatif"
        description="Cliquez sur les en-têtes pour trier les résultats."
      >
        <Card variant="outlined">
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <TableSortLabel
                        active={sortKey === col.key}
                        direction={sortAsc ? 'asc' : 'desc'}
                        onClick={() => handleSort(col.key)}
                      >
                        {col.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sorted.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{formatNumber(row.netYieldPercent)} %</TableCell>
                    <TableCell>{formatNumber(row.grossYieldPercent)} %</TableCell>
                    <TableCell>{formatCurrency(row.cashFlowMonth)}</TableCell>
                    <TableCell>{formatCurrency(row.monthlyPayment)}</TableCell>
                    <TableCell>{formatCurrency(row.totalRevenues)}</TableCell>
                    <TableCell>{formatCurrency(row.totalCharges)}</TableCell>
                  </TableRow>
                ))}
                {sorted.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <Typography color="text.secondary">
                        Aucun appartement à comparer pour l’instant.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </SectionCard>
    </Stack>
  );
};

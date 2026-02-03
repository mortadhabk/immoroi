import { Card, CardContent, Grid, Typography } from '@mui/material';
import type { ApartmentMetrics } from '../services/calculations/calculations';
import { formatCurrency, formatNumber } from '../utils/format/currency';

export const ResultsPanel = ({ metrics }: { metrics: ApartmentMetrics }) => {
  const items = [
    { label: 'Montant emprunté', value: formatCurrency(metrics.loanAmount) },
    { label: 'Taux annuel appliqué', value: `${formatNumber(metrics.annualRate * 100)} %` },
    { label: 'Mensualité', value: formatCurrency(metrics.monthlyPayment) },
    { label: 'Intérêts totaux', value: formatCurrency(metrics.totalInterest) },
    { label: 'Coût total avec prêt', value: formatCurrency(metrics.totalCostWithLoan) },
    { label: 'Coût acquisition + travaux', value: formatCurrency(metrics.totalPlusWorks) },
    { label: 'Revenus annuels', value: formatCurrency(metrics.totalRevenues) },
    { label: 'Charges annuelles', value: formatCurrency(metrics.totalCharges) },
    { label: 'Rendement brut', value: `${formatNumber(metrics.grossYieldPercent)} %` },
    { label: 'Rendement net', value: `${formatNumber(metrics.netYieldPercent)} %` },
    { label: 'Cashflow mensuel', value: formatCurrency(metrics.cashFlowMonth) },
    { label: 'Gain brut mensuel', value: formatCurrency(metrics.gainBrutMensuel) },
  ];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Résultats
        </Typography>
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.label}>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                {item.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

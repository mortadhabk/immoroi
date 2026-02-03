import { Grid, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PercentIcon from '@mui/icons-material/Percent';
import { KpiCard } from '../KpiCard';
import { SectionCard } from '../layout/SectionCard';

export type KPISectionProps = {
  revenuesAnnual: string;
  revenuesMonthly: string;
  chargesAnnual: string;
  monthlyLoans: string;
  cashflowMonthly: string;
  cashflowAnnual: string;
  grossYield: string;
  netYield: string;
  irr: string;
  cashflowPositive: boolean;
};

export const KPISection = ({
  revenuesAnnual,
  revenuesMonthly,
  chargesAnnual,
  monthlyLoans,
  cashflowMonthly,
  cashflowAnnual,
  grossYield,
  netYield,
  irr,
  cashflowPositive,
}: KPISectionProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <SectionCard title="Revenus">
          <Stack spacing={2}>
            <KpiCard
              title="Revenus locatifs annuels"
              value={revenuesAnnual}
              subtitle="Total portefeuille"
              icon={<PaymentsIcon color="primary" />}
              tooltip="Somme des loyers annuels de tous vos biens."
            />
            <KpiCard
              title="Revenus mensuels moyens"
              value={revenuesMonthly}
              subtitle="Moyenne estimée"
              icon={<TrendingUpIcon color="primary" />}
              tooltip="Revenus annuels divisés par 12."
            />
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={3}>
        <SectionCard title="Charges">
          <Stack spacing={2}>
            <KpiCard
              title="Charges annuelles"
              value={chargesAnnual}
              subtitle="Taxes + entretien"
              icon={<ReceiptLongIcon color="primary" />}
              tooltip="Somme des charges annuelles renseignées."
            />
            <KpiCard
              title="Mensualités de crédit"
              value={monthlyLoans}
              subtitle="Prêts actifs"
              icon={<CreditCardIcon color="primary" />}
              tooltip="Somme des mensualités calculées pour tous les prêts."
            />
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={3}>
        <SectionCard title="Cashflow">
          <Stack spacing={2}>
            <KpiCard
              title="Cashflow mensuel total"
              value={cashflowMonthly}
              subtitle={cashflowPositive ? 'Cashflow positif' : 'Cashflow négatif'}
              icon={<AccountBalanceWalletIcon color={cashflowPositive ? 'success' : 'warning'} />}
              tooltip="Revenus mensuels - charges mensuelles estimées."
            />
            <KpiCard
              title="Cashflow annuel"
              value={cashflowAnnual}
              subtitle="Avant impôts"
              icon={<AccountBalanceWalletIcon color="primary" />}
              tooltip="Cashflow mensuel x 12."
            />
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={3}>
        <SectionCard title="Rendements">
          <Stack spacing={2}>
            <KpiCard
              title="Rendement brut moyen"
              value={grossYield}
              subtitle="% annuel"
              icon={<PercentIcon color="primary" />}
              tooltip="Revenus annuels / coût total d'acquisition."
            />
            <KpiCard
              title="Rendement net moyen"
              value={netYield}
              subtitle="Après charges"
              icon={<PercentIcon color="primary" />}
              tooltip="(Revenus annuels - charges) / coût total."
            />
            <KpiCard
              title="TRI estimé"
              value={irr}
              subtitle="Projection simple"
              icon={<PercentIcon color="primary" />}
              tooltip="Indication simplifiée basée sur rendement net."
            />
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );
};

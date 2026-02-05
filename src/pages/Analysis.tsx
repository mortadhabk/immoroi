import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePortfolioStore } from '../store/portfolioStore';
import { computeInvestmentMetrics, getMissingEssentials, isEssentialsCompleted } from '../services/calculations/calculations';
import { formatCurrency, formatNumber } from '../utils/format/currency';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';

const percent = (v: number) => `${formatNumber(v)} %`;

export const Analysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apartments } = usePortfolioStore();
  const apartment = apartments.find((a) => a.id === id);
  const [scenarioTab, setScenarioTab] = useState(1);

  if (!apartment) {
    return (
      <Stack spacing={2}>
        <Typography>Bien introuvable.</Typography>
        <Button variant="contained" onClick={() => navigate('/portfolio')}>
          Retour au portfolio
        </Button>
      </Stack>
    );
  }

  const essentialsOk = isEssentialsCompleted(apartment);
  const missing = getMissingEssentials(apartment);

  const scenarioOptions = [
    { vacancyRate: 0.08, rentMultiplier: 0.95, chargesMultiplier: 1.1 },
    { vacancyRate: 0, rentMultiplier: 1, chargesMultiplier: 1 },
    { vacancyRate: 0.02, rentMultiplier: 1.05, chargesMultiplier: 0.95 },
  ];

  const metrics = useMemo(
    () => computeInvestmentMetrics(apartment, scenarioOptions[scenarioTab]),
    [apartment, scenarioTab]
  );

  if (!essentialsOk) {
    return (
      <Stack spacing={3}>
        <PageHeader
          title="Analyse complète"
          description="Analyse indisponible tant que les informations essentielles ne sont pas complétées."
        />
        <SectionCard title="Analyse indisponible" description="Complétez les champs suivants pour débloquer l’analyse.">
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {missing.map((field) => (
                <Chip key={field.key} label={field.label} variant="outlined" />
              ))}
            </Stack>
            <Button variant="contained" onClick={() => navigate(`/appartement/${apartment.id}`)}>
              Compléter le bien
            </Button>
          </Stack>
        </SectionCard>
      </Stack>
    );
  }

  return (
    <Stack spacing={4}>
      <PageHeader
        title={`Analyse complète — ${apartment.name}`}
        description="Toutes les statistiques clés pour décider."
        actions={
          <Button variant="outlined" onClick={() => navigate(`/appartement/${apartment.id}`)}>
            Revenir au bien
          </Button>
        }
      />

      <SectionCard title="Vue d’ensemble" description="KPI clés orientés investisseur.">
        <Grid container spacing={2}>
          {[
            { label: 'Cashflow net mensuel', value: formatCurrency(metrics.cashFlowMonthAfterDebt) },
            { label: 'Rendement net / brut', value: `${percent(metrics.netYieldPercent)} · ${percent(metrics.grossYieldPercent)}` },
            { label: 'Coût total du crédit', value: formatCurrency(metrics.costTotalCredit) },
            { label: 'Surplus / effort mensuel', value: formatCurrency(metrics.cashFlowMonthAfterDebt) },
          ].map((kpi) => (
            <Grid item xs={12} sm={6} md={3} key={kpi.label}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    {kpi.label}
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {kpi.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </SectionCard>

      <SectionCard title="Financement" description="Mensualité, intérêts, coût total du crédit.">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Mensualité</Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.monthlyPayment)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Intérêts totaux</Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.totalInterest)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Coût total crédit</Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.costTotalCredit)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Apport / Emprunt</Typography>
            <Typography fontWeight={700}>
              {formatCurrency(apartment.downPayment)} / {formatCurrency(metrics.loanAmount)}
            </Typography>
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Revenus & Charges" description="Vision annuelle complète.">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Revenus annuels</Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.totalRevenues)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Charges annuelles</Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.totalCharges)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">
              NOI annuel
              <Tooltip title="Revenus annuels – charges d’exploitation (hors dette).">
                <HelpOutlineIcon fontSize="inherit" sx={{ ml: 0.5 }} />
              </Tooltip>
            </Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.noi)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">
              DSCR
              <Tooltip title="NOI / annuité de dette.">
                <HelpOutlineIcon fontSize="inherit" sx={{ ml: 0.5 }} />
              </Tooltip>
            </Typography>
            <Typography fontWeight={700}>{formatNumber(metrics.dscr)}</Typography>
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Cashflow & performance" description="Point mort et performance après dette.">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Cashflow annuel net</Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.cashFlowYearAfterDebt)}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">
              Point mort loyer
              <Tooltip title="Loyer mensuel minimum pour cashflow = 0.">
                <HelpOutlineIcon fontSize="inherit" sx={{ ml: 0.5 }} />
              </Tooltip>
            </Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.breakEvenRentMonthly)}</Typography>
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Sensibilité" description="Impact rapide sur le cashflow mensuel.">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Taux +0,5</Typography>
            <Typography fontWeight={700}>
              {formatCurrency(computeInvestmentMetrics(apartment, { rateDelta: 0.005 }).cashFlowMonthAfterDebt)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Taux +1,0</Typography>
            <Typography fontWeight={700}>
              {formatCurrency(computeInvestmentMetrics(apartment, { rateDelta: 0.01 }).cashFlowMonthAfterDebt)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Loyer -5%</Typography>
            <Typography fontWeight={700}>
              {formatCurrency(computeInvestmentMetrics(apartment, { rentMultiplier: 0.95 }).cashFlowMonthAfterDebt)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="text.secondary">Loyer +5%</Typography>
            <Typography fontWeight={700}>
              {formatCurrency(computeInvestmentMetrics(apartment, { rentMultiplier: 1.05 }).cashFlowMonthAfterDebt)}
            </Typography>
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Scénarios" description="Conservateur, réaliste et optimiste.">
        <Tabs value={scenarioTab} onChange={(_, v) => setScenarioTab(v)}>
          <Tab label="Conservateur" />
          <Tab label="Réaliste" />
          <Tab label="Optimiste" />
        </Tabs>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">Cashflow net</Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.cashFlowMonthAfterDebt)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">NOI annuel</Typography>
            <Typography fontWeight={700}>{formatCurrency(metrics.noi)}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="text.secondary">DSCR</Typography>
            <Typography fontWeight={700}>{formatNumber(metrics.dscr)}</Typography>
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Graphiques" description="Breakdown mensuel simple.">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {[
            { label: 'Loyer', value: metrics.monthlyRentEffective, color: 'rgba(26,79,216,0.7)' },
            { label: 'Charges', value: -(metrics.totalCharges / 12), color: 'rgba(220,38,38,0.6)' },
            { label: 'Crédit', value: -metrics.monthlyPayment, color: 'rgba(59,130,246,0.5)' },
            { label: 'Net', value: metrics.cashFlowMonthAfterDebt, color: 'rgba(34,197,94,0.7)' },
          ].map((item) => (
            <Card key={item.label} variant="outlined">
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography fontWeight={700}>{formatCurrency(item.value)}</Typography>
                <Box sx={{ height: 6, borderRadius: 999, bgcolor: item.color, mt: 1 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </SectionCard>
    </Stack>
  );
};

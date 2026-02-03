import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNextStep } from 'nextstepjs';
import { usePortfolioStore } from '../store/portfolioStore';
import { calculateApartmentMetrics, calculatePortfolioKpis } from '../services/calculations/calculations';
import { KpiCard } from '../components/KpiCard';
import { formatCurrency, formatNumber } from '../utils/format/currency';
import { hasSeenTour, markTourSeen } from '../utils/onboarding';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { EmptyState } from '../components/EmptyState';

export const Dashboard = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { startNextStep } = useNextStep();
  const {
    apartments,
    addApartment,
    deleteApartment,
    duplicateApartment,
    importPortfolio,
  } = usePortfolioStore();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const kpis = useMemo(() => calculatePortfolioKpis(apartments), [apartments]);

  const chartData = useMemo(
    () =>
      apartments.map((apt) => {
        const metrics = calculateApartmentMetrics(apt);
        return {
          name: apt.name,
          netYield: metrics.netYieldPercent,
          cashFlow: metrics.cashFlowMonth,
        };
      }),
    [apartments]
  );

  const exportJson = () => {
    const data = JSON.stringify(apartments, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    if (Array.isArray(data)) {
      importPortfolio(data);
    }
  };

  useEffect(() => {
    if (!hasSeenTour() && apartments.length > 0) {
      const timer = setTimeout(() => {
        startNextStep('mainTour');
        markTourSeen();
      }, 400);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [apartments.length, startNextStep]);

  const openMenu = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchor(event.currentTarget);
    setSelectedId(id);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedId(null);
  };

  return (
    <Stack spacing={4}>
      <PageHeader
        title="Portfolio immobilier"
        description="Vue d'ensemble de la rentabilité et des cashflows."
        actions={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' }, alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            <Button
              id="action-add-apt"
              variant="contained"
              startIcon={<AddIcon />}
              fullWidth
              onClick={() => {
                const id = addApartment();
                navigate(`/appartement/${id}`);
              }}
            >
              Ajouter un appartement
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportJson} fullWidth>
              Export JSON
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => inputRef.current?.click()}
              fullWidth
            >
              Import JSON
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="application/json"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void importJson(file);
              }}
            />
          </Stack>
        }
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard title="Revenus annuels" value={formatCurrency(kpis.totalRevenues)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard title="Charges annuelles" value={formatCurrency(kpis.totalCharges)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard title="Cashflow annuel" value={formatCurrency(kpis.cashFlowYear)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard title="Mensualités totales" value={formatCurrency(kpis.totalMonthlyPayments)} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard title="Rendement brut moyen" value={`${formatNumber(kpis.avgGrossYield)} %`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KpiCard title="Rendement net moyen" value={`${formatNumber(kpis.avgNetYield)} %`} />
        </Grid>
      </Grid>

      <SectionCard
        title="Vos appartements"
        description="Cliquez sur “Remplir les étapes” pour modifier un bien."
      >
        <Grid container spacing={3}>
          {apartments.length === 0 && (
            <Grid item xs={12}>
              <EmptyState
                title="Aucun appartement pour l’instant"
                description="Ajoutez un premier bien pour démarrer vos calculs."
                action={
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    fullWidth
                    onClick={() => {
                      const id = addApartment();
                      navigate(`/appartement/${id}`);
                    }}
                  >
                    Ajouter un appartement
                  </Button>
                }
              />
            </Grid>
          )}
          {apartments.map((apt, index) => {
            const metrics = calculateApartmentMetrics(apt);
            return (
              <Grid item xs={12} md={6} key={apt.id}>
                <Card variant="outlined" id={index === 0 ? 'portfolio-first-card' : undefined}>
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" fontWeight={700}>
                            {apt.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {apt.city} {apt.postalCode}
                          </Typography>
                        </Box>
                        <IconButton
                          aria-label="Plus d'actions"
                          onClick={(e) => openMenu(e, apt.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Stack>

                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Rendement net
                          </Typography>
                          <Typography fontWeight={700}>
                            {formatNumber(metrics.netYieldPercent)} %
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Cashflow mensuel
                          </Typography>
                          <Typography fontWeight={700}>
                            {formatCurrency(metrics.cashFlowMonth)}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <Button
                          id={index === 0 ? 'portfolio-edit-button' : undefined}
                          variant="contained"
                          fullWidth
                          onClick={() => navigate(`/appartement/${apt.id}`)}
                        >
                          Remplir les étapes
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<ContentCopyIcon />}
                          fullWidth
                          onClick={() => duplicateApartment(apt.id)}
                        >
                          Copier ce bien
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </SectionCard>

      <SectionCard
        title="Comparaison rapide"
        description="Repérez rapidement les biens les plus performants."
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card id="chart-net-yield" variant="outlined" sx={{ height: 360 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Rendement net % par appartement
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <Tooltip formatter={(v: number) => `${formatNumber(v)} %`} />
                    <Bar dataKey="netYield" fill="#1b5e20" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: 360 }}>
              <CardContent sx={{ height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Cashflow mensuel par appartement
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" hide />
                    <YAxis />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="cashFlow" fill="#0d47a1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </SectionCard>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            if (selectedId) duplicateApartment(selectedId);
            closeMenu();
          }}
        >
          Copier ce bien
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedId) deleteApartment(selectedId);
            closeMenu();
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <DeleteOutline color="error" fontSize="small" />
            <span>Supprimer</span>
          </Stack>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

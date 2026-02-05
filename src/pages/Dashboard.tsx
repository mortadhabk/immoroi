import { useEffect, useMemo, useState } from 'react';
import { Button, Menu, MenuItem, Stack, Typography, Card, CardContent } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useNavigate } from 'react-router-dom';
import { useNextStep } from 'nextstepjs';
import { usePortfolioStore } from '../store/portfolioStore';
import { calculateApartmentMetrics, calculatePortfolioKpis } from '../services/calculations/calculations';
import { formatCurrency, formatNumber } from '../utils/format/currency';
import { hasSeenTour, markTourSeen } from '../utils/onboarding';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { EmptyState } from '../components/EmptyState';
import { PropertyList } from '../components/portfolio/PropertyList';
import { AnalyticsCharts } from '../components/portfolio/AnalyticsCharts';
import { completionFor } from '../components/portfolio/utils';
import type { ApartmentWithMetrics } from '../components/portfolio/types';
import { KpiCard } from '../components/KpiCard';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { startNextStep } = useNextStep();
  const {
    apartments,
    addApartment,
    deleteApartment,
    duplicateApartment,
  } = usePortfolioStore();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cashflowFilter, setCashflowFilter] = useState('all');
  const [yieldFilter, setYieldFilter] = useState('all');
  const [sortKey, setSortKey] = useState('updated');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const kpis = useMemo(() => calculatePortfolioKpis(apartments), [apartments]);

  const items: ApartmentWithMetrics[] = useMemo(
    () =>
      apartments.map((apartment) => ({
        apartment,
        metrics: calculateApartmentMetrics(apartment),
        completion: completionFor(apartment),
      })),
    [apartments]
  );

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

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch =
          item.apartment.name.toLowerCase().includes(search.toLowerCase()) ||
          item.apartment.city.toLowerCase().includes(search.toLowerCase());
        const isComplete = item.completion.filled === item.completion.total;
        const matchesStatus =
          statusFilter === 'all'
            ? true
            : statusFilter === 'complete'
            ? isComplete
            : !isComplete;
        const matchesCashflow =
          cashflowFilter === 'all'
            ? true
            : cashflowFilter === 'positive'
            ? item.metrics.cashFlowMonth >= 0
            : item.metrics.cashFlowMonth < 0;
        const matchesYield =
          yieldFilter === 'all'
            ? true
            : yieldFilter === 'low'
            ? item.metrics.netYieldPercent < 3
            : yieldFilter === 'mid'
            ? item.metrics.netYieldPercent >= 3 && item.metrics.netYieldPercent < 6
            : item.metrics.netYieldPercent >= 6;
        return matchesSearch && matchesStatus && matchesCashflow && matchesYield;
      })
      .sort((a, b) => {
        if (sortKey === 'yield') return b.metrics.netYieldPercent - a.metrics.netYieldPercent;
        if (sortKey === 'cashflow') return b.metrics.cashFlowMonth - a.metrics.cashFlowMonth;
        return new Date(b.apartment.updatedAt).getTime() - new Date(a.apartment.updatedAt).getTime();
      });
  }, [items, search, statusFilter, cashflowFilter, yieldFilter, sortKey]);

  const stats = useMemo(() => {
    const revenuesAnnual = kpis.totalRevenues;
    const revenuesMonthly = revenuesAnnual / 12;
    const cashflowAnnual = kpis.cashFlowYear;
    const cashflowMonthly = cashflowAnnual / 12;
    const grossYield = kpis.avgGrossYield;
    const netYield = kpis.avgNetYield;
    return {
      revenuesAnnual,
      revenuesMonthly,
      cashflowAnnual,
      cashflowMonthly,
      grossYield,
      netYield,
    };
  }, [kpis]);


  const nextAction = useMemo(() => {
    const firstIncomplete = items.find((item) => item.completion.missing.length > 0);
    if (!firstIncomplete) {
      return apartments.length === 0
        ? 'Ajoutez votre premier bien pour démarrer.'
        : 'Tout est prêt. Analysez vos performances.';
    }
    const missingCount = firstIncomplete.completion.missing.length;
    return `Il vous manque ${missingCount} informations pour calculer vos rendements.`;
  }, [items, apartments.length]);

  const visibleItems = filteredItems.slice(0, 7);
  const cashflowData = visibleItems.map((item) => ({
    name: item.apartment.name || 'Bien',
    value: item.metrics.cashFlowMonth,
  }));
  const yieldData = visibleItems.map((item) => ({
    name: item.apartment.name || 'Bien',
    value: item.metrics.netYieldPercent,
  }));

  const formatPercent = (value: number) => `${formatNumber(value)} %`;

  return (
    <Stack spacing={4}>
      <PageHeader
        title="Votre portfolio immobilier"
        description="Vue globale de votre rentabilité et cashflow."
        actions={
          <Button
            variant="contained"
            onClick={() => {
              const id = addApartment();
              navigate(`/appartement/${id}`);
            }}
          >
            Ajouter un bien
          </Button>
        }
      />

      <SectionCard title="KPI globaux" description="Indicateurs clés au-dessus de la ligne de flottaison.">
        <Stack
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          <KpiCard
            title="Cashflow mensuel total"
            value={formatCurrency(stats.cashflowMonthly)}
            subtitle="Après charges"
          />
          <KpiCard
            title="Rendement net moyen"
            value={formatPercent(stats.netYield)}
            subtitle="Moyenne portefeuille"
          />
          <KpiCard
            title="Nombre de biens"
            value={String(apartments.length)}
            subtitle="Biens actifs"
          />
          <KpiCard
            title="% de biens complets"
            value={`${items.length === 0 ? 0 : Math.round((items.filter((i) => i.completion.filled === i.completion.total).length / items.length) * 100)} %`}
            subtitle="Données complètes"
          />
        </Stack>
      </SectionCard>


      <SectionCard title="Vos biens" description="Focus sur les biens à fort impact.">
        {apartments.length === 0 ? (
          <EmptyState
            title="Votre portfolio est vide"
            description="Ajoutez votre premier bien pour commencer l’analyse."
            action={
              <Button
                variant="contained"
                onClick={() => {
                  const id = addApartment();
                  navigate(`/appartement/${id}`);
                }}
              >
                Ajouter mon premier bien
              </Button>
            }
          />
        ) : (
          <PropertyList
            items={visibleItems}
            search={search}
            onSearch={setSearch}
            statusFilter={statusFilter}
            onStatusFilter={setStatusFilter}
            cashflowFilter={cashflowFilter}
            onCashflowFilter={setCashflowFilter}
            yieldFilter={yieldFilter}
            onYieldFilter={setYieldFilter}
            sortKey={sortKey}
            onSortKey={setSortKey}
            viewMode={viewMode}
            onViewMode={setViewMode}
            onPrimary={(id) => navigate(`/appartement/${id}`)}
            onDuplicate={(id) => duplicateApartment(id)}
            onMenu={(event, id) => openMenu(event, id)}
            emptyAction={
              <Button
                variant="contained"
                onClick={() => {
                  const id = addApartment();
                  navigate(`/appartement/${id}`);
                }}
              >
                Ajouter un bien
              </Button>
            }
            formatCurrency={formatCurrency}
            formatPercent={formatPercent}
          />
        )}
      </SectionCard>

      <SectionCard title="Comparaison des cashflows mensuels" description="Analyse des biens affichés.">
        {visibleItems.length === 0 ? (
          <EmptyState
            title="Aucune donnée à afficher"
            description="Ajoutez un bien pour générer les graphiques."
          />
        ) : (
          <AnalyticsCharts
            cashflowData={cashflowData}
            yieldData={yieldData}
            formatCurrency={formatCurrency}
            formatPercent={(value) => formatPercent(value)}
          />
        )}
      </SectionCard>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            if (selectedId) duplicateApartment(selectedId);
            closeMenu();
          }}
        >
          Dupliquer
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

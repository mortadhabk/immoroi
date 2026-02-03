import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
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
import { PortfolioHeader } from '../components/portfolio/PortfolioHeader';
import { KPISection } from '../components/portfolio/KPISection';
import { InsightsPanel } from '../components/portfolio/InsightsPanel';
import { PropertyList } from '../components/portfolio/PropertyList';
import { AnalyticsCharts } from '../components/portfolio/AnalyticsCharts';
import { completionFor } from '../components/portfolio/utils';
import type { ApartmentWithMetrics } from '../components/portfolio/types';

const MARKET_AVG = 3;

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

  const insights = useMemo(() => {
    if (items.length === 0) {
      return {
        negativeCount: 0,
        bestLabel: 'Aucun bien',
        bestValue: '0 €',
        marketComparison: 'Ajoutez un bien pour obtenir une comparaison.',
        optimizationTip: 'Commencez par renseigner les revenus et charges.',
      };
    }
    const negativeCount = items.filter((item) => item.metrics.cashFlowMonth < 0).length;
    const best = [...items].sort((a, b) => b.metrics.cashFlowMonth - a.metrics.cashFlowMonth)[0];
    const marketComparison =
      stats.netYield >= MARKET_AVG
        ? `Votre rendement net moyen est supérieur à la moyenne du marché (${MARKET_AVG} %).`
        : `Votre rendement net moyen est inférieur à la moyenne du marché (${MARKET_AVG} %).`;
    const highestCharges = [...items].sort((a, b) => b.metrics.totalCharges - a.metrics.totalCharges)[0];
    const optimizationTip = highestCharges
      ? `Opportunité : réduire les charges sur ${highestCharges.apartment.name || 'un bien'} pour améliorer le net.`
      : 'Opportunité : optimisez les charges pour améliorer le rendement.';
    return {
      negativeCount,
      bestLabel: best.apartment.name || 'Votre meilleur bien',
      bestValue: formatCurrency(best.metrics.cashFlowMonth),
      marketComparison,
      optimizationTip,
    };
  }, [items, stats.netYield]);

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

  const stepsStatus = [apartments.length > 0, items.some((item) => item.completion.missing.length === 0), items.length > 1];

  const cashflowData = items.map((item) => ({
    name: item.apartment.name || 'Bien',
    value: item.metrics.cashFlowMonth,
  }));
  const yieldData = items.map((item) => ({
    name: item.apartment.name || 'Bien',
    value: item.metrics.netYieldPercent,
  }));
  const breakdownData = [
    { name: 'Revenus', value: kpis.totalRevenues },
    { name: 'Charges', value: kpis.totalCharges },
  ];

  const formatPercent = (value: number) => `${formatNumber(value)} %`;

  return (
    <Stack spacing={4}>
      <PortfolioHeader nextAction={nextAction} stepsStatus={stepsStatus} onAdd={() => {
        const id = addApartment();
        navigate(`/appartement/${id}`);
      }} />

      <PageHeader
        title="Statistiques globales"
        description="Vue synthétique de la performance de votre patrimoine."
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportJson}>
              Export JSON
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => inputRef.current?.click()}
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

 

      <SectionCard title="Insights Portfolio" description="Messages clés pour passer à l’action.">
        <InsightsPanel
          negativeCashflowCount={insights.negativeCount}
          bestPropertyLabel={insights.bestLabel}
          bestPropertyValue={insights.bestValue}
          marketComparison={insights.marketComparison}
          optimizationTip={insights.optimizationTip}
        />
      </SectionCard>

      <SectionCard title="Vos biens" description="Gestion simple et rapide de votre patrimoine.">
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
            items={filteredItems}
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

      <SectionCard title="Analyse visuelle" description="Comparez vos biens en un coup d’œil.">
        {items.length === 0 ? (
          <EmptyState
            title="Aucune donnée à afficher"
            description="Ajoutez un bien pour générer les graphiques."
          />
        ) : (
          <AnalyticsCharts
            cashflowData={cashflowData}
            yieldData={yieldData}
            breakdownData={breakdownData}
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

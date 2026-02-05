import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { PropertyCard } from './PropertyCard';
import type { ApartmentWithMetrics } from './types';
import { EmptyState } from '../EmptyState';

export type PropertyListProps = {
  items: ApartmentWithMetrics[];
  search: string;
  onSearch: (value: string) => void;
  statusFilter: string;
  onStatusFilter: (value: string) => void;
  cashflowFilter: string;
  onCashflowFilter: (value: string) => void;
  yieldFilter: string;
  onYieldFilter: (value: string) => void;
  sortKey: string;
  onSortKey: (value: string) => void;
  viewMode: 'grid' | 'table';
  onViewMode: (value: 'grid' | 'table') => void;
  onPrimary: (id: string) => void;
  onDuplicate: (id: string) => void;
  onMenu: (event: React.MouseEvent<HTMLElement>, id: string) => void;
  emptyAction: React.ReactNode;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
};

export const PropertyList = ({
  items,
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  cashflowFilter,
  onCashflowFilter,
  yieldFilter,
  onYieldFilter,
  sortKey,
  onSortKey,
  viewMode,
  onViewMode,
  onPrimary,
  onDuplicate,
  onMenu,
  emptyAction,
  formatCurrency,
  formatPercent,
}: PropertyListProps) => {
  return (
    <Stack spacing={2}>
      <Grid container spacing={1} alignItems="center" sx={{ mx: { xs: -0.5, sm: 0 } }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Rechercher"
            placeholder="Nom ou ville"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Statut</InputLabel>
            <Select value={statusFilter} label="Statut" onChange={(e) => onStatusFilter(e.target.value)}>
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="complete">Complet</MenuItem>
              <MenuItem value="incomplete">Incomplet</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Cashflow</InputLabel>
            <Select value={cashflowFilter} label="Cashflow" onChange={(e) => onCashflowFilter(e.target.value)}>
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="positive">Positif</MenuItem>
              <MenuItem value="negative">Négatif</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Rendement</InputLabel>
            <Select value={yieldFilter} label="Rendement" onChange={(e) => onYieldFilter(e.target.value)}>
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="low">Faible</MenuItem>
              <MenuItem value="mid">Moyen</MenuItem>
              <MenuItem value="high">Élevé</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Trier</InputLabel>
            <Select value={sortKey} label="Trier" onChange={(e) => onSortKey(e.target.value)}>
              <MenuItem value="updated">Dernière modification</MenuItem>
              <MenuItem value="yield">Rendement net</MenuItem>
              <MenuItem value="cashflow">Cashflow mensuel</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <ToggleButtonGroup
            fullWidth
            value={viewMode}
            exclusive
            onChange={(_, value) => value && onViewMode(value)}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      <Divider sx={{ mx: { xs: -0.5, sm: 0 } }} />

      {items.length === 0 && (
        <EmptyState
          title="Aucun bien trouvé"
          description="Modifiez vos filtres ou ajoutez un nouveau bien."
          action={emptyAction}
        />
      )}

      {viewMode === 'grid' && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            gap: 3,
            mx: { xs: -0.5, sm: 0 },
          }}
        >
          {items.map((item) => {
            const isComplete = item.completion.filled === item.completion.total;
            return (
              <PropertyCard
                key={item.apartment.id}
                name={item.apartment.name || 'Nouveau bien'}
                location={item.apartment.city || 'Ville à renseigner'}
                completionLabel={`Complétude : ${item.completion.filled}/${item.completion.total}`}
                completionRatio={item.completion.ratio}
                statusLabel={isComplete ? 'Complet' : 'Incomplet'}
                statusColor={isComplete ? 'success' : 'warning'}
                netYield={formatPercent(item.metrics.netYieldPercent)}
                cashflow={formatCurrency(item.metrics.cashFlowMonth)}
                cashflowPositive={item.metrics.cashFlowMonth >= 0}
                primaryLabel={isComplete ? 'Voir l’analyse' : 'Continuer la saisie'}
                onPrimary={() => onPrimary(item.apartment.id)}
                onDuplicate={() => onDuplicate(item.apartment.id)}
                onMenu={(event) => onMenu(event, item.apartment.id)}
                helper={
                  item.completion.missing.length > 0
                    ? `À compléter : ${item.completion.missing.slice(0, 2).join(', ')}`
                    : undefined
                }
              />
            );
          })}
        </Box>
      )}

      {viewMode === 'table' && (
        <Stack spacing={2}>
          {items.map((item) => {
            const isComplete = item.completion.filled === item.completion.total;
            return (
              <Box key={item.apartment.id}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight={700}>{item.apartment.name || 'Nouveau bien'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.apartment.city || 'Ville à renseigner'}
                    </Typography>
                  </Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flex: 2 }}>
                    <Typography>Rendement net: {formatPercent(item.metrics.netYieldPercent)}</Typography>
                    <Typography>Cashflow: {formatCurrency(item.metrics.cashFlowMonth)}</Typography>
                    <Typography>Complétude: {item.completion.filled}/{item.completion.total}</Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button variant="contained" onClick={() => onPrimary(item.apartment.id)}>
                      {isComplete ? 'Voir l’analyse' : 'Continuer la saisie'}
                    </Button>
                    <Button variant="outlined" onClick={() => onDuplicate(item.apartment.id)}>
                      Dupliquer
                    </Button>
                  </Stack>
                </Stack>
                <Divider sx={{ mt: 2 }} />
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

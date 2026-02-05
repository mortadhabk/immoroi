import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useNavigate } from 'react-router-dom';
import { usePortfolioStore } from '../store/portfolioStore';
import { formatCurrency, formatNumber } from '../utils/format/currency';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { buildComparatorRows, applyComparatorFilters, computeScore } from './comparatorUtils';

export const Comparator = () => {
  const { apartments } = usePortfolioStore();
  const navigate = useNavigate();
  const [objective, setObjective] = useState<'cashflow' | 'yield' | 'credit'>('cashflow');
  const [sortKey, setSortKey] = useState<'score' | 'netYield' | 'cashflow' | 'credit'>('score');
  const [sortAsc, setSortAsc] = useState(false);
  const [showCompleteOnly, setShowCompleteOnly] = useState(true);
  const [status, setStatus] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [city, setCity] = useState('');
  const [cashflowFilter, setCashflowFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [minNetYield, setMinNetYield] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const rows = useMemo(() => buildComparatorRows(apartments), [apartments]);
  const cities = useMemo(() => Array.from(new Set(rows.map((r) => r.city))).sort(), [rows]);

  const filtered = useMemo(() => {
    return applyComparatorFilters(rows, {
      showCompleteOnly,
      status,
      city,
      cashflow: cashflowFilter,
      minNetYield,
    });
  }, [rows, showCompleteOnly, status, city, cashflowFilter, minNetYield]);

  const sorted = useMemo(() => {
    const data = [...filtered];
    data.sort((a, b) => {
      const scoreA = computeScore(a);
      const scoreB = computeScore(b);
      const valueA =
        sortKey === 'score'
          ? scoreA
          : sortKey === 'cashflow'
          ? a.metrics.cashFlowMonthAfterDebt
          : sortKey === 'credit'
          ? a.metrics.costTotalCredit
          : a.metrics.netYieldPercent;
      const valueB =
        sortKey === 'score'
          ? scoreB
          : sortKey === 'cashflow'
          ? b.metrics.cashFlowMonthAfterDebt
          : sortKey === 'credit'
          ? b.metrics.costTotalCredit
          : b.metrics.netYieldPercent;
      return sortAsc ? valueA - valueB : valueB - valueA;
    });
    return data;
  }, [filtered, sortKey, sortAsc]);

  const updateObjective = (value: 'cashflow' | 'yield' | 'credit') => {
    setObjective(value);
    if (value === 'credit') {
      setSortKey('credit');
      setSortAsc(true);
    } else {
      setSortKey(value === 'yield' ? 'netYield' : 'cashflow');
      setSortAsc(false);
    }
  };

  const handleSelect = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const selectedRows = sorted.filter((row) => selected.includes(row.id));
  const topChoiceId = sorted.find((row) => row.isComplete)?.id ?? null;

  return (
    <Stack spacing={4}>
 
      <SectionCard title="Tableau comparatif" description="Comparez les biens sur les critères clés.">
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Sélectionnez 2 à 4 biens pour la comparaison détaillée.
              </Typography>
              <Button
                variant="contained"
                disabled={selected.length < 2 || selected.length > 4}
                onClick={() => setCompareOpen(true)}
              >
                Comparer ({selected.length}/4)
              </Button>
            </Stack>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="medium" sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }} />
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Bien</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Statut</TableCell>
                  <TableCell>
                    Rendement brut (%/an)
                    <Tooltip title="Revenus annuels / coût total projet.">
                      <HelpOutlineIcon fontSize="inherit" sx={{ ml: 0.5 }} />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    Rendement net (%/an)
                    <Tooltip title="(Revenus - charges) / coût total projet.">
                      <HelpOutlineIcon fontSize="inherit" sx={{ ml: 0.5 }} />
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Cashflow mensuel net</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Cashflow annuel net</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Mensualité crédit</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Coût total crédit</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Coût total projet</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sorted.map((row) => {
                  const score = computeScore(row);
                  const missingLabel = row.missing.length > 0 ? `À compléter (${row.missing.length})` : 'Complet';
                  const showDash = !row.isComplete;
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selected.includes(row.id)} onChange={() => handleSelect(row.id)} />
                      </TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <Stack spacing={0.5}>
                          <Typography fontWeight={700}>{row.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{row.city}</Typography>
                          {topChoiceId === row.id && (
                            <Chip size="small" color="success" label="Top choix" />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Chip
                            size="small"
                            label={missingLabel}
                            color={row.isComplete ? 'success' : 'warning'}
                            variant="outlined"
                          />
                          {!row.isComplete && (
                            <Button
                              size="small"
                              onClick={() => navigate(`/appartement/${row.id}?step=${row.missing[0]?.stepIndex ?? 0}`)}
                            >
                              Compléter
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{showDash ? '—' : `${formatNumber(row.metrics.grossYieldPercent)} %`}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{showDash ? '—' : `${formatNumber(row.metrics.netYieldPercent)} %`}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{showDash ? '—' : formatCurrency(row.metrics.cashFlowMonthAfterDebt)}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{showDash ? '—' : formatCurrency(row.metrics.cashFlowYearAfterDebt)}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{showDash ? '—' : formatCurrency(row.metrics.monthlyPayment)}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{showDash ? '—' : formatCurrency(row.metrics.costTotalCredit)}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{showDash ? '—' : formatCurrency(row.metrics.totalAcquisitionCost)}</TableCell>
                      <TableCell sx={{ fontSize: 14 }}>{row.isComplete ? score : '—'}</TableCell>
                    </TableRow>
                  );
                })}
                {sorted.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11}>
                      <Typography color="text.secondary">
                        Aucun bien complet à comparer.
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Button variant="contained" onClick={() => navigate('/portfolio')}>
                          Ajouter un bien
                        </Button>
                        <Button variant="outlined" onClick={() => setShowCompleteOnly(false)}>
                          Afficher les incomplets
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            </Box>
          </CardContent>
        </Card>
      </SectionCard>

      <Dialog open={compareOpen} onClose={() => setCompareOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Comparaison détaillée</DialogTitle>
        <DialogContent>
          <Grid container spacing={2.5} sx={{ mt: 1 }}>
            {selectedRows.map((row) => (
              <Grid item xs={12} md={6} key={row.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography fontWeight={700}>{row.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{row.city}</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">Cashflow mensuel net</Typography>
                      <Typography fontWeight={700}>{formatCurrency(row.metrics.cashFlowMonthAfterDebt)}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">Rendement net</Typography>
                      <Typography fontWeight={700}>{formatNumber(row.metrics.netYieldPercent)} %</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">Mensualité</Typography>
                      <Typography fontWeight={700}>{formatCurrency(row.metrics.monthlyPayment)}</Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">Point mort loyer</Typography>
                      <Typography fontWeight={700}>{formatCurrency(row.metrics.breakEvenRentMonthly)}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};

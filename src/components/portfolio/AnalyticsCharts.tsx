import { Box, Stack, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export type AnalyticsChartsProps = {
  cashflowData: Array<{ name: string; value: number }>;
  yieldData: Array<{ name: string; value: number }>;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
};

export const AnalyticsCharts = ({
  cashflowData,
  yieldData,
  formatCurrency,
  formatPercent,
}: AnalyticsChartsProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
        gap: 3,
      }}
    >
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          Cashflow mensuel par bien
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={cashflowData}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip formatter={(v: number) => formatCurrency(v)} />
            <Bar dataKey="value" fill="#0b57d0" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
      <Stack spacing={1.5}>
        <Typography variant="subtitle1" fontWeight={700}>
          Rendement net annuel par bien
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={yieldData}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip formatter={(v: number) => formatPercent(v)} />
            <Bar dataKey="value" fill="#198754" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
    </Box>
  );
};

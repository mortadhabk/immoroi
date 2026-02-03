import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

export type InsightsPanelProps = {
  negativeCashflowCount: number;
  bestPropertyLabel: string;
  bestPropertyValue: string;
  marketComparison: string;
  optimizationTip: string;
};

export const InsightsPanel = ({
  negativeCashflowCount,
  bestPropertyLabel,
  bestPropertyValue,
  marketComparison,
  optimizationTip,
}: InsightsPanelProps) => {
  const messages = [
    {
      icon: <WarningAmberIcon color="warning" />,
      title: `${negativeCashflowCount} biens ont un cashflow négatif`,
      text: 'Priorisez ces biens pour éviter une perte mensuelle durable.',
    },
    {
      icon: <TrendingUpIcon color="success" />,
      title: `${bestPropertyLabel} génère ${bestPropertyValue}/mois`,
      text: 'C’est votre meilleur contributeur actuel.',
    },
    {
      icon: <TipsAndUpdatesIcon color="primary" />,
      title: marketComparison,
      text: optimizationTip,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        gap: 2,
      }}
    >
      {messages.map((item) => (
        <Card key={item.title} variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              {item.icon}
              <Typography fontWeight={700}>{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {item.text}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

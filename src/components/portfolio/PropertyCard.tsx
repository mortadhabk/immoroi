import { Box, Button, Card, CardContent, Chip, LinearProgress, Stack, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';

export type PropertyCardProps = {
  name: string;
  location: string;
  completionLabel: string;
  completionRatio: number;
  statusLabel: string;
  statusColor: 'success' | 'warning';
  netYield: string;
  cashflow: string;
  cashflowPositive?: boolean;
  primaryLabel: string;
  onPrimary: () => void;
  onDuplicate: () => void;
  onMenu: (e: React.MouseEvent<HTMLElement>) => void;
  helper?: string;
};

export const PropertyCard = ({
  name,
  location,
  completionLabel,
  completionRatio,
  statusLabel,
  statusColor,
  netYield,
  cashflow,
  cashflowPositive,
  primaryLabel,
  onPrimary,
  onDuplicate,
  onMenu,
  helper,
}: PropertyCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {location}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={statusLabel} color={statusColor} variant="outlined" />
              {cashflowPositive && <Chip label="Cashflow +" color="success" variant="outlined" />}
              <IconButton aria-label="Actions" onClick={onMenu}>
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              {completionLabel}
            </Typography>
            <LinearProgress variant="determinate" value={completionRatio} sx={{ height: 8, borderRadius: 4 }} />
            {helper && (
              <Typography variant="caption" color="text.secondary">
                {helper}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Cashflow mensuel
              </Typography>
              <Typography variant="h6" fontWeight={800}>
                {cashflow}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary">
                Rendement net
              </Typography>
              <Typography fontWeight={700}>{netYield}</Typography>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="contained" fullWidth onClick={onPrimary}>
              {primaryLabel}
            </Button>
            <Button variant="outlined" startIcon={<ContentCopyIcon />} fullWidth onClick={onDuplicate}>
              Dupliquer
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

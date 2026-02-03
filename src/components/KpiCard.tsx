import { Card, CardContent, Typography, Stack, Box, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  tooltip?: string;
};

export const KpiCard = ({ title, value, subtitle, icon, tooltip }: KpiCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              {icon && <Box sx={{ display: 'flex', alignItems: 'center' }}>{icon}</Box>}
              <Typography variant="overline" color="text.secondary">
                {title}
              </Typography>
            </Stack>
            {tooltip && (
              <Tooltip title={tooltip} arrow>
                <IconButton size="small" aria-label={`Aide: ${title}`}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
        <Box
          sx={{
            position: 'absolute',
            width: 120,
            height: 120,
            right: -40,
            bottom: -40,
            background: 'radial-gradient(circle, rgba(124,77,255,0.18) 0%, transparent 70%)',
          }}
        />
      </CardContent>
    </Card>
  );
};

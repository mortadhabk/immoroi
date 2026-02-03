import { Card, CardContent, Typography, Stack } from '@mui/material';

type KpiCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export const KpiCard = ({ title, value, subtitle }: KpiCardProps) => {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

import { Card, CardContent, Stack, Typography } from '@mui/material';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
          <Typography color="text.secondary">{description}</Typography>
          {action}
        </Stack>
      </CardContent>
    </Card>
  );
};

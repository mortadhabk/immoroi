import { Card, CardContent, Stack, Typography } from '@mui/material';

type SectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export const SectionCard = ({ title, description, children }: SectionCardProps) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            )}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

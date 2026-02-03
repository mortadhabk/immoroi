import { Box, Stack, Typography } from '@mui/material';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

export const PageHeader = ({ title, description, actions }: PageHeaderProps) => {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ md: 'center' }}
    >
      <Box>
        <Typography variant="h4" fontWeight={800}>
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {actions && <Box>{actions}</Box>}
    </Stack>
  );
};

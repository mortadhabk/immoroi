import { AppBar, Toolbar, Typography, Button, Stack, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { CoffeeDonationFloatingButton } from './CoffeeDonationFloatingButton';

type AppShellProps = {
  children: React.ReactNode;
};

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(16, 24, 40, 0.08)',
          background: 'linear-gradient(90deg, rgba(11,87,208,0.08), rgba(124,77,255,0.08))',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            px: { xs: 1, sm: 3, md: 4 },
          }}
        >
          <Box component={RouterLink} to="/" sx={{ textDecoration: 'none' }}>
            <Typography variant="h6" fontWeight={800} color="text.primary">
              ImmoROI
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button component={RouterLink} to="/" color="primary" variant="text">
              Accueil
            </Button>
            <Button component={RouterLink} to="/portfolio" color="primary" variant="text">
              Portfolio
            </Button>
            <Button component={RouterLink} to="/comparateur" color="primary" variant="text">
              Comparateur
            </Button>
            <Button component={RouterLink} to="/contact" color="primary" variant="text">
              Contact
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth={false}
        sx={{
          py: { xs: 3, md: 5 },
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
        }}
      >
        <Box sx={{ maxWidth: 1320, mx: 'auto', width: '100%' }}>{children}</Box>
      </Container>
      <CoffeeDonationFloatingButton />
    </>
  );
};

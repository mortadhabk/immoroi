import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const buildJsonLd = (description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ImmoROI',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  description,
  url: 'https://example.com',
});

export const Home = () => {
  const navigate = useNavigate();
  const title = 'ImmoROI - Simulateur de rentabilité immobilière';
  const description =
    'Calcule la rentabilité d’un investissement locatif : crédit bancaire, loyers, charges, cashflow et rendements %/an.';

  return (
    <Stack spacing={6} sx={{ pb: { xs: 6, md: 10 } }}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://example.com/" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com/" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        <script type="application/ld+json">{JSON.stringify(buildJsonLd(description))}</script>
      </Helmet>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          p: { xs: 3, md: 6 },
          background:
            'radial-gradient(circle at 15% 20%, rgba(106,122,166,0.2), transparent 45%), radial-gradient(circle at 85% 10%, rgba(31,75,153,0.18), transparent 40%), #ffffff',
          border: '1px solid rgba(106,122,166,0.18)',
        }}
      >
        <Stack spacing={2.5} sx={{ maxWidth: 640 }}>
          <Chip label="Simulation immobilière guidée" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
          <Typography component="h1" variant="h2" fontWeight={800}>
            Calcule la rentabilité
            de ton investissement immobilier
          </Typography>
          <Typography color="text.secondary">
            Crédit bancaire, loyers, charges et cashflow : tout est calculé automatiquement.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <PaidIcon color="primary" fontSize="small" />
              <Typography>Cashflow mensuel + rendements %/an</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccountBalanceIcon color="primary" fontSize="small" />
              <Typography>Crédit bancaire intégré</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <DirectionsWalkIcon color="primary" fontSize="small" />
              <Typography>Guidé étape par étape</Typography>
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="contained" size="large" onClick={() => navigate('/portfolio')}>
              Simuler mon investissement
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/comparateur')}>
              Voir un exemple
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={800}>
          Ce que tu obtiens
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {[
            {
              icon: <AutoGraphIcon color="primary" />,
              title: 'Rendements lisibles',
              text: 'Brut et net en %/an, clairs et comparables.',
            },
            {
              icon: <AccountBalanceIcon color="primary" />,
              title: 'Crédit bancaire intégré',
              text: 'Mensualités et coût total du prêt.',
            },
            {
              icon: <PaidIcon color="primary" />,
              title: 'Cashflow réel',
              text: 'Revenus - charges, par mois et par an.',
            },
          ].map((item) => (
            <Card key={item.title} variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={2}>
                  {item.icon}
                  <Typography variant="h6" fontWeight={700}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.text}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>

      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={800}>
          Comment ça fonctionne
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {[
            {
              step: 'Étape 1',
              title: 'Ajoute le bien',
              text: 'Prix, surface, frais principaux.',
            },
            {
              step: 'Étape 2',
              title: 'Renseigne le crédit',
              text: 'Taux annuel, durée, apport.',
            },
            {
              step: 'Étape 3',
              title: 'Analyse instantanée',
              text: 'Cashflow et rendements %/an.',
            },
          ].map((item) => (
            <Card key={item.title} variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Chip label={item.step} color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                  <Typography variant="h6" fontWeight={700}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.text}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>

      <Card
        variant="outlined"
        sx={{
          p: { xs: 3, md: 5 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(31,75,153,0.12), rgba(106,122,166,0.12))',
        }}
      >
        <Stack spacing={1.5} alignItems="center">
          <Typography variant="h4" fontWeight={800}>
            Prêt à simuler ton investissement ?
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
            Quelques chiffres suffisent pour voir le résultat.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/portfolio')}>
            Simuler mon investissement
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};

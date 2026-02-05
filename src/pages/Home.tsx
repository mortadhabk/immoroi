import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PaidIcon from '@mui/icons-material/Paid';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ShieldIcon from '@mui/icons-material/Shield';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
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
    'Simule la rentabilité réelle d’un investissement immobilier : crédit bancaire, loyers, charges, cashflow et rendements %.';

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
        component={motion.section}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          p: { xs: 3, md: 6 },
          background:
            'radial-gradient(circle at 12% 20%, rgba(26,79,216,0.10), transparent 40%), radial-gradient(circle at 85% 10%, rgba(28,124,84,0.10), transparent 40%), #ffffff',
          border: '1px solid rgba(15,23,42,0.08)',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            gap: { xs: 4, md: 5 },
            alignItems: 'center',
          }}
        >
          <Stack spacing={2}>
            <Chip label="Simulation immobilière guidée" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
            <Typography component="h1" variant="h5" fontWeight={700} color="text.primary">
              ImmoROI – Simulateur de rentabilité immobilière
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              Cashflow, rentabilité et coût total du crédit en une vue claire.
            </Typography>
            <Typography color="text.secondary">
              Calcule en quelques minutes la rentabilité, le cashflow et le coût total de ton crédit immobilier.
              Pensé pour les investisseurs qui financent avec un prêt bancaire.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="contained" size="large" onClick={() => navigate('/portfolio')}>
                Lancer une simulation
              </Button>
            </Stack>
          </Stack>

          <Card
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
            }}
          >
            <Stack spacing={2}>
              <Typography variant="subtitle1" fontWeight={700}>
                Aperçu de votre simulation
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 2,
                }}
              >
                {[
                  { label: 'Cashflow mensuel', value: '+420 €', tone: 'success.main' },
                  { label: 'Rendement net', value: '4,2 %', tone: 'primary.main' },
                  { label: 'Coût total crédit', value: '128 400 €', tone: 'text.primary' },
                  { label: 'Mensualité', value: '620 €', tone: 'text.primary' },
                ].map((item) => (
                  <Box key={item.label} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(15,23,42,0.02)' }}>
                    <Typography variant="caption" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700} color={item.tone}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ height: 120, borderRadius: 2, bgcolor: 'rgba(26,79,216,0.08)' }}>
                <Stack spacing={1} sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Cashflow par mois
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, alignItems: 'end' }}>
                    {[30, 52, 40, 70, 55, 80].map((h, i) => (
                      <Box key={i} sx={{ height: h, borderRadius: 1, bgcolor: 'primary.main' }} />
                    ))}
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Box>

      <Stack spacing={2.5}>
        <Typography component="h2" variant="h4" fontWeight={800}>
          Pourquoi ImmoROI
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {[
            {
              icon: <InsightsIcon color="primary" />,
              title: 'Lecture rapide',
              text: 'Comprends la rentabilité en un coup d’œil.',
            },
            {
              icon: <AccountBalanceIcon color="primary" />,
              title: 'Crédit intégré',
              text: 'Mensualités et coût total inclus.',
            },
            {
              icon: <TrendingUpIcon color="primary" />,
              title: 'Décision fiable',
              text: 'Basé sur revenus, charges et frais réels.',
            },
            {
              icon: <ShieldIcon color="primary" />,
              title: 'Données claires',
              text: 'Sans jargon, sans tableur complexe.',
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

      <Stack spacing={2.5}>
        <Typography component="h2" variant="h4" fontWeight={800}>
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
              icon: <PaidIcon color="primary" />,
              title: 'Cashflow mensuel & annuel',
              text: 'Revenus - charges, pour piloter le projet.',
            },
            {
              icon: <AutoGraphIcon color="primary" />,
              title: 'Rendement brut & net',
              text: 'Rendements % clairs et comparables.',
            },
            {
              icon: <AccountBalanceIcon color="primary" />,
              title: 'Coût total du crédit',
              text: 'Mensualités, intérêts et coût global.',
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
        <Typography component="h2" variant="h4" fontWeight={800}>
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
              title: 'Le bien',
              text: 'Prix d’achat, surface, frais principaux.',
            },
            {
              step: 'Étape 2',
              title: 'Le financement',
              text: 'Taux d’intérêt, durée, apport personnel.',
            },
            {
              step: 'Étape 3',
              title: 'Analyse instantanée',
              text: 'Cashflow, rendements et coût global.',
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

      <Stack spacing={2.5}>
        <Typography component="h2" variant="h4" fontWeight={800}>
          Réassurance simple
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              {[
                'Sans tableur complexe : tout est structuré et guidé.',
                'Résultats transparents : chaque chiffre est expliqué.',
                'Décision rapide : tu sais immédiatement si le projet est rentable.',
              ].map((text) => (
                <Stack key={text} direction="row" spacing={1.5} alignItems="center">
                  <ChecklistIcon color="success" />
                  <Typography color="text.secondary">{text}</Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
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
          <Typography component="h2" variant="h4" fontWeight={800}>
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
      <Divider sx={{ opacity: 0.4 }} />
    </Stack>
  );
};

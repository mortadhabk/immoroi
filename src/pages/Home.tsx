import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BoltIcon from '@mui/icons-material/Bolt';
import ShieldIcon from '@mui/icons-material/Shield';
import InsightsIcon from '@mui/icons-material/Insights';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={8} sx={{ pb: { xs: 6, md: 10 } }}>
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
            'radial-gradient(circle at 15% 20%, rgba(124,77,255,0.22), transparent 45%), radial-gradient(circle at 85% 10%, rgba(11,87,208,0.22), transparent 40%), #ffffff',
          border: '1px solid rgba(124,77,255,0.2)',
        }}
      >
        <Stack spacing={3} sx={{ maxWidth: 640 }}>
          <Chip label="Simulateur premium" color="primary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
          <Typography variant="h2" fontWeight={800}>
            Le ROI immobilier
            <br />
            enfin clair, rapide et fiable.
          </Typography>
          <Typography color="text.secondary">
            ImmoROI vous guide pas à pas pour calculer rendement net, cashflow et mensualités, sans jargon et sans
            tableurs complexes.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="contained" size="large" onClick={() => navigate('/portfolio')}>
              Commencer maintenant
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/comparateur')}>
              Voir un exemple
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={800}>
          Les bénéfices essentiels
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
              title: 'Vision instantanée',
              text: 'Rendement net annuel et cashflow visibles en un coup d’œil.',
            },
            {
              icon: <BoltIcon color="primary" />,
              title: 'Saisie ultra rapide',
              text: 'Ajoutez un bien en quelques minutes, guidé étape par étape.',
            },
            {
              icon: <ShieldIcon color="primary" />,
              title: 'Fiable et transparent',
              text: 'Chaque formule est appliquée clairement, sans boîte noire.',
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
              title: 'Ajoutez votre bien',
              text: 'Nom, localisation, prix d’achat et frais.',
            },
            {
              step: 'Étape 2',
              title: 'Renseignez revenus & charges',
              text: 'Loyer mensuel et charges annuelles pour un calcul fiable.',
            },
            {
              step: 'Étape 3',
              title: 'Analysez les résultats',
              text: 'Rendement net annuel, cashflow et mensualités claires.',
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

      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={800}>
          Pourquoi ImmoROI inspire confiance
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            gap: 3,
          }}
        >
          {[
            {
              icon: <InsightsIcon color="primary" />,
              title: 'Des résultats lisibles',
              text: 'Affichage clair en € et en %, sans ambiguïté.',
            },
            {
              icon: <CheckCircleIcon color="primary" />,
              title: 'Contrôle total',
              text: 'Export JSON et gestion multi-biens pour vos analyses.',
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

      <Card
        variant="outlined"
        sx={{
          p: { xs: 3, md: 5 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(11,87,208,0.12), rgba(124,77,255,0.12))',
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Typography variant="h4" fontWeight={800}>
            Prêt à simuler votre prochain investissement ?
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
            Lancez un calcul en quelques minutes et comparez la performance de vos biens.
          </Typography>
          <Button variant="contained" size="large" onClick={() => navigate('/portfolio')}>
            Démarrer un calcul
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};

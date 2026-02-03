import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { markIntroSeen } from '../utils/onboarding';

export const Intro = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={4} alignItems="center" sx={{ py: { xs: 4, md: 8 } }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Typography variant="overline" color="text.secondary">
          Nouveau simulateur ROI
        </Typography>
        <Typography variant="h3" fontWeight={800} sx={{ textAlign: 'center' }}>
          Visualisez votre rentabilité
          <br />
          appartement par appartement
        </Typography>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 640 }}>
          Ce simulateur vous guide étape par étape pour estimer votre rendement, cashflow et ROI, comme dans un Excel,
          mais avec une expérience moderne.
        </Typography>
      </motion.div>

      <Grid container spacing={2} sx={{ maxWidth: 900 }}>
        {[
          { title: 'Portfolio dynamique', text: 'Gérez plusieurs biens et comparez-les instantanément.' },
          { title: 'Calculs précis', text: 'Mensualité, intérêts, rendements nets/bruts et cashflow.' },
          { title: 'Guidage intelligent', text: 'Saisie pas à pas avec transitions fluides.' },
        ].map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.text}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Button
          id="intro-cta"
          size="large"
          variant="contained"
          startIcon={<RocketLaunchIcon />}
          onClick={() => {
            markIntroSeen();
            navigate('/');
          }}
        >
          Démarrer le simulateur
        </Button>
      </motion.div>

      <Box sx={{ opacity: 0.4, fontSize: 12 }}>Astuce: vous pourrez exporter votre portefeuille en JSON.</Box>
    </Stack>
  );
};

import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChecklistIcon from '@mui/icons-material/Checklist';

export type PortfolioHeaderProps = {
  nextAction: string;
  stepsStatus: boolean[];
  onAdd: () => void;
};

export const PortfolioHeader = ({ nextAction, stepsStatus, onAdd }: PortfolioHeaderProps) => {
  const steps = ['Ajouter un bien', 'Compléter les infos', 'Analyser les performances'];

  return (
    <Box
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: '1px solid rgba(15,23,42,0.08)',
        background:
          'radial-gradient(circle at 10% 15%, rgba(26,79,216,0.12), transparent 45%), radial-gradient(circle at 90% 5%, rgba(28,124,84,0.12), transparent 40%), #ffffff',
        boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
      }}
    >
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={800}>
              Votre portfolio immobilier
            </Typography>
            <Typography color="text.secondary">
              Visualisez votre rentabilité et vos cashflows en temps réel.
            </Typography>
          </Stack>
          <Stack spacing={1.5} sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Parcours guidé
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
            >
              {steps.map((step, index) => (
                <Chip
                  key={step}
                  icon={<ChecklistIcon />}
                  label={`Étape ${index + 1} · ${step}`}
                  color={stepsStatus[index] ? 'success' : 'default'}
                  variant="outlined"
                  sx={{ maxWidth: { xs: '100%', sm: 'none' }, whiteSpace: 'normal' }}
                />
              ))}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={1.5} sx={{ alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
            <Typography variant="subtitle2" color="text.secondary">
              Prochaine action
            </Typography>
            <Typography fontWeight={700} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              {nextAction}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{
                textTransform: 'none',
                fontWeight: 800,
                px: 3,
                py: 1.2,
                borderRadius: 2.5,
                boxShadow: '0 10px 24px rgba(26,79,216,0.25)',
              }}
            >
              Ajouter un bien
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

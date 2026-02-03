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
        border: '1px solid rgba(124,77,255,0.18)',
        background:
          'radial-gradient(circle at 12% 15%, rgba(124,77,255,0.18), transparent 45%), radial-gradient(circle at 85% 10%, rgba(11,87,208,0.18), transparent 40%), #ffffff',
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
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              {steps.map((step, index) => (
                <Chip
                  key={step}
                  icon={<ChecklistIcon />}
                  label={`Étape ${index + 1} · ${step}`}
                  color={stepsStatus[index] ? 'success' : 'default'}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2" color="text.secondary">
              Prochaine action
            </Typography>
            <Typography fontWeight={700}>{nextAction}</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
              Ajouter un bien
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

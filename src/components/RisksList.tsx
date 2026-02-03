import {
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import type { Risk } from '../models/apartment';

export const RisksList = ({
  risks,
  onChange,
  onAdd,
}: {
  risks: Risk[];
  onChange: (risks: Risk[]) => void;
  onAdd: () => void;
}) => {
  const update = (id: string, partial: Partial<Risk>) => {
    onChange(risks.map((r) => (r.id === id ? { ...r, ...partial } : r)));
  };

  const remove = (id: string) => onChange(risks.filter((r) => r.id !== id));

  return (
    <Stack spacing={2}>
      {risks.length === 0 && (
        <Typography color="text.secondary">Aucun risque. Ajoutez-en un.</Typography>
      )}
      {risks.map((r) => (
        <Grid container spacing={2} alignItems="center" key={r.id}>
          <Grid item xs={12} md={10}>
            <TextField
              fullWidth
              label="Risque"
              value={r.label}
              onChange={(e) => update(r.id, { label: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <IconButton color="error" onClick={() => remove(r.id)}>
              <DeleteOutline />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button variant="outlined" onClick={onAdd}>
        Ajouter un risque
      </Button>
    </Stack>
  );
};

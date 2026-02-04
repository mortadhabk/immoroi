import {
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import type { Charge } from '../models/apartment';
import { NumberField } from './NumberField';

export const ChargesTable = ({
  charges,
  onChange,
  onAdd,
}: {
  charges: Charge[];
  onChange: (charges: Charge[]) => void;
  onAdd: () => void;
}) => {
  const update = (id: string, partial: Partial<Charge>) => {
    onChange(charges.map((c) => (c.id === id ? { ...c, ...partial } : c)));
  };

  const remove = (id: string) => onChange(charges.filter((c) => c.id !== id));

  return (
    <Stack spacing={2}>
      {charges.length === 0 && (
        <Typography color="text.secondary">Aucune charge. Ajoutez-en une.</Typography>
      )}
      {charges.map((c) => (
        <Grid container spacing={2} alignItems="center" key={c.id}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Type"
              value={c.type}
              onChange={(e) => update(c.id, { type: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <NumberField
              label="Montant annuel"
              value={c.amount}
              onChange={(v) => update(c.id, { amount: v })}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Description"
              value={c.description || ''}
              onChange={(e) => update(c.id, { description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <IconButton color="error" onClick={() => remove(c.id)} aria-label="Supprimer la charge">
              <DeleteOutline />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button variant="outlined" onClick={onAdd}>
        Ajouter une charge
      </Button>
    </Stack>
  );
};

import {
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  Grid,
} from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import type { Revenue } from '../models/apartment';
import { NumberField } from './NumberField';

export const RevenuesTable = ({
  revenues,
  onChange,
  onAdd,
}: {
  revenues: Revenue[];
  onChange: (revenues: Revenue[]) => void;
  onAdd: () => void;
}) => {
  const update = (id: string, partial: Partial<Revenue>) => {
    onChange(revenues.map((r) => (r.id === id ? { ...r, ...partial } : r)));
  };

  const remove = (id: string) => onChange(revenues.filter((r) => r.id !== id));

  return (
    <Stack spacing={2}>
      {revenues.length === 0 && (
        <Typography color="text.secondary">Aucun revenu. Ajoutez-en un.</Typography>
      )}
      {revenues.map((r, index) => (
        <Grid container spacing={2} alignItems="center" key={r.id}>
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Type"
              value={r.type}
              onChange={(e) => update(r.id, { type: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <NumberField
              id={index === 0 ? 'field-revenue-0' : undefined}
              label="Montant mensuel"
              value={r.monthlyAmount}
              onChange={(v) => update(r.id, { monthlyAmount: v })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <IconButton color="error" onClick={() => remove(r.id)} aria-label="Supprimer le revenu">
              <DeleteOutline />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button variant="outlined" onClick={onAdd}>
        Ajouter un revenu
      </Button>
    </Stack>
  );
};

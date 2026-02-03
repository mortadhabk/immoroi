import TextField from '@mui/material/TextField';
import { toNumber, nonNegative } from '../utils/format/number';

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  allowNegative?: boolean;
  step?: number;
  id?: string;
};

export const NumberField = ({
  label,
  value,
  onChange,
  helperText,
  allowNegative = false,
  step = 0.01,
  id,
}: NumberFieldProps) => {
  return (
    <TextField
      fullWidth
      id={id}
      label={label}
      type="text"
      value={Number.isFinite(value) ? value : 0}
      onChange={(e) => {
        const n = toNumber(e.target.value);
        onChange(allowNegative ? n : nonNegative(n));
      }}
      helperText={helperText}
      inputProps={{ inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*', step }}
    />
  );
};

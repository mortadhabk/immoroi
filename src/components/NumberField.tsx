import TextField from '@mui/material/TextField';
import { useEffect, useMemo, useState } from 'react';
import { toNumber, nonNegative } from '../utils/format/number';

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  allowNegative?: boolean;
  step?: number;
  id?: string;
  error?: boolean;
};

export const NumberField = ({
  label,
  value,
  onChange,
  helperText,
  allowNegative = false,
  step = 0.01,
  id,
  error = false,
}: NumberFieldProps) => {
  const decimals = useMemo(() => {
    if (!Number.isFinite(step)) return 2;
    const stepStr = String(step);
    if (!stepStr.includes('.')) return 0;
    return stepStr.split('.')[1].length;
  }, [step]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: 0,
      }),
    [decimals]
  );

  const roundToDecimals = (n: number) => {
    const factor = Math.pow(10, decimals);
    return Math.round((n + Number.EPSILON) * factor) / factor;
  };

  const [display, setDisplay] = useState(String(value ?? ''));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      const numeric = typeof value === 'number' ? value : toNumber(String(value), NaN);
      setDisplay(Number.isFinite(numeric) ? formatter.format(numeric) : '');
    }
  }, [value, focused, formatter]);

  return (
    <TextField
      fullWidth
      id={id}
      label={label}
      type="text"
      value={display}
      onChange={(e) => {
        const raw = e.target.value;
        setDisplay(raw);
        if (raw.trim() === '') {
          onChange(0);
          return;
        }
        const n = toNumber(raw, NaN);
        if (Number.isFinite(n)) {
          onChange(allowNegative ? n : nonNegative(n));
        }
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        const n = toNumber(display, 0);
        const normalized = allowNegative ? n : nonNegative(n);
        const rounded = roundToDecimals(normalized);
        onChange(rounded);
        setDisplay(formatter.format(rounded));
      }}
      helperText={helperText}
      error={error}
      inputProps={{ inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*', step }}
    />
  );
};

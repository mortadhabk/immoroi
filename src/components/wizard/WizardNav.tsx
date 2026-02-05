import { Button, Stack } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

type WizardNavProps = {
  atStart: boolean;
  atEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSkip?: () => void;
  onReturn?: () => void;
  hideNext?: boolean;
};

export const WizardNav = ({
  atStart,
  atEnd,
  onPrev,
  onNext,
  onSkip,
  onReturn,
  hideNext = false,
}: WizardNavProps) => {
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between">
      <Button startIcon={<NavigateBeforeIcon />} disabled={atStart} onClick={onPrev}>
        Précédent
      </Button>
      <Stack direction="row" spacing={1}>
        {atEnd && onReturn && (
          <Button variant="outlined" onClick={onReturn}>
            Retour au portfolio
          </Button>
        )}
        {onSkip && (
          <Button variant="text" color="inherit" onClick={onSkip}>
            Passer cette étape
          </Button>
        )}
        {!hideNext && (
          <Button endIcon={<NavigateNextIcon />} disabled={atEnd} variant="contained" onClick={onNext}>
            Suivant
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

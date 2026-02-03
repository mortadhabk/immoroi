import { Typography } from '@mui/material';

type InlineHelpProps = {
  text: string;
};

export const InlineHelp = ({ text }: InlineHelpProps) => {
  return (
    <Typography variant="caption" color="text.secondary">
      {text}
    </Typography>
  );
};

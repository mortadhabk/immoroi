import { useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const STORAGE_KEY = 'immoROI_donate_hidden_until';
const PAYPAL_ME_URL ='https://www.paypal.me/mortadhaboubaker';

const getHiddenUntil = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return 0;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
};

export const CoffeeDonationFloatingButton = () => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const hiddenUntil = getHiddenUntil();
    setHidden(Date.now() < hiddenUntil);
  }, []);

  const handleClose = () => {
    const hiddenUntil = Date.now() + 30 * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, String(hiddenUntil));
    setHidden(true);
  };

  if (hidden) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        zIndex: 1300,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Button
        variant="contained"
        size="small"
        href={PAYPAL_ME_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="M’offrir un café"
        sx={{
          borderRadius: 999,
          px: 2,
          py: 0.8,
          fontWeight: 700,
          boxShadow: '0 8px 20px rgba(31, 111, 235, 0.25)',
        }}
      >
        ☕ Offrez moi un café
      </Button>
      <IconButton
        size="small"
        aria-label="Masquer le bouton café"
        onClick={handleClose}
        sx={{
          bgcolor: '#fff',
          border: '1px solid rgba(15,23,42,0.12)',
          boxShadow: '0 6px 16px rgba(15,23,42,0.12)',
          '&:hover': { bgcolor: '#f5f7fb' },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

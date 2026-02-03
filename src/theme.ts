import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0b57d0',
    },
    secondary: {
      main: '#198754',
    },
    info: {
      main: '#7c4dff',
    },
    background: {
      default: '#f4f7ff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          borderColor: '#e3e8f6',
          boxShadow: '0 12px 30px rgba(18, 38, 63, 0.08)',
          transition: 'transform 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 16px 36px rgba(18, 38, 63, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          transition: 'transform 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
  },
});

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f4b99',
    },
    secondary: {
      main: '#2f6f58',
    },
    info: {
      main: '#5b6aa5',
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
          borderColor: '#dfe5ee',
          boxShadow: '0 10px 22px rgba(18, 38, 63, 0.06)',
          transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: '#cdd6e3',
            boxShadow: '0 14px 30px rgba(18, 38, 63, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 12,
          paddingInline: 18,
          paddingBlock: 10,
          transition: 'transform 180ms ease, box-shadow 180ms ease, background 180ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          backgroundImage: 'linear-gradient(120deg, #1f4b99, #6a7aa6)',
          boxShadow: '0 6px 16px rgba(31, 75, 153, 0.18)',
          '&:hover': {
            boxShadow: '0 10px 22px rgba(31, 75, 153, 0.28)',
          },
        },
        outlined: {
          borderColor: '#c7cfdd',
          backgroundColor: '#ffffff',
          '&:hover': {
            borderColor: '#9aa6bb',
            backgroundColor: '#f4f6f9',
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

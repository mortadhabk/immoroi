import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { NextStepProvider, NextStep } from 'nextstepjs';
import { HelmetProvider } from 'react-helmet-async';
import { theme } from './theme';
import App from './App';
import './index.css';
import { onboardingTours } from './services/onboarding/steps';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <BrowserRouter>
          <NextStepProvider>
            <NextStep steps={onboardingTours}>
              <App />
            </NextStep>
          </NextStepProvider>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  </React.StrictMode>
);

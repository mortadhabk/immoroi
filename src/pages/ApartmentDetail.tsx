import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  LinearProgress,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { usePortfolioStore, createCharge, createRevenue, createRisk } from '../store/portfolioStore';
import { calculateApartmentMetrics } from '../services/calculations/calculations';
import { NumberField } from '../components/NumberField';
import { ChargesTable } from '../components/ChargesTable';
import { RevenuesTable } from '../components/RevenuesTable';
import { RisksList } from '../components/RisksList';
import { ResultsPanel } from '../components/ResultsPanel';
import { formatCurrency } from '../utils/format/currency';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { InlineHelp } from '../components/InlineHelp';
import { WizardNav } from '../components/wizard/WizardNav';

export const ApartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apartments, setApartment, deleteApartment, duplicateApartment, resetApartment } = usePortfolioStore();
  const apartment = apartments.find((a) => a.id === id);
  const [activeStep, setActiveStep] = useState(0);

  const metrics = useMemo(() =>
    apartment ? calculateApartmentMetrics(apartment) : null,
    [apartment]
  );

  if (!apartment || !metrics) {
    return (
      <Stack spacing={2}>
        <Alert severity="warning">Appartement introuvable.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>Retour</Button>
      </Stack>
    );
  }

  const steps = [
    {
      label: 'Identité',
      description: 'Nom du bien, localisation, surface et nombre de pièces.',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="field-name"
              label="Nom"
              value={apartment.name}
              onChange={(e) => setApartment(apartment.id, { name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Adresse"
              value={apartment.address}
              onChange={(e) => setApartment(apartment.id, { address: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Ville"
              value={apartment.city}
              onChange={(e) => setApartment(apartment.id, { city: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Code postal"
              value={apartment.postalCode}
              onChange={(e) => setApartment(apartment.id, { postalCode: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <NumberField
              label="Surface (m²)"
              value={apartment.surfaceM2}
              onChange={(v) => setApartment(apartment.id, { surfaceM2: v })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <NumberField
              label="Pièces"
              value={apartment.rooms}
              onChange={(v) => setApartment(apartment.id, { rooms: v })}
              step={1}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Achat',
      description: 'Prix d’achat, frais de notaire et frais d’agence.',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <NumberField
              id="field-purchasePrice"
              label="Prix d'achat"
              value={apartment.purchasePrice}
              onChange={(v) => setApartment(apartment.id, { purchasePrice: v })}
            />
            <InlineHelp text="Prix hors travaux." />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumberField
              label="Frais de notaire"
              value={apartment.notaryFees}
              onChange={(v) => setApartment(apartment.id, { notaryFees: v })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumberField
              label="Frais d'agence"
              value={apartment.agencyFees}
              onChange={(v) => setApartment(apartment.id, { agencyFees: v })}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Frais banque',
      description: 'Frais de dossier, courtage et garanties.',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <NumberField
              label="Frais dossier"
              value={apartment.bankFileFees}
              onChange={(v) => setApartment(apartment.id, { bankFileFees: v })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumberField
              label="Courtier"
              value={apartment.brokerFees}
              onChange={(v) => setApartment(apartment.id, { brokerFees: v })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumberField
              label="Garanties"
              value={apartment.guaranteeFees}
              onChange={(v) => setApartment(apartment.id, { guaranteeFees: v })}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Financement',
      description: 'Apport, durée du prêt, taux et assurance.',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <NumberField
              label="Apport"
              value={apartment.downPayment}
              onChange={(v) => setApartment(apartment.id, { downPayment: v })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumberField
              label="Durée (années)"
              value={apartment.loanYears}
              onChange={(v) => setApartment(apartment.id, { loanYears: v })}
              step={1}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <NumberField
              label="Taux annuel (ex: 0.032)"
              value={apartment.annualInterestRate ?? 0}
              onChange={(v) => setApartment(apartment.id, { annualInterestRate: v === 0 ? null : v })}
              helperText="Laisser à 0 pour taux par défaut"
              step={0.001}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <NumberField
              label="Assurance banque (total durée)"
              value={apartment.bankInsuranceTotal}
              onChange={(v) => setApartment(apartment.id, { bankInsuranceTotal: v })}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Travaux',
      description: 'Budget travaux et mises aux normes.',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <NumberField
              label="Travaux"
              value={apartment.worksCost}
              onChange={(v) => setApartment(apartment.id, { worksCost: v })}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Charges',
      description: 'Charges annuelles, taxe foncière, copropriété, entretien.',
      content: (
        <ChargesTable
          charges={apartment.charges}
          onChange={(charges) => setApartment(apartment.id, { charges })}
          onAdd={() => setApartment(apartment.id, { charges: [...apartment.charges, createCharge()] })}
        />
      ),
    },
    {
      label: 'Revenus',
      description: 'Revenus locatifs mensuels.',
      content: (
        <RevenuesTable
          revenues={apartment.revenues}
          onChange={(revenues) => setApartment(apartment.id, { revenues })}
          onAdd={() => setApartment(apartment.id, { revenues: [...apartment.revenues, createRevenue()] })}
        />
      ),
    },
    {
      label: 'Risques',
      description: 'Risques identifiés pour ce bien.',
      content: (
        <RisksList
          risks={apartment.risks}
          onChange={(risks) => setApartment(apartment.id, { risks })}
          onAdd={() => setApartment(apartment.id, { risks: [...apartment.risks, createRisk()] })}
        />
      ),
    },
  ];

  const atStart = activeStep === 0;
  const atEnd = activeStep === steps.length - 1;
  const progress = ((activeStep + 1) / steps.length) * 100;

  return (
    <Stack spacing={3}>
      <PageHeader
        title={apartment.name}
        description="Renseignez les informations ci-dessous, étape par étape."
        actions={
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ width: { xs: '100%', sm: 'auto' }, alignItems: { xs: 'stretch', sm: 'center' } }}
          >
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} fullWidth>
              Retour
            </Button>
            <Button startIcon={<ContentCopyIcon />} onClick={() => duplicateApartment(apartment.id)} fullWidth>
              Copier ce bien
            </Button>
            <Button startIcon={<RestartAltIcon />} color="warning" onClick={() => resetApartment(apartment.id)} fullWidth>
              Remettre à zéro
            </Button>
            <Button
              startIcon={<DeleteOutlineIcon />}
              color="error"
              onClick={() => {
                deleteApartment(apartment.id);
                navigate('/');
              }}
              fullWidth
            >
              Supprimer
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <SectionCard
              title={`Étape ${activeStep + 1} / ${steps.length} — ${steps[activeStep].label}`}
              description={steps[activeStep].description}
            >
              <Stack spacing={3}>
                <LinearProgress variant="determinate" value={progress} />
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((step) => (
                    <Step key={step.label}>
                      <StepLabel>{step.label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35 }}
                  >
                    {steps[activeStep].content}
                  </motion.div>
                </AnimatePresence>
                <WizardNav
                  atStart={atStart}
                  atEnd={atEnd}
                  onPrev={() => setActiveStep((s) => Math.max(0, s - 1))}
                  onNext={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
                  onSkip={!atEnd && activeStep >= 4 ? () => setActiveStep((s) => Math.min(steps.length - 1, s + 1)) : undefined}
                  onReturn={atEnd ? () => navigate('/') : undefined}
                />
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2} sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
            <ResultsPanel metrics={metrics} />
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Résumé express
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Acquisition (banque)</Typography>
                    <Typography fontWeight={700}>{formatCurrency(metrics.acquisitionViaBank)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Coût travaux</Typography>
                    <Typography fontWeight={700}>{formatCurrency(apartment.worksCost)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Charges annuelles</Typography>
                    <Typography fontWeight={700}>{formatCurrency(metrics.totalCharges)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Revenus annuels</Typography>
                    <Typography fontWeight={700}>{formatCurrency(metrics.totalRevenues)}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

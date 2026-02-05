import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { SectionCard } from '../components/layout/SectionCard';
import { submitFeedback } from '../services/feedback';

const MODULE_OPTIONS = [
  'Simulation d’un bien',
  'Analyse complète',
  'Comparateur',
  'Dashboard / Portfolio',
  'Autre',
];

const TYPES = [
  'Nouvelle fonctionnalité',
  'Amélioration existante',
  'Bug / problème',
  'Autre',
];

const IMPACTS = ['Faible', 'Moyen', 'Élevé'];

type UserProfile = {
  id?: string;
  name?: string;
  email?: string;
};

const getUserProfile = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem('roi-user');
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
};

export const Contact = () => {
  const location = useLocation();
  const profile = useMemo(() => getUserProfile(), []);
  const [type, setType] = useState(TYPES[0]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState('Moyen');
  const [modules, setModules] = useState<string[]>([]);
  const [name, setName] = useState(profile?.name ?? '');
  const [email, setEmail] = useState(profile?.email ?? '');
  const [allowContact, setAllowContact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isLoggedIn = Boolean(profile?.email);
  const isValid = subject.trim().length > 0 && description.trim().length > 0 && email.trim().length > 0;

  const handleSubmit = async () => {
    setError('');
    setSuccess(false);
    if (!isValid) {
      setError('Merci de compléter les champs requis.');
      return;
    }
    setLoading(true);
    try {
      await submitFeedback({
        userId: profile?.id ?? null,
        name: name.trim() || null,
        email: email.trim(),
        type,
        subject: subject.trim(),
        description: description.trim(),
        impact,
        modules,
        allowContact,
        sourcePage: location.pathname,
      });
      setSuccess(true);
      setSubject('');
      setDescription('');
      setModules([]);
    } catch (err: any) {
      setError(err?.message || "Impossible d'envoyer la suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Une idée pour améliorer ImmoROI ?"
        description="Proposez une fonctionnalité ou une amélioration. Nous lisons chaque message."
      />

      <SectionCard title="Votre avis nous aide à améliorer ImmoROI" description="Merci pour votre retour.">
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Type de message</InputLabel>
                <Select value={type} label="Type de message" onChange={(e) => setType(String(e.target.value))}>
                  {TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Sujet"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Description détaillée"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Quel problème essayez-vous de résoudre ? Comment utilisez-vous ImmoROI aujourd’hui ?"
                required
                fullWidth
                multiline
                minRows={4}
              />

              <FormControl fullWidth>
                <InputLabel>Impact perçu</InputLabel>
                <Select value={impact} label="Impact perçu" onChange={(e) => setImpact(String(e.target.value))}>
                  {IMPACTS.map((i) => (
                    <MenuItem key={i} value={i}>{i}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Utilisation concernée</InputLabel>
                <Select
                  multiple
                  value={modules}
                  label="Utilisation concernée"
                  onChange={(e) => setModules(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {MODULE_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  label="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  InputProps={{ readOnly: Boolean(profile?.name) }}
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={!isLoggedIn}
                  fullWidth
                  InputProps={{ readOnly: isLoggedIn }}
                />
              </Stack>

              <FormControlLabel
                control={<Checkbox checked={allowContact} onChange={(e) => setAllowContact(e.target.checked)} />}
                label="J’accepte d’être recontacté"
              />

              {error && (
                <Typography color="error">{error}</Typography>
              )}
              {success && (
                <Typography color="success.main">Merci pour votre retour ! Votre suggestion a bien été envoyée.</Typography>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                <Button variant="contained" disabled={!isValid || loading} onClick={handleSubmit}>
                  {loading ? 'Envoi...' : 'Envoyer la suggestion'}
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Les suggestions les plus demandées sont étudiées en priorité.
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </SectionCard>
    </Stack>
  );
};

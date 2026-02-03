import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Dashboard } from './pages/Dashboard';
import { ApartmentDetail } from './pages/ApartmentDetail';
import { Comparator } from './pages/Comparator';
import { Intro } from './pages/Intro';
import { hasSeenIntro } from './utils/onboarding';

const App = () => {
  const location = useLocation();
  const seenIntro = hasSeenIntro();

  if (!seenIntro && location.pathname !== '/intro') {
    return <Navigate to="/intro" replace />;
  }

  if (location.pathname === '/intro') {
    return <Intro />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/appartement/:id" element={<ApartmentDetail />} />
        <Route path="/comparateur" element={<Comparator />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;

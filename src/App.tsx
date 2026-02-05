import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { Dashboard } from './pages/Dashboard';
import { ApartmentDetail } from './pages/ApartmentDetail';
import { Analysis } from './pages/Analysis';
import { Contact } from './pages/Contact';
import { Comparator } from './pages/Comparator';
import { Intro } from './pages/Intro';
import { hasSeenIntro } from './utils/onboarding';
import { Home } from './pages/Home';

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
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Dashboard />} />
        <Route path="/appartement/:id" element={<ApartmentDetail />} />
        <Route path="/portfolio/:id/analyse" element={<Analysis />} />
        <Route path="/comparateur" element={<Comparator />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;

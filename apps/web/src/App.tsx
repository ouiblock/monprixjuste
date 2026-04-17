import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ImmobilierPage from './pages/ImmobilierPage';
import AutoPage from './pages/AutoPage';
import AnnonceGeneratorPage from './pages/AnnonceGeneratorPage';
import PrivacyPage from './pages/PrivacyPage';
import CGUPage from './pages/CGUPage';
import CookieBanner from './components/CookieBanner';
import CGUConsentModal from './components/CGUConsentModal';
import './index.css';

function App() {
  useEffect(() => {
    // Force dark mode pour une meilleure lisibilité
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/immobilier" element={<ImmobilierPage />} />
          <Route path="/auto" element={<AutoPage />} />
          <Route path="/annonces" element={<AnnonceGeneratorPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cgu" element={<CGUPage />} />
        </Routes>
      </Layout>
      <CGUConsentModal />
      <CookieBanner />
    </BrowserRouter>
  );
}

export default App;

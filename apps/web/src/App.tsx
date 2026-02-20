import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import ImmobilierPage from './pages/ImmobilierPage';
import AutoPage from './pages/AutoPage';
import PrivacyPage from './pages/PrivacyPage';
import CookieBanner from './components/CookieBanner';
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
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </Layout>
      <CookieBanner />
    </BrowserRouter>
  );
}

export default App;

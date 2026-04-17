import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header Simple - Orange */}
      <header className="bg-[#ff6d11] shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <img src="/logoblanc.svg" alt="MonPrixJuste" className="h-12 w-auto" />
              <span className="text-2xl font-black text-white">MonPrixJuste</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                to="/"
                className={`px-5 py-2 rounded-lg text-base font-bold transition-all ${
                  isActive('/') 
                    ? 'bg-white text-[#ff6d11]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Accueil
              </Link>
              <Link
                to="/immobilier"
                className={`px-5 py-2 rounded-lg text-base font-bold transition-all ${
                  isActive('/immobilier') 
                    ? 'bg-white text-[#ff6d11]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Immobilier
              </Link>
              <Link
                to="/auto"
                className={`px-5 py-2 rounded-lg text-base font-bold transition-all ${
                  isActive('/auto') 
                    ? 'bg-white text-[#ff6d11]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Automobile
              </Link>
              <Link
                to="/annonces"
                className={`px-5 py-2 rounded-lg text-base font-bold transition-all ${
                  isActive('/annonces') 
                    ? 'bg-white text-[#ff6d11]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Générateur d'annonces
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-[#ff6d11]">
            <nav className="px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  isActive('/') 
                    ? 'bg-white text-[#ff6d11]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Accueil
              </Link>
              <Link
                to="/immobilier"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  isActive('/immobilier') 
                    ? 'bg-white text-[#ff6d11]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Immobilier
              </Link>
              <Link
                to="/auto"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  isActive('/auto') 
                    ? 'bg-white text-[#ff6d11]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Automobile
              </Link>
              <Link
                to="/annonces"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  isActive('/annonces') 
                    ? 'bg-white text-[#ff6d11]' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Générateur d'annonces
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer Simple - Orange */}
      <footer className="bg-[#ff6d11] mt-20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Mise en garde */}
          <div className="bg-white/10 rounded-lg p-6 mb-6">
            <h3 className="text-sm font-bold text-white mb-2">⚠️ Mise en garde</h3>
            <p className="text-sm text-white leading-relaxed">
              MonPrixJuste est un outil indicatif. Les estimations ne constituent pas un avis de valeur professionnel. 
              Pour toute transaction importante, consultez un professionnel qualifié.
            </p>
            <p className="text-sm text-white leading-relaxed mt-2">
              <strong>Gratuit pour usage personnel.</strong> Toute utilisation commerciale sans autorisation de l'association HERRICHAIN est interdite.
            </p>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 border-t border-white/20 pt-6">
            <p className="text-sm text-white font-medium">
              © 2026 MonPrixJuste - Tous droits réservés
            </p>
            <div className="flex gap-6 text-sm text-white font-medium">
              <Link
                to="/cgu"
                className="underline hover:no-underline"
              >
                CGU
              </Link>
              <Link
                to="/privacy"
                className="underline hover:no-underline"
              >
                Confidentialité
              </Link>
              <a
                href="https://www.arteandigital.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Artean Digital
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

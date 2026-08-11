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

      {/* Footer Simple */}
      <footer className="py-8 bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <div className="text-gray-400 text-sm font-semibold">
              &copy; {new Date().getFullYear()} MonPrixJuste. Tous droits réservés.
            </div>
            <div className="text-gray-400 text-xs font-medium">
              Powered by{' '}
              <a 
                href="https://www.arteandigital.fr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#ff6d11] transition-colors"
                style={{ backgroundColor: 'transparent' }}
              >
                Artean Digital
              </a>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm font-medium">
            <Link to="/cgu" className="hover:text-gray-900 transition-colors">CGU</Link>
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Confidentialité</Link>
            <Link to="/mentions-legales" className="hover:text-gray-900 transition-colors">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import AssistantChatWidget from './AssistantChatWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden max-w-[100vw]">
      {/* Header Simple - Orange */}
      <header className="bg-[#ff6d11] shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity min-w-0">
              <img src="/logoblanc.svg" alt="MonPrixJuste" className="h-9 sm:h-11 w-auto flex-shrink-0" />
              <span className="text-lg sm:text-2xl font-black text-white truncate">MonPrixJuste</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1.5">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm xl:text-base font-bold transition-all ${
                  isActive('/')
                    ? 'bg-white text-[#ff6d11]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Accueil
              </Link>
              <Link
                to="/immobilier"
                className={`px-4 py-2 rounded-lg text-sm xl:text-base font-bold transition-all ${
                  isActive('/immobilier')
                    ? 'bg-white text-[#ff6d11]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Immobilier
              </Link>
              <Link
                to="/auto"
                className={`px-4 py-2 rounded-lg text-sm xl:text-base font-bold transition-all ${
                  isActive('/auto')
                    ? 'bg-white text-[#ff6d11]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Automobile
              </Link>
              <Link
                to="/annonces"
                className={`px-4 py-2 rounded-lg text-sm xl:text-base font-bold transition-all ${
                  isActive('/annonces')
                    ? 'bg-white text-[#ff6d11]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Annonce Immo
              </Link>
              <Link
                to="/annonces-auto"
                className={`px-4 py-2 rounded-lg text-sm xl:text-base font-bold transition-all ${
                  isActive('/annonces-auto')
                    ? 'bg-white text-[#ff6d11]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Annonce Auto
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-white/20 transition-colors flex-shrink-0"
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
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
          <div className="lg:hidden border-t border-white/20 bg-[#ff6d11]">
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
                Estimation Immobilier
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
                Estimation Automobile
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
                Générateur d'annonce Immo
              </Link>
              <Link
                to="/annonces-auto"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-bold transition-all ${
                  isActive('/annonces-auto')
                    ? 'bg-white text-[#ff6d11]'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                Générateur d'annonce Auto
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </main>

      {/* Footer Simple */}
      <footer className="py-8 bg-gray-50 border-t border-gray-200 mt-auto pb-20 sm:pb-8">
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
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-500 text-sm font-medium">
            <Link to="/cgu" className="hover:text-gray-900 transition-colors">CGU</Link>
            <Link to="/privacy" className="hover:text-gray-900 transition-colors">Confidentialité</Link>
            <Link to="/mentions-legales" className="hover:text-gray-900 transition-colors">Mentions légales</Link>
          </div>
        </div>
      </footer>

      {/* Chatbot FAQ Assistant (Auto & Immo) */}
      <AssistantChatWidget />
    </div>
  );
}

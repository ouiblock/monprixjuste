import { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { Button } from '@monprixjuste/ui';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté
    const cookieConsent = localStorage.getItem('mpj-cookie-consent');
    if (!cookieConsent) {
      // Afficher le banner après un court délai pour ne pas être intrusif
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('mpj-cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🍪 Respect de votre vie privée
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>MonPrixJuste ne collecte AUCUNE donnée personnelle.</strong> Toutes vos estimations sont traitées 
              localement dans votre navigateur. Nous utilisons uniquement le localStorage pour sauvegarder vos estimations 
              sur votre appareil. <strong>Aucune donnée n'est envoyée à des serveurs externes.</strong> Pas de cookies tiers, 
              pas de tracking, pas d'analytics.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full md:w-auto">
            <Button
              onClick={handleAccept}
              variant="primary"
              size="sm"
              className="flex-1 md:flex-initial"
            >
              J'ai compris
            </Button>
            <button
              onClick={handleAccept}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer link */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            En utilisant MonPrixJuste, vous acceptez que vos données restent sur votre appareil. 
            <a href="/privacy" className="text-[#ff6d11] hover:underline ml-1">
              En savoir plus sur notre politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

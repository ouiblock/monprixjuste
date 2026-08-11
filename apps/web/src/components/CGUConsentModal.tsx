import { useState, useEffect } from 'react';
import { X, FileText, AlertTriangle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@monprixjuste/ui';

export default function CGUConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les CGU
    const cguConsent = localStorage.getItem('mpj-cgu-consent');
    if (!cguConsent) {
      // Afficher le modal immédiatement
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('mpj-cgu-consent', 'accepted');
    setIsVisible(false);
  };

  // Ne pas afficher sur la page CGU ou Privacy
  if (location.pathname === '/cgu' || location.pathname === '/privacy') {
    return null;
  }

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#ff6d11]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#ff6d11]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Conditions Générales d'Utilisation</h2>
                <p className="text-sm text-gray-500">Merci de les accepter avant d'utiliser nos outils</p>
              </div>
            </div>
            <button
              onClick={handleAccept}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mise en garde */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Mise en garde importante</h3>
                <p className="text-sm text-amber-800">
                  MonPrixJuste est un outil indicatif. Les estimations ne constituent pas un avis de valeur professionnel. 
                  Pour toute transaction importante, consultez un professionnel qualifié.
                </p>
              </div>
            </div>
          </div>

          {/* Points clés */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900">Points clés des CGU :</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#ff6d11] mt-0.5">✓</span>
                <span><strong>Gratuit pour usage personnel</strong> - Toute utilisation commerciale sans autorisation est interdite</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff6d11] mt-0.5">✓</span>
                <span><strong>Outil indicatif</strong> - Ne remplace pas un avis professionnel (notaire, expert immobilier)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff6d11] mt-0.5">✓</span>
                <span><strong>Données 100% locales</strong> - Aucune donnée personnelle collectée ou stockée sur serveur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ff6d11] mt-0.5">✓</span>
                <span><strong>Responsabilité</strong> - L'utilisateur assume l'entière responsabilité des décisions prises</span>
              </li>
            </ul>
          </div>

          {/* Editeur */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
            <p className="mb-2">
              <strong>Éditeur :</strong> Association HERRICHAIN (Loi 1901, RNA : W641015204)
            </p>
            <p className="mb-2">
              <strong>Développement :</strong> Artean Digital - <a href="https://www.arteandigital.fr" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] hover:underline">www.arteandigital.fr</a>
            </p>
            <p className="text-xs text-gray-500">
              Propriété intellectuelle exclusive d'Artean Digital (SAS BASK'IN BIARRITZ, SIRET : 92991521300011).<br/>
              Toute utilisation commerciale ou reproduction sans autorisation est interdite.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAccept}
              variant="primary"
              className="flex-1"
            >
              J'accepte les CGU
            </Button>
            <Link
              to="/cgu"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Lire les CGU complètes
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            En cliquant sur "J'accepte les CGU", vous reconnaissez avoir lu et accepté les Conditions Générales d'Utilisation de MonPrixJuste.
          </p>
        </div>
      </div>
    </div>
  );
}

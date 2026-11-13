import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, Building2, Server } from 'lucide-react';
import { Card } from '@monprixjuste/ui';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center text-[#ff6d11] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Mentions Légales
          </h1>
          <p className="text-base sm:text-lg text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Éditeur */}
          <Card>
            <div className="p-5 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 flex items-center gap-3">
                <Scale className="w-6 h-6 text-[#ff6d11] flex-shrink-0" />
                1. Éditeur du site
              </h2>
              <div className="space-y-4 text-gray-600">
                <p><strong>ARTEAN DIGITAL (SAS BASK'IN BIARRITZ)</strong></p>
                <p>Société par Actions Simplifiée (SAS) au capital de 100 €</p>
                <p><strong>SIRET :</strong> 92991521300011</p>
                <p><strong>Siège social :</strong> Biarritz, France</p>
                <p><strong>Site web :</strong> <a href="https://www.arteandigital.fr" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] hover:underline">www.arteandigital.fr</a></p>
              </div>
            </div>
          </Card>

          {/* Développement & Propriété intellectuelle */}
          <Card>
            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-[#ff6d11]" />
                2. Propriété intellectuelle
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>Le code source, le design, l'architecture et l'intégralité du projet "MonPrixJuste" sont la propriété intellectuelle exclusive d'Artean Digital (SAS BASK'IN BIARRITZ).</p>
                <p className="font-bold text-gray-900">Toute utilisation commerciale, reproduction, modification, distribution, ou exploitation de ce code, en tout ou en partie, est strictement interdite sans l'autorisation écrite préalable d'Artean Digital.</p>
              </div>
            </div>
          </Card>

          {/* Hébergement */}
          <Card>
            <div className="p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Server className="w-6 h-6 text-[#ff6d11]" />
                3. Hébergement
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>Ce site est hébergé de manière statique.</p>
                <p>Les données saisies par les utilisateurs sont stockées localement dans leur navigateur (localStorage) et ne sont ni collectées, ni transmises, ni sauvegardées sur nos serveurs.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

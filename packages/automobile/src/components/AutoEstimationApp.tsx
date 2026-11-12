import { useAutoStore } from '../stores/autoStore';
import VehicleForm from './VehicleForm';
import SourcesSection from './SourcesSection';
import PonderationsSection from './PonderationsSection';
import AdjustmentsSection from './AdjustmentsSection';
import CalculationSummary from './CalculationSummary';
import { Calculator, RotateCcw, AlertCircle, ExternalLink } from 'lucide-react';
import Tooltip from '../../../../apps/web/src/components/Tooltip';

export default function AutoEstimationApp() {
  const { reset } = useAutoStore();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative py-8 sm:py-12 md:py-16 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/voiture.svg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-white/65"></div>
        </div>

        <div className="relative z-10 w-full text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mx-auto animate-fade-in">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#ff6d11] mb-2 sm:mb-3">
                Outil d'estimation hybride — Automobile
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3 sm:mb-4">
                Ne bradez plus<br />
                <span className="text-[#ff6d11]">votre véhicule.</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
                Croisez la cote La Centrale, les annonces Leboncoin et les offres de reprise type Vendezvotrevoiture.fr pour éditer un rapport PDF complet avec photos et sources cliquables.
              </p>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6">
                {[
                  'La Centrale & Vendezvotrevoiture',
                  'Photos en tête de page PDF',
                  'Sources cliquables dans le PDF',
                  '100% privé & gratuit',
                ].map((label) => (
                  <span
                    key={label}
                    className="text-xs font-semibold text-gray-800 bg-white/90 border border-gray-300 px-2.5 py-1 rounded-full shadow-2xs"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('vehicule-form')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Démarrer l'estimation <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium text-xs sm:text-sm transition-colors rounded-lg hover:bg-gray-900/5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div id="vehicule-form" className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Bandeau Plateformes de Référence Automobile */}
        <div className="mb-8 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl text-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="font-bold text-blue-950 text-xs sm:text-sm flex items-center gap-1.5">
              🔍 Où relever vos cotes et annonces comparables ?
              <Tooltip
                content="Consultez gratuitement la cote sur La Centrale, l'offre de rachat immédiat sur Vendezvotrevoiture.fr et les annonces similaires sur Leboncoin ou AutoScout24. Collez les liens des annonces pour les rendre cliquables dans votre PDF."
                position="top"
              />
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
              Portails automobiles de référence
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-3">
            {(
              [
                ['La Centrale (Cote & Pro)', 'https://www.lacentrale.fr/', true],
                ['Vendezvotrevoiture.fr (Rachat)', 'https://www.vendezvotrevoiture.fr/', true],
                ['Leboncoin', 'https://www.leboncoin.fr/', false],
                ['AutoScout24', 'https://www.autoscout24.fr/', false],
                ['Histovec (Gouv)', 'https://histovec.interieur.gouv.fr/histovec/accueil', false],
              ] as const
            ).map(([label, url, primary]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                    : 'bg-white text-blue-700 border border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <span className="truncate">{label}</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            ))}
          </div>
          <p className="text-blue-800 text-xs leading-relaxed">
            <strong>Méthode conseillée :</strong> relevez la cote sur{' '}
            <a
              href="https://www.lacentrale.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold underline hover:no-underline"
            >
              La Centrale
            </a>
            , une offre de reprise sur{' '}
            <a
              href="https://www.vendezvotrevoiture.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold underline hover:no-underline"
            >
              Vendezvotrevoiture.fr
            </a>{' '}
            et 2 à 3 annonces proches sur Leboncoin ou La Centrale.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8 min-w-0">
            <VehicleForm />
            <SourcesSection />
            <PonderationsSection />
            <AdjustmentsSection />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1 min-w-0">
            <div className="lg:sticky lg:top-24">
              <CalculationSummary />
            </div>
          </div>
        </div>

        {/* Disclaimer renforcé */}
        <div className="mt-10 p-4 sm:p-6 bg-amber-50 rounded-xl border-2 border-amber-500/80">
          <h3 className="text-sm sm:text-base font-bold text-amber-900 mb-2.5 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            Avertissement Important
          </h3>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed mb-2.5">
            <strong>MonPrixJuste est un outil indicatif uniquement.</strong> Cette estimation ne remplace en aucun cas :
          </p>
          <ul className="text-xs sm:text-sm text-amber-900 space-y-1 ml-4 mb-2.5">
            <li>• Un contrôle technique professionnel</li>
            <li>• Une expertise automobile certifiée</li>
            <li>• Un avis de valeur d'un expert agréé</li>
          </ul>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            Pour toute transaction importante, consultez impérativement un professionnel qualifié. Les données sont saisies manuellement et peuvent contenir des erreurs.
          </p>
          <div className="mt-4 pt-3 border-t border-amber-300">
            <p className="text-xs text-amber-800">
              🔒 <strong>Confidentialité :</strong> Toutes les données et photos sont traitées localement dans votre navigateur. Aucune information n'est envoyée à des serveurs externes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

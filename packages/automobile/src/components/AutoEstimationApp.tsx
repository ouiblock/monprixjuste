import { Button } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import VehicleForm from './VehicleForm';
import SourcesSection from './SourcesSection';
import PonderationsSection from './PonderationsSection';
import AdjustmentsSection from './AdjustmentsSection';
import CalculationSummary from './CalculationSummary';
import { Calculator, RotateCcw, AlertCircle, CheckCircle2, Car } from 'lucide-react';

export default function AutoEstimationApp() {
  const { vehicleData, sources, calculate, reset } = useAutoStore();

  const canCalculate = vehicleData.estimationName && 
                       vehicleData.marque && 
                       vehicleData.modele && 
                       vehicleData.annee &&
                       (sources.coteOfficielle.length > 0 || 
                        sources.annoncesParticulier.length > 0 || 
                        sources.annoncesPro.length > 0 || 
                        sources.rachatCash.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[680px] md:h-[820px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/voiture.svg" 
            alt="" 
            className="w-full h-full object-cover" 
          />
          {/* White Overlay */}
          <div className="absolute inset-0 bg-white/50"></div>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#ff6d11] mb-5">
                Outil d'estimation — Automobile
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                Ne bradez plus<br />
                <span className="text-[#ff6d11]">votre véhicule.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                Combinez la cote officielle, les annonces du marché et les offres de rachat pour vendre au prix juste, pas en dessous.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {['Cote officielle + marché', 'Ajustements kilométrage & état', 'Zéro algorithme opaque', '100% privé & gratuit'].map((label) => (
                  <span key={label} className="text-xs font-semibold text-gray-700 bg-gray-900/5 border border-gray-300 px-3 py-1.5 rounded-full">
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => window.scrollTo({ top: document.getElementById('vehicule-form')?.offsetTop || 800, behavior: 'smooth' })}
                  className="flex items-center gap-2 px-7 py-4 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                >
                  Démarrer l'estimation <Calculator className="w-5 h-5" />
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 font-medium text-sm transition-colors rounded-lg hover:bg-gray-900/5"
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            <VehicleForm />
            <SourcesSection />
            <PonderationsSection />
            <AdjustmentsSection />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CalculationSummary />
            </div>
          </div>
        </div>

        {/* Disclaimer renforcé */}
        <div className="mt-12 p-6 bg-amber-50 rounded-lg border-2 border-amber-600">
          <h3 className="text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Avertissement Important
          </h3>
          <p className="text-sm text-amber-900 leading-relaxed mb-3">
            <strong>MonPrixJuste est un outil indicatif uniquement.</strong> Cette estimation ne remplace en aucun cas :
          </p>
          <ul className="text-sm text-amber-900 space-y-1 ml-4 mb-3">
            <li>• Un contrôle technique professionnel</li>
            <li>• Une expertise automobile certifiée</li>
            <li>• Un avis de valeur d'un expert agréé</li>
          </ul>
          <p className="text-sm text-amber-900 leading-relaxed">
            Pour toute transaction importante, consultez impérativement un professionnel qualifié. Les données sont saisies manuellement et peuvent contenir des erreurs.
          </p>
          <p className="text-xs text-amber-800 mt-3">
            Outil développé par{' '}
            <a
              href="https://www.arteandigital.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              www.arteandigital.fr
            </a>{' '}
            pour l'association HERRICHAIN.
          </p>
          <div className="mt-4 pt-4 border-t border-amber-400">
            <p className="text-xs text-amber-800">
              🔒 <strong>Confidentialité :</strong> Toutes les données sont traitées localement dans votre navigateur. Aucune information n'est envoyée à des serveurs externes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      {/* Hero avec image */}
      <section className="relative h-[700px] md:h-[850px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/voiture.svg" 
            alt="" 
            className="w-full h-full object-cover" 
          />
          {/* Overlay avec opacité */}
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 h-full max-w-7xl relative z-10">
          <div className="flex items-center justify-center h-full">
            <div className="max-w-4xl text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff6d11] to-[#E65A00] rounded-2xl flex items-center justify-center shadow-lg">
                  <Car className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* H1 */}
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Estimation Automobile
              </h1>

              {/* H2 */}
              <h2 className="text-3xl md:text-4xl text-white font-black mb-8">
                Ne bradez plus votre véhicule
              </h2>

              {/* H3 */}
              <h3 className="text-xl md:text-2xl text-white mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
                Combinez la cote officielle, les annonces du marché et les offres de rachat pour vendre au prix juste, pas en dessous.
              </h3>

              {/* Hero Proof */}
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Cote officielle + marché</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Ajustements kilométrage & état</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Estimation détaillée</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={reset}
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Réinitialiser
                </Button>
                <Button
                  onClick={calculate}
                  variant="primary"
                  size="lg"
                  disabled={!canCalculate}
                  className="bg-gradient-to-r from-[#ff6d11] to-[#E65A00] hover:from-[#E65A00] hover:to-[#D54E00]"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculer l'estimation
                </Button>
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

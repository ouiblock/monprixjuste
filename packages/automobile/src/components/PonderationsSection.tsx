import { Card } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import { Info } from 'lucide-react';
import Tooltip from '../../../../apps/web/src/components/Tooltip';

export default function PonderationsSection() {
  const { ponderations, setPonderations } = useAutoStore();

  const handleChange = (key: keyof typeof ponderations, value: number) => {
    setPonderations({ [key]: value });
  };

  const total =
    ponderations.coteOfficielle +
    ponderations.annoncesParticulier +
    ponderations.annoncesPro +
    ponderations.rachatCash;

  const isValid = total === 100;

  return (
    <Card>
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            4. Pondération des sources
          </h2>
          <Tooltip
            content="Ajustez l'importance relative de chaque catégorie de sources. Si une catégorie ne contient aucune donnée, son poids est automatiquement redistribué sur les autres."
            position="top"
          />
        </div>

        <p className="text-xs sm:text-sm text-gray-700 mb-6">
          Ajustez l'importance de chaque catégorie de sources. Le total recommandé est de 100%.
        </p>

        <div className="space-y-5">
          {/* Cote Officielle */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <label className="text-sm sm:text-base font-bold text-gray-900">
                  📊 Cote officielle (La Centrale / Argus)
                </label>
                <Tooltip
                  content="La cote officielle (La Centrale, L'Argus) est calculée à partir des transactions du marché et constitue la référence principale. Recommandé : 40-45%."
                  position="top"
                />
              </div>
              <span className="text-base sm:text-lg font-black text-[#ff6d11] flex-shrink-0">
                {ponderations.coteOfficielle}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={ponderations.coteOfficielle}
              onChange={(e) => handleChange('coteOfficielle', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff6d11]"
            />
          </div>

          {/* Annonces Particulier */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <label className="text-sm sm:text-base font-bold text-gray-900">
                  👤 Annonces Particulier (Leboncoin…)
                </label>
                <Tooltip
                  content="Les annonces de particuliers reflètent la concurrence directe entre vendeurs privés sur Leboncoin ou La Centrale. Recommandé : 25-30%."
                  position="top"
                />
              </div>
              <span className="text-base sm:text-lg font-black text-[#ff6d11] flex-shrink-0">
                {ponderations.annoncesParticulier}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={ponderations.annoncesParticulier}
              onChange={(e) => handleChange('annoncesParticulier', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff6d11]"
            />
          </div>

          {/* Annonces Pro */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <label className="text-sm sm:text-base font-bold text-gray-900">
                  🏢 Annonces Pro / Concession
                </label>
                <Tooltip
                  content="Les prix professionnels (La Centrale, AutoScout24) incluent les frais de préparation et la garantie. Une décote de -5% est automatiquement appliquée dans le calcul."
                  position="top"
                />
              </div>
              <span className="text-base sm:text-lg font-black text-[#ff6d11] flex-shrink-0">
                {ponderations.annoncesPro}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={ponderations.annoncesPro}
              onChange={(e) => handleChange('annoncesPro', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff6d11]"
            />
          </div>

          {/* Rachat Cash */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <label className="text-sm sm:text-base font-bold text-gray-900">
                  💰 Offre de rachat (Vendezvotrevoiture.fr…)
                </label>
                <Tooltip
                  content="L'offre de rachat cash (Vendezvotrevoiture.fr, reprise concession) représente la valeur de liquidité immédiate (prix plancher). Recommandé : 10-15%."
                  position="top"
                />
              </div>
              <span className="text-base sm:text-lg font-black text-[#ff6d11] flex-shrink-0">
                {ponderations.rachatCash}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={ponderations.rachatCash}
              onChange={(e) => handleChange('rachatCash', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff6d11]"
            />
          </div>
        </div>

        {/* Total */}
        <div
          className={`mt-6 p-4 rounded-xl border-2 ${
            isValid ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm sm:text-base font-black text-gray-900">Total des pondérations</span>
            <span className={`text-xl sm:text-2xl font-bold ${isValid ? 'text-green-600' : 'text-yellow-600'}`}>
              {total}%
            </span>
          </div>
          {!isValid && (
            <div className="flex items-start gap-2 mt-2">
              <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">
                Le total doit être égal à 100%. Ajustez les curseurs pour équilibrer les pondérations.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

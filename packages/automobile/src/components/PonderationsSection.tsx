import { Card } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import { Info } from 'lucide-react';

export default function PonderationsSection() {
  const { ponderations, setPonderations } = useAutoStore();

  const handleChange = (key: keyof typeof ponderations, value: number) => {
    setPonderations({ [key]: value });
  };

  const total = ponderations.coteOfficielle + 
                ponderations.annoncesParticulier + 
                ponderations.annoncesPro + 
                ponderations.rachatCash;

  const isValid = total === 100;

  return (
    <Card className="mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-900 mb-6">
          Pondération des sources
        </h2>

        <p className="text-sm text-gray-700 mb-6">
          Ajustez l'importance de chaque catégorie de sources. Le total doit être égal à 100%.
        </p>

        <div className="space-y-6">
          {/* Cote Officielle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-bold text-gray-900">
                📊 Cote officielle (La Centrale / Argus)
              </label>
              <span className="text-lg font-black text-[#ff6d11]">
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-bold text-gray-900">
                👤 Annonces Particulier
              </label>
              <span className="text-lg font-black text-[#ff6d11]">
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-bold text-gray-900">
                🏢 Annonces Pro / Concession
              </label>
              <span className="text-lg font-black text-[#ff6d11]">
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
            <div className="flex items-center justify-between mb-2">
              <label className="text-base font-bold text-gray-900">
                💰 Prix de rachat cash
              </label>
              <span className="text-lg font-black text-[#ff6d11]">
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
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          isValid 
            ? 'bg-green-50 border-green-500' 
            : 'bg-yellow-50 border-yellow-500'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-base font-black text-gray-900">
              Total
            </span>
            <span className={`text-2xl font-bold ${
              isValid ? 'text-green-600' : 'text-yellow-600'
            }`}>
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

        {/* Recommandations */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-xs font-semibold text-blue-800 mb-2">
            💡 Recommandations par défaut
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• <strong>Cote officielle (42%)</strong> : Référence fiable et standardisée</li>
            <li>• <strong>Annonces Particulier (28%)</strong> : Prix réels du marché</li>
            <li>• <strong>Annonces Pro (18%)</strong> : Prix avec garantie et services</li>
            <li>• <strong>Rachat cash (12%)</strong> : Valeur plancher immédiate</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

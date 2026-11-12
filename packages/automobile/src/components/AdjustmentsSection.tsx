import { Card } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import type { EtatGeneral, AccidentGravite } from '../types';
import { Info } from 'lucide-react';
import Tooltip from '../../../../apps/web/src/components/Tooltip';

export default function AdjustmentsSection() {
  const { ajustements, setAjustements, vehicleData } = useAutoStore();

  return (
    <Card>
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4">
          5. Ajustements qualitatifs
        </h2>

        <div className="mb-6 p-3.5 sm:p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                <strong>Ces ajustements sont facultatifs.</strong> Si vos sources correspondent déjà exactement au véhicule, vous pouvez les laisser par défaut. Utilisez-les pour valoriser vos options ou votre historique d'entretien.
              </p>
            </div>
          </div>
        </div>

        {/* État général */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <label className="block text-sm sm:text-base font-bold text-gray-900">
              État général du véhicule
            </label>
            <Tooltip
              content="L'état général reflète l'usure globale visible (carrosserie, intérieur, mécanique). Soyez objectif : une surévaluation de l'état sera rapidement détectée lors de l'essai."
              position="top"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {(['Très bon / comme neuf', 'Bon', 'Moyen / usure visible', 'À réviser / gros travaux'] as EtatGeneral[]).map((etat) => {
              const isSelected = ajustements.etatGeneral === etat;
              const impacts: Record<EtatGeneral, string> = {
                'Très bon / comme neuf': '+4%',
                'Bon': '0%',
                'Moyen / usure visible': '-5%',
                'À réviser / gros travaux': '-10%',
              };
              return (
                <button
                  key={etat}
                  type="button"
                  onClick={() => setAjustements({ etatGeneral: etat })}
                  className={`p-3.5 rounded-xl border-2 transition-all text-left sm:text-center ${
                    isSelected
                      ? 'border-[#ff6d11] bg-orange-50'
                      : 'border-gray-200 hover:border-[#ff6d11] hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900">{etat}</div>
                  <div className={`text-xs mt-1 ${isSelected ? 'text-[#ff6d11] font-bold' : 'text-gray-600'}`}>
                    {impacts[etat]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kilométrage bonus (auto-calculé) */}
        <div className="mb-6 p-3.5 sm:p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-blue-800 mb-1">
                Ajustement kilométrage : {ajustements.kilometrageBonus > 0 ? '+' : ''}
                {ajustements.kilometrageBonus}%
              </p>
              <p className="text-xs text-blue-700">
                Calculé automatiquement selon {vehicleData.kilometrage.toLocaleString('fr-FR')} km
                {vehicleData.motorisation === 'Électrique' && ' — facteur électrique appliqué (−40% de pénalité)'}
                {ajustements.kilometrageBonus > 0 && ' (faible kilométrage)'}
                {ajustements.kilometrageBonus < 0 && ' (kilométrage élevé)'}
              </p>
            </div>
          </div>
        </div>

        {/* Options et équipements */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-base sm:text-lg font-black text-gray-900">Options et équipements</h3>
            <Tooltip
              content="Ne cochez que les équipements en option payante sur votre véhicule. Les équipements de série sont déjà intégrés dans la cote de base."
              position="top"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {[
              { key: 'toitPanoramique' as const, label: 'Toit panoramique', pct: '+4%' },
              { key: 'camera360' as const, label: 'Caméra 360°', pct: '+3%' },
              { key: 'gps' as const, label: 'GPS intégré / grand écran', pct: '+2%' },
              { key: 'siegesCuir' as const, label: 'Sièges cuir / alcantara', pct: '+3%' },
              { key: 'siegesChauffants' as const, label: 'Sièges chauffants / ventilés', pct: '+1.5%' },
              { key: 'regulateurAdaptatif' as const, label: 'Régulateur adaptatif + maintien voie', pct: '+2%' },
              { key: 'pharesLED' as const, label: 'Phares full LED / Matrix', pct: '+2%' },
              { key: 'jantesAlliage' as const, label: 'Jantes alliage 17" ou plus', pct: '+1.5%' },
              { key: 'equipementsHiver' as const, label: 'Équipements hiver inclus', pct: '+1.5%' },
            ].map(({ key, label, pct }) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={ajustements[key] as boolean}
                  onChange={(e) => setAjustements({ [key]: e.target.checked })}
                  className="w-4 h-4 accent-[#ff6d11] rounded flex-shrink-0"
                />
                <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{label}</span>
                  <span className="text-xs font-bold text-[#ff6d11] flex-shrink-0">{pct}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Entretien et historique */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-base sm:text-lg font-black text-gray-900">Entretien et historique</h3>
            <Tooltip
              content="Un historique d'entretien traçable (factures + rapport Histovec) rassure l'acheteur et justifie le haut de la fourchette."
              position="top"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {[
              { key: 'carnetComplet' as const, label: "Carnet d'entretien complet", pct: '+3%' },
              { key: 'derniereRevisionMarque' as const, label: 'Dernière révision en concession', pct: '+5%' },
              { key: 'controletechniqueValide' as const, label: 'Contrôle technique valide (< 6 mois)', pct: '+2%' },
              { key: 'premiereMain' as const, label: 'Première main', pct: '+4%' },
            ].map(({ key, label, pct }) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={ajustements[key] as boolean}
                  onChange={(e) => setAjustements({ [key]: e.target.checked })}
                  className="w-4 h-4 accent-[#ff6d11] rounded flex-shrink-0"
                />
                <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{label}</span>
                  <span className="text-xs font-bold text-[#ff6d11] flex-shrink-0">{pct}</span>
                </div>
              </label>
            ))}

            <div className="p-3 rounded-xl border border-gray-200 sm:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                Nombre de propriétaires
              </label>
              <select
                value={ajustements.nombreProprietaires}
                onChange={(e) =>
                  setAjustements({ nombreProprietaires: Number(e.target.value) as 1 | 2 | 3 | 4 })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ff6d11]"
              >
                <option value="1">1 propriétaire (+2%)</option>
                <option value="2">2 propriétaires (0%)</option>
                <option value="3">3 propriétaires (-2%)</option>
                <option value="4">4 propriétaires ou plus (-5%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accident déclaré */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <label className="block text-sm sm:text-base font-black text-gray-900">Accident déclaré</label>
            <Tooltip
              content="La déclaration d'un accident structurel connu est une obligation légale lors d'une vente."
              position="top"
            />
          </div>
          <select
            value={ajustements.accidentDeclare}
            onChange={(e) => setAjustements({ accidentDeclare: e.target.value as AccidentGravite })}
            className="w-full sm:w-2/3 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6d11] bg-white text-sm font-medium text-gray-900"
          >
            <option value="Aucun">Aucun (0%)</option>
            <option value="Léger cosmétique">Léger cosmétique (-5%)</option>
            <option value="Moyen / structure">Moyen / structure (-10%)</option>
            <option value="Grave / économique">Grave / économique (-20%)</option>
          </select>
        </div>

        {/* Autres bonus/malus */}
        <div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3">Autres bonus / malus</h3>
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs sm:text-sm font-medium text-gray-900">
                    Impact couleur
                  </label>
                  <Tooltip
                    content="Les teintes sobres (noir, gris, blanc) se revendent plus vite que les coloris atypiques."
                    position="top"
                  />
                </div>
                <span className="text-sm font-bold text-[#ff6d11]">
                  {ajustements.couleurBonus > 0 ? '+' : ''}
                  {ajustements.couleurBonus}%
                </span>
              </div>
              <input
                type="range"
                min="-3"
                max="2"
                step="0.5"
                value={ajustements.couleurBonus}
                onChange={(e) => setAjustements({ couleurBonus: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#ff6d11]"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>Vive (-3%)</span>
                <span>Standard (0%)</span>
                <span>Recherchée (+2%)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ajustements.pneumatiquesRecents}
                  onChange={(e) => setAjustements({ pneumatiquesRecents: e.target.checked })}
                  className="w-4 h-4 accent-[#ff6d11] rounded flex-shrink-0"
                />
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">Pneumatiques récents</span>
                  <span className="text-xs font-bold text-[#ff6d11]">+2%</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ajustements.garantieConstructeur}
                  onChange={(e) => setAjustements({ garantieConstructeur: e.target.checked })}
                  className="w-4 h-4 accent-[#ff6d11] rounded flex-shrink-0"
                />
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">Garantie constructeur</span>
                  <span className="text-xs font-bold text-[#ff6d11]">+8%</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ajustements.etatInterieurImpeccable}
                  onChange={(e) => setAjustements({ etatInterieurImpeccable: e.target.checked })}
                  className="w-4 h-4 accent-[#ff6d11] rounded flex-shrink-0"
                />
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">Intérieur impeccable</span>
                  <span className="text-xs font-bold text-[#ff6d11]">+1.5%</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ajustements.etatExterieurImpeccable}
                  onChange={(e) => setAjustements({ etatExterieurImpeccable: e.target.checked })}
                  className="w-4 h-4 accent-[#ff6d11] rounded flex-shrink-0"
                />
                <div className="flex-1 flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">Extérieur impeccable</span>
                  <span className="text-xs font-bold text-[#ff6d11]">+1.5%</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

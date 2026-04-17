import { Card } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import type { EtatGeneral, AccidentGravite } from '../types';
import { Info } from 'lucide-react';

export default function AdjustmentsSection() {
  const { ajustements, setAjustements, vehicleData } = useAutoStore();

  return (
    <Card className="mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-900 mb-4">
          Ajustements qualitatifs
        </h2>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Ces ajustements sont facultatifs.</strong> Si vos sources correspondent déjà bien au véhicule, 
                vous pouvez les ignorer. Utilisez-les uniquement pour affiner si votre véhicule diffère significativement 
                des comparables (état, équipements, historique...).
              </p>
            </div>
          </div>
        </div>

        {/* État général */}
        <div className="mb-6">
          <label className="block text-base font-bold text-gray-900 mb-3">
            État général du véhicule
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['Très bon / comme neuf', 'Bon', 'Moyen / usure visible', 'À réviser / gros travaux'] as EtatGeneral[]).map((etat) => {
              const isSelected = ajustements.etatGeneral === etat;
              const impacts: Record<EtatGeneral, string> = {
                'Très bon / comme neuf': '+4%',
                'Bon': '0%',
                'Moyen / usure visible': '-5%',
                'À réviser / gros travaux': '-10%'
              };
              
              return (
                <button
                  key={etat}
                  onClick={() => setAjustements({ etatGeneral: etat })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-[#ff6d11] bg-orange-50'
                      : 'border-gray-300 hover:border-[#ff6d11] hover:bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {etat}
                  </div>
                  <div className={`text-xs mt-1 ${
                    isSelected ? 'text-[#ff6d11] font-semibold' : 'text-gray-600'
                  }`}>
                    {impacts[etat]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kilométrage bonus (auto-calculé) */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">
                Ajustement kilométrage : {ajustements.kilometrageBonus > 0 ? '+' : ''}{ajustements.kilometrageBonus}%
              </p>
              <p className="text-xs text-blue-700">
                Calculé automatiquement selon {vehicleData.kilometrage.toLocaleString('fr-FR')} km
                {ajustements.kilometrageBonus > 0 && ' (faible kilométrage)'}
                {ajustements.kilometrageBonus < 0 && ' (kilométrage élevé)'}
              </p>
            </div>
          </div>
        </div>

        {/* Options et équipements */}
        <div className="mb-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">
            Options et équipements
          </h3>
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Important :</strong> Ne cochez que les équipements <strong>en option</strong> sur votre véhicule. 
                Les équipements de série (ex: Tesla, Mercedes, BMW haut de gamme) sont déjà inclus dans la cote de base et ne doivent pas être comptabilisés deux fois.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.toitPanoramique}
                onChange={(e) => setAjustements({ toitPanoramique: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Toit panoramique
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+2%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.camera360}
                onChange={(e) => setAjustements({ camera360: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Caméra 360°
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+2%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.gps}
                onChange={(e) => setAjustements({ gps: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  GPS intégré / grand écran
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+1.5%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.siegesCuir}
                onChange={(e) => setAjustements({ siegesCuir: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Sièges cuir / alcantara
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+2%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.siegesChauffants}
                onChange={(e) => setAjustements({ siegesChauffants: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Sièges chauffants / ventilés
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+1.5%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.regulateurAdaptatif}
                onChange={(e) => setAjustements({ regulateurAdaptatif: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Régulateur adaptatif + maintien voie
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+2%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.pharesLED}
                onChange={(e) => setAjustements({ pharesLED: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Phares full LED / Matrix
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+2%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.jantesAlliage}
                onChange={(e) => setAjustements({ jantesAlliage: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Jantes alliage 17" ou plus
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+1.5%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.equipementsHiver}
                onChange={(e) => setAjustements({ equipementsHiver: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Équipements hiver inclus
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+1.5%</span>
              </div>
            </label>
          </div>
        </div>

        {/* Entretien et historique */}
        <div className="mb-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">
            Entretien et historique
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.carnetComplet}
                onChange={(e) => setAjustements({ carnetComplet: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Carnet d'entretien complet
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+2%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.derniereRevisionMarque}
                onChange={(e) => setAjustements({ derniereRevisionMarque: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Dernière révision en concession
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+3%</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.controletechniqueValide}
                onChange={(e) => setAjustements({ controletechniqueValide: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Contrôle technique valide
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+2%</span>
              </div>
            </label>

            <div className="p-3 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nombre de propriétaires
              </label>
              <select
                value={ajustements.nombreProprietaires}
                onChange={(e) => setAjustements({ nombreProprietaires: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11]"
              >
                <option value="1">1 (+2%)</option>
                <option value="2">2 (0%)</option>
                <option value="3">3 (-2%)</option>
                <option value="4">4+ (-5%)</option>
              </select>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={ajustements.premiereMain}
                onChange={(e) => setAjustements({ premiereMain: e.target.checked })}
                className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">
                  Première main
                </span>
                <span className="text-xs text-[#ff6d11] ml-2">+2%</span>
              </div>
            </label>
          </div>
        </div>

        {/* Accident déclaré */}
        <div className="mb-6">
          <label className="block text-base font-black text-gray-900 mb-3">
            Accident déclaré
          </label>
          <select
            value={ajustements.accidentDeclare}
            onChange={(e) => setAjustements({ accidentDeclare: e.target.value as AccidentGravite })}
            className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-gray-900"
          >
            <option value="Aucun">Aucun (0%)</option>
            <option value="Léger cosmétique">Léger cosmétique (-5%)</option>
            <option value="Moyen / structure">Moyen / structure (-10%)</option>
            <option value="Grave / économique">Grave / économique (-20%)</option>
          </select>
          {ajustements.accidentDeclare !== 'Aucun' && (
            <p className="mt-2 text-xs text-red-600">
              ⚠️ Un accident déclaré impacte significativement la valeur du véhicule
            </p>
          )}
        </div>

        {/* Autres bonus/malus */}
        <div className="mb-6">
          <h3 className="text-lg font-black text-gray-900 mb-4">
            Autres bonus/malus
          </h3>
          <div className="space-y-4">
            {/* Slider couleur */}
            <div className="p-4 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Couleur : {ajustements.couleurBonus > 0 ? '+' : ''}{ajustements.couleurBonus}%
              </label>
              <input
                type="range"
                min="-3"
                max="2"
                step="0.5"
                value={ajustements.couleurBonus}
                onChange={(e) => setAjustements({ couleurBonus: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Vive/originale (-3%)</span>
                <span>Standard (0%)</span>
                <span>Recherchée (+2%)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ajustements.pneumatiquesRecents}
                  onChange={(e) => setAjustements({ pneumatiquesRecents: e.target.checked })}
                  className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    Pneumatiques récents
                  </span>
                  <span className="text-xs text-[#ff6d11] ml-2">+1.5%</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ajustements.garantieConstructeur}
                  onChange={(e) => setAjustements({ garantieConstructeur: e.target.checked })}
                  className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    Garantie constructeur restante
                  </span>
                  <span className="text-xs text-[#ff6d11] ml-2">+4%</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ajustements.etatInterieurImpeccable}
                  onChange={(e) => setAjustements({ etatInterieurImpeccable: e.target.checked })}
                  className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    État intérieur impeccable
                  </span>
                  <span className="text-xs text-[#ff6d11] ml-2">+1.5%</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ajustements.etatExterieurImpeccable}
                  onChange={(e) => setAjustements({ etatExterieurImpeccable: e.target.checked })}
                  className="w-5 h-5 text-[#ff6d11] rounded focus:ring-2 focus:ring-[#ff6d11]"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">
                    État extérieur impeccable
                  </span>
                  <span className="text-xs text-[#ff6d11] ml-2">+1.5%</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Résumé des ajustements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Résumé des ajustements actifs
          </h4>
          <div className="flex flex-wrap gap-2">
            {ajustements.etatGeneral !== 'Bon' && (
              <span className="px-3 py-1 bg-white text-xs font-medium text-gray-900 rounded-full border border-gray-200">
                État : {ajustements.etatGeneral}
              </span>
            )}
            {ajustements.kilometrageBonus !== 0 && (
              <span className="px-3 py-1 bg-white text-xs font-medium text-gray-900 rounded-full border border-gray-200">
                Km : {ajustements.kilometrageBonus > 0 ? '+' : ''}{ajustements.kilometrageBonus}%
              </span>
            )}
            {ajustements.toitPanoramique && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                Toit panoramique +4%
              </span>
            )}
            {ajustements.camera360 && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                Caméra 360° +3%
              </span>
            )}
            {ajustements.gps && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                GPS +2%
              </span>
            )}
            {ajustements.siegesCuir && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                Sièges cuir +3%
              </span>
            )}
            {ajustements.regulateurAdaptatif && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                Régulateur adaptatif +2%
              </span>
            )}
            {ajustements.carnetComplet && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                Carnet complet +3%
              </span>
            )}
            {ajustements.derniereRevisionMarque && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                Révision concession +5%
              </span>
            )}
            {ajustements.premiereMain && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                Première main +4%
              </span>
            )}
            {ajustements.pneumatiquesRecents && (
              <span className="px-3 py-1 bg-orange-50 text-xs font-medium text-[#ff6d11] rounded-full">
                Pneus récents +2%
              </span>
            )}
            {ajustements.accidentDeclare !== 'Aucun' && (
              <span className="px-3 py-1 bg-red-50 text-xs font-medium text-red-600 rounded-full">
                Accident {ajustements.accidentDeclare}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

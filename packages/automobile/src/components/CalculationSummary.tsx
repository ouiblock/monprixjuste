import { Card, Button } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import { Download, TrendingUp, TrendingDown, AlertCircle, FileText, CheckCircle2, Sparkles } from 'lucide-react';
import { generateAutoPDF } from '../pdf/pdfAuto';
import Tooltip from '../../../../apps/web/src/components/Tooltip';

const SOURCE_LABELS: Record<string, string> = {
  coteOfficielle: 'Cote officielle (La Centrale / Argus)',
  annoncesParticulier: 'Annonces particuliers',
  annoncesPro: 'Annonces professionnelles',
  rachatCash: 'Offres de rachat (Vendezvotrevoiture…)',
};

export default function CalculationSummary() {
  const { calculationResult, vehicleData, sources, ponderations, ajustements, calculate } = useAutoStore();
  const photosCount = (vehicleData.photos || []).length;

  if (!calculationResult) {
    return (
      <Card className="border-2 border-orange-200">
        <div className="p-5 sm:p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ff6d11] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-1">Prêt à calculer votre cote ?</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Ajoutez au moins une source de prix (La Centrale, Leboncoin, Vendezvotrevoiture.fr…) puis lancez le calcul pour éditer votre dossier PDF.
            </p>
          </div>
          <Button onClick={calculate} variant="primary" size="md" className="w-full">
            Calculer l'estimation
          </Button>
          <div className="pt-3 border-t border-gray-100 text-left space-y-1.5 text-xs text-gray-500">
            <p className="font-bold text-gray-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#ff6d11]" />
              Inclus dans le rapport PDF Pro :
            </p>
            <p>• Photo du véhicule en tête de page ({photosCount} photo{photosCount > 1 ? 's' : ''} prête{photosCount > 1 ? 's' : ''})</p>
            <p>• Liens des annonces en mode « Source cliquable »</p>
            <p>• Détail des pondérations & conseils de négociation</p>
          </div>
        </div>
      </Card>
    );
  }

  const {
    prixFinal,
    fourchetteBasse,
    fourchetteHaute,
    scoreConfiance,
    positionMarche,
    detailsSources,
    ajustementsAppliques,
  } = calculationResult;

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-[#ff6d11]';
    return 'bg-red-500';
  };

  const getPositionColor = (position: string) => {
    if (position === 'Très compétitif' || position === 'Compétitif') return 'text-green-600';
    if (position === 'Dans la moyenne') return 'text-[#E65A00]';
    if (position === 'Au-dessus') return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDownloadPDF = () => {
    generateAutoPDF(vehicleData, sources, ponderations, ajustements, calculationResult);
  };

  return (
    <div className="space-y-5">
      {/* ── CARTE MISE EN AVANT DU DOSSIER PDF PRO ─────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-slate-700">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6d11]/20 border border-[#ff6d11]/40 text-[#ff6d11] text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Dossier PDF Professionnel Prêt
        </div>
        <h3 className="text-lg font-black text-white mb-2">
          Téléchargez votre Avis de Valeur PDF
        </h3>
        <ul className="space-y-1.5 text-xs text-slate-300 mb-4">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6d11] flex-shrink-0" />
            <span>
              {photosCount > 0
                ? `Photo en tête de page (${photosCount} photo${photosCount > 1 ? 's' : ''})`
                : 'Page de garde pro (ajoutez une photo en haut)'}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6d11] flex-shrink-0" />
            <span>Annonces & cotes en « Source cliquable »</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6d11] flex-shrink-0" />
            <span>Arguments de vente & négociation inclus</span>
          </li>
        </ul>
        <button
          type="button"
          onClick={handleDownloadPDF}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-black text-sm rounded-xl shadow-lg transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Télécharger le rapport PDF Pro
        </button>
      </div>

      {/* Prix estimé */}
      <Card>
        <div className="p-5 sm:p-6 text-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1">
            Prix final estimé
          </h2>
          <div className="text-3xl sm:text-4xl font-black text-[#ff6d11] mb-3">
            {prixFinal.toLocaleString('fr-FR')} €
          </div>
          <div className="flex items-center justify-center flex-wrap gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 py-2 px-3 rounded-xl">
            <div className="flex items-center gap-1 font-semibold">
              <TrendingDown className="w-4 h-4 text-gray-400" />
              <span>{fourchetteBasse.toLocaleString('fr-FR')} €</span>
            </div>
            <span>—</span>
            <div className="flex items-center gap-1 font-semibold">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span>{fourchetteHaute.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Score de confiance & Positionnement */}
      <Card>
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                Score de confiance
                <Tooltip
                  content="Mesure la diversité et l'homogénéité de vos sources. Combinez La Centrale, Leboncoin et Vendezvotrevoiture.fr pour dépasser 75%."
                  position="top"
                />
              </span>
              <span className="text-lg font-black text-gray-900">{scoreConfiance}%</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getScoreColor(scoreConfiance)} transition-all duration-500`}
                style={{ width: `${scoreConfiance}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              Positionnement
              <Tooltip
                content="Compare votre prix final ajusté avec la moyenne brute des sources saisies."
                position="top"
              />
            </span>
            <span className={`text-sm font-black ${getPositionColor(positionMarche)}`}>
              {positionMarche}
            </span>
          </div>
        </div>
      </Card>

      {/* Détails des sources */}
      <Card>
        <div className="p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
            Contributions par source
          </h3>
          <div className="space-y-2.5">
            {Object.entries(detailsSources).map(([key, source]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl text-xs sm:text-sm"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {SOURCE_LABELS[key] || key}
                  </div>
                  <div className="text-xs text-gray-500">Poids : {source.poids?.toFixed(0)}%</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-[#ff6d11]">
                    {source.moyenne ? `${source.moyenne.toLocaleString('fr-FR')} €` : '—'}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Contrib. {source.contribution?.toLocaleString('fr-FR')} €
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {ajustementsAppliques.length > 0 && (
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">
              Ajustements appliqués
            </h3>
            <div className="space-y-2">
              {ajustementsAppliques.map((ajustement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2.5 bg-gray-50 rounded-lg text-xs"
                >
                  <span className="text-gray-800 font-medium">{ajustement.nom}</span>
                  <span
                    className={`font-bold whitespace-nowrap ${
                      ajustement.valeur >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {ajustement.valeur >= 0 ? '+' : ''}
                    {ajustement.valeur.toFixed(1)}% ({ajustement.impact >= 0 ? '+' : ''}
                    {Math.round(ajustement.impact).toLocaleString('fr-FR')} €)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

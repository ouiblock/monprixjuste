import { Card, Button } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import { Download, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { generateAutoPDF } from '../pdf/pdfAuto';

export default function CalculationSummary() {
  const { calculationResult, vehicleData, sources, ponderations, ajustements, calculate } = useAutoStore();

  if (!calculationResult) {
    return (
      <Card className="mb-8">
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Ajoutez au moins une source de prix et cliquez sur "Calculer" pour voir les résultats.
          </p>
          <Button onClick={calculate} variant="primary" size="lg">
            Calculer l'estimation
          </Button>
        </div>
      </Card>
    );
  }

  const { prixFinal, fourchetteBasse, fourchetteHaute, scoreConfiance, positionMarche, detailsSources, ajustementsAppliques } = calculationResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-[#ff6d11]';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPositionColor = (position: string) => {
    if (position === 'Très compétitif') return 'text-green-600';
    if (position === 'Compétitif') return 'text-green-500';
    if (position === 'Dans la moyenne') return 'text-[#E65A00]';
    if (position === 'Au-dessus') return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <Card>
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Prix estimé
          </h2>
          <div className="text-5xl font-black text-[#ff6d11] mb-4">
            {prixFinal.toLocaleString('fr-FR')} €
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <TrendingDown className="w-4 h-4" />
              <span>{fourchetteBasse.toLocaleString('fr-FR')} €</span>
            </div>
            <span>—</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{fourchetteHaute.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Score de confiance
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getScoreColor(scoreConfiance)} transition-all duration-500`}
                  style={{ width: `${scoreConfiance}%` }}
                />
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">{scoreConfiance}%</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Basé sur {Object.values(detailsSources).filter(s => s.moyenne > 0).length} catégorie(s) de sources
          </p>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Positionnement marché
          </h3>
          <div className={`text-2xl font-bold ${getPositionColor(positionMarche)}`}>
            {positionMarche}
          </div>
        </div>
      </Card>

      {ajustementsAppliques.length > 0 && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ajustements appliqués
            </h3>
            <div className="space-y-2">
              {ajustementsAppliques.map((ajustement, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">
                    {ajustement.nom}
                  </span>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${
                      ajustement.valeur >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {ajustement.valeur >= 0 ? '+' : ''}{ajustement.valeur.toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-600 ml-2">
                      ({ajustement.impact >= 0 ? '+' : ''}{ajustement.impact.toLocaleString('fr-FR')} €)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Détails des sources
          </h3>
          <div className="space-y-4">
            {Object.entries(detailsSources).map(([key, source]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-semibold text-gray-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xs text-gray-600">
                    Poids: {source.poids?.toFixed(0)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#ff6d11]">
                    {source.moyenne?.toLocaleString('fr-FR')} €
                  </div>
                  <div className="text-xs text-gray-600">
                    Contribution: {source.contribution?.toLocaleString('fr-FR')} €
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => generateAutoPDF(vehicleData, sources, ponderations, ajustements, calculationResult)}
      >
        <Download className="w-5 h-5 mr-2" />
        Exporter le rapport PDF
      </Button>
    </div>
  );
}

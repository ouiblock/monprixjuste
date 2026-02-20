import { Card, Button, Input } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { useState } from 'react';
import type { CoteOfficielle, AnnonceParticulier, AnnoncePro, RachatCash } from '../types';

export default function SourcesSection() {
  const { 
    sources, 
    addCoteOfficielle, removeCoteOfficielle,
    addAnnonceParticulier, removeAnnonceParticulier,
    addAnnoncePro, removeAnnoncePro,
    addRachatCash, removeRachatCash
  } = useAutoStore();
  
  const [showAddCote, setShowAddCote] = useState(false);
  const [showAddParticulier, setShowAddParticulier] = useState(false);
  const [showAddPro, setShowAddPro] = useState(false);
  const [showAddRachat, setShowAddRachat] = useState(false);
  
  const [newCote, setNewCote] = useState<Partial<CoteOfficielle>>({ source: 'La Centrale', prix: 0, commentaire: '' });
  const [newParticulier, setNewParticulier] = useState<Partial<AnnonceParticulier>>({ prix: 0, kilometrage: 0, annee: 2020, lien: '', commentaire: '' });
  const [newPro, setNewPro] = useState<Partial<AnnoncePro>>({ source: '', prix: 0, kilometrage: 0, annee: 2020, commentaire: '' });
  const [newRachat, setNewRachat] = useState<Partial<RachatCash>>({ societe: 'Aramisauto', prix: 0, date: new Date().toISOString().split('T')[0], conditions: '' });

  const totalSources = sources.coteOfficielle.length + 
                       sources.annoncesParticulier.length + 
                       sources.annoncesPro.length + 
                       sources.rachatCash.length;

  const handleAddCote = () => {
    addCoteOfficielle(newCote as CoteOfficielle);
    setNewCote({ source: 'La Centrale', prix: 0, commentaire: '' });
    setShowAddCote(false);
  };

  const handleAddParticulier = () => {
    addAnnonceParticulier(newParticulier as AnnonceParticulier);
    setNewParticulier({ prix: 0, kilometrage: 0, annee: 2020, lien: '', commentaire: '' });
    setShowAddParticulier(false);
  };

  const handleAddPro = () => {
    addAnnoncePro(newPro as AnnoncePro);
    setNewPro({ source: '', prix: 0, kilometrage: 0, annee: 2020, commentaire: '' });
    setShowAddPro(false);
  };

  const handleAddRachat = () => {
    addRachatCash(newRachat as RachatCash);
    setNewRachat({ societe: 'Aramisauto', prix: 0, date: new Date().toISOString().split('T')[0], conditions: '' });
    setShowAddRachat(false);
  };

  return (
    <Card className="mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Sources de comparables
          </h2>
          <span className="px-3 py-1 bg-orange-100 text-[#ff6d11] font-semibold rounded-full text-sm">
            {totalSources} source{totalSources > 1 ? 's' : ''}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Ajoutez au moins une source de prix pour calculer l'estimation. Plus vous ajoutez de sources, plus le résultat sera fiable.
        </p>

        {/* Cote Officielle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">📊 Cote officielle</h3>
            <Button
              onClick={() => setShowAddCote(!showAddCote)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {showAddCote && (
            <div className="p-4 bg-gray-50 rounded-lg mb-3">
              <div className="grid md:grid-cols-3 gap-4 mb-3">
                <select
                  value={newCote.source}
                  onChange={(e) => setNewCote({ ...newCote, source: e.target.value as 'La Centrale' | 'Argus' })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900"
                >
                  <option value="La Centrale">La Centrale</option>
                  <option value="Argus">Argus</option>
                </select>
                <Input
                  type="number"
                  placeholder="Prix (€)"
                  value={newCote.prix || ''}
                  onChange={(e) => setNewCote({ ...newCote, prix: Number(e.target.value) })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCote} variant="primary" size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Valider
                </Button>
                <Button onClick={() => setShowAddCote(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {sources.coteOfficielle.map((cote, index) => (
            <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{cote.source}</span>
                  <span className="text-[#ff6d11] font-bold ml-3">{cote.prix.toLocaleString('fr-FR')} €</span>
                </div>
                <Button
                  onClick={() => removeCoteOfficielle(cote.id!)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Annonces Particulier */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">👤 Annonces particuliers</h3>
            <Button
              onClick={() => setShowAddParticulier(!showAddParticulier)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {showAddParticulier && (
            <div className="p-4 bg-gray-50 rounded-lg mb-3">
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <Input
                  type="number"
                  placeholder="Année"
                  value={newParticulier.annee || ''}
                  onChange={(e) => setNewParticulier({ ...newParticulier, annee: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Prix (€)"
                  value={newParticulier.prix || ''}
                  onChange={(e) => setNewParticulier({ ...newParticulier, prix: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Kilométrage"
                  value={newParticulier.kilometrage || ''}
                  onChange={(e) => setNewParticulier({ ...newParticulier, kilometrage: Number(e.target.value) })}
                />
                <Input
                  type="url"
                  placeholder="Lien (optionnel)"
                  value={newParticulier.lien || ''}
                  onChange={(e) => setNewParticulier({ ...newParticulier, lien: e.target.value })}
                  className="md:col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddParticulier} variant="primary" size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Valider
                </Button>
                <Button onClick={() => setShowAddParticulier(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {sources.annoncesParticulier.map((annonce, index) => (
            <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">Particulier</span>
                  <span className="text-[#ff6d11] font-bold ml-3">{annonce.prix.toLocaleString('fr-FR')} €</span>
                  <span className="text-sm text-gray-600 ml-3">{annonce.kilometrage.toLocaleString('fr-FR')} km</span>
                </div>
                <Button
                  onClick={() => removeAnnonceParticulier(annonce.id!)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Annonces Pro */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">🏢 Annonces professionnelles</h3>
            <Button
              onClick={() => setShowAddPro(!showAddPro)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {showAddPro && (
            <div className="p-4 bg-gray-50 rounded-lg mb-3">
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <Input
                  type="text"
                  placeholder="Source (ex: Leboncoin Pro)"
                  value={newPro.source}
                  onChange={(e) => setNewPro({ ...newPro, source: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Année"
                  value={newPro.annee || ''}
                  onChange={(e) => setNewPro({ ...newPro, annee: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Prix (€)"
                  value={newPro.prix || ''}
                  onChange={(e) => setNewPro({ ...newPro, prix: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Kilométrage"
                  value={newPro.kilometrage || ''}
                  onChange={(e) => setNewPro({ ...newPro, kilometrage: Number(e.target.value) })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPro} variant="primary" size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Valider
                </Button>
                <Button onClick={() => setShowAddPro(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {sources.annoncesPro.map((annonce, index) => (
            <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{annonce.source}</span>
                  <span className="text-[#ff6d11] font-bold ml-3">{annonce.prix.toLocaleString('fr-FR')} €</span>
                  <span className="text-sm text-gray-600 ml-3">{annonce.kilometrage.toLocaleString('fr-FR')} km</span>
                </div>
                <Button
                  onClick={() => removeAnnoncePro(annonce.id!)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Rachat Cash */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">💰 Rachat cash</h3>
            <Button
              onClick={() => setShowAddRachat(!showAddRachat)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {showAddRachat && (
            <div className="p-4 bg-gray-50 rounded-lg mb-3">
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <Input
                  type="text"
                  placeholder="Société (ex: Aramisauto)"
                  value={newRachat.societe}
                  onChange={(e) => setNewRachat({ ...newRachat, societe: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Prix (€)"
                  value={newRachat.prix || ''}
                  onChange={(e) => setNewRachat({ ...newRachat, prix: Number(e.target.value) })}
                />
                <Input
                  type="date"
                  value={newRachat.date}
                  onChange={(e) => setNewRachat({ ...newRachat, date: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Conditions"
                  value={newRachat.conditions}
                  onChange={(e) => setNewRachat({ ...newRachat, conditions: e.target.value })}
                  className="md:col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddRachat} variant="primary" size="sm">
                  <Check className="w-4 h-4 mr-1" />
                  Valider
                </Button>
                <Button onClick={() => setShowAddRachat(false)} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {sources.rachatCash.map((rachat, index) => (
            <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{rachat.societe}</span>
                  <span className="text-[#ff6d11] font-bold ml-3">{rachat.prix.toLocaleString('fr-FR')} €</span>
                  <span className="text-sm text-gray-600 ml-3">{new Date(rachat.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <Button
                  onClick={() => removeRachatCash(rachat.id!)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

import { Card, Button, Input } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import { Plus, Trash2, Check, X, Edit2, RefreshCw, ExternalLink, Link2 } from 'lucide-react';
import { useState } from 'react';
import type { CoteOfficielle, AnnonceParticulier, AnnoncePro, RachatCash } from '../types';
import Tooltip from '../../../../apps/web/src/components/Tooltip';

function getValidUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`;
}

export default function SourcesSection() {
  const {
    sources,
    addCoteOfficielle,
    removeCoteOfficielle,
    updateCoteOfficielle,
    addAnnonceParticulier,
    removeAnnonceParticulier,
    updateAnnonceParticulier,
    addAnnoncePro,
    removeAnnoncePro,
    updateAnnoncePro,
    addRachatCash,
    removeRachatCash,
    updateRachatCash,
    calculate,
  } = useAutoStore();

  const [showAddCote, setShowAddCote] = useState(false);
  const [showAddParticulier, setShowAddParticulier] = useState(false);
  const [showAddPro, setShowAddPro] = useState(false);
  const [showAddRachat, setShowAddRachat] = useState(false);

  const [editingCoteId, setEditingCoteId] = useState<string | null>(null);
  const [editingParticulierId, setEditingParticulierId] = useState<string | null>(null);
  const [editingProId, setEditingProId] = useState<string | null>(null);
  const [editingRachatId, setEditingRachatId] = useState<string | null>(null);

  const [editCotePrix, setEditCotePrix] = useState(0);
  const [editCoteLien, setEditCoteLien] = useState('');
  const [editParticulierPrix, setEditParticulierPrix] = useState(0);
  const [editParticulierLien, setEditParticulierLien] = useState('');
  const [editProPrix, setEditProPrix] = useState(0);
  const [editProLien, setEditProLien] = useState('');
  const [editRachatPrix, setEditRachatPrix] = useState(0);
  const [editRachatLien, setEditRachatLien] = useState('');

  const [newCote, setNewCote] = useState<Partial<CoteOfficielle>>({
    source: 'La Centrale',
    prix: 0,
    lien: '',
    commentaire: '',
  });
  const [newParticulier, setNewParticulier] = useState<Partial<AnnonceParticulier>>({
    prix: 0,
    kilometrage: 0,
    annee: 2020,
    lien: '',
    commentaire: '',
  });
  const [newPro, setNewPro] = useState<Partial<AnnoncePro>>({
    source: 'La Centrale',
    prix: 0,
    kilometrage: 0,
    annee: 2020,
    lien: '',
    commentaire: '',
  });
  const [newRachat, setNewRachat] = useState<Partial<RachatCash>>({
    societe: 'Vendezvotrevoiture.fr',
    prix: 0,
    date: new Date().toISOString().split('T')[0],
    conditions: '',
    lien: '',
  });

  const totalSources =
    sources.coteOfficielle.length +
    sources.annoncesParticulier.length +
    sources.annoncesPro.length +
    sources.rachatCash.length;

  const handleAddCote = () => {
    if (!newCote.prix || newCote.prix <= 0) return;
    addCoteOfficielle(newCote as CoteOfficielle);
    setNewCote({ source: 'La Centrale', prix: 0, lien: '', commentaire: '' });
    setShowAddCote(false);
  };

  const handleAddParticulier = () => {
    if (!newParticulier.prix || newParticulier.prix <= 0) return;
    addAnnonceParticulier(newParticulier as AnnonceParticulier);
    setNewParticulier({ prix: 0, kilometrage: 0, annee: 2020, lien: '', commentaire: '' });
    setShowAddParticulier(false);
  };

  const handleAddPro = () => {
    if (!newPro.prix || newPro.prix <= 0) return;
    addAnnoncePro({ ...newPro, source: newPro.source || 'La Centrale' } as AnnoncePro);
    setNewPro({ source: 'La Centrale', prix: 0, kilometrage: 0, annee: 2020, lien: '', commentaire: '' });
    setShowAddPro(false);
  };

  const handleAddRachat = () => {
    if (!newRachat.prix || newRachat.prix <= 0) return;
    addRachatCash({ ...newRachat, societe: newRachat.societe || 'Vendezvotrevoiture.fr' } as RachatCash);
    setNewRachat({
      societe: 'Vendezvotrevoiture.fr',
      prix: 0,
      date: new Date().toISOString().split('T')[0],
      conditions: '',
      lien: '',
    });
    setShowAddRachat(false);
  };

  const startEditCote = (cote: CoteOfficielle) => {
    setEditingCoteId(cote.id!);
    setEditCotePrix(cote.prix);
    setEditCoteLien(cote.lien || '');
  };

  const saveEditCote = () => {
    if (editingCoteId) {
      updateCoteOfficielle(editingCoteId, { prix: editCotePrix, lien: editCoteLien });
      setEditingCoteId(null);
    }
  };

  const startEditParticulier = (annonce: AnnonceParticulier) => {
    setEditingParticulierId(annonce.id!);
    setEditParticulierPrix(annonce.prix);
    setEditParticulierLien(annonce.lien || '');
  };

  const saveEditParticulier = () => {
    if (editingParticulierId) {
      updateAnnonceParticulier(editingParticulierId, { prix: editParticulierPrix, lien: editParticulierLien });
      setEditingParticulierId(null);
    }
  };

  const startEditPro = (annonce: AnnoncePro) => {
    setEditingProId(annonce.id!);
    setEditProPrix(annonce.prix);
    setEditProLien(annonce.lien || '');
  };

  const saveEditPro = () => {
    if (editingProId) {
      updateAnnoncePro(editingProId, { prix: editProPrix, lien: editProLien });
      setEditingProId(null);
    }
  };

  const startEditRachat = (rachat: RachatCash) => {
    setEditingRachatId(rachat.id!);
    setEditRachatPrix(rachat.prix);
    setEditRachatLien(rachat.lien || '');
  };

  const saveEditRachat = () => {
    if (editingRachatId) {
      updateRachatCash(editingRachatId, { prix: editRachatPrix, lien: editRachatLien });
      setEditingRachatId(null);
    }
  };

  return (
    <Card>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              3. Sources de comparables & liens cliquables
            </h2>
            <Tooltip
              content="Ajoutez vos sources de prix (cotes La Centrale, annonces Leboncoin, offres Vendezvotrevoiture.fr…). Chaque lien d'annonce saisi apparaîtra sous forme de bouton « Source cliquable » directement dans votre PDF d'estimation."
              position="top"
            />
          </div>
          <span className="px-3 py-1 bg-orange-100 text-[#ff6d11] font-bold rounded-full text-xs sm:text-sm">
            {totalSources} source{totalSources > 1 ? 's' : ''}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
          Ajoutez au moins une source de prix pour calculer l'estimation. Renseignez l'URL des annonces pour qu'elles soient accessibles en un clic dans le rapport PDF généré.
        </p>

        {/* ── 1. Cote Officielle ─────────────────────────────── */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">📊 Cote officielle</h3>
              <Tooltip
                content="Consultez gratuitement la cote sur La Centrale (lacentrale.fr/cote-auto.php) ou L'Argus. Vous pouvez coller le lien de la page de cote pour la retrouver dans le PDF."
                position="top"
              />
            </div>
            <Button onClick={() => setShowAddCote(!showAddCote)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {showAddCote && (
            <div className="p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 mb-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newCote.source}
                  onChange={(e) => setNewCote({ ...newCote, source: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900 text-sm font-medium"
                >
                  <option value="La Centrale">La Centrale</option>
                  <option value="Argus">L'Argus</option>
                  <option value="Autre cote">Autre cote</option>
                </select>
                <Input
                  type="number"
                  placeholder="Prix de la cote (€) *"
                  value={newCote.prix || ''}
                  onChange={(e) => setNewCote({ ...newCote, prix: Number(e.target.value) })}
                />
                <div className="sm:col-span-2">
                  <Input
                    type="url"
                    placeholder="Lien vers la cote (facultatif — deviendra une Source cliquable PDF)"
                    value={newCote.lien || ''}
                    onChange={(e) => setNewCote({ ...newCote, lien: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
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
            <div key={cote.id || index} className="p-3.5 bg-white border border-gray-200 rounded-xl mb-2.5">
              {editingCoteId === cote.id ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={editCotePrix}
                      onChange={(e) => setEditCotePrix(Number(e.target.value))}
                      placeholder="Prix (€)"
                    />
                    <Input
                      type="url"
                      value={editCoteLien}
                      onChange={(e) => setEditCoteLien(e.target.value)}
                      placeholder="Lien de la cote (optionnel)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEditCote} variant="primary" size="sm">
                      <Check className="w-4 h-4 mr-1" />
                      Enregistrer
                    </Button>
                    <Button onClick={() => setEditingCoteId(null)} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-1" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">{cote.source}</span>
                      <span className="text-[#ff6d11] font-black text-base">
                        {cote.prix.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                    {cote.lien && (
                      <a
                        href={getValidUrl(cote.lien)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Source cliquable PDF active
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => startEditCote(cote)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                      title="Modifier"
                      aria-label="Modifier la cote"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCoteOfficielle(cote.id!)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                      title="Supprimer"
                      aria-label="Supprimer la cote"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── 2. Annonces Particulier ────────────────────────── */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">👤 Annonces particuliers</h3>
              <Tooltip
                content="Relevez 2 à 4 annonces de particuliers sur Leboncoin ou La Centrale pour un modèle d'année et kilométrage proches. Collez le lien de chaque annonce : il sera cliquable dans le rapport PDF."
                position="top"
              />
            </div>
            <Button onClick={() => setShowAddParticulier(!showAddParticulier)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {showAddParticulier && (
            <div className="p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 mb-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  type="number"
                  placeholder="Année (ex: 2020)"
                  value={newParticulier.annee || ''}
                  onChange={(e) => setNewParticulier({ ...newParticulier, annee: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Kilométrage (km)"
                  value={newParticulier.kilometrage || ''}
                  onChange={(e) =>
                    setNewParticulier({ ...newParticulier, kilometrage: Number(e.target.value) })
                  }
                />
                <Input
                  type="number"
                  placeholder="Prix affiché (€) *"
                  value={newParticulier.prix || ''}
                  onChange={(e) => setNewParticulier({ ...newParticulier, prix: Number(e.target.value) })}
                />
                <div className="sm:col-span-3">
                  <Input
                    type="url"
                    placeholder="Lien de l'annonce Leboncoin / La Centrale (Source cliquable dans le PDF)"
                    value={newParticulier.lien || ''}
                    onChange={(e) => setNewParticulier({ ...newParticulier, lien: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
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
            <div key={annonce.id || index} className="p-3.5 bg-white border border-gray-200 rounded-xl mb-2.5">
              {editingParticulierId === annonce.id ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={editParticulierPrix}
                      onChange={(e) => setEditParticulierPrix(Number(e.target.value))}
                      placeholder="Prix (€)"
                    />
                    <Input
                      type="url"
                      value={editParticulierLien}
                      onChange={(e) => setEditParticulierLien(e.target.value)}
                      placeholder="Lien de l'annonce"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEditParticulier} variant="primary" size="sm">
                      <Check className="w-4 h-4 mr-1" />
                      Enregistrer
                    </Button>
                    <Button onClick={() => setEditingParticulierId(null)} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-1" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        Particulier ({annonce.annee})
                      </span>
                      <span className="text-[#ff6d11] font-black text-base">
                        {annonce.prix.toLocaleString('fr-FR')} €
                      </span>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {annonce.kilometrage.toLocaleString('fr-FR')} km
                      </span>
                    </div>
                    {annonce.lien && (
                      <a
                        href={getValidUrl(annonce.lien)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Source cliquable PDF active
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => startEditParticulier(annonce)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                      title="Modifier"
                      aria-label="Modifier l'annonce particulier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAnnonceParticulier(annonce.id!)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                      title="Supprimer"
                      aria-label="Supprimer l'annonce particulier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── 3. Annonces Pro ────────────────────────────────── */}
        <div className="mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">🏢 Annonces professionnelles</h3>
              <Tooltip
                content="Annonces de concessions ou marchands sur La Centrale, Leboncoin Pro ou AutoScout24. Un abattement de -5% est appliqué dans le calcul pour neutraliser la marge et garantie pro."
                position="top"
              />
            </div>
            <Button onClick={() => setShowAddPro(!showAddPro)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {showAddPro && (
            <div className="p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 mb-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newPro.source}
                  onChange={(e) => setNewPro({ ...newPro, source: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900 text-sm font-medium"
                >
                  <option value="La Centrale">La Centrale</option>
                  <option value="Leboncoin Pro">Leboncoin Pro</option>
                  <option value="AutoScout24">AutoScout24</option>
                  <option value="Concessionnaire">Concessionnaire</option>
                  <option value="Autre Pro">Autre Pro</option>
                </select>
                <Input
                  type="number"
                  placeholder="Année (ex: 2020)"
                  value={newPro.annee || ''}
                  onChange={(e) => setNewPro({ ...newPro, annee: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Kilométrage (km)"
                  value={newPro.kilometrage || ''}
                  onChange={(e) => setNewPro({ ...newPro, kilometrage: Number(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Prix affiché (€) *"
                  value={newPro.prix || ''}
                  onChange={(e) => setNewPro({ ...newPro, prix: Number(e.target.value) })}
                />
                <div className="sm:col-span-2">
                  <Input
                    type="url"
                    placeholder="Lien de l'annonce pro (Source cliquable dans le PDF)"
                    value={newPro.lien || ''}
                    onChange={(e) => setNewPro({ ...newPro, lien: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
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
            <div key={annonce.id || index} className="p-3.5 bg-white border border-gray-200 rounded-xl mb-2.5">
              {editingProId === annonce.id ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={editProPrix}
                      onChange={(e) => setEditProPrix(Number(e.target.value))}
                      placeholder="Prix (€)"
                    />
                    <Input
                      type="url"
                      value={editProLien}
                      onChange={(e) => setEditProLien(e.target.value)}
                      placeholder="Lien de l'annonce pro"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEditPro} variant="primary" size="sm">
                      <Check className="w-4 h-4 mr-1" />
                      Enregistrer
                    </Button>
                    <Button onClick={() => setEditingProId(null)} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-1" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">
                        {annonce.source} ({annonce.annee})
                      </span>
                      <span className="text-[#ff6d11] font-black text-base">
                        {annonce.prix.toLocaleString('fr-FR')} €
                      </span>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {annonce.kilometrage.toLocaleString('fr-FR')} km
                      </span>
                    </div>
                    {annonce.lien && (
                      <a
                        href={getValidUrl(annonce.lien)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Source cliquable PDF active
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => startEditPro(annonce)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                      title="Modifier"
                      aria-label="Modifier l'annonce pro"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAnnoncePro(annonce.id!)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                      title="Supprimer"
                      aria-label="Supprimer l'annonce pro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── 4. Rachat Cash (Vendezvotrevoiture.fr, etc.) ───── */}
        <div className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                💰 Offres de reprise / rachat cash
              </h3>
              <Tooltip
                content="Valeur de rachat immédiat proposée par des plateformes comme Vendezvotrevoiture.fr, La Centrale Rachat ou un concessionnaire. Elle constitue votre prix plancher de sécurité."
                position="top"
              />
            </div>
            <Button onClick={() => setShowAddRachat(!showAddRachat)} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>

          {showAddRachat && (
            <div className="p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 mb-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newRachat.societe}
                  onChange={(e) => setNewRachat({ ...newRachat, societe: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900 text-sm font-medium"
                >
                  <option value="Vendezvotrevoiture.fr">Vendezvotrevoiture.fr</option>
                  <option value="La Centrale Rachat">La Centrale Rachat</option>
                  <option value="Reprise Concessionnaire">Reprise Concessionnaire</option>
                  <option value="Autre reprise">Autre reprise</option>
                </select>
                <Input
                  type="number"
                  placeholder="Offre de rachat (€) *"
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
                  placeholder="Conditions (ex: sans reprise, sous 7j…)"
                  value={newRachat.conditions}
                  onChange={(e) => setNewRachat({ ...newRachat, conditions: e.target.value })}
                />
                <div className="sm:col-span-2">
                  <Input
                    type="url"
                    placeholder="Lien vers l'offre (facultatif — deviendra une Source cliquable PDF)"
                    value={newRachat.lien || ''}
                    onChange={(e) => setNewRachat({ ...newRachat, lien: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
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
            <div key={rachat.id || index} className="p-3.5 bg-white border border-gray-200 rounded-xl mb-2.5">
              {editingRachatId === rachat.id ? (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={editRachatPrix}
                      onChange={(e) => setEditRachatPrix(Number(e.target.value))}
                      placeholder="Prix (€)"
                    />
                    <Input
                      type="url"
                      value={editRachatLien}
                      onChange={(e) => setEditRachatLien(e.target.value)}
                      placeholder="Lien de l'offre"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEditRachat} variant="primary" size="sm">
                      <Check className="w-4 h-4 mr-1" />
                      Enregistrer
                    </Button>
                    <Button onClick={() => setEditingRachatId(null)} variant="outline" size="sm">
                      <X className="w-4 h-4 mr-1" />
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-gray-900 text-sm sm:text-base">{rachat.societe}</span>
                      <span className="text-[#ff6d11] font-black text-base">
                        {rachat.prix.toLocaleString('fr-FR')} €
                      </span>
                      {rachat.date && (
                        <span className="text-xs text-gray-500">
                          {new Date(rachat.date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>
                    {rachat.lien && (
                      <a
                        href={getValidUrl(rachat.lien)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        Source cliquable PDF active
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => startEditRachat(rachat)}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                      title="Modifier"
                      aria-label="Modifier l'offre de rachat"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRachatCash(rachat.id!)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-gray-200 transition-colors"
                      title="Supprimer"
                      aria-label="Supprimer l'offre de rachat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bouton Mettre à jour l'estimation */}
        {totalSources > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-200">
            <Button onClick={calculate} variant="primary" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Calculer / Mettre à jour l'estimation
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

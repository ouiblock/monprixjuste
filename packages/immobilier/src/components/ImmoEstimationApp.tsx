import { useState } from 'react';
import { Calculator, AlertCircle, Building2, Plus, X, ExternalLink, Download, ChevronDown, ChevronUp, RotateCcw, CheckCircle2, Home, TrendingUp, TrendingDown } from 'lucide-react';
import type { TypeBien, EtatGeneral, ClasseDPE, Exposition, CalculationResult, DVFTransaction, AnnoncePAP, EstimationAgence, Ponderations, Ajustements } from '../types';
import { calculateImmoPrice } from '../calculation/calculatePrice';
import { generateImmoPDF } from '../pdf/pdfImmo';

interface AddressSuggestion { label: string; city: string; postcode: string; context: string; }

let _nid = 1;
const gid = () => String(_nid++);

const DEFAULT_PONDERATIONS: Ponderations = { dvf: 50, annonces: 30, estimations: 20 };
const DEFAULT_AJUSTEMENTS: Ajustements = {
  etatGeneral: 'Bon', dpe: 'Non renseigné', exposition: 'Non renseignée',
  balcon: false, terrasse: false, jardin: false, parking: false, cave: false,
  vueDegagee: false, calme: false, proximiteTransports: false, proximiteCommerce: false,
  travauxRecents: false, coproprieteEntretenue: false,
};

export default function ImmoEstimationApp() {
  // ── Bien ────────────────────────────────────────────────
  const [typeBien, setTypeBien] = useState<TypeBien>('Appartement');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [surface, setSurface] = useState(0);
  const [pieces, setPieces] = useState(0);
  const [chambres, setChambres] = useState(0);
  const [etage, setEtage] = useState(0);
  const [ascenseur, setAscenseur] = useState(false);
  const [anneeConstruction, setAnneeConstruction] = useState(2000);

  // ── Autocomplete adresse ─────────────────────────────────
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return; }
    try {
      const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5&type=housenumber`);
      const data = await res.json();
      setSuggestions((data.features || []).map((f: { properties: { label: string; city: string; postcode: string; context: string } }) => ({
        label: f.properties.label, city: f.properties.city,
        postcode: f.properties.postcode, context: f.properties.context,
      })));
      setShowSuggestions(true);
    } catch { setSuggestions([]); }
  };

  const selectSuggestion = (s: AddressSuggestion) => {
    setAdresse(s.label); setVille(s.city); setCodePostal(s.postcode);
    setSuggestions([]); setShowSuggestions(false);
  };

  // ── Sources inline ───────────────────────────────────────
  const [dvfRows, setDvfRows] = useState<DVFTransaction[]>([]);
  const [annoncesRows, setAnnoncesRows] = useState<AnnoncePAP[]>([]);
  const [estimationsRows, setEstimationsRows] = useState<EstimationAgence[]>([]);

  // ── Inline row handlers ──────────────────────────────────
  const addDvf = () => setDvfRows(r => [...r, { id: gid(), prix: 0, surface: 0, date: '', adresse: '', commentaire: '' }]);
  const removeDvf = (id: string) => setDvfRows(r => r.filter(x => x.id !== id));
  const updateDvf = (id: string, field: string, value: number | string) => setDvfRows(r => r.map(x => x.id === id ? { ...x, [field]: value } : x));

  const addAnnonce = () => setAnnoncesRows(r => [...r, { id: gid(), prix: 0, surface: 0, pieces: 0, source: 'Leboncoin', lien: '', commentaire: '' }]);
  const removeAnnonce = (id: string) => setAnnoncesRows(r => r.filter(x => x.id !== id));
  const updateAnnonce = (id: string, field: string, value: number | string) => setAnnoncesRows(r => r.map(x => x.id === id ? { ...x, [field]: value } : x));

  const addEstimation = () => setEstimationsRows(r => [...r, { id: gid(), prixMin: 0, prixMax: 0, source: 'Meilleurs Agents', date: '', commentaire: '' }]);
  const removeEstimation = (id: string) => setEstimationsRows(r => r.filter(x => x.id !== id));
  const updateEstimation = (id: string, field: string, value: number | string) => setEstimationsRows(r => r.map(x => x.id === id ? { ...x, [field]: value } : x));

  // ── Pondérations & Ajustements ──────────────────────────
  const [ponderations, setPonderationsState] = useState<Ponderations>(DEFAULT_PONDERATIONS);
  const [ajustements, setAjustementsState] = useState<Ajustements>(DEFAULT_AJUSTEMENTS);
  const [showAjust, setShowAjust] = useState(false);

  const setPond = (partial: Partial<Ponderations>) => setPonderationsState(p => ({ ...p, ...partial }));
  const setAjust = (partial: Partial<Ajustements>) => setAjustementsState(a => ({ ...a, ...partial }));

  // ── Résultat ─────────────────────────────────────────────
  const [resultat, setResultat] = useState<CalculationResult | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const dvfValides = dvfRows.filter(d => d.prix > 0 && d.surface > 0);
  const annoncesValides = annoncesRows.filter(a => a.prix > 0 && a.surface > 0);
  const estimationsValides = estimationsRows.filter(e => e.prixMin > 0 && e.prixMax > 0);
  const totalPond = ponderations.dvf + ponderations.annonces + ponderations.estimations;
  const canCalculate = surface > 0 && (dvfValides.length + annoncesValides.length + estimationsValides.length) > 0;

  const handleCalculate = () => {
    setErreur(null);
    if (surface <= 0) { setErreur('Renseignez la surface du bien.'); return; }
    if (dvfValides.length + annoncesValides.length + estimationsValides.length === 0) { setErreur('Ajoutez au moins une source de prix.'); return; }
    try {
      const propertyData = { estimationName: adresse || 'Estimation', date: new Date().toISOString().slice(0, 10), typeBien, adresse, ville, codePostal, surface, pieces, chambres, etage, ascenseur, anneeConstruction };
      const sources = { dvf: dvfValides, annonces: annoncesValides, estimations: estimationsValides };
      const result = calculateImmoPrice(propertyData, sources, ponderations, ajustements);
      setResultat(result);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur de calcul');
    }
  };

  const handleReset = () => {
    setTypeBien('Appartement'); setAdresse(''); setVille(''); setCodePostal('');
    setSurface(0); setPieces(0); setChambres(0); setEtage(0); setAscenseur(false); setAnneeConstruction(2000);
    setDvfRows([]); setAnnoncesRows([]); setEstimationsRows([]);
    setPonderationsState(DEFAULT_PONDERATIONS); setAjustementsState(DEFAULT_AJUSTEMENTS);
    setResultat(null); setErreur(null);
  };

  const handlePDF = () => {
    if (!resultat) return;
    const propertyData = { estimationName: adresse || 'Estimation', date: new Date().toISOString().slice(0, 10), typeBien, adresse, ville, codePostal, surface, pieces, chambres, etage, ascenseur, anneeConstruction };
    const sources = { dvf: dvfValides, annonces: annoncesValides, estimations: estimationsValides };
    generateImmoPDF(propertyData, sources, ponderations, ajustements, resultat);
  };

  const scoreStyle = (s: number): string => s >= 70 ? '#22c55e' : s >= 50 ? '#ff6d11' : '#ef4444';
  const posColor = (p: string) => {
    if (p === 'Très compétitif' || p === 'Compétitif') return 'text-green-700 bg-green-50 border-green-200';
    if (p === 'Dans la moyenne') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const inp = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900';
  const btnPrimary = 'inline-flex items-center px-4 py-2 rounded-lg bg-[#ff6d11] text-white text-sm font-semibold hover:bg-[#E65A00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const btnOutline = 'inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors';
  const card = 'bg-white rounded-xl border border-gray-200 shadow-sm';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[700px] md:h-[850px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/appartement.svg"
            alt="" 
            className="w-full h-full object-cover" 
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gray-900/30"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 h-full max-w-7xl relative z-10">
          <div className="flex items-center justify-center h-full">
            <div className="max-w-4xl text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff6d11] to-[#E65A00] rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* H1 */}
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                Estimation Immobilière
              </h1>

              {/* H2 */}
              <h2 className="text-3xl md:text-4xl text-white font-bold mb-8">
                Vendez votre bien au juste prix
              </h2>

              {/* H3 */}
              <h3 className="text-xl md:text-2xl text-white mb-10 leading-relaxed max-w-3xl mx-auto">
                Combinez les ventes réelles, les annonces du marché et les estimations professionnelles pour obtenir une estimation précise et argumentée.
              </h3>

              {/* Hero Proof */}
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Données du marché réel</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Ajustements personnalisés</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6d11]" />
                  <span>Rapport détaillé</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <button onClick={handleReset} className="inline-flex items-center px-6 py-3 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/20 bg-white/10 backdrop-blur-md transition-colors">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Réinitialiser
                </button>
                <button onClick={handleCalculate} disabled={!canCalculate} className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6d11] to-[#E65A00] text-white font-semibold hover:from-[#E65A00] hover:to-[#cc4e00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculer l'estimation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Resources banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm">
          <div className="flex flex-wrap gap-3 mb-3">
            {([['DVF Etalab','https://app.dvf.etalab.gouv.fr/'],['Immo-Data','https://www.immo-data.fr/'],['Leboncoin','https://www.leboncoin.fr/'],['SeLoger','https://www.seloger.com/'],['Meilleurs Agents','https://www.meilleursagents.com/']] as const).map(([l,u]) => (
              <a key={l} href={u} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">{l} <ExternalLink className="w-3 h-3" /></a>
            ))}
          </div>
          <p className="text-blue-700 text-xs leading-relaxed">
            <strong>DVF (Demandes de Valeurs Foncières)</strong> : base de données publiques de l'État français recensant toutes les ventes immobilières notariées. 
            <a href="https://www.immo-data.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Immo-Data</a> facilite l'analyse de ces données pour obtenir des prix de référence par zone.
          </p>
        </div>

        <div className="space-y-6">
          {/* Informations du bien */}
          <div className={card + ' p-6'}>
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Home className="w-5 h-5 text-[#ff6d11]" />
              Informations du bien
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Type de bien</label>
                <select className={inp} value={typeBien} onChange={e => setTypeBien(e.target.value as TypeBien)}>
                  {['Appartement','Maison','Terrain','Immeuble','Local commercial','Parking/Garage'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Surface (m²) *</label>
                <input className={inp} type="number" min="0" placeholder="Ex: 80" value={surface || ''} onChange={e => setSurface(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Pièces</label>
                <input className={inp} type="number" min="0" placeholder="Ex: 4" value={pieces || ''} onChange={e => setPieces(Number(e.target.value))} />
              </div>
              <div className="md:col-span-3 relative space-y-1">
                <label className="block text-sm font-medium text-gray-700">Adresse du bien</label>
                <input
                  className={inp}
                  placeholder="Ex: 12 Rue de la Paix, Paris"
                  value={adresse}
                  autoComplete="off"
                  onChange={e => { setAdresse(e.target.value); fetchSuggestions(e.target.value); }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <button key={i} type="button" onMouseDown={() => selectSuggestion(s)} className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0">
                        <div className="font-medium text-sm">{s.label}</div>
                        <div className="text-xs text-gray-500">{s.city} • {s.postcode} • {s.context}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input className={inp} placeholder="Paris" value={ville} onChange={e => setVille(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Code postal</label>
                <input className={inp} placeholder="75015" value={codePostal} onChange={e => setCodePostal(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Chambres</label>
                <input className={inp} type="number" min="0" value={chambres || ''} onChange={e => setChambres(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Étage</label>
                <input className={inp} type="number" min="0" value={etage || ''} onChange={e => setEtage(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Année de construction</label>
                <input className={inp} type="number" min="1800" max="2025" value={anneeConstruction} onChange={e => setAnneeConstruction(Number(e.target.value))} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="asc" checked={ascenseur} onChange={e => setAscenseur(e.target.checked)} className="w-4 h-4 accent-[#ff6d11]" />
                <label htmlFor="asc" className="text-sm font-medium text-gray-700">Ascenseur</label>
              </div>
            </div>
          </div>

          {/* Sources + Pondérations */}
          <div className={card + ' p-6'}>
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#ff6d11]" />
              Sources de prix
            </h2>

            {/* Pondérations */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-orange-800 mb-3">
                ⚖️ Pondérations — Total : {totalPond}%{totalPond !== 100 ? ' ⚠️' : ' ✓'}
              </p>
              <div className="grid gap-3 md:grid-cols-3">
                {([['dvf', 'DVF (ventes réelles)'], ['annonces', 'Annonces'], ['estimations', 'Estimations pro']] as const).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">{label} : <strong className="text-[#ff6d11]">{ponderations[key]}%</strong></label>
                    <input type="range" min={0} max={100} value={ponderations[key]} onChange={e => setPond({ [key]: Number(e.target.value) })} className="w-full accent-[#ff6d11]" />
                  </div>
                ))}
              </div>
            </div>

            {/* DVF */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-base text-gray-900">Ventes réelles DVF <span className="text-xs text-gray-500 font-normal">(prix notariés)</span></h3>
              {dvfRows.length === 0 && <p className="text-sm text-gray-400 italic">Aucune vente ajoutée.</p>}
              {dvfRows.map(row => (
                <div key={row.id} className="flex gap-2 items-center flex-wrap">
                  <input type="number" placeholder="Prix €" value={row.prix || ''} onChange={e => updateDvf(row.id, 'prix', Number(e.target.value))} className={inp + ' flex-1 min-w-[120px]'} />
                  <input type="number" placeholder="m²" value={row.surface || ''} onChange={e => updateDvf(row.id, 'surface', Number(e.target.value))} className={inp + ' w-24'} />
                  {row.prix > 0 && row.surface > 0 && <span className="text-xs text-gray-500 whitespace-nowrap">{Math.round(row.prix / row.surface).toLocaleString('fr-FR')} €/m²</span>}
                  <button onClick={() => removeDvf(row.id)} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={addDvf} className={btnOutline + ' w-full justify-center'}><Plus className="w-4 h-4 mr-2" />Ajouter une vente DVF</button>
            </div>

            {/* Annonces */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-base text-gray-900">Annonces immobilières <span className="text-xs text-gray-500 font-normal">(décote annonce → vente appliquée)</span></h3>
              {annoncesRows.length === 0 && <p className="text-sm text-gray-400 italic">Aucune annonce ajoutée.</p>}
              {annoncesRows.map(row => (
                <div key={row.id} className="flex gap-2 items-center flex-wrap">
                  <input type="number" placeholder="Prix €" value={row.prix || ''} onChange={e => updateAnnonce(row.id, 'prix', Number(e.target.value))} className={inp + ' flex-1 min-w-[120px]'} />
                  <input type="number" placeholder="m²" value={row.surface || ''} onChange={e => updateAnnonce(row.id, 'surface', Number(e.target.value))} className={inp + ' w-24'} />
                  <select value={row.source} onChange={e => updateAnnonce(row.id, 'source', e.target.value)} className={inp + ' w-auto'}>
                    {['Leboncoin','SeLoger','PAP','Bien\'ici','Autre'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  {row.prix > 0 && row.surface > 0 && <span className="text-xs text-gray-500 whitespace-nowrap">{Math.round(row.prix * 0.95 / row.surface).toLocaleString('fr-FR')} €/m² net</span>}
                  <button onClick={() => removeAnnonce(row.id)} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={addAnnonce} className={btnOutline + ' w-full justify-center'}><Plus className="w-4 h-4 mr-2" />Ajouter une annonce</button>
            </div>

            {/* Estimations pro */}
            <div className="space-y-3">
              <h3 className="font-semibold text-base text-gray-900">Estimations professionnelles <span className="text-xs text-gray-500 font-normal">(Meilleurs Agents, agences locales…)</span></h3>
              {estimationsRows.length === 0 && <p className="text-sm text-gray-400 italic">Aucune estimation ajoutée.</p>}
              {estimationsRows.map(row => (
                <div key={row.id} className="flex gap-2 items-center flex-wrap">
                  <input type="number" placeholder="Prix min €" value={row.prixMin || ''} onChange={e => updateEstimation(row.id, 'prixMin', Number(e.target.value))} className={inp + ' flex-1 min-w-[120px]'} />
                  <input type="number" placeholder="Prix max €" value={row.prixMax || ''} onChange={e => updateEstimation(row.id, 'prixMax', Number(e.target.value))} className={inp + ' flex-1 min-w-[120px]'} />
                  <select value={row.source} onChange={e => updateEstimation(row.id, 'source', e.target.value)} className={inp + ' w-auto'}>
                    {['Meilleurs Agents','Agence locale','Notaire','Autre'].map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removeEstimation(row.id)} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={addEstimation} className={btnOutline + ' w-full justify-center'}><Plus className="w-4 h-4 mr-2" />Ajouter une estimation pro</button>
            </div>
          </div>

          {/* Ajustements qualitatifs */}
          <div className={card + ' p-6'}>
            <button className="w-full flex items-center justify-between" onClick={() => setShowAjust(v => !v)}>
              <h2 className="text-xl font-bold text-gray-900">🎯 Ajustements qualitatifs</h2>
              {showAjust ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {showAjust && (
              <div className="mt-5 space-y-5">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">État général</label>
                    <select className={inp} value={ajustements.etatGeneral} onChange={e => setAjust({ etatGeneral: e.target.value as EtatGeneral })}>
                      {['Neuf / récent','Bon','À rafraîchir','À rénover'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">DPE</label>
                    <select className={inp} value={ajustements.dpe} onChange={e => setAjust({ dpe: e.target.value as ClasseDPE })}>
                      {['A','B','C','D','E','F','G','Non renseigné'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Exposition</label>
                    <select className={inp} value={ajustements.exposition} onChange={e => setAjust({ exposition: e.target.value as Exposition })}>
                      {['Sud','Double','Triple','Est','Ouest','Nord','Non renseignée'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Équipements</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {([['balcon','Balcon (+1%)'],['terrasse','Terrasse (+1,5%)'],['jardin','Jardin (+2%)'],['parking','Parking (+1%)'],['cave','Cave (+0,5%)']] as const).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded-lg hover:bg-gray-50">
                        <input type="checkbox" checked={ajustements[key]} onChange={e => setAjust({ [key]: e.target.checked })} className="w-4 h-4 accent-[#ff6d11]" />{label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Environnement</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {([['vueDegagee','Vue dégagée (+1%)'],['calme','Calme (+0,5%)'],['proximiteTransports','Proches transports (+1%)'],['proximiteCommerce','Proches commerces (+0,5%)']] as const).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded-lg hover:bg-gray-50">
                        <input type="checkbox" checked={ajustements[key]} onChange={e => setAjust({ [key]: e.target.checked })} className="w-4 h-4 accent-[#ff6d11]" />{label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Autres</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {([['travauxRecents','Travaux récents (+1,5%)'],['coproprieteEntretenue','Copropriété entretenue (+0,5%)']] as const).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer text-sm p-2 rounded-lg hover:bg-gray-50">
                        <input type="checkbox" checked={ajustements[key]} onChange={e => setAjust({ [key]: e.target.checked })} className="w-4 h-4 accent-[#ff6d11]" />{label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {erreur && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{erreur}
            </div>
          )}

          {/* CTA Calculer */}
          <div className="flex gap-3">
            <button onClick={handleCalculate} disabled={!canCalculate} className={btnPrimary + ' flex-1 justify-center py-3'}>
              <Calculator className="w-5 h-5 mr-2" />Calculer l'estimation
            </button>
            <button onClick={handleReset} className={btnOutline + ' px-4'}>
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Résultat */}
          {resultat && (
            <div className={card + ' border-2 border-[#ff6d11] p-6'}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="text-xl font-bold text-[#ff6d11]">📊 Résultat d'estimation hybride</h3>
                <button onClick={handlePDF} className={btnPrimary}>
                  <Download className="w-4 h-4 mr-2" />Export PDF
                </button>
              </div>

              {/* Source breakdown */}
              <div className="grid gap-4 md:grid-cols-3 text-sm mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 font-semibold text-xs uppercase mb-1">DVF ({ponderations.dvf}%)</p>
                  <p className="text-xl font-bold">{resultat.detailsSources.dvf.moyenne > 0 ? resultat.detailsSources.dvf.moyenne.toLocaleString('fr-FR') + ' €' : '—'}</p>
                  {resultat.detailsSources.dvf.moyenne > 0 && surface > 0 && <p className="text-xs text-blue-600 font-medium">{Math.round(resultat.detailsSources.dvf.moyenne / surface).toLocaleString('fr-FR')} €/m²</p>}
                  <p className="text-xs text-gray-500 mt-1">Contribution : {resultat.detailsSources.dvf.contribution.toLocaleString('fr-FR')} €</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-800 font-semibold text-xs uppercase mb-1">Annonces ({ponderations.annonces}%)</p>
                  <p className="text-xl font-bold">{resultat.detailsSources.annonces.moyenne > 0 ? resultat.detailsSources.annonces.moyenne.toLocaleString('fr-FR') + ' €' : '—'}</p>
                  {resultat.detailsSources.annonces.moyenne > 0 && surface > 0 && <p className="text-xs text-purple-600 font-medium">{Math.round(resultat.detailsSources.annonces.moyenne / surface).toLocaleString('fr-FR')} €/m²</p>}
                  <p className="text-xs text-gray-500 mt-1">Contribution : {resultat.detailsSources.annonces.contribution.toLocaleString('fr-FR')} €</p>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <p className="text-teal-800 font-semibold text-xs uppercase mb-1">Estimations pro ({ponderations.estimations}%)</p>
                  <p className="text-xl font-bold">{resultat.detailsSources.estimations.moyenne > 0 ? resultat.detailsSources.estimations.moyenne.toLocaleString('fr-FR') + ' €' : '—'}</p>
                  {resultat.detailsSources.estimations.moyenne > 0 && surface > 0 && <p className="text-xs text-teal-600 font-medium">{Math.round(resultat.detailsSources.estimations.moyenne / surface).toLocaleString('fr-FR')} €/m²</p>}
                  <p className="text-xs text-gray-500 mt-1">Contribution : {resultat.detailsSources.estimations.contribution.toLocaleString('fr-FR')} €</p>
                </div>
              </div>

              {/* Prix de base */}
              <div className="text-center py-3 mb-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Prix de base pondéré</p>
                <p className="text-2xl font-bold">{resultat.prixBase.toLocaleString('fr-FR')} €</p>
                <p className="text-xs text-gray-400">{resultat.prixM2.toLocaleString('fr-FR')} €/m²</p>
              </div>

              {/* Ajustements appliqués */}
              {resultat.ajustementsAppliques.length > 0 && (
                <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                  <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Ajustements appliqués</p>
                  <div className="space-y-1">
                    {resultat.ajustementsAppliques.map((aj, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{aj.nom}</span>
                        <span className={aj.valeur >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {aj.valeur >= 0 ? '+' : ''}{aj.valeur.toFixed(1)}% ({aj.impact >= 0 ? '+' : ''}{Math.round(aj.impact).toLocaleString('fr-FR')} €)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prix final */}
              <div className="border-t pt-4 mb-6">
                <p className="text-lg font-semibold mb-2">🏡 Estimation finale</p>
                <p className="text-4xl font-black text-[#ff6d11]">{resultat.prixFinal.toLocaleString('fr-FR')} €</p>
                <p className="text-sm text-gray-600 mt-1">
                  Fourchette : {resultat.fourchetteBasse.toLocaleString('fr-FR')} € – {resultat.fourchetteHaute.toLocaleString('fr-FR')} €
                </p>
              </div>

              {/* Score + Position */}
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div className="text-center py-4">
                  <div className="inline-block px-6 py-3 rounded-lg" style={{ background: scoreStyle(resultat.scoreConfiance) }}>
                    <p className="text-3xl font-bold text-white">{resultat.scoreConfiance}/100</p>
                    <p className="text-xs text-white/80">Score de confiance</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className={`px-4 py-3 rounded-lg border ${posColor(resultat.positionMarche)}`}>
                    <p className="font-semibold flex items-center gap-1">
                      {(resultat.positionMarche === 'Au-dessus' || resultat.positionMarche === 'Élevé') ? <TrendingUp className="w-4 h-4" /> : resultat.positionMarche === 'Très compétitif' ? <TrendingDown className="w-4 h-4" /> : null}
                      {resultat.positionMarche}
                    </p>
                    <p className="text-xs mt-0.5">Position marché</p>
                  </div>
                </div>
              </div>

              {/* Indicateurs complémentaires */}
              <div className="bg-gray-50 border rounded-lg p-4 space-y-4">
                <p className="text-xs font-semibold text-gray-700 uppercase">Indicateurs complémentaires</p>
                {surface > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Comparatif prix au m² par source</p>
                    <div className="grid gap-2 grid-cols-2 md:grid-cols-4 text-sm">
                      {resultat.detailsSources.dvf.moyenne > 0 && <div className="flex flex-col text-center bg-blue-50 rounded px-3 py-2"><span className="text-xs text-blue-700">DVF</span><span className="font-semibold">{Math.round(resultat.detailsSources.dvf.moyenne / surface).toLocaleString('fr-FR')} €/m²</span></div>}
                      {resultat.detailsSources.annonces.moyenne > 0 && <div className="flex flex-col text-center bg-purple-50 rounded px-3 py-2"><span className="text-xs text-purple-700">Annonces</span><span className="font-semibold">{Math.round(resultat.detailsSources.annonces.moyenne / surface).toLocaleString('fr-FR')} €/m²</span></div>}
                      {resultat.detailsSources.estimations.moyenne > 0 && <div className="flex flex-col text-center bg-teal-50 rounded px-3 py-2"><span className="text-xs text-teal-700">Estim. pro</span><span className="font-semibold">{Math.round(resultat.detailsSources.estimations.moyenne / surface).toLocaleString('fr-FR')} €/m²</span></div>}
                      <div className="flex flex-col text-center bg-orange-50 rounded px-3 py-2"><span className="text-xs text-[#ff6d11]">Final</span><span className="font-bold text-[#ff6d11]">{resultat.prixM2.toLocaleString('fr-FR')} €/m²</span></div>
                    </div>
                  </div>
                )}
                <div className="grid gap-3 md:grid-cols-3 text-sm">
                  <div className="bg-white border rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Frais de notaire estimés</p>
                    <p className="font-semibold">{Math.round(resultat.prixFinal * 0.08).toLocaleString('fr-FR')} €</p>
                    <p className="text-xs text-gray-400">~8% du prix (ancien)</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Mensualité crédit indicative</p>
                    <p className="font-semibold">{Math.round((resultat.prixFinal * (0.035 / 12)) / (1 - Math.pow(1 + 0.035 / 12, -240))).toLocaleString('fr-FR')} €/mois</p>
                    <p className="text-xs text-gray-400">Sur 20 ans à 3,5% (hors assurance)</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Coût total acquéreur estimé</p>
                    <p className="font-bold text-lg">{Math.round(resultat.prixFinal * 1.08).toLocaleString('fr-FR')} €</p>
                    <p className="text-xs text-gray-400">Prix + frais de notaire (~8%)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-4 p-6 bg-amber-50 rounded-lg border-2 border-amber-600">
            <h3 className="text-base font-bold text-amber-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />Avertissement Important
            </h3>
            <p className="text-sm text-amber-900 leading-relaxed mb-3">
              <strong>Cet outil est indicatif uniquement.</strong> Cette estimation ne remplace en aucun cas :
            </p>
            <ul className="text-sm text-amber-900 space-y-1 ml-4 mb-3">
              <li>• Un avis de valeur professionnel (notaire, expert immobilier)</li>
              <li>• Une expertise immobilière certifiée</li>
              <li>• Une estimation d'agence immobilière</li>
            </ul>
            <p className="text-sm text-amber-900 leading-relaxed">
              Pour toute transaction importante, consultez un professionnel qualifié. Les données sont saisies manuellement et les prix du marché évoluent constamment.
            </p>
          </div>

          {/* CTA Je Partage Immo */}
          <div className="mt-4 mb-12">
            <a href="https://app.jepartageimmo.fr/estimation" target="_blank" rel="noopener noreferrer">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-10 hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Home className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-white mb-2">Estimez votre bien avec Je Partage Immo</h3>
                    <p className="text-white/90 text-base font-medium">La plateforme immobilière solidaire. Vendez, achetez ou louez votre bien en toute transparence, sans frais cachés.</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-block px-6 py-3 bg-white text-indigo-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors">Découvrir</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

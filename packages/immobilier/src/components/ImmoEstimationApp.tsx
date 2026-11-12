import { useState } from 'react';
import {
  Calculator,
  AlertCircle,
  Plus,
  X,
  ExternalLink,
  Download,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Home,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle2,
  Link2,
  Sparkles,
} from 'lucide-react';
import type {
  TypeBien,
  EtatGeneral,
  ClasseDPE,
  Exposition,
  CalculationResult,
  DVFTransaction,
  AnnoncePAP,
  EstimationAgence,
  Ponderations,
  Ajustements,
} from '../types';
import { calculateImmoPrice } from '../calculation/calculatePrice';
import { generateImmoPDF } from '../pdf/pdfImmo';
import Tooltip from '../../../../apps/web/src/components/Tooltip';
import PhotoUploader from '../../../../apps/web/src/components/PhotoUploader';

interface AddressSuggestion {
  label: string;
  city: string;
  postcode: string;
  context: string;
}

let _nid = 1;
const gid = () => String(_nid++);

const DEFAULT_PONDERATIONS: Ponderations = { dvf: 50, annonces: 30, estimations: 20 };
const DEFAULT_AJUSTEMENTS: Ajustements = {
  etatGeneral: 'Bon',
  dpe: 'Non renseigné',
  exposition: 'Non renseignée',
  balcon: false,
  terrasse: false,
  jardin: false,
  parking: false,
  cave: false,
  vueDegagee: false,
  calme: false,
  proximiteTransports: false,
  proximiteCommerce: false,
  travauxRecents: false,
  coproprieteEntretenue: false,
};

export default function ImmoEstimationApp() {
  // ── Photos du bien (couverture PDF en tête de page) ─────
  const [photos, setPhotos] = useState<string[]>([]);

  // ── Bien ────────────────────────────────────────────────
  const [estimationName, setEstimationName] = useState('');
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
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5&type=housenumber`
      );
      const data = await res.json();
      setSuggestions(
        (data.features || []).map(
          (f: { properties: { label: string; city: string; postcode: string; context: string } }) => ({
            label: f.properties.label,
            city: f.properties.city,
            postcode: f.properties.postcode,
            context: f.properties.context,
          })
        )
      );
      setShowSuggestions(true);
    } catch {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (s: AddressSuggestion) => {
    setAdresse(s.label);
    setVille(s.city);
    setCodePostal(s.postcode);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // ── Sources inline ───────────────────────────────────────
  const [dvfRows, setDvfRows] = useState<DVFTransaction[]>([]);
  const [annoncesRows, setAnnoncesRows] = useState<AnnoncePAP[]>([]);
  const [estimationsRows, setEstimationsRows] = useState<EstimationAgence[]>([]);

  // ── Inline row handlers ──────────────────────────────────
  const addDvf = () =>
    setDvfRows((r) => [
      ...r,
      { id: gid(), prix: 0, surface: 0, date: '', adresse: '', commentaire: '', lien: '' },
    ]);
  const removeDvf = (id: string) => setDvfRows((r) => r.filter((x) => x.id !== id));
  const updateDvf = (id: string, field: string, value: number | string) =>
    setDvfRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const addAnnonce = () =>
    setAnnoncesRows((r) => [
      ...r,
      { id: gid(), prix: 0, surface: 0, pieces: 0, source: 'Leboncoin', lien: '', commentaire: '' },
    ]);
  const removeAnnonce = (id: string) => setAnnoncesRows((r) => r.filter((x) => x.id !== id));
  const updateAnnonce = (id: string, field: string, value: number | string) =>
    setAnnoncesRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  const addEstimation = () =>
    setEstimationsRows((r) => [
      ...r,
      { id: gid(), prixMin: 0, prixMax: 0, source: 'Agence immobilière', date: '', commentaire: '', lien: '' },
    ]);
  const removeEstimation = (id: string) => setEstimationsRows((r) => r.filter((x) => x.id !== id));
  const updateEstimation = (id: string, field: string, value: number | string) =>
    setEstimationsRows((r) => r.map((x) => (x.id === id ? { ...x, [field]: value } : x)));

  // ── Pondérations & Ajustements ──────────────────────────
  const [ponderations, setPonderationsState] = useState<Ponderations>(DEFAULT_PONDERATIONS);
  const [ajustements, setAjustementsState] = useState<Ajustements>(DEFAULT_AJUSTEMENTS);
  const [showAjust, setShowAjust] = useState(false);

  const setPond = (partial: Partial<Ponderations>) => setPonderationsState((p) => ({ ...p, ...partial }));
  const setAjust = (partial: Partial<Ajustements>) => setAjustementsState((a) => ({ ...a, ...partial }));

  // ── Résultat ─────────────────────────────────────────────
  const [resultat, setResultat] = useState<CalculationResult | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const dvfValides = dvfRows.filter((d) => d.prix > 0 && d.surface > 0);
  const annoncesValides = annoncesRows.filter((a) => a.prix > 0 && a.surface > 0);
  const estimationsValides = estimationsRows.filter((e) => e.prixMin > 0 && e.prixMax > 0);
  const totalPond = ponderations.dvf + ponderations.annonces + ponderations.estimations;
  const canCalculate =
    surface > 0 && dvfValides.length + annoncesValides.length + estimationsValides.length > 0;

  const buildPropertyData = () => ({
    estimationName: estimationName.trim() || adresse || `${typeBien} ${ville || ''}`.trim() || 'Estimation',
    date: new Date().toISOString().slice(0, 10),
    typeBien,
    adresse,
    ville,
    codePostal,
    surface,
    pieces,
    chambres,
    etage,
    ascenseur,
    anneeConstruction,
    photos,
  });

  const handleCalculate = () => {
    setErreur(null);
    if (surface <= 0) {
      setErreur('Renseignez la surface habitable du bien.');
      return;
    }
    if (dvfValides.length + annoncesValides.length + estimationsValides.length === 0) {
      setErreur('Ajoutez au moins une source de prix (DVF, annonce ou évaluation).');
      return;
    }
    try {
      const propertyData = buildPropertyData();
      const sources = { dvf: dvfValides, annonces: annoncesValides, estimations: estimationsValides };
      const result = calculateImmoPrice(propertyData, sources, ponderations, ajustements);
      setResultat(result);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur de calcul');
    }
  };

  const handleReset = () => {
    setPhotos([]);
    setEstimationName('');
    setTypeBien('Appartement');
    setAdresse('');
    setVille('');
    setCodePostal('');
    setSurface(0);
    setPieces(0);
    setChambres(0);
    setEtage(0);
    setAscenseur(false);
    setAnneeConstruction(2000);
    setDvfRows([]);
    setAnnoncesRows([]);
    setEstimationsRows([]);
    setPonderationsState(DEFAULT_PONDERATIONS);
    setAjustementsState(DEFAULT_AJUSTEMENTS);
    setResultat(null);
    setErreur(null);
  };

  const handlePDF = () => {
    if (!resultat) return;
    const propertyData = buildPropertyData();
    const sources = { dvf: dvfValides, annonces: annoncesValides, estimations: estimationsValides };
    generateImmoPDF(propertyData, sources, ponderations, ajustements, resultat);
  };

  const scoreStyle = (s: number): string => (s >= 70 ? '#22c55e' : s >= 50 ? '#ff6d11' : '#ef4444');
  const posColor = (p: string) => {
    if (p === 'Très compétitif' || p === 'Compétitif') return 'text-green-700 bg-green-50 border-green-200';
    if (p === 'Dans la moyenne') return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const inp =
    'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff6d11] bg-white text-gray-900';
  const btnPrimary =
    'inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#ff6d11] text-white text-sm font-semibold hover:bg-[#E65A00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  const btnOutline =
    'inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors';
  const card = 'bg-white rounded-2xl border border-gray-200 shadow-xs';

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative py-8 sm:py-12 md:py-16 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/appartement.svg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/65" />
        </div>

        <div className="relative z-10 w-full text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mx-auto animate-fade-in">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#ff6d11] mb-2 sm:mb-3">
                Outil d'estimation hybride — Immobilier
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3 sm:mb-4">
                Estimez votre bien.<br />
                <span className="text-[#ff6d11]">Vendez au juste prix.</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
                Combinez les ventes réelles notariées (DVF Etalab & Immo-Data), les annonces du marché et les avis de valeur pour générer un dossier PDF professionnel avec photos et sources cliquables.
              </p>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6">
                {[
                  'Ventes DVF & Immo-Data',
                  'Photos en tête de page PDF',
                  'Sources cliquables dans le PDF',
                  '100% privé & gratuit',
                ].map((label) => (
                  <span
                    key={label}
                    className="text-xs font-semibold text-gray-800 bg-white/90 border border-gray-300 px-2.5 py-1 rounded-full shadow-2xs"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById('calculateur')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Démarrer l'estimation <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium text-xs sm:text-sm transition-colors rounded-lg hover:bg-gray-900/5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div id="calculateur" className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Resources banner — 100% Agnostic : Immo-Data, DVF Etalab & plateformes classiques */}
        <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl text-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <span className="font-bold text-blue-950 text-xs sm:text-sm flex items-center gap-1.5">
              🔍 Où trouver vos données de référence ?
              <Tooltip
                content="Consultez gratuitement les ventes notariées réelles sur Immo-Data.fr ou DVF Etalab, puis relevez les annonces de biens similaires en vente dans votre quartier sur Leboncoin, SeLoger, PAP ou Bien'ici."
                position="top"
              />
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-white px-2.5 py-0.5 rounded-full border border-blue-200">
              Plateformes 100% indépendantes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-3">
            {(
              [
                ['Immo-Data.fr (Ventes DVF)', 'https://www.immo-data.fr/', true],
                ['DVF Etalab (Gouv)', 'https://app.dvf.etalab.gouv.fr/', true],
                ['Leboncoin', 'https://www.leboncoin.fr/', false],
                ['SeLoger', 'https://www.seloger.com/', false],
                ['PAP', 'https://www.pap.fr/', false],
                ["Bien'ici", 'https://www.bienici.com/', false],
              ] as const
            ).map(([label, url, primary]) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                    : 'bg-white text-blue-700 border border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <span className="truncate">{label}</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            ))}
          </div>
          <p className="text-blue-800 text-xs leading-relaxed">
            <strong>1. Ventes réelles :</strong> consultez{' '}
            <a
              href="https://www.immo-data.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold underline hover:no-underline"
            >
              Immo-Data.fr
            </a>{' '}
            ou{' '}
            <a
              href="https://app.dvf.etalab.gouv.fr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold underline hover:no-underline"
            >
              DVF Etalab
            </a>{' '}
            (données publiques des actes notariés).{' '}
            <strong>2. Marché actuel :</strong> comparez avec les annonces sur Leboncoin, SeLoger ou PAP et collez leurs liens pour les rendre cliquables dans votre PDF.
          </p>
        </div>

        <div className="space-y-6">
          {/* ── ÉTAPE 0 : PHOTOS DU BIEN (EN TÊTE DU PDF) ────────── */}
          <PhotoUploader
            photos={photos}
            onChange={setPhotos}
            title="1. Photos du bien immobilier (En-tête du rapport PDF)"
            subtitle="Importez une ou plusieurs photos de votre bien (façade, séjour, jardin…). La photo principale illustrera l'en-tête de la première page de votre PDF d'estimation."
          />

          {/* ── ÉTAPE 1 : INFORMATIONS DU BIEN ───────────────────── */}
          <div className={card + ' p-4 sm:p-6'}>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Home className="w-5 h-5 text-[#ff6d11] flex-shrink-0" />
              <span>2. Informations du bien</span>
              <Tooltip
                content="Renseignez les caractéristiques principales de votre bien. La surface habitable est indispensable pour calculer le prix au m² à partir des ventes DVF et des annonces comparables."
                position="top"
              />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2 md:col-span-3 space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Titre du dossier d'estimation (facultatif)
                  <Tooltip
                    content="Ce titre apparaîtra en grand sur la couverture de votre rapport PDF (ex: 'Appartement T3 Biarritz Centre'). S'il est laissé vide, l'adresse sera utilisée."
                    position="top"
                  />
                </label>
                <input
                  className={inp}
                  placeholder="Ex: Appartement T3 lumineux — Quartier Saint-Charles"
                  value={estimationName}
                  onChange={(e) => setEstimationName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Type de bien
                  <Tooltip
                    content="Le type de bien adapte les conseils de vente et de négociation générés dans votre rapport PDF."
                    position="top"
                  />
                </label>
                <select
                  className={inp}
                  value={typeBien}
                  onChange={(e) => setTypeBien(e.target.value as TypeBien)}
                >
                  {['Appartement', 'Maison', 'Terrain', 'Immeuble', 'Local commercial', 'Parking/Garage'].map(
                    (t) => (
                      <option key={t}>{t}</option>
                    )
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Surface habitable (m²) *
                  <Tooltip
                    content="Indiquez la surface habitable (Loi Boutin) ou Loi Carrez en copropriété. Les annexes (balcon, terrasse, cave, jardin) sont valorisées séparément dans les ajustements qualitatifs."
                    position="top"
                  />
                </label>
                <input
                  className={inp}
                  type="number"
                  min="0"
                  placeholder="Ex: 80"
                  value={surface || ''}
                  onChange={(e) => setSurface(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Nombre de pièces
                  <Tooltip
                    content="Nombre total de pièces principales (séjour + chambres, hors cuisine, salle de bain et sanitaires)."
                    position="top"
                  />
                </label>
                <input
                  className={inp}
                  type="number"
                  min="0"
                  placeholder="Ex: 4"
                  value={pieces || ''}
                  onChange={(e) => setPieces(Number(e.target.value))}
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3 relative space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Adresse du bien
                  <Tooltip
                    content="La saisie semi-automatique utilise la Base Adresse Nationale officielle (data.gouv.fr) pour pré-remplir la ville et le code postal."
                    position="top"
                  />
                </label>
                <input
                  className={inp}
                  placeholder="Ex: 12 Rue de la Paix, Paris"
                  value={adresse}
                  autoComplete="off"
                  onChange={(e) => {
                    setAdresse(e.target.value);
                    fetchSuggestions(e.target.value);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => selectSuggestion(s)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0"
                      >
                        <div className="font-medium text-sm">{s.label}</div>
                        <div className="text-xs text-gray-500">
                          {s.city} • {s.postcode} • {s.context}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  className={inp}
                  placeholder="Paris"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Code postal</label>
                <input
                  className={inp}
                  placeholder="75015"
                  value={codePostal}
                  onChange={(e) => setCodePostal(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Chambres</label>
                <input
                  className={inp}
                  type="number"
                  min="0"
                  placeholder="Ex: 2"
                  value={chambres || ''}
                  onChange={(e) => setChambres(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Étage
                  <Tooltip
                    content="0 pour un rez-de-chaussée. L'étage et la présence d'un ascenseur figurent sur la fiche descriptive du bien dans le rapport PDF."
                    position="top"
                  />
                </label>
                <input
                  className={inp}
                  type="number"
                  min="0"
                  value={etage || ''}
                  onChange={(e) => setEtage(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  Année de construction
                  <Tooltip
                    content="Permet de contextualiser l'époque du bâti (ancien, années 70, récent, RT2012/RE2020) dans votre dossier d'estimation."
                    position="top"
                  />
                </label>
                <input
                  className={inp}
                  type="number"
                  min="1800"
                  max="2027"
                  value={anneeConstruction}
                  onChange={(e) => setAnneeConstruction(Number(e.target.value))}
                />
              </div>

              <div className="flex items-center gap-2 pt-2 sm:pt-6">
                <input
                  type="checkbox"
                  id="asc"
                  checked={ascenseur}
                  onChange={(e) => setAscenseur(e.target.checked)}
                  className="w-4 h-4 accent-[#ff6d11]"
                />
                <label htmlFor="asc" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Ascenseur dans l'immeuble
                </label>
              </div>
            </div>
          </div>

          {/* ── ÉTAPE 2 : SOURCES & PONDÉRATIONS ─────────────────── */}
          <div className={card + ' p-4 sm:p-6'}>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-5 flex items-center gap-2 flex-wrap">
              <Calculator className="w-5 h-5 text-[#ff6d11] flex-shrink-0" />
              <span>3. Sources de prix & liens cliquables</span>
              <Tooltip
                content="Combinez jusqu'à 3 familles de sources : ventes réelles notariées (DVF / Immo-Data), annonces en ligne (Leboncoin, SeLoger, PAP…) et évaluations professionnelles. Chaque lien d'annonce saisi sera intégré en mode « Source cliquable » dans votre PDF."
                position="top"
              />
            </h2>

            {/* Pondérations */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <div className="text-sm font-semibold text-orange-900 mb-3 flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-2">
                  ⚖️ Pondération des sources — Total : {totalPond}%{totalPond !== 100 ? ' ⚠️' : ' ✓'}
                  <Tooltip
                    content="La pondération définit le poids de chaque famille de sources. Si vous ne renseignez qu'une ou deux catégories, l'algorithme redistribue automatiquement les poids sur les sources disponibles."
                    position="top"
                  />
                </span>
                {totalPond !== 100 && (
                  <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Recommandé : total à 100%
                  </span>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {(
                  [
                    ['dvf', 'DVF / Immo-Data (ventes)'],
                    ['annonces', 'Annonces marché'],
                    ['estimations', 'Avis de valeur pro'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-1 bg-white/80 p-3 rounded-lg border border-orange-200/60">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                      <span>{label}</span>
                      <strong className="text-[#ff6d11] text-sm">{ponderations[key]}%</strong>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={ponderations[key]}
                      onChange={(e) => setPond({ [key]: Number(e.target.value) })}
                      className="w-full accent-[#ff6d11]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* DVF / Immo-Data */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-1.5 flex-wrap">
                  <span>Ventes réelles DVF / Immo-Data</span>
                  <span className="text-xs text-gray-500 font-normal">(actes notariés)</span>
                  <Tooltip
                    content="Relevez sur Immo-Data.fr ou DVF Etalab les ventes réelles proches de votre bien. Les transactions de plus de 5 ans subissent automatiquement un abattement de pondération de 30%."
                    position="top"
                  />
                </h3>
                <a
                  href="https://www.immo-data.fr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  Ouvrir Immo-Data.fr <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {dvfRows.length === 0 && (
                <p className="text-sm text-gray-400 italic">Aucune vente DVF ajoutée pour le moment.</p>
              )}

              {dvfRows.map((row) => {
                const isOld = Boolean(
                  row.date &&
                    !isNaN(new Date(row.date).getTime()) &&
                    new Date().getFullYear() - new Date(row.date).getFullYear() >= 5
                );
                return (
                  <div
                    key={row.id}
                    className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5 transition-all hover:border-gray-300"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-5">
                        <input
                          type="number"
                          placeholder="Prix de vente net € *"
                          value={row.prix || ''}
                          onChange={(e) => updateDvf(row.id, 'prix', Number(e.target.value))}
                          className={inp}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="number"
                          placeholder="Surface m² *"
                          value={row.surface || ''}
                          onChange={(e) => updateDvf(row.id, 'surface', Number(e.target.value))}
                          className={inp}
                        />
                      </div>
                      <div className="sm:col-span-4 flex items-center justify-between sm:justify-end gap-2">
                        {row.prix > 0 && row.surface > 0 ? (
                          <span className="text-xs font-bold text-[#ff6d11] bg-orange-50 px-2.5 py-2 rounded-lg border border-orange-200 whitespace-nowrap">
                            {Math.round(row.prix / row.surface).toLocaleString('fr-FR')} €/m²
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Prix & m² requis</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeDvf(row.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Supprimer cette vente"
                          aria-label="Supprimer cette vente"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Champs facultatifs : Adresse, Date, Lien Immo-Data / DVF */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-200/70">
                      <input
                        type="text"
                        placeholder="Adresse de la vente (facultatif)"
                        value={row.adresse || ''}
                        onChange={(e) => updateDvf(row.id, 'adresse', e.target.value)}
                        className={inp + ' text-xs'}
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">Date :</span>
                        <input
                          type="date"
                          value={row.date || ''}
                          onChange={(e) => updateDvf(row.id, 'date', e.target.value)}
                          className={inp + ' text-xs'}
                          title="Date de la transaction notariée (facultatif)"
                        />
                      </div>
                      <input
                        type="url"
                        placeholder="Lien Immo-Data / DVF (facultatif)"
                        value={row.lien || ''}
                        onChange={(e) => updateDvf(row.id, 'lien', e.target.value)}
                        className={inp + ' text-xs'}
                      />
                    </div>
                    {isOld && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/70 inline-block">
                        Transaction de plus de 5 ans : pondération réduite de 30% automatiquement.
                      </p>
                    )}
                  </div>
                );
              })}
              <button type="button" onClick={addDvf} className={btnOutline + ' w-full'}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une vente réelle (DVF / Immo-Data)
              </button>
            </div>

            {/* Annonces */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-1.5 flex-wrap">
                  <span>Annonces immobilières</span>
                  <span className="text-xs text-gray-500 font-normal">
                    (décote négociation −5% + lien cliquable PDF)
                  </span>
                  <Tooltip
                    content="Les prix affichés sur Leboncoin, SeLoger ou PAP incluent une marge de négociation. Notre algorithme applique automatiquement -5% pour estimer le prix net signé. Collez l'URL de l'annonce pour qu'elle devienne une « Source cliquable » dans le PDF."
                    position="top"
                  />
                </h3>
              </div>

              {annoncesRows.length === 0 && (
                <p className="text-sm text-gray-400 italic">Aucune annonce ajoutée pour le moment.</p>
              )}

              {annoncesRows.map((row) => {
                const validUrl =
                  row.lien &&
                  (row.lien.startsWith('http://') || row.lien.startsWith('https://')
                    ? row.lien
                    : `https://${row.lien}`);
                return (
                  <div
                    key={row.id}
                    className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5 transition-all hover:border-gray-300"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-4">
                        <input
                          type="number"
                          placeholder="Prix affiché € *"
                          value={row.prix || ''}
                          onChange={(e) => updateAnnonce(row.id, 'prix', Number(e.target.value))}
                          className={inp}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          placeholder="Surface m² *"
                          value={row.surface || ''}
                          onChange={(e) => updateAnnonce(row.id, 'surface', Number(e.target.value))}
                          className={inp}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <select
                          value={row.source}
                          onChange={(e) => updateAnnonce(row.id, 'source', e.target.value)}
                          className={inp}
                        >
                          {['Leboncoin', 'SeLoger', 'PAP', "Bien'ici", 'Logic-Immo', 'Autre'].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-2">
                        {row.prix > 0 && row.surface > 0 ? (
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-2 rounded-lg border border-purple-200 whitespace-nowrap">
                            {Math.round((row.prix * 0.95) / row.surface).toLocaleString('fr-FR')} €/m² net
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Prix & m² requis</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAnnonce(row.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Supprimer cette annonce"
                          aria-label="Supprimer cette annonce"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Lien de l'annonce pour Source Cliquable PDF */}
                    <div className="pt-2 border-t border-gray-200/70 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative flex-1 flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-blue-600 flex-shrink-0 hidden sm:block" />
                        <input
                          type="url"
                          placeholder="URL de l'annonce (deviendra une « Source cliquable » dans le PDF)"
                          value={row.lien || ''}
                          onChange={(e) => updateAnnonce(row.id, 'lien', e.target.value)}
                          className={inp + ' text-xs'}
                        />
                      </div>
                      {row.lien && (
                        <a
                          href={validUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                          title="Vérifier le lien de l'annonce"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Source cliquable active</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
              <button type="button" onClick={addAnnonce} className={btnOutline + ' w-full'}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une annonce comparable (Leboncoin, SeLoger, PAP…)
              </button>
            </div>

            {/* Estimations pro (100% Agnostic) */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-1.5 flex-wrap">
                <span>Avis de valeur & Évaluations externes</span>
                <span className="text-xs text-gray-500 font-normal">(agences locales, notaires, experts…)</span>
                <Tooltip
                  content="Si vous disposez déjà d'une fourchette communiquée par un professionnel (agence immobilière locale, étude notariale, expert), saisissez sa fourchette basse et haute. Vous pouvez aussi joindre un lien vers le document."
                  position="top"
                />
              </h3>
              {estimationsRows.length === 0 && (
                <p className="text-sm text-gray-400 italic">Aucun avis de valeur ajouté pour le moment.</p>
              )}
              {estimationsRows.map((row) => {
                const validUrl =
                  row.lien &&
                  (row.lien.startsWith('http://') || row.lien.startsWith('https://')
                    ? row.lien
                    : `https://${row.lien}`);
                return (
                  <div
                    key={row.id}
                    className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5 transition-all hover:border-gray-300"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                      <div className="sm:col-span-4">
                        <input
                          type="number"
                          placeholder="Fourchette basse € *"
                          value={row.prixMin || ''}
                          onChange={(e) => updateEstimation(row.id, 'prixMin', Number(e.target.value))}
                          className={inp}
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <input
                          type="number"
                          placeholder="Fourchette haute € *"
                          value={row.prixMax || ''}
                          onChange={(e) => updateEstimation(row.id, 'prixMax', Number(e.target.value))}
                          className={inp}
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <select
                          value={row.source}
                          onChange={(e) => updateEstimation(row.id, 'source', e.target.value)}
                          className={inp}
                        >
                          {[
                            'Agence immobilière',
                            'Notaire',
                            'Expert immobilier',
                            'Estimation en ligne',
                            'Autre',
                          ].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeEstimation(row.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Supprimer cet avis de valeur"
                          aria-label="Supprimer cet avis de valeur"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/70 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative flex-1 flex items-center gap-2">
                        <Link2 className="w-4 h-4 text-blue-600 flex-shrink-0 hidden sm:block" />
                        <input
                          type="url"
                          placeholder="Lien vers le document ou l'évaluation en ligne (facultatif)"
                          value={row.lien || ''}
                          onChange={(e) => updateEstimation(row.id, 'lien', e.target.value)}
                          className={inp + ' text-xs'}
                        />
                      </div>
                      {row.lien && (
                        <a
                          href={validUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Source cliquable active</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
              <button type="button" onClick={addEstimation} className={btnOutline + ' w-full'}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un avis de valeur professionnel
              </button>
            </div>
          </div>

          {/* ── ÉTAPE 3 : AJUSTEMENTS QUALITATIFS ────────────────── */}
          <div className={card + ' p-4 sm:p-6'}>
            <button
              type="button"
              className="w-full flex items-center justify-between text-left gap-2"
              onClick={() => setShowAjust((v) => !v)}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  4. Ajustements qualitatifs du bien
                </h2>
                <Tooltip
                  content="Les ajustements qualitatifs valorisent ou décotent votre bien par rapport à la moyenne des comparables (état, classe DPE, exposition, extérieur, stationnement). Leur cumul est plafonné à ±20% pour garantir un résultat réaliste."
                  position="top"
                />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff6d11] bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 flex-shrink-0">
                {showAjust ? 'Masquer' : 'Afficher'}
                {showAjust ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {showAjust && (
              <div className="mt-5 space-y-5 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      État général
                      <Tooltip
                        content="'Neuf / récent' (+5%), 'Bon' (0%), 'À rafraîchir' (-5%), 'À rénover' (-12%). Soyez objectif par rapport aux biens comparables sélectionnés."
                        position="top"
                      />
                    </label>
                    <select
                      className={inp}
                      value={ajustements.etatGeneral}
                      onChange={(e) => setAjust({ etatGeneral: e.target.value as EtatGeneral })}
                    >
                      {['Neuf / récent', 'Bon', 'À rafraîchir', 'À rénover'].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      Classe énergétique DPE
                      <Tooltip
                        content="Le DPE impacte fortement la négociation : A/B (+3%), C (+1%), D (0%), E (-4%), F (-8%), G (-12%, passoires thermiques soumises aux interdictions de location)."
                        position="top"
                      />
                    </label>
                    <select
                      className={inp}
                      value={ajustements.dpe}
                      onChange={(e) => setAjust({ dpe: e.target.value as ClasseDPE })}
                    >
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Non renseigné'].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      Exposition principale
                      <Tooltip
                        content="Une exposition Sud (+1%), Double (+1.5%) ou Triple (+2%) apporte un gain de luminosité recherché. L'exposition Nord entraîne une légère décote (-1.5%)."
                        position="top"
                      />
                    </label>
                    <select
                      className={inp}
                      value={ajustements.exposition}
                      onChange={(e) => setAjust({ exposition: e.target.value as Exposition })}
                    >
                      {['Sud', 'Double', 'Triple', 'Est', 'Ouest', 'Nord', 'Non renseignée'].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2.5">Annexes & Équipements</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {(
                      [
                        ['balcon', 'Balcon (+1%)'],
                        ['terrasse', 'Terrasse (+1,5%)'],
                        ['jardin', 'Jardin privatif (+2%)'],
                        ['parking', 'Parking / Box (+1%)'],
                        ['cave', 'Cave (+0,5%)'],
                      ] as const
                    ).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2.5 cursor-pointer text-sm p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={ajustements[key]}
                          onChange={(e) => setAjust({ [key]: e.target.checked })}
                          className="w-4 h-4 accent-[#ff6d11]"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2.5">Environnement & Bâti</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {(
                      [
                        ['vueDegagee', 'Vue dégagée (+1%)'],
                        ['calme', 'Environnement calme (+0,5%)'],
                        ['proximiteTransports', 'Proche transports (+1%)'],
                        ['proximiteCommerce', 'Proche commerces (+0,5%)'],
                        ['travauxRecents', 'Travaux récents (+1,5%)'],
                        ['coproprieteEntretenue', 'Copropriété entretenue (+0,5%)'],
                      ] as const
                    ).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex items-center gap-2.5 cursor-pointer text-sm p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={ajustements[key]}
                          onChange={(e) => setAjust({ [key]: e.target.checked })}
                          className="w-4 h-4 accent-[#ff6d11]"
                        />
                        <span>{label}</span>
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
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{erreur}</span>
            </div>
          )}

          {/* CTA Calculer */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={!canCalculate}
              className={btnPrimary + ' flex-1 py-3.5 text-base shadow-md'}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculer l'estimation et préparer le dossier PDF
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={btnOutline + ' px-5 py-3.5'}
              title="Réinitialiser tout le formulaire"
            >
              <RotateCcw className="w-5 h-5 mr-2 sm:mr-0" />
              <span className="sm:hidden">Réinitialiser</span>
            </button>
          </div>

          {/* ── RÉSULTAT & MISE EN AVANT DU DOSSIER PDF PRO ──────── */}
          {resultat && (
            <div className="space-y-6 animate-fade-in">
              {/* Carte de résultat principal */}
              <div className={card + ' border-2 border-[#ff6d11] p-4 sm:p-6'}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ff6d11]">
                      Synthèse de valorisation
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                      Résultat de votre estimation hybride
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handlePDF}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#ff6d11]" />
                    Télécharger le rapport PDF Pro
                  </button>
                </div>

                {/* Source breakdown */}
                <div className="grid gap-3 sm:grid-cols-3 text-sm mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
                    <p className="text-blue-800 font-semibold text-xs uppercase mb-1">
                      DVF / Immo-Data ({ponderations.dvf}%)
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {resultat.detailsSources.dvf.moyenne > 0
                        ? resultat.detailsSources.dvf.moyenne.toLocaleString('fr-FR') + ' €'
                        : '—'}
                    </p>
                    {resultat.detailsSources.dvf.moyenne > 0 && surface > 0 && (
                      <p className="text-xs text-blue-700 font-medium">
                        {Math.round(resultat.detailsSources.dvf.moyenne / surface).toLocaleString('fr-FR')} €/m²
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Contribution : {resultat.detailsSources.dvf.contribution.toLocaleString('fr-FR')} €
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
                    <p className="text-purple-800 font-semibold text-xs uppercase mb-1">
                      Annonces ({ponderations.annonces}%)
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {resultat.detailsSources.annonces.moyenne > 0
                        ? resultat.detailsSources.annonces.moyenne.toLocaleString('fr-FR') + ' €'
                        : '—'}
                    </p>
                    {resultat.detailsSources.annonces.moyenne > 0 && surface > 0 && (
                      <p className="text-xs text-purple-700 font-medium">
                        {Math.round(resultat.detailsSources.annonces.moyenne / surface).toLocaleString('fr-FR')} €/m²
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Contribution : {resultat.detailsSources.annonces.contribution.toLocaleString('fr-FR')} €
                    </p>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5">
                    <p className="text-teal-800 font-semibold text-xs uppercase mb-1">
                      Avis de valeur ({ponderations.estimations}%)
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      {resultat.detailsSources.estimations.moyenne > 0
                        ? resultat.detailsSources.estimations.moyenne.toLocaleString('fr-FR') + ' €'
                        : '—'}
                    </p>
                    {resultat.detailsSources.estimations.moyenne > 0 && surface > 0 && (
                      <p className="text-xs text-teal-700 font-medium">
                        {Math.round(resultat.detailsSources.estimations.moyenne / surface).toLocaleString('fr-FR')}{' '}
                        €/m²
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Contribution : {resultat.detailsSources.estimations.contribution.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>

                {/* Prix de base */}
                <div className="text-center py-3 mb-4 bg-gray-50 rounded-xl border border-gray-200/60">
                  <p className="text-xs sm:text-sm text-gray-500">Prix de base pondéré (avant ajustements)</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {resultat.prixBase.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-xs text-gray-500">{resultat.prixM2.toLocaleString('fr-FR')} €/m²</p>
                </div>

                {/* Ajustements appliqués */}
                {resultat.ajustementsAppliques.length > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
                      Ajustements qualitatifs appliqués
                    </p>
                    <div className="space-y-1.5">
                      {resultat.ajustementsAppliques.map((aj, i) => (
                        <div key={i} className="flex justify-between items-center gap-2 text-xs sm:text-sm">
                          <span className="text-gray-800">{aj.nom}</span>
                          <span
                            className={`font-semibold whitespace-nowrap ${
                              aj.valeur >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {aj.valeur >= 0 ? '+' : ''}
                            {aj.valeur.toFixed(1)}% ({aj.impact >= 0 ? '+' : ''}
                            {Math.round(aj.impact).toLocaleString('fr-FR')} €)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prix final */}
                <div className="border-t border-gray-200 pt-5 mb-6 text-center sm:text-left">
                  <p className="text-sm font-semibold text-gray-600 mb-1">🏡 Valeur finale estimée</p>
                  <p className="text-3xl sm:text-5xl font-black text-[#ff6d11]">
                    {resultat.prixFinal.toLocaleString('fr-FR')} €
                  </p>
                  <p className="text-sm text-gray-600 mt-1.5">
                    Fourchette recommandée :{' '}
                    <strong>{resultat.fourchetteBasse.toLocaleString('fr-FR')} €</strong> –{' '}
                    <strong>{resultat.fourchetteHaute.toLocaleString('fr-FR')} €</strong>
                  </p>
                </div>

                {/* Score + Position */}
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div
                      className="inline-block px-6 py-2.5 rounded-xl shadow-xs"
                      style={{ background: scoreStyle(resultat.scoreConfiance) }}
                    >
                      <p className="text-2xl sm:text-3xl font-bold text-white">{resultat.scoreConfiance}/100</p>
                      <p className="text-xs text-white/90">Indice de confiance</p>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
                      <span>Fiabilité des sources</span>
                      <Tooltip
                        content={`Score de confiance : ${resultat.scoreConfiance}/100. Il mesure la quantité, la diversité et la cohérence des sources saisies. 70+ : excellent. 50-69 : correct. <50 : enrichissez avec d'autres ventes DVF sur Immo-Data.`}
                        position="top"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className={`px-4 py-2.5 rounded-xl border ${posColor(resultat.positionMarche)}`}>
                      <p className="font-bold flex items-center gap-1.5">
                        {resultat.positionMarche === 'Au-dessus' || resultat.positionMarche === 'Élevé' ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : resultat.positionMarche === 'Très compétitif' ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : null}
                        {resultat.positionMarche}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                      <span>Positionnement marché</span>
                      <Tooltip
                        content="Indique comment votre bien se situe par rapport à la moyenne brute des sources après prise en compte de ses caractéristiques propres (DPE, état, extérieur…)."
                        position="top"
                      />
                    </div>
                  </div>
                </div>

                {/* Indicateurs complémentaires */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-gray-700 uppercase">
                      Indicateurs financiers acquéreur
                    </p>
                    <Tooltip
                      content="Ces indicateurs aident à anticiper la capacité d'emprunt des acheteurs potentiels (frais d'acte notarié dans l'ancien ~8%, mensualité sur 20 ans au taux moyen de 3,5%)."
                      position="top"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3 text-sm">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Frais de notaire estimés</p>
                      <p className="font-bold text-gray-900">
                        {Math.round(resultat.prixFinal * 0.08).toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-xs text-gray-400">~8% du prix (ancien)</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Mensualité crédit indicative</p>
                      <p className="font-bold text-gray-900">
                        {Math.round(
                          (resultat.prixFinal * (0.035 / 12)) / (1 - Math.pow(1 + 0.035 / 12, -240))
                        ).toLocaleString('fr-FR')}{' '}
                        €/mois
                      </p>
                      <p className="text-xs text-gray-400">Sur 20 ans à 3,5% (hors assurance)</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Budget total acquéreur</p>
                      <p className="font-black text-base text-[#ff6d11]">
                        {Math.round(resultat.prixFinal * 1.08).toLocaleString('fr-FR')} €
                      </p>
                      <p className="text-xs text-gray-400">Prix net + frais de notaire (~8%)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── MISE EN AVANT PROPRE & PROFESSIONNELLE DU RAPPORT PDF ── */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 rounded-2xl p-5 sm:p-8 text-white shadow-xl border border-slate-700">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6d11]/20 border border-[#ff6d11]/40 text-[#ff6d11] text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      Dossier PDF Prêt à Télécharger
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      Éditez votre Rapport d'Estimation Immobilier Complet
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                      Un document structuré sur 3 pages au format A4, conçu pour appuyer votre prix lors de vos visites ou échanges avec les acheteurs et professionnels :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#ff6d11] flex-shrink-0" />
                        <span>
                          {photos.length > 0
                            ? `Photo de couverture en tête de page (${photos.length} photo${photos.length > 1 ? 's' : ''} incluse${photos.length > 1 ? 's' : ''})`
                            : 'Page de garde exécutive (ajoutez une photo en haut pour l\'illustrer)'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#ff6d11] flex-shrink-0" />
                        <span>Annonces & références en mode « Source cliquable »</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#ff6d11] flex-shrink-0" />
                        <span>Détail des ventes DVF / Immo-Data & pondérations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#ff6d11] flex-shrink-0" />
                        <span>Stratégie de prix & conseils de négociation</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handlePDF}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-black text-base rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer"
                    >
                      <FileText className="w-5 h-5" />
                      Télécharger le PDF officiel
                    </button>
                    <span className="text-[11px] text-slate-400 text-center md:text-right">
                      Génération instantanée • 100% local & confidentiel
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-4 mb-10 p-4 sm:p-6 bg-amber-50 rounded-xl border-2 border-amber-500/80">
            <h3 className="text-sm sm:text-base font-bold text-amber-900 mb-2.5 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Avertissement Important
            </h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed mb-2.5">
              <strong>Cet outil est indicatif uniquement.</strong> Cette estimation ne remplace en aucun cas :
            </p>
            <ul className="text-xs sm:text-sm text-amber-900 space-y-1 ml-4 mb-2.5">
              <li>• Un avis de valeur professionnel (notaire, expert immobilier)</li>
              <li>• Une expertise immobilière certifiée</li>
              <li>• Une estimation d'agence immobilière</li>
            </ul>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Pour toute transaction importante, consultez un professionnel qualifié. Les données sont saisies manuellement et les prix du marché évoluent constamment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

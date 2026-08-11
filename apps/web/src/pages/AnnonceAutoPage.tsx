import { useState } from 'react';
import { 
  Car, Copy, CheckCircle, RotateCcw, ChevronRight, ChevronLeft, 
  Search, ExternalLink, Info, Sparkles, Gauge, Settings2, 
  Shield, Wrench, Fuel, Zap, MapPin, Calendar, Hash
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────
type EtatVehicule = 'excellent' | 'bon' | 'a_rafraichir';
type Carburant = 'Essence' | 'Diesel' | 'Hybride' | 'Électrique' | 'GPL' | 'Hydrogène';
type Boite = 'Manuelle' | 'Automatique' | 'Robotisée';

interface VehiculeData {
  plaque: string;
  marque: string;
  modele: string;
  version: string;
  annee: number;
  carburant: Carburant;
  boite: Boite;
  puissance: string;
  couleur: string;
}

interface VendeurData {
  kilometrage: number;
  prix: number;
  etat: EtatVehicule;
  localisation: string;
  options: string[];
  entretien: string[];
  commentaire: string;
}

// ── Constants ──────────────────────────────────────────────
const MARQUES = [
  'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes',
  'Audi', 'Toyota', 'Ford', 'Opel', 'Nissan', 'Fiat', 'Seat',
  'Skoda', 'Dacia', 'Hyundai', 'Kia', 'Volvo', 'Mini', 'Tesla',
  'Mazda', 'Honda', 'Suzuki', 'Jeep', 'Land Rover', 'Porsche'
];

const OPTIONS_LIST = [
  { id: 'gps', label: 'GPS / Navigation', icon: '📍' },
  { id: 'toit_ouvrant', label: 'Toit ouvrant / panoramique', icon: '☀️' },
  { id: 'camera_recul', label: 'Caméra de recul', icon: '📷' },
  { id: 'sieges_chauffants', label: 'Sièges chauffants', icon: '🔥' },
  { id: 'regulateur', label: 'Régulateur adaptatif', icon: '⚙️' },
  { id: 'carplay', label: 'Apple CarPlay / Android Auto', icon: '📱' },
  { id: 'jantes_alu', label: 'Jantes aluminium', icon: '🔘' },
  { id: 'radar_stationnement', label: 'Radar de stationnement', icon: '📡' },
  { id: 'led', label: 'Phares LED / Xénon', icon: '💡' },
  { id: 'cuir', label: 'Sellerie cuir', icon: '🪑' },
  { id: 'toit_panoramique', label: 'Toit panoramique', icon: '🏔️' },
  { id: 'keyless', label: 'Démarrage sans clé', icon: '🔑' },
  { id: 'climatisation_auto', label: 'Climatisation automatique', icon: '❄️' },
  { id: 'aide_stationnement', label: 'Aide au stationnement', icon: '🅿️' },
  { id: 'angle_mort', label: 'Surveillance angle mort', icon: '👁️' },
  { id: 'attelage', label: 'Attelage', icon: '🔗' },
];

const ENTRETIEN_LIST = [
  { id: 'carnet_complet', label: 'Carnet d\'entretien complet' },
  { id: 'revision_recente', label: 'Révision récente (< 6 mois)' },
  { id: 'ct_ok', label: 'Contrôle technique récent et OK' },
  { id: 'pas_sinistre', label: 'Aucun sinistre déclaré' },
  { id: 'premiere_main', label: 'Première main' },
  { id: 'non_fumeur', label: 'Véhicule non-fumeur' },
  { id: 'garage', label: 'Toujours garé en garage' },
  { id: 'pneus_neufs', label: 'Pneus neufs ou récents' },
  { id: 'distribution_faite', label: 'Distribution faite' },
  { id: 'batterie_neuve', label: 'Batterie neuve (< 1 an)' },
];

const COULEURS = [
  'Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Beige',
  'Marron', 'Orange', 'Jaune', 'Bordeaux', 'Argent', 'Autre'
];

// ── Helpers ────────────────────────────────────────────────
const formatPlaque = (val: string) => val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

const genererAnnonceAuto = (v: VehiculeData, s: VendeurData): string => {
  let a = '';

  // Titre
  a += `${v.marque} ${v.modele}`;
  if (v.version) a += ` ${v.version}`;
  a += ` — ${v.annee}`;
  a += ` — ${fmt(s.kilometrage)} km`;
  a += '\n\n';

  // Prix
  a += `Prix : ${fmt(s.prix)} €\n\n`;

  // Caractéristiques
  a += 'CARACTÉRISTIQUES\n';
  a += '━━━━━━━━━━━━━━━━━━\n';
  a += `Marque : ${v.marque}\n`;
  a += `Modèle : ${v.modele}\n`;
  if (v.version) a += `Version : ${v.version}\n`;
  a += `Année : ${v.annee}\n`;
  a += `Kilométrage : ${fmt(s.kilometrage)} km\n`;
  a += `Carburant : ${v.carburant}\n`;
  a += `Boîte : ${v.boite}\n`;
  if (v.puissance) a += `Puissance : ${v.puissance}\n`;
  if (v.couleur) a += `Couleur : ${v.couleur}\n`;
  a += `État général : ${s.etat === 'excellent' ? 'Excellent — comme neuf' : s.etat === 'bon' ? 'Bon état — normal pour l\'âge' : 'À rafraîchir — quelques travaux à prévoir'}\n`;
  if (s.localisation) a += `Localisation : ${s.localisation}\n`;
  a += '\n';

  // Options
  if (s.options.length > 0) {
    a += 'ÉQUIPEMENTS & OPTIONS\n';
    a += '━━━━━━━━━━━━━━━━━━━━━━━━\n';
    s.options.forEach(o => {
      const opt = OPTIONS_LIST.find(x => x.id === o);
      if (opt) a += `• ${opt.label}\n`;
    });
    a += '\n';
  }

  // Entretien
  if (s.entretien.length > 0) {
    a += 'ENTRETIEN & HISTORIQUE\n';
    a += '━━━━━━━━━━━━━━━━━━━━━━━━\n';
    s.entretien.forEach(e => {
      const ent = ENTRETIEN_LIST.find(x => x.id === e);
      if (ent) a += `✓ ${ent.label}\n`;
    });
    a += '\n';
  }

  // Commentaire
  if (s.commentaire.trim()) {
    a += 'DESCRIPTION\n';
    a += '━━━━━━━━━━━\n';
    a += s.commentaire.trim() + '\n\n';
  }

  // Disclaimer
  a += '━━━━━━━━━━━━━━━━━━━━━━━━\n';
  a += 'Annonce générée par MonPrixJuste.fr\n';
  a += 'Outil gratuit — Estimation et annonce automobile\n';

  return a;
};

const genererPromptIA = (v: VehiculeData, s: VendeurData): string => {
  let p = `Tu es un expert en rédaction d'annonces automobiles pour LeBonCoin et les plateformes de vente entre particuliers. Rédige une annonce persuasive, honnête et bien structurée pour le véhicule suivant :\n\n`;

  p += `VÉHICULE :\n`;
  p += `- Marque : ${v.marque}\n`;
  p += `- Modèle : ${v.modele}\n`;
  if (v.version) p += `- Version/Finition : ${v.version}\n`;
  p += `- Année : ${v.annee}\n`;
  p += `- Kilométrage : ${fmt(s.kilometrage)} km\n`;
  p += `- Carburant : ${v.carburant}\n`;
  p += `- Boîte : ${v.boite}\n`;
  if (v.puissance) p += `- Puissance : ${v.puissance}\n`;
  if (v.couleur) p += `- Couleur : ${v.couleur}\n`;
  p += `- État : ${s.etat === 'excellent' ? 'Excellent (comme neuf)' : s.etat === 'bon' ? 'Bon état' : 'À rafraîchir'}\n`;
  p += `- Prix demandé : ${fmt(s.prix)} €\n`;
  if (s.localisation) p += `- Localisation : ${s.localisation}\n`;

  if (s.options.length > 0) {
    p += `\nÉQUIPEMENTS :\n`;
    s.options.forEach(o => {
      const opt = OPTIONS_LIST.find(x => x.id === o);
      if (opt) p += `- ${opt.label}\n`;
    });
  }

  if (s.entretien.length > 0) {
    p += `\nENTRETIEN :\n`;
    s.entretien.forEach(e => {
      const ent = ENTRETIEN_LIST.find(x => x.id === e);
      if (ent) p += `- ${ent.label}\n`;
    });
  }

  if (s.commentaire.trim()) {
    p += `\nNOTES DU VENDEUR :\n${s.commentaire.trim()}\n`;
  }

  p += `\nCONSIGNES DE RÉDACTION :\n`;
  p += `1. Commence par un titre accrocheur de 60-80 caractères max (pour LeBonCoin)\n`;
  p += `2. Structure le corps en paragraphes courts et aérés\n`;
  p += `3. Mets en avant les points forts du véhicule\n`;
  p += `4. Sois honnête sur l'état et le kilométrage\n`;
  p += `5. Termine par un appel à l'action (contact, essai)\n`;
  p += `6. Utilise des mots-clés pertinents pour le référencement (marque, modèle, année, motorisation)\n`;
  p += `7. Longueur idéale : 150-300 mots\n`;
  p += `8. Ton : professionnel mais chaleureux, inspirant confiance\n`;

  return p;
};

// ── Component ──────────────────────────────────────────────
export default function AnnonceAutoPage() {
  const [step, setStep] = useState(1);

  // Step 1 - Vehicle
  const [vehicule, setVehicule] = useState<VehiculeData>({
    plaque: '', marque: '', modele: '', version: '',
    annee: new Date().getFullYear(), carburant: 'Essence',
    boite: 'Manuelle', puissance: '', couleur: '',
  });

  // Step 2 - Seller info
  const [vendeur, setVendeur] = useState<VendeurData>({
    kilometrage: 0, prix: 0, etat: 'bon',
    localisation: '', options: [], entretien: [],
    commentaire: '',
  });

  // Step 3 - Result
  const [isGenerating, setIsGenerating] = useState(false);
  const [annonceGeneree, setAnnonceGeneree] = useState('');
  const [promptIA, setPromptIA] = useState('');
  const [copiedAnnonce, setCopiedAnnonce] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTitre, setCopiedTitre] = useState(false);

  // Plaque search
  const [plaqueError, setPlaqueError] = useState('');

  const handlePlaqueSearch = () => {
    const raw = vehicule.plaque.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (raw.length < 5) {
      setPlaqueError('Saisissez une plaque valide (ex: AA123AA)');
      return;
    }
    setPlaqueError('');
    window.open('https://histovec.interieur.gouv.fr/histovec/home', '_blank', 'noopener,noreferrer');
  };

  const toggleOption = (id: string) => {
    setVendeur(v => ({
      ...v,
      options: v.options.includes(id)
        ? v.options.filter(o => o !== id)
        : [...v.options, id]
    }));
  };

  const toggleEntretien = (id: string) => {
    setVendeur(v => ({
      ...v,
      entretien: v.entretien.includes(id)
        ? v.entretien.filter(e => e !== id)
        : [...v.entretien, id]
    }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulated generation delay
    setTimeout(() => {
      setAnnonceGeneree(genererAnnonceAuto(vehicule, vendeur));
      setPromptIA(genererPromptIA(vehicule, vendeur));
      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2500);
  };

  const titre = `${vehicule.marque} ${vehicule.modele}${vehicule.version ? ' ' + vehicule.version : ''} — ${vehicule.annee} — ${fmt(vendeur.kilometrage)} km`;

  const reset = () => {
    setStep(1);
    setVehicule({ plaque: '', marque: '', modele: '', version: '', annee: new Date().getFullYear(), carburant: 'Essence', boite: 'Manuelle', puissance: '', couleur: '' });
    setVendeur({ kilometrage: 0, prix: 0, etat: 'bon', localisation: '', options: [], entretien: [], commentaire: '' });
    setAnnonceGeneree('');
    setPromptIA('');
  };

  const canGoStep2 = vehicule.marque && vehicule.modele && vehicule.annee > 0;
  const canGenerate = vendeur.kilometrage > 0 && vendeur.prix > 0;

  const inp = 'w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-base font-medium text-gray-900 transition-colors';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#ff6d11] rounded-xl flex items-center justify-center shadow-sm">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                Générateur d'annonce automobile
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Optimisé pour LeBonCoin, La Centrale, ParuVendu et toutes les marketplaces
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 mt-6">
            {[
              { n: 1, label: 'Véhicule' },
              { n: 2, label: 'Détails & prix' },
              { n: 3, label: 'Annonce' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex-1 justify-center ${
                  step === s.n
                    ? 'bg-[#ff6d11] text-white shadow-sm'
                    : step > s.n
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.n ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">{s.n}</span>
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < 2 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* ═══════════════ STEP 1: VÉHICULE ═══════════════ */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">

            {/* Plaque */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-black text-gray-900">Identification par plaque</h2>
                <span className="text-xs text-gray-400 font-medium">(facultatif)</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Consultez <strong>Histovec</strong> pour retrouver les infos exactes de votre véhicule.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  inputMode="text"
                  value={vehicule.plaque}
                  onChange={e => setVehicule({ ...vehicule, plaque: formatPlaque(e.target.value) })}
                  onKeyDown={e => { if (e.key === 'Enter') handlePlaqueSearch(); }}
                  placeholder="AA-123-AA"
                  maxLength={9}
                  className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-lg font-mono font-bold uppercase tracking-widest text-gray-900 placeholder:text-gray-300 placeholder:font-normal placeholder:tracking-normal"
                />
                <button
                  type="button"
                  onClick={handlePlaqueSearch}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  <ExternalLink className="w-5 h-5" />
                  Consulter Histovec
                </button>
              </div>
              {plaqueError && <p className="mt-2 text-sm font-medium text-red-600">{plaqueError}</p>}
              <div className="mt-3 flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Histovec ouvrira un nouvel onglet. Recopiez les infos du véhicule ci-dessous.
                </p>
              </div>
            </div>

            {/* Infos véhicule */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#ff6d11]" />
                Informations du véhicule
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">Marque *</label>
                  <input
                    list="marques-auto"
                    className={inp}
                    placeholder="Ex: Renault"
                    value={vehicule.marque}
                    onChange={e => setVehicule({ ...vehicule, marque: e.target.value })}
                  />
                  <datalist id="marques-auto">
                    {MARQUES.map(m => <option key={m} value={m} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">Modèle *</label>
                  <input className={inp} placeholder="Ex: Clio" value={vehicule.modele} onChange={e => setVehicule({ ...vehicule, modele: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">Version / Finition</label>
                  <input className={inp} placeholder="Ex: RS Line, Intens, GTI..." value={vehicule.version} onChange={e => setVehicule({ ...vehicule, version: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Année *
                  </label>
                  <input type="number" className={inp} min={1970} max={new Date().getFullYear() + 1} value={vehicule.annee || ''} onChange={e => setVehicule({ ...vehicule, annee: Number(e.target.value) })} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-1">
                    <Fuel className="w-4 h-4 text-gray-400" />
                    Carburant
                  </label>
                  <select className={inp} value={vehicule.carburant} onChange={e => setVehicule({ ...vehicule, carburant: e.target.value as Carburant })}>
                    {(['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL', 'Hydrogène'] as Carburant[]).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">Boîte</label>
                  <select className={inp} value={vehicule.boite} onChange={e => setVehicule({ ...vehicule, boite: e.target.value as Boite })}>
                    {(['Manuelle', 'Automatique', 'Robotisée'] as Boite[]).map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-1">
                    <Zap className="w-4 h-4 text-gray-400" />
                    Puissance
                  </label>
                  <input className={inp} placeholder="Ex: 130 ch / 6 CV" value={vehicule.puissance} onChange={e => setVehicule({ ...vehicule, puissance: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">Couleur</label>
                  <select className={inp} value={vehicule.couleur} onChange={e => setVehicule({ ...vehicule, couleur: e.target.value })}>
                    <option value="">Sélectionner...</option>
                    {COULEURS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Next button */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!canGoStep2}
                className="flex items-center gap-2 px-8 py-4 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-base rounded-xl transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Suivant <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════ STEP 2: DÉTAILS & PRIX ═══════════════ */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">

            {/* KM + Prix + État */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#ff6d11]" />
                Kilométrage, prix & état
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    Kilométrage (km) *
                  </label>
                  <input
                    type="number"
                    className={inp}
                    placeholder="Ex: 85000"
                    value={vendeur.kilometrage || ''}
                    onChange={e => setVendeur({ ...vendeur, kilometrage: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">Prix souhaité (€) *</label>
                  <input
                    type="number"
                    className={inp}
                    placeholder="Ex: 12500"
                    value={vendeur.prix || ''}
                    onChange={e => setVendeur({ ...vendeur, prix: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* État général - 3 radios visuels */}
              <label className="block text-sm font-bold text-gray-900 mb-3">État général</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {([
                  { val: 'excellent' as EtatVehicule, label: 'Excellent', sub: 'Comme neuf, aucun défaut', color: 'green' },
                  { val: 'bon' as EtatVehicule, label: 'Bon état', sub: 'Normal pour l\'âge', color: 'blue' },
                  { val: 'a_rafraichir' as EtatVehicule, label: 'À rafraîchir', sub: 'Quelques défauts', color: 'amber' },
                ]).map(e => (
                  <button
                    key={e.val}
                    onClick={() => setVendeur({ ...vendeur, etat: e.val })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      vendeur.etat === e.val
                        ? `border-${e.color}-500 bg-${e.color}-50 ring-2 ring-${e.color}-200`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={vendeur.etat === e.val ? {
                      borderColor: e.color === 'green' ? '#22c55e' : e.color === 'blue' ? '#3b82f6' : '#f59e0b',
                      backgroundColor: e.color === 'green' ? '#f0fdf4' : e.color === 'blue' ? '#eff6ff' : '#fffbeb',
                    } : {}}
                  >
                    <div className="text-base font-black text-gray-900">{e.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{e.sub}</div>
                  </button>
                ))}
              </div>

              {/* Localisation */}
              <div className="mt-4">
                <label className="block text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Localisation (ville ou département)
                </label>
                <input className={inp} placeholder="Ex: Biarritz, 64" value={vendeur.localisation} onChange={e => setVendeur({ ...vendeur, localisation: e.target.value })} />
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff6d11]" />
                Équipements & options
              </h2>
              <p className="text-sm text-gray-500 mb-4">Sélectionnez les équipements présents sur votre véhicule.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {OPTIONS_LIST.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                      vendeur.options.includes(opt.id)
                        ? 'bg-[#ff6d11]/10 border-2 border-[#ff6d11] text-gray-900'
                        : 'bg-gray-50 border-2 border-transparent text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Entretien */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#ff6d11]" />
                Entretien & historique
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ENTRETIEN_LIST.map(ent => (
                  <label
                    key={ent.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${
                      vendeur.entretien.includes(ent.id)
                        ? 'bg-green-50 border-2 border-green-300'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={vendeur.entretien.includes(ent.id)}
                      onChange={() => toggleEntretien(ent.id)}
                      className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-800">{ent.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Commentaire */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#ff6d11]" />
                Notes complémentaires
              </h2>
              <p className="text-sm text-gray-500 mb-3">Ajoutez des précisions utiles pour l'acheteur (motif de vente, historique, remarques).</p>
              <textarea
                className={`${inp} min-h-[100px] resize-y`}
                placeholder="Ex: Vends pour changement de véhicule, toujours bien entretenu..."
                value={vendeur.commentaire}
                onChange={e => setVendeur({ ...vendeur, commentaire: e.target.value })}
                rows={4}
              />
            </div>

            {/* Nav buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="flex items-center gap-2 px-8 py-4 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-base rounded-xl transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Générer l'annonce
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════ STEP 3: RÉSULTAT ═══════════════ */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">

            {/* Titre */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-gray-900">Titre de l'annonce</h2>
                <button
                  onClick={() => copyText(titre, setCopiedTitre)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                    copiedTitre
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {copiedTitre ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedTitre ? 'Copié' : 'Copier'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-lg font-bold text-gray-900 border border-gray-200">
                {titre}
              </div>
            </div>

            {/* Annonce brute */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Car className="w-5 h-5 text-[#ff6d11]" />
                  Annonce prête à coller
                </h2>
                <button
                  onClick={() => copyText(annonceGeneree, setCopiedAnnonce)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    copiedAnnonce
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'bg-[#ff6d11] text-white hover:bg-[#e65a00] shadow-md'
                  }`}
                >
                  {copiedAnnonce ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedAnnonce ? 'Copié !' : 'Copier l\'annonce'}
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">{annonceGeneree}</pre>
              </div>
            </div>

            {/* Prompt IA */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Prompt IA — Version enrichie
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Copiez ce prompt dans ChatGPT, Claude ou Gemini pour obtenir une annonce encore plus persuasive.
                  </p>
                </div>
                <button
                  onClick={() => copyText(promptIA, setCopiedPrompt)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${
                    copiedPrompt
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
                  }`}
                >
                  {copiedPrompt ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedPrompt ? 'Copié !' : 'Copier le prompt'}
                </button>
              </div>
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">{promptIA}</pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                Modifier les infos
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 text-gray-500 font-medium rounded-xl hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Nouvelle annonce
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm mx-4">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ff6d11] rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-black text-gray-900 mb-2">Génération en cours</h3>
              <p className="text-sm text-gray-500">Nous préparons votre annonce et le prompt IA...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

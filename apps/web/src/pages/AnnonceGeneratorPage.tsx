import { useState, useEffect } from 'react';
import { Button } from '@monprixjuste/ui';
import { 
  Home, 
  FileText, 
  Euro, 
  Zap, 
  Building2, 
  Copy, 
  RotateCcw, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

type TypeBien = 'Appartement' | 'Maison' | 'Villa' | 'Immeuble' | 'Studio';
type Orientation = 'Nord' | 'Sud' | 'Est' | 'Ouest' | 'Nord-Est' | 'Nord-Ouest' | 'Sud-Est' | 'Sud-Ouest';
type ClasseDPE = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'Vierge';
type ModeVente = 'particulier' | 'agence-hai-vendeur' | 'agence-hai-acquereur';

interface BienImmobilier {
  typeBien: TypeBien;
  ville: string;
  codePostal: string;
  surfaceHabitable: number;
  surfaceCarrez?: number;
  surfaceTerrain?: number;
  nbPieces?: number;
  nbChambres?: number;
  etage?: string;
  anneeConstruction?: string;
  orientation: Orientation;
  chauffage?: string;
  eauChaude?: string;
  parking?: string;
  cave?: string;
  ascenseur?: 'Oui' | 'Non';
  prixNet: number;
  prixFAI?: number;
  description?: string;
  classeDPE: ClasseDPE;
  classeGES: ClasseDPE;
  consommation?: number;
  depensesAnnuelles?: number;
  anneeRefPrix?: string;
  dateDiagnostic: string;
  enCopro: boolean;
  nbLots?: number;
  nbLotsHabitation?: number;
  chargesMensuelles?: number;
  precisionCharges?: string;
  procedureEnCours: boolean;
  typeProcedure?: string;
  travauxVotes: boolean;
  montantTravaux?: number;
  descriptionTravaux?: string;
}

interface HonorairesCalcul {
  honorairesTTC: number;
  honorairesHT: number;
  taux: number;
  prixFAI: number;
}

// Couleurs DPE
const DPE_COLORS: Record<ClasseDPE, string> = {
  A: '#00b300',
  B: '#00cc00',
  C: '#ffe600',
  D: '#ff9900',
  E: '#ff6600',
  F: '#ff3300',
  G: '#cc0000',
  Vierge: '#999999'
};

// Couleurs GES
const GES_COLORS: Record<ClasseDPE, string> = {
  A: '#00b300',
  B: '#00cc00',
  C: '#ffe600',
  D: '#ff9900',
  E: '#ff6600',
  F: '#ff3300',
  G: '#cc0000',
  Vierge: '#999999'
};

const TYPES_CHAUFFAGE = [
  'Collectif gaz',
  'Collectif fuel',
  'Individuel gaz',
  'Individuel fuel',
  'Individuel électrique',
  'Pompe à chaleur',
  'Bois',
  'Solaire'
];

const TYPES_EAU_CHAUDE = [
  'Collectif',
  'Individuel électrique',
  'Individuel gaz',
  'Ballon thermodynamique',
  'Solaire'
];

// Barème DGCCRF ou taux personnalisé
const calculateHonoraires = (prixNet: number, tauxPersonnalise?: number): HonorairesCalcul => {
  let honorairesTTC, taux;
  
  if (tauxPersonnalise !== undefined && tauxPersonnalise > 0) {
    // Mode taux personnalisé
    taux = tauxPersonnalise;
    honorairesTTC = prixNet * (taux / 100);
  } else {
    // Barème DGCCRF
    if (prixNet <= 250000) {
      honorairesTTC = 10611;
      taux = (honorairesTTC / prixNet) * 100;
    } else if (prixNet <= 600000) {
      taux = 4.57;
      honorairesTTC = prixNet * 0.0457;
    } else {
      taux = 3.65;
      honorairesTTC = prixNet * 0.0365;
    }
  }
  
  const honorairesHT = honorairesTTC / 1.20;
  
  return {
    honorairesTTC: Math.round(honorairesTTC),
    honorairesHT: Math.round(honorairesHT),
    taux: Math.round(taux * 100) / 100,
    prixFAI: Math.round(prixNet + honorairesTTC)
  };
};

const resolvePrixNetFromFAI = (prixFAI: number): number => {
  let low = 0;
  let high = prixFAI;
  
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const hon = calculateHonoraires(mid);
    const total = mid + hon.honorairesTTC;
    
    if (Math.abs(total - prixFAI) < 1) {
      return mid;
    }
    
    if (total < prixFAI) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return (low + high) / 2;
};

const genererAnnonce = (bien: BienImmobilier, modeVente: ModeVente, honorairesCalc?: HonorairesCalcul): string => {
  let annonce = '';
  
  // Titre
  annonce += `${bien.typeBien} ${bien.nbPieces ? bien.nbPieces + ' pièces' : ''} ${bien.nbChambres ? bien.nbChambres + ' chambres' : ''}\n`;
  annonce += `${bien.surfaceHabitable} m² • ${bien.ville} (${bien.codePostal})\n\n`;
  
  // Prix
  if (modeVente === 'particulier') {
    annonce += `Prix : ${new Intl.NumberFormat('fr-FR').format(bien.prixNet)} €\n`;
  } else if (modeVente === 'agence-hai-vendeur') {
    annonce += `Prix : ${new Intl.NumberFormat('fr-FR').format(bien.prixNet)} €\n`;
    annonce += `Honoraires à la charge du vendeur\n`;
  } else if (modeVente === 'agence-hai-acquereur' && honorairesCalc) {
    annonce += `Prix FAI : ${new Intl.NumberFormat('fr-FR').format(honorairesCalc.prixFAI)} €\n`;
    annonce += `(Prix net vendeur : ${new Intl.NumberFormat('fr-FR').format(bien.prixNet)} € + Honoraires TTC : ${new Intl.NumberFormat('fr-FR').format(honorairesCalc.honorairesTTC)} € soit ${honorairesCalc.taux.toFixed(2)}%)\n`;
  }
  annonce += '\n';
  
  // Caractéristiques
  annonce += 'CARACTÉRISTIQUES\n';
  annonce += '━━━━━━━━━━━━━━━━━━\n';
  annonce += `Type de bien : ${bien.typeBien}\n`;
  annonce += `Surface habitable : ${bien.surfaceHabitable} m² (Loi Boutin)\n`;
  
  if (bien.typeBien === 'Appartement' || bien.typeBien === 'Studio') {
    if (bien.surfaceCarrez) annonce += `Surface Carrez : ${bien.surfaceCarrez} m²\n`;
  }
  
  if (bien.typeBien === 'Maison' || bien.typeBien === 'Villa' || bien.typeBien === 'Immeuble') {
    if (bien.surfaceTerrain) annonce += `Surface terrain : ${bien.surfaceTerrain} m²\n`;
  }
  
  if (bien.nbPieces) annonce += `Nombre de pièces : ${bien.nbPieces}\n`;
  if (bien.nbChambres) annonce += `Nombre de chambres : ${bien.nbChambres}\n`;
  
  if (bien.typeBien === 'Appartement' || bien.typeBien === 'Studio') {
    if (bien.etage) annonce += `Étage : ${bien.etage}\n`;
  }
  
  if (bien.anneeConstruction) annonce += `Année de construction : ${bien.anneeConstruction}\n`;
  annonce += `Orientation : ${bien.orientation}\n`;
  
  if (bien.chauffage) annonce += `Chauffage : ${bien.chauffage}\n`;
  if (bien.eauChaude) annonce += `Eau chaude : ${bien.eauChaude}\n`;
  if (bien.parking) annonce += `Parking/Garage : ${bien.parking}\n`;
  if (bien.cave) annonce += `Cave : ${bien.cave}\n`;
  
  if ((bien.typeBien === 'Appartement' || bien.typeBien === 'Studio') && bien.ascenseur) {
    annonce += `Ascenseur : ${bien.ascenseur}\n`;
  }
  
  annonce += '\n';
  
  // DPE
  annonce += 'DIAGNOSTICS ÉNERGÉTIQUES\n';
  annonce += '━━━━━━━━━━━━━━━━━━━━━━━━\n';
  annonce += `Classe DPE : ${bien.classeDPE}\n`;
  annonce += `Classe GES : ${bien.classeGES}\n`;
  
  if (bien.classeDPE === 'F' || bien.classeDPE === 'G') {
    annonce += `\n⚠️ Logement à consommation énergétique excessive (classes F et G - Loi Climat et Résilience)\n`;
  }
  
  if (bien.consommation) {
    annonce += `Consommation énergétique : ${bien.consommation} kWh/m²/an\n`;
  }
  
  if (bien.depensesAnnuelles) {
    annonce += `Estimation des dépenses annuelles : ${new Intl.NumberFormat('fr-FR').format(bien.depensesAnnuelles)} €/an\n`;
  }
  
  if (bien.anneeRefPrix) {
    annonce += `Année de référence des prix de l'énergie : ${bien.anneeRefPrix}\n`;
  }
  
  annonce += `Date du diagnostic : ${bien.dateDiagnostic}\n\n`;
  
  // Copropriété
  if (bien.enCopro) {
    annonce += 'COPROPRIÉTÉ\n';
    annonce += '━━━━━━━━━━━━\n';
    annonce += `Nombre de lots : ${bien.nbLots}\n`;
    if (bien.nbLotsHabitation) {
      annonce += `Dont lots d'habitation : ${bien.nbLotsHabitation}\n`;
    }
    annonce += `Charges mensuelles : ${new Intl.NumberFormat('fr-FR').format(bien.chargesMensuelles || 0)} €`;
    if (bien.precisionCharges) {
      annonce += ` (${bien.precisionCharges})`;
    }
    annonce += '\n';
    
    if (bien.procedureEnCours && bien.typeProcedure) {
      annonce += `⚠️ Procédure en cours : ${bien.typeProcedure}\n`;
    }
    
    if (bien.travauxVotes) {
      if (bien.montantTravaux) {
        annonce += `Travaux votés (< 3 ans) : ${new Intl.NumberFormat('fr-FR').format(bien.montantTravaux)} €\n`;
      }
      if (bien.descriptionTravaux) {
        annonce += `Description : ${bien.descriptionTravaux}\n`;
      }
    }
    
    annonce += '\n';
  }
  
  // Description
  if (bien.description) {
    annonce += 'DESCRIPTION\n';
    annonce += '━━━━━━━━━━━\n';
    annonce += bien.description + '\n\n';
  }
  
  // Mentions légales
  annonce += 'MENTIONS LÉGALES\n';
  annonce += '━━━━━━━━━━━━━━\n';
  annonce += 'Annonce conforme à la réglementation DGCCRF (arrêté du 10/01/2017)\n';
  annonce += 'Conforme à la Loi Hoguet, Loi ALUR, Loi Climat & Résilience\n';
  annonce += 'Informations Géorisques disponibles sur demande\n';
  
  return annonce;
};

export default function AnnonceGeneratorPage() {
  // BLOC 1 - Caractéristiques
  const [typeBien, setTypeBien] = useState<TypeBien>('Appartement');
  const [ville, setVille] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [surfaceHabitable, setSurfaceHabitable] = useState<number>(0);
  const [surfaceCarrez, setSurfaceCarrez] = useState<number>(0);
  const [surfaceTerrain, setSurfaceTerrain] = useState<number>(0);
  const [nbPieces, setNbPieces] = useState<number>(0);
  const [nbChambres, setNbChambres] = useState<number>(0);
  const [etage, setEtage] = useState('');
  const [anneeConstruction, setAnneeConstruction] = useState('');
  const [orientation, setOrientation] = useState<Orientation>('Sud');
  const [chauffage, setChauffage] = useState('');
  const [eauChaude, setEauChaude] = useState('');
  const [parking, setParking] = useState('');
  const [cave, setCave] = useState('');
  const [ascenseur, setAscenseur] = useState<'Oui' | 'Non' | ''>('');
  
  // BLOC 2 - Prix
  const [modeVente, setModeVente] = useState<ModeVente>('particulier');
  const [modeSaisie, setModeSaisie] = useState<'net' | 'fai'>('net');
  const [modeCalcul, setModeCalcul] = useState<'dgccrf' | 'taux' | 'fai_net'>('dgccrf');
  const [tauxPersonnalise, setTauxPersonnalise] = useState<number>(0);
  const [prixNet, setPrixNet] = useState<number>(0);
  const [prixFAI, setPrixFAI] = useState<number>(0);
  
  // BLOC 3 - Description
  const [description, setDescription] = useState('');
  const charCount = description.length;
  
  // BLOC 4 - DPE
  const [classeDPE, setClasseDPE] = useState<ClasseDPE>('D');
  const [classeGES, setClasseGES] = useState<ClasseDPE>('D');
  const [consommation, setConsommation] = useState<number>(0);
  const [depensesAnnuelles, setDepensesAnnuelles] = useState<number>(0);
  const [anneeRefPrix, setAnneeRefPrix] = useState('');
  const [dateDiagnostic, setDateDiagnostic] = useState('');
  
  // BLOC 5 - Copropriété
  const [enCopro, setEnCopro] = useState(false);
  const [nbLots, setNbLots] = useState<number>(0);
  const [nbLotsHabitation, setNbLotsHabitation] = useState<number>(0);
  const [chargesMensuelles, setChargesMensuelles] = useState<number>(0);
  const [precisionCharges, setPrecisionCharges] = useState('');
  const [procedureEnCours, setProcedureEnCours] = useState(false);
  const [typeProcedure, setTypeProcedure] = useState('');
  const [travauxVotes, setTravauxVotes] = useState(false);
  const [montantTravaux, setMontantTravaux] = useState<number>(0);
  const [descriptionTravaux, setDescriptionTravaux] = useState('');
  
  // Résultat
  const [annonceGeneree, setAnnonceGeneree] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Sync prix
  useEffect(() => {
    if (modeVente !== 'agence-hai-acquereur') return;
    
    if (modeCalcul === 'fai_net' && prixNet > 0 && prixFAI > 0) {
      // Mode FAI + Net : reconstituer le taux
      const honoraires = prixFAI - prixNet;
      const tauxCalc = (honoraires / prixNet) * 100;
      if (Math.abs(tauxCalc - tauxPersonnalise) > 0.1) {
        setTauxPersonnalise(Math.round(tauxCalc * 100) / 100);
      }
    } else if (modeSaisie === 'net' && prixNet > 0) {
      const calc = calculateHonoraires(prixNet, modeCalcul === 'taux' ? tauxPersonnalise : undefined);
      if (Math.abs(calc.prixFAI - prixFAI) > 1) {
        setPrixFAI(calc.prixFAI);
      }
    }
  }, [prixNet, modeSaisie, modeVente, modeCalcul, tauxPersonnalise, prixFAI]);
  
  useEffect(() => {
    if (modeVente !== 'agence-hai-acquereur') return;
    if (modeCalcul === 'fai_net') return; // En mode FAI+Net, on ne recalcule pas automatiquement
    
    if (modeSaisie === 'fai' && prixFAI > 0) {
      const newNet = resolvePrixNetFromFAI(prixFAI);
      if (Math.abs(newNet - prixNet) > 1) {
        setPrixNet(Math.round(newNet));
      }
    }
  }, [prixFAI, modeSaisie, modeVente, modeCalcul]);
  
  const honorairesCalc: HonorairesCalcul | null = 
    (modeVente === 'agence-hai-acquereur' && prixNet > 0)
      ? calculateHonoraires(prixNet, modeCalcul === 'taux' || modeCalcul === 'fai_net' ? tauxPersonnalise : undefined)
      : null;
  
  const handleGenererAnnonce = () => {
    const bien: BienImmobilier = {
      typeBien,
      ville,
      codePostal,
      surfaceHabitable,
      surfaceCarrez: surfaceCarrez || undefined,
      surfaceTerrain: surfaceTerrain || undefined,
      nbPieces: nbPieces || undefined,
      nbChambres: nbChambres || undefined,
      etage,
      anneeConstruction,
      orientation,
      chauffage,
      eauChaude,
      parking,
      cave,
      ascenseur: ascenseur || undefined,
      prixNet,
      prixFAI: prixFAI || undefined,
      description,
      classeDPE,
      classeGES,
      consommation: consommation || undefined,
      depensesAnnuelles: depensesAnnuelles || undefined,
      anneeRefPrix,
      dateDiagnostic,
      enCopro,
      nbLots: nbLots || undefined,
      nbLotsHabitation: nbLotsHabitation || undefined,
      chargesMensuelles: chargesMensuelles || undefined,
      precisionCharges,
      procedureEnCours,
      typeProcedure,
      travauxVotes,
      montantTravaux: montantTravaux || undefined,
      descriptionTravaux,
    };
    
    const annonce = genererAnnonce(bien, modeVente, honorairesCalc || undefined);
    setAnnonceGeneree(annonce);
  };
  
  const copier = () => {
    navigator.clipboard.writeText(annonceGeneree);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const reset = () => {
    if (!confirm('Réinitialiser tous les champs ?')) return;
    setTypeBien('Appartement');
    setVille('');
    setCodePostal('');
    setSurfaceHabitable(0);
    setSurfaceCarrez(0);
    setSurfaceTerrain(0);
    setNbPieces(0);
    setNbChambres(0);
    setEtage('');
    setAnneeConstruction('');
    setChauffage('');
    setEauChaude('');
    setParking('');
    setCave('');
    setAscenseur('');
    setDescription('');
    setPrixNet(0);
    setPrixFAI(0);
    setClasseDPE('D');
    setClasseGES('D');
    setEnCopro(false);
    setAnnonceGeneree('');
  };
  
  const isAppartStudio = typeBien === 'Appartement' || typeBien === 'Studio';
  const isMaisonVilla = typeBien === 'Maison' || typeBien === 'Villa' || typeBien === 'Immeuble';
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            📝 Générateur d'Annonces Immobilières
          </h1>
          <p className="text-lg text-gray-600">
            Créez des annonces conformes DGCCRF, Loi Hoguet, Loi ALUR, Loi Climat
          </p>
        </div>
        
        {/* Mode de vente */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            🎯 Mode de vente
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => setModeVente('particulier')}
              className={`p-6 rounded-xl border-2 transition-all ${
                modeVente === 'particulier'
                  ? 'border-[#ff6d11] bg-orange-50'
                  : 'border-gray-200 hover:border-[#ff6d11]'
              }`}
            >
              <div className="text-3xl mb-2">👤</div>
              <div className="font-bold text-gray-900">Particulier à Particulier</div>
              <div className="text-sm text-gray-600">Pas d'honoraires d'agence</div>
            </button>
            <button
              onClick={() => setModeVente('agence-hai-vendeur')}
              className={`p-6 rounded-xl border-2 transition-all ${
                modeVente === 'agence-hai-vendeur'
                  ? 'border-[#ff6d11] bg-orange-50'
                  : 'border-gray-200 hover:border-[#ff6d11]'
              }`}
            >
              <div className="text-3xl mb-2">🏢</div>
              <div className="font-bold text-gray-900">Agence - HAI Vendeur</div>
              <div className="text-sm text-gray-600">Honoraires à la charge du vendeur</div>
            </button>
            <button
              onClick={() => setModeVente('agence-hai-acquereur')}
              className={`p-6 rounded-xl border-2 transition-all ${
                modeVente === 'agence-hai-acquereur'
                  ? 'border-[#ff6d11] bg-orange-50'
                  : 'border-gray-200 hover:border-[#ff6d11]'
              }`}
            >
              <div className="text-3xl mb-2">🤝</div>
              <div className="font-bold text-gray-900">Agence - HAI Acquéreur</div>
              <div className="text-sm text-gray-600">Honoraires à la charge de l'acquéreur</div>
            </button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* FORMULAIRE */}
          <div className="space-y-6">
            {/* BLOC 1 - Caractéristiques */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-[#ff6d11]" />
                Caractéristiques du bien
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Type de bien</label>
                  <div className="flex flex-wrap gap-2">
                    {(['Appartement', 'Maison', 'Villa', 'Immeuble', 'Studio'] as TypeBien[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setTypeBien(t)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                          typeBien === t
                            ? 'bg-[#ff6d11] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Ville *</label>
                    <input
                      type="text"
                      value={ville}
                      onChange={e => setVille(e.target.value.toUpperCase())}
                      placeholder="PARIS"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Code postal *</label>
                    <input
                      type="text"
                      value={codePostal}
                      onChange={e => setCodePostal(e.target.value)}
                      placeholder="75001"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Surface habitable (m²) * <span className="text-xs text-gray-500 font-normal">Loi Boutin</span>
                    </label>
                    <input
                      type="number"
                      value={surfaceHabitable || ''}
                      onChange={e => setSurfaceHabitable(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                  {isAppartStudio && (
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Surface Carrez (m²) *</label>
                      <input
                        type="number"
                        value={surfaceCarrez || ''}
                        onChange={e => setSurfaceCarrez(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                      />
                    </div>
                  )}
                  {isMaisonVilla && (
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Surface terrain (m²)</label>
                      <input
                        type="number"
                        value={surfaceTerrain || ''}
                        onChange={e => setSurfaceTerrain(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Pièces</label>
                    <input
                      type="number"
                      value={nbPieces || ''}
                      onChange={e => setNbPieces(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Chambres</label>
                    <input
                      type="number"
                      value={nbChambres || ''}
                      onChange={e => setNbChambres(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                </div>
                
                {isAppartStudio && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Étage</label>
                    <input
                      type="text"
                      value={etage}
                      onChange={e => setEtage(e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Année construction</label>
                    <input
                      type="text"
                      value={anneeConstruction}
                      onChange={e => setAnneeConstruction(e.target.value)}
                      placeholder="2010"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Orientation</label>
                    <select
                      value={orientation}
                      onChange={e => setOrientation(e.target.value as Orientation)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    >
                      {['Nord', 'Sud', 'Est', 'Ouest', 'Nord-Est', 'Nord-Ouest', 'Sud-Est', 'Sud-Ouest'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Chauffage</label>
                    <select
                      value={chauffage}
                      onChange={e => setChauffage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    >
                      <option value="">Sélectionner...</option>
                      {TYPES_CHAUFFAGE.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Eau chaude</label>
                    <select
                      value={eauChaude}
                      onChange={e => setEauChaude(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    >
                      <option value="">Sélectionner...</option>
                      {TYPES_EAU_CHAUDE.map(e => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Parking/Garage</label>
                    <input
                      type="text"
                      value={parking}
                      onChange={e => setParking(e.target.value)}
                      placeholder="1 place"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Cave</label>
                    <input
                      type="text"
                      value={cave}
                      onChange={e => setCave(e.target.value)}
                      placeholder="Oui"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                </div>
                
                {isAppartStudio && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Ascenseur</label>
                    <select
                      value={ascenseur}
                      onChange={e => setAscenseur(e.target.value as 'Oui' | 'Non')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Oui">Oui</option>
                      <option value="Non">Non</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* BLOC 2 - Prix */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Euro className="w-5 h-5 text-[#ff6d11]" />
                Prix {modeVente !== 'particulier' && '& Honoraires (DGCCRF)'}
              </h2>
              
              {modeVente === 'agence-hai-acquereur' && (
                <>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setModeSaisie('net')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                        modeSaisie === 'net'
                          ? 'bg-[#ff6d11] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Saisir prix net vendeur
                    </button>
                    <button
                      onClick={() => setModeSaisie('fai')}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                        modeSaisie === 'fai'
                          ? 'bg-[#ff6d11] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Saisir prix FAI
                    </button>
                  </div>

                  {/* Mode de calcul des honoraires */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Mode de calcul des honoraires</label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button
                        onClick={() => setModeCalcul('dgccrf')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          modeCalcul === 'dgccrf'
                            ? 'bg-[#ff6d11] text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        Barème DGCCRF
                      </button>
                      <button
                        onClick={() => setModeCalcul('taux')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          modeCalcul === 'taux'
                            ? 'bg-[#ff6d11] text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        Taux personnalisé
                      </button>
                      <button
                        onClick={() => setModeCalcul('fai_net')}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          modeCalcul === 'fai_net'
                            ? 'bg-[#ff6d11] text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        Prix FAI + Net
                      </button>
                    </div>

                    {modeCalcul === 'taux' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Taux d'honoraires (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={tauxPersonnalise || ''}
                          onChange={e => setTauxPersonnalise(Number(e.target.value))}
                          placeholder="4.57"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                        />
                      </div>
                    )}

                    {modeCalcul === 'fai_net' && (
                      <p className="text-xs text-gray-600">
                        Saisissez le prix net vendeur et le prix FAI ci-dessous. Le taux sera calculé automatiquement.
                      </p>
                    )}
                  </div>
                </>
              )}
              
              {modeCalcul === 'fai_net' && modeVente === 'agence-hai-acquereur' ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Prix net vendeur (€)</label>
                    <input
                      type="number"
                      value={prixNet || ''}
                      onChange={e => setPrixNet(Number(e.target.value))}
                      placeholder="365000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-900 mb-2">Prix FAI (€)</label>
                    <input
                      type="number"
                      value={prixFAI || ''}
                      onChange={e => setPrixFAI(Number(e.target.value))}
                      placeholder="385000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                </>
              ) : (modeVente === 'agence-hai-acquereur' && modeSaisie === 'net') || modeVente !== 'agence-hai-acquereur' ? (
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Prix {modeVente === 'particulier' ? 'de vente' : 'net vendeur'} (€)
                  </label>
                  <input
                    type="number"
                    value={prixNet || ''}
                    onChange={e => setPrixNet(Number(e.target.value))}
                    placeholder="365000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Prix FAI (€)</label>
                  <input
                    type="number"
                    value={prixFAI || ''}
                    onChange={e => setPrixFAI(Number(e.target.value))}
                    placeholder="385000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                  />
                </div>
              )}
              
              {honorairesCalc && modeVente === 'agence-hai-acquereur' && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-bold text-gray-900 mb-2">Récapitulatif :</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Prix net vendeur</span>
                      <span className="font-bold">{new Intl.NumberFormat('fr-FR').format(prixNet)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Honoraires TTC</span>
                      <span className="font-bold">{new Intl.NumberFormat('fr-FR').format(honorairesCalc.honorairesTTC)} € ({honorairesCalc.taux.toFixed(2)} %)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prix FAI</span>
                      <span className="font-bold">{new Intl.NumberFormat('fr-FR').format(honorairesCalc.prixFAI)} €</span>
                    </div>
                  </div>
                </div>
              )}
              
              {modeVente !== 'particulier' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-gray-700">
                    {modeVente === 'agence-hai-acquereur' ? (
                      <span><strong>DGCCRF :</strong> L'annonce affiche le prix FAI, puis prix net vendeur, montant TTC et % (obligation DGCCRF, arrêté 10/01/2017)</span>
                    ) : (
                      <span><strong>DGCCRF :</strong> L'annonce affiche uniquement le prix + "Honoraires à la charge du vendeur". Le montant n'apparaît PAS dans l'annonce publique (arrêté DGCCRF 10/01/2017)</span>
                    )}
                  </p>
                </div>
              )}
            </div>
            
            {/* BLOC 3 - Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ff6d11]" />
                Description libre
              </h2>
              <div className="space-y-2">
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11] min-h-[200px]"
                  placeholder="Rédigez ici la description complète du bien..."
                />
                <p className="text-xs text-gray-500 text-right">{charCount} caractères</p>
              </div>
            </div>
            
            {/* BLOC 4 - DPE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#ff6d11]" />
                DPE / GES (loi Climat & Résilience)
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Classe DPE</label>
                  <div className="flex flex-wrap gap-2">
                    {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Vierge'] as ClasseDPE[]).map(c => (
                      <button
                        key={c}
                        onClick={() => setClasseDPE(c)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                          classeDPE === c ? 'ring-2 ring-offset-2 ring-gray-900' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: DPE_COLORS[c],
                          color: c === 'Vierge' || c === 'F' || c === 'G' ? '#fff' : c === 'A' || c === 'B' || c === 'C' ? '#000' : '#fff'
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Classe GES</label>
                  <div className="flex flex-wrap gap-2">
                    {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'Vierge'] as ClasseDPE[]).map(c => (
                      <button
                        key={c}
                        onClick={() => setClasseGES(c)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                          classeGES === c ? 'ring-2 ring-offset-2 ring-gray-900' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: GES_COLORS[c],
                          color: c === 'Vierge' || c === 'F' || c === 'G' ? '#fff' : '#000'
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                
                {(classeDPE === 'F' || classeDPE === 'G') && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                      <p className="text-sm text-red-800">
                        <strong>Mention obligatoire :</strong> « Logement à consommation énergétique excessive » (classes F et G – loi Climat et Résilience)
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Consommation (kWh/m²/an)</label>
                    <input
                      type="number"
                      value={consommation || ''}
                      onChange={e => setConsommation(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Dépenses annuelles (€/an)</label>
                    <input
                      type="number"
                      value={depensesAnnuelles || ''}
                      onChange={e => setDepensesAnnuelles(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Année réf. prix énergie</label>
                    <input
                      type="text"
                      value={anneeRefPrix}
                      onChange={e => setAnneeRefPrix(e.target.value)}
                      placeholder="2021"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Date diagnostic (MM/AAAA) *</label>
                    <input
                      type="text"
                      value={dateDiagnostic}
                      onChange={e => setDateDiagnostic(e.target.value)}
                      placeholder="11/2023"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* BLOC 5 - Copropriété */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#ff6d11]" />
                Copropriété
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setEnCopro(false)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                      !enCopro
                        ? 'bg-[#ff6d11] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pas de copropriété
                  </button>
                  <button
                    onClick={() => setEnCopro(true)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                      enCopro
                        ? 'bg-[#ff6d11] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    En copropriété
                  </button>
                </div>
                
                {enCopro && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Nombre de lots total *</label>
                        <input
                          type="number"
                          value={nbLots || ''}
                          onChange={e => setNbLots(Number(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Dont lots d'habitation</label>
                        <input
                          type="number"
                          value={nbLotsHabitation || ''}
                          onChange={e => setNbLotsHabitation(Number(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Charges mensuelles (€) *</label>
                      <input
                        type="number"
                        value={chargesMensuelles || ''}
                        onChange={e => setChargesMensuelles(Number(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Précision charges</label>
                      <input
                        type="text"
                        value={precisionCharges}
                        onChange={e => setPrecisionCharges(e.target.value)}
                        placeholder="eau au réel en plus"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                      />
                    </div>
                    
                    <div>
                      <button
                        onClick={() => setProcedureEnCours(!procedureEnCours)}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                          procedureEnCours
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {procedureEnCours ? 'Procédure en cours' : 'Pas de procédure'}
                      </button>
                    </div>
                    
                    {procedureEnCours && (
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Type de procédure</label>
                        <input
                          type="text"
                          value={typeProcedure}
                          onChange={e => setTypeProcedure(e.target.value)}
                          placeholder="Sauvegarde, redressement..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                        />
                      </div>
                    )}
                    
                    <div>
                      <button
                        onClick={() => setTravauxVotes(!travauxVotes)}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                          travauxVotes
                            ? 'bg-orange-100 text-orange-700 border border-orange-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {travauxVotes ? 'Travaux votés (< 3 ans)' : 'Pas de travaux votés'}
                      </button>
                    </div>
                    
                    {travauxVotes && (
                      <>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">Montant travaux (€)</label>
                          <input
                            type="number"
                            value={montantTravaux || ''}
                            onChange={e => setMontantTravaux(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">Description travaux</label>
                          <input
                            type="text"
                            value={descriptionTravaux}
                            onChange={e => setDescriptionTravaux(e.target.value)}
                            placeholder="Ravalement façade..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ff6d11]"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {/* BOUTONS */}
            <div className="flex gap-3">
              <Button onClick={handleGenererAnnonce} className="flex-1 gap-2 bg-[#ff6d11] hover:bg-[#E65A00]">
                <Sparkles className="w-5 h-5" />
                Générer l'annonce
              </Button>
              <Button onClick={reset} variant="outline" className="px-4">
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* RÉSULTAT */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-black text-gray-900 mb-4">Annonce générée</h2>
              
              {!annonceGeneree ? (
                <div className="text-center py-20 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Remplissez le formulaire et cliquez sur "Générer l'annonce"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">
                      {annonceGeneree}
                    </pre>
                  </div>
                  
                  <Button onClick={copier} className="w-full gap-2">
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copié !' : 'Copier'}
                  </Button>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">✅ DGCCRF</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">✅ Loi Hoguet</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">✅ Loi ALUR</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">✅ Loi Climat</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">✅ Géorisques</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

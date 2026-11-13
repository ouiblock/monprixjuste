// Types pour le vertical Automobile - MonPrixJuste

export type Motorisation = 'Essence' | 'Diesel' | 'Hybride essence' | 'Hybride diesel' | 'Électrique' | 'GPL' | 'Autre';
export type Boite = 'Manuelle' | 'Automatique' | 'Double embrayage';
export type Carrosserie = 'Citadine' | 'Berline' | 'SUV / Crossover' | 'Break' | 'Coupé' | 'Cabriolet' | 'Monospace' | 'Autre';
export type EtatGeneral = 'Très bon / comme neuf' | 'Bon' | 'Moyen / usure visible' | 'À réviser / gros travaux';
export type AccidentGravite = 'Aucun' | 'Léger cosmétique' | 'Moyen / structure' | 'Grave / économique';

export interface VehicleData {
  estimationName: string;
  date: string;
  role?: 'vendeur' | 'acheteur';
  marque: string;
  modele: string;
  version: string;
  annee: number;
  kilometrage: number;
  motorisation: Motorisation;
  boite: Boite;
  carrosserie: Carrosserie;
  nombrePortes: number;
  couleur: string;
  photos?: string[]; // Photos en base64 JPEG (photos[0] = photo en tête de page)
}

// Sources de comparables
export interface CoteOfficielle {
  id: string;
  prix: number;
  source: string; // "La Centrale", "Argus", etc.
  commentaire: string;
  lien?: string;
}

export interface AnnonceParticulier {
  id: string;
  prix: number;
  kilometrage: number;
  annee: number;
  lien: string;
  commentaire: string;
}

export interface AnnoncePro {
  id: string;
  prix: number;
  kilometrage: number;
  annee: number;
  source: string; // "La Centrale", "Leboncoin Pro", "AutoScout24", etc.
  commentaire: string;
  lien?: string;
}

export interface RachatCash {
  id: string;
  prix: number;
  societe: string; // "Vendezvotrevoiture.fr", "La Centrale Rachat", etc.
  date: string;
  conditions: string;
  lien?: string;
}

export interface Sources {
  coteOfficielle: CoteOfficielle[];
  annoncesParticulier: AnnonceParticulier[];
  annoncesPro: AnnoncePro[];
  rachatCash: RachatCash[];
}

// Pondération des sources
export interface Ponderations {
  coteOfficielle: number; // %
  annoncesParticulier: number; // %
  annoncesPro: number; // %
  rachatCash: number; // %
}

// Ajustements qualitatifs
export interface Ajustements {
  // État & historique
  etatGeneral: EtatGeneral;
  carnetComplet: boolean; // +5%
  derniereRevisionMarque: boolean; // +6%
  premiereMain: boolean; // +4%
  nombreProprietaires: 1 | 2 | 3 | 4; // 1: +4%, 2: 0%, 3: -4%, 4+: -10%
  accidentDeclare: AccidentGravite;
  controletechniqueValide: boolean; // +4%
  
  // Kilométrage (calculé automatiquement)
  kilometrageBonus: number; // % calculé selon paliers
  
  // Options & équipements
  toitPanoramique: boolean; // +5%
  camera360: boolean; // +4%
  gps: boolean; // +3%
  siegesCuir: boolean; // +5%
  siegesChauffants: boolean; // +3%
  regulateurAdaptatif: boolean; // +4%
  pharesLED: boolean; // +4%
  jantesAlliage: boolean; // +3%
  equipementsHiver: boolean; // +3%
  
  // Autres bonus/malus
  couleurBonus: number; // -5% à +4% (slider)
  pneumatiquesRecents: boolean; // +3%
  garantieConstructeur: boolean; // +8%
  etatInterieurImpeccable: boolean; // +3%
  etatExterieurImpeccable: boolean; // +3%
}

// Résultat du calcul
export interface CalculationResult {
  prixBase: number; // Prix pondéré avant ajustements
  prixFinal: number; // Prix final après ajustements
  fourchetteBasse: number;
  fourchetteHaute: number;
  scoreConfiance: number; // 0-100
  
  // Détails du calcul
  detailsSources: {
    coteOfficielle: { moyenne: number; poids: number; contribution: number };
    annoncesParticulier: { moyenne: number; poids: number; contribution: number };
    annoncesPro: { moyenne: number; poids: number; contribution: number };
    rachatCash: { moyenne: number; poids: number; contribution: number };
  };
  
  ajustementsAppliques: {
    nom: string;
    valeur: number; // % ou montant
    impact: number; // montant en €
  }[];
  
  // Positionnement marché
  positionMarche: 'Très compétitif' | 'Compétitif' | 'Dans la moyenne' | 'Au-dessus' | 'Élevé';
}

// État complet du store
export interface AutoEstimationState {
  vehicleData: VehicleData;
  sources: Sources;
  ponderations: Ponderations;
  ajustements: Ajustements;
  calculationResult: CalculationResult | null;
  
  // Actions
  setVehicleData: (data: Partial<VehicleData>) => void;
  
  // Sources
  addCoteOfficielle: (cote: Omit<CoteOfficielle, 'id'>) => void;
  updateCoteOfficielle: (id: string, cote: Partial<CoteOfficielle>) => void;
  removeCoteOfficielle: (id: string) => void;
  
  addAnnonceParticulier: (annonce: Omit<AnnonceParticulier, 'id'>) => void;
  updateAnnonceParticulier: (id: string, annonce: Partial<AnnonceParticulier>) => void;
  removeAnnonceParticulier: (id: string) => void;
  
  addAnnoncePro: (annonce: Omit<AnnoncePro, 'id'>) => void;
  updateAnnoncePro: (id: string, annonce: Partial<AnnoncePro>) => void;
  removeAnnoncePro: (id: string) => void;
  
  addRachatCash: (rachat: Omit<RachatCash, 'id'>) => void;
  updateRachatCash: (id: string, rachat: Partial<RachatCash>) => void;
  removeRachatCash: (id: string) => void;
  
  // Pondérations
  setPonderations: (ponderations: Partial<Ponderations>) => void;
  
  // Ajustements
  setAjustements: (ajustements: Partial<Ajustements>) => void;
  
  // Calcul
  calculate: () => void;
  
  // Reset
  reset: () => void;
}

// Export pour l'historique unifié
export interface AutoEstimationExport {
  id: string;
  vertical: 'automobile';
  name: string;
  date: string;
  finalPrice: number;
  metadata: {
    marque: string;
    modele: string;
    annee: number;
    kilometrage: number;
    motorisation: Motorisation;
  };
}

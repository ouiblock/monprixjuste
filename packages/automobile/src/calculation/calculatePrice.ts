import type { Sources, Ponderations, Ajustements, CalculationResult, VehicleData, EtatGeneral, AccidentGravite } from '../types';

// Calcule le bonus/malus kilométrage automatique
// Pour les véhicules électriques, le kilométrage est moins pénalisant (batterie = vraie usure)
export function calculateKilometrageBonus(km: number, motorisation?: string): number {
  // Réduction de 40% de la pénalité pour les électriques
  const facteurElec = motorisation === 'Électrique' ? 0.6 : 1.0;
  if (km < 30000) return 4; // +5% était trop fort pour les véhicules jeunes
  if (km < 60000) return 2;
  if (km < 100000) return 0;
  if (km < 150000) return Math.round(-4 * facteurElec);
  if (km < 200000) return Math.round(-8 * facteurElec);
  return Math.round(-12 * facteurElec);
}

// Calcul du multiplicateur d'état général
function getEtatGeneralMultiplier(etat: EtatGeneral): number {
  switch (etat) {
    case 'Très bon / comme neuf': return 1.04;
    case 'Bon': return 1.0;
    case 'Moyen / usure visible': return 0.95;
    case 'À réviser / gros travaux': return 0.90;
    default: return 1.0;
  }
}

// Calcul du malus accident
function getAccidentMalus(gravite: AccidentGravite): number {
  switch (gravite) {
    case 'Aucun': return 0;
    case 'Léger cosmétique': return -5;
    case 'Moyen / structure': return -10;
    case 'Grave / économique': return -20;
    default: return 0;
  }
}

// Calcul du bonus/malus nombre de propriétaires
function getProprietairesBonus(nombre: 1 | 2 | 3 | 4): number {
  switch (nombre) {
    case 1: return 2;
    case 2: return 0;
    case 3: return -2;
    case 4: return -5;
    default: return 0;
  }
}

// Calcul du prix moyen d'une catégorie de sources
function calculateCategoryAverage(prices: number[]): number {
  if (prices.length === 0) return 0;
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}

// Coefficient de pondération dégressif pour éviter des ajustements cumulés trop importants
function getCoefficientPonderation(nombreAjustements: number): number {
  // Jusqu'à 8 ajustements : 100% de l'impact (un utilisateur attentif ne doit pas être pénalisé)
  if (nombreAjustements <= 8) return 1.0;
  // 9-14 ajustements : réduction progressive à 80%
  if (nombreAjustements <= 14) return 1.0 - (nombreAjustements - 8) * 0.033;
  // 15-18 ajustements : réduction progressive à 60%
  if (nombreAjustements <= 18) return 0.8 - (nombreAjustements - 14) * 0.05;
  // 19+ ajustements : plafond à 55%
  return 0.55;
}

// Ajustement automatique pour les annonces pro (-5%)
function applyProAdjustment(price: number): number {
  return price * 0.95;
}

// Calcul principal
export function calculateAutoPrice(
  vehicleData: VehicleData,
  sources: Sources,
  ponderations: Ponderations,
  ajustements: Ajustements
): CalculationResult {
  // 1. Calcul des moyennes par catégorie
  const coteOfficielleAvg = calculateCategoryAverage(
    sources.coteOfficielle.map(c => c.prix)
  );
  
  const annoncesParticulierAvg = calculateCategoryAverage(
    sources.annoncesParticulier.map(a => a.prix)
  );
  
  const annoncesProAvg = calculateCategoryAverage(
    sources.annoncesPro.map(a => applyProAdjustment(a.prix))
  );
  
  const rachatCashAvg = calculateCategoryAverage(
    sources.rachatCash.map(r => r.prix)
  );
  
  // 2. Calcul du prix de base pondéré
  const totalSources = sources.coteOfficielle.length + 
                       sources.annoncesParticulier.length + 
                       sources.annoncesPro.length + 
                       sources.rachatCash.length;
  
  if (totalSources === 0) {
    throw new Error('Au moins une source de prix est requise');
  }
  
  // Normaliser les pondérations si nécessaire
  const totalPonderation = ponderations.coteOfficielle + 
                          ponderations.annoncesParticulier + 
                          ponderations.annoncesPro + 
                          ponderations.rachatCash;
  
  const normCoteOfficielle = ponderations.coteOfficielle / totalPonderation;
  const normAnnoncesParticulier = ponderations.annoncesParticulier / totalPonderation;
  const normAnnoncesPro = ponderations.annoncesPro / totalPonderation;
  const normRachatCash = ponderations.rachatCash / totalPonderation;
  
  // Contributions pondérées (seulement si la catégorie a des données)
  const contribCote = sources.coteOfficielle.length > 0 ? coteOfficielleAvg * normCoteOfficielle : 0;
  const contribPart = sources.annoncesParticulier.length > 0 ? annoncesParticulierAvg * normAnnoncesParticulier : 0;
  const contribPro = sources.annoncesPro.length > 0 ? annoncesProAvg * normAnnoncesPro : 0;
  const contribRachat = sources.rachatCash.length > 0 ? rachatCashAvg * normRachatCash : 0;
  
  // Recalculer la pondération effective (seulement les catégories avec données)
  const effectivePonderation = 
    (sources.coteOfficielle.length > 0 ? normCoteOfficielle : 0) +
    (sources.annoncesParticulier.length > 0 ? normAnnoncesParticulier : 0) +
    (sources.annoncesPro.length > 0 ? normAnnoncesPro : 0) +
    (sources.rachatCash.length > 0 ? normRachatCash : 0);
  
  const prixBase = (contribCote + contribPart + contribPro + contribRachat) / effectivePonderation;
  
  // 3. Application des ajustements qualitatifs (multiplicatifs)
  let prixAjuste = prixBase;
  const ajustementsAppliques: { nom: string; valeur: number; impact: number }[] = [];
  
  // État général (multiplicateur)
  const etatMultiplier = getEtatGeneralMultiplier(ajustements.etatGeneral);
  if (etatMultiplier !== 1.0) {
    const impact = prixAjuste * (etatMultiplier - 1);
    ajustementsAppliques.push({
      nom: `État général: ${ajustements.etatGeneral}`,
      valeur: (etatMultiplier - 1) * 100,
      impact
    });
    prixAjuste *= etatMultiplier;
  }
  
  // Kilométrage bonus
  const kmBonus = ajustements.kilometrageBonus / 100;
  if (kmBonus !== 0) {
    const impact = prixAjuste * kmBonus;
    ajustementsAppliques.push({
      nom: `Kilométrage (${vehicleData.kilometrage.toLocaleString('fr-FR')} km)`,
      valeur: ajustements.kilometrageBonus,
      impact
    });
    prixAjuste *= (1 + kmBonus);
  }
  
  // Entretien & historique
  if (ajustements.carnetComplet) {
    const impact = prixAjuste * 0.03;
    ajustementsAppliques.push({ nom: 'Carnet d\'entretien complet', valeur: 3, impact });
    prixAjuste *= 1.03;
  }

  if (ajustements.derniereRevisionMarque) {
    const impact = prixAjuste * 0.05;
    ajustementsAppliques.push({ nom: 'Dernière révision en concession', valeur: 5, impact });
    prixAjuste *= 1.05;
  }

  if (ajustements.premiereMain) {
    const impact = prixAjuste * 0.04;
    ajustementsAppliques.push({ nom: 'Première main', valeur: 4, impact });
    prixAjuste *= 1.04;
  }

  const proprietairesBonus = getProprietairesBonus(ajustements.nombreProprietaires);
  if (proprietairesBonus !== 0) {
    const impact = prixAjuste * (proprietairesBonus / 100);
    ajustementsAppliques.push({
      nom: `${ajustements.nombreProprietaires} propriétaire(s)`,
      valeur: proprietairesBonus,
      impact
    });
    prixAjuste *= (1 + proprietairesBonus / 100);
  }

  if (ajustements.controletechniqueValide) {
    const impact = prixAjuste * 0.02;
    ajustementsAppliques.push({ nom: 'Contrôle technique valide', valeur: 2, impact });
    prixAjuste *= 1.02;
  }
  
  // Options & équipements
  if (ajustements.toitPanoramique) {
    const impact = prixAjuste * 0.04;
    ajustementsAppliques.push({ nom: 'Toit panoramique', valeur: 4, impact });
    prixAjuste *= 1.04;
  }

  if (ajustements.camera360) {
    const impact = prixAjuste * 0.03;
    ajustementsAppliques.push({ nom: 'Caméra 360°', valeur: 3, impact });
    prixAjuste *= 1.03;
  }

  if (ajustements.gps) {
    const impact = prixAjuste * 0.02;
    ajustementsAppliques.push({ nom: 'GPS intégré', valeur: 2, impact });
    prixAjuste *= 1.02;
  }

  if (ajustements.siegesCuir) {
    const impact = prixAjuste * 0.03;
    ajustementsAppliques.push({ nom: 'Sièges cuir', valeur: 3, impact });
    prixAjuste *= 1.03;
  }

  if (ajustements.siegesChauffants) {
    const impact = prixAjuste * 0.015;
    ajustementsAppliques.push({ nom: 'Sièges chauffants', valeur: 1.5, impact });
    prixAjuste *= 1.015;
  }

  if (ajustements.regulateurAdaptatif) {
    const impact = prixAjuste * 0.02;
    ajustementsAppliques.push({ nom: 'Régulateur adaptatif', valeur: 2, impact });
    prixAjuste *= 1.02;
  }

  if (ajustements.pharesLED) {
    const impact = prixAjuste * 0.02;
    ajustementsAppliques.push({ nom: 'Phares LED', valeur: 2, impact });
    prixAjuste *= 1.02;
  }

  if (ajustements.jantesAlliage) {
    const impact = prixAjuste * 0.015;
    ajustementsAppliques.push({ nom: 'Jantes alliage', valeur: 1.5, impact });
    prixAjuste *= 1.015;
  }

  if (ajustements.equipementsHiver) {
    const impact = prixAjuste * 0.015;
    ajustementsAppliques.push({ nom: 'Équipements hiver', valeur: 1.5, impact });
    prixAjuste *= 1.015;
  }
  
  // Accident
  const accidentMalus = getAccidentMalus(ajustements.accidentDeclare);
  if (accidentMalus !== 0) {
    const impact = prixAjuste * (accidentMalus / 100);
    ajustementsAppliques.push({
      nom: `Accident déclaré: ${ajustements.accidentDeclare}`,
      valeur: accidentMalus,
      impact
    });
    prixAjuste *= (1 + accidentMalus / 100);
  }
  
  // Autres bonus/malus
  if (ajustements.couleurBonus !== 0) {
    const couleurBonusReduit = ajustements.couleurBonus * 0.5;
    const impact = prixAjuste * (couleurBonusReduit / 100);
    ajustementsAppliques.push({
      nom: 'Couleur',
      valeur: couleurBonusReduit,
      impact
    });
    prixAjuste *= (1 + couleurBonusReduit / 100);
  }

  if (ajustements.pneumatiquesRecents) {
    const impact = prixAjuste * 0.02;
    ajustementsAppliques.push({ nom: 'Pneumatiques récents', valeur: 2, impact });
    prixAjuste *= 1.02;
  }

  if (ajustements.garantieConstructeur) {
    const impact = prixAjuste * 0.08;
    ajustementsAppliques.push({ nom: 'Garantie constructeur', valeur: 8, impact });
    prixAjuste *= 1.08;
  }

  if (ajustements.etatInterieurImpeccable) {
    const impact = prixAjuste * 0.015;
    ajustementsAppliques.push({ nom: 'État intérieur impeccable', valeur: 1.5, impact });
    prixAjuste *= 1.015;
  }

  if (ajustements.etatExterieurImpeccable) {
    const impact = prixAjuste * 0.015;
    ajustementsAppliques.push({ nom: 'État extérieur impeccable', valeur: 1.5, impact });
    prixAjuste *= 1.015;
  }
  
  // Application du coefficient de pondération si trop d'ajustements
  const nombreAjustements = ajustementsAppliques.length;
  const coeffPonderation = getCoefficientPonderation(nombreAjustements);
  
  // Si coefficient < 1, on réduit l'impact total des ajustements
  if (coeffPonderation < 1.0) {
    // Calculer l'écart total par rapport au prix de base
    const ecartTotal = prixAjuste - prixBase;
    // Appliquer le coefficient de pondération sur l'écart
    const ecartPondere = ecartTotal * coeffPonderation;
    prixAjuste = prixBase + ecartPondere;
    
    // Ajouter une note explicative
    ajustementsAppliques.push({
      nom: `⚖️ Pondération appliquée (${nombreAjustements} ajustements)`,
      valeur: (coeffPonderation - 1) * 100,
      impact: ecartPondere - ecartTotal
    });
  }
  
  const prixFinal = Math.round(prixAjuste);
  
  // 4. Calcul de la fourchette
  const allPrices = [
    ...sources.coteOfficielle.map(c => c.prix),
    ...sources.annoncesParticulier.map(a => a.prix),
    ...sources.annoncesPro.map(a => a.prix),
    ...sources.rachatCash.map(r => r.prix)
  ];
  
  const ecartType = calculateStandardDeviation(allPrices);
  const coefficientVariation = ecartType / prixBase;
  
  // Fourchette plus large si peu de sources ou forte dispersion
  let fourchettePercent = 0.05; // 5% par défaut
  if (totalSources < 3) fourchettePercent = 0.12;
  else if (totalSources < 5) fourchettePercent = 0.08;
  else if (coefficientVariation > 0.15) fourchettePercent = 0.10;
  
  const fourchetteBasse = Math.round(prixFinal * (1 - fourchettePercent));
  const fourchetteHaute = Math.round(prixFinal * (1 + fourchettePercent));
  
  // 5. Score de confiance
  const scoreConfiance = calculateConfidenceScore(
    totalSources,
    coefficientVariation,
    ajustementsAppliques.length,
    vehicleData
  );
  
  // 6. Positionnement marché
  const positionMarche = calculateMarketPosition(prixFinal, prixBase);
  
  return {
    prixBase: Math.round(prixBase),
    prixFinal,
    fourchetteBasse,
    fourchetteHaute,
    scoreConfiance,
    detailsSources: {
      coteOfficielle: {
        moyenne: Math.round(coteOfficielleAvg),
        poids: normCoteOfficielle * 100,
        contribution: Math.round(contribCote / effectivePonderation)
      },
      annoncesParticulier: {
        moyenne: Math.round(annoncesParticulierAvg),
        poids: normAnnoncesParticulier * 100,
        contribution: Math.round(contribPart / effectivePonderation)
      },
      annoncesPro: {
        moyenne: Math.round(annoncesProAvg),
        poids: normAnnoncesPro * 100,
        contribution: Math.round(contribPro / effectivePonderation)
      },
      rachatCash: {
        moyenne: Math.round(rachatCashAvg),
        poids: normRachatCash * 100,
        contribution: Math.round(contribRachat / effectivePonderation)
      }
    },
    ajustementsAppliques,
    positionMarche
  };
}

// Calcul de l'écart-type
function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
}

// Calcul du score de confiance
function calculateConfidenceScore(
  nbSources: number,
  coefficientVariation: number,
  nbAjustements: number,
  vehicleData: VehicleData
): number {
  let score = 35; // Base conservatrice : un score élevé doit être mérité
  
  // Bonus nombre de sources (max +30)
  score += Math.min(nbSources * 5, 30);
  
  // Bonus faible dispersion (max +15)
  if (coefficientVariation < 0.05) score += 15;
  else if (coefficientVariation < 0.10) score += 10;
  else if (coefficientVariation < 0.15) score += 5;
  
  // Bonus ajustements pertinents (max +10)
  score += Math.min(nbAjustements * 2, 10);
  
  // Bonus cohérence km/année (max +5)
  const kmParAn = vehicleData.kilometrage / (2026 - vehicleData.annee);
  if (kmParAn >= 10000 && kmParAn <= 20000) score += 5; // Usage normal
  else if (kmParAn >= 5000 && kmParAn <= 25000) score += 3;
  
  return Math.min(Math.round(score), 100);
}

// Positionnement marché
function calculateMarketPosition(
  prixFinal: number,
  prixBase: number
): 'Très compétitif' | 'Compétitif' | 'Dans la moyenne' | 'Au-dessus' | 'Élevé' {
  const ratio = prixFinal / prixBase;
  
  if (ratio < 0.90) return 'Très compétitif';
  if (ratio < 0.97) return 'Compétitif';
  if (ratio <= 1.03) return 'Dans la moyenne';
  if (ratio <= 1.10) return 'Au-dessus';
  return 'Élevé';
}

import jsPDF from 'jspdf';
import type { VehicleData, Sources, Ponderations, Ajustements, CalculationResult } from '../types';

const ORANGE = '#ff6d11';
const DARK = '#1F2937';
const GRAY = '#6B7280';
const LIGHT_GRAY = '#F3F4F6';
const WHITE = '#FFFFFF';

const DISCLAIMER =
  'AVERTISSEMENT BÊTA — Cette estimation est fournie à titre purement indicatif par MonPrixJuste (version bêta). ' +
  'Elle ne constitue en aucun cas un avis professionnel, une expertise automobile ou une garantie de valeur. ' +
  'MonPrixJuste est un projet open source porté par l\'association HERRICHAIN (Loi 1901, RNA : W641015204), développé par www.arteandigital.fr pour l\'association HERRICHAIN. ' +
  'L\'association et ses contributeurs déclinent toute responsabilité quant à l\'usage qui pourrait être fait de cette estimation. ' +
  'Consultez un professionnel de l\'automobile pour toute décision d\'achat ou de vente.';

function formatPrice(n: number): string {
  return n.toLocaleString('fr-FR') + ' €';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function addPageHeader(doc: jsPDF, pageNum: number, totalPages: number) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(ORANGE);
  doc.rect(0, 0, w, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(WHITE);
  doc.text('MonPrixJuste', 14, 9.5);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page ${pageNum} / ${totalPages}`, w - 14, 9.5, { align: 'right' });
}

function addPageFooter(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(LIGHT_GRAY);
  doc.rect(0, h - 18, w, 18, 'F');
  doc.setFontSize(6.5);
  doc.setTextColor(GRAY);
  doc.setFont('helvetica', 'italic');
  const lines = doc.splitTextToSize(DISCLAIMER, w - 28);
  doc.text(lines, 14, h - 13);
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setFillColor(ORANGE);
  doc.rect(14, y, 4, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(DARK);
  doc.text(title, 22, y + 5.5);
  return y + 14;
}

function addRow(doc: jsPDF, label: string, value: string, y: number, highlight = false): number {
  const w = doc.internal.pageSize.getWidth();
  if (highlight) {
    doc.setFillColor(255, 237, 213);
    doc.rect(14, y - 1, w - 28, 8, 'F');
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(GRAY);
  doc.text(label, 16, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DARK);
  doc.text(value, w - 16, y + 5, { align: 'right' });
  doc.setDrawColor(230, 230, 230);
  doc.line(14, y + 7.5, w - 14, y + 7.5);
  return y + 10;
}

export function generateAutoPDF(
  vehicleData: VehicleData,
  sources: Sources,
  ponderations: Ponderations,
  ajustements: Ajustements,
  result: CalculationResult
): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const TOTAL_PAGES = 3;

  // ─────────────────────────────────────────────
  // PAGE 1 — PAGE DE GARDE
  // ─────────────────────────────────────────────
  addPageHeader(doc, 1, TOTAL_PAGES);

  // Bloc orange central
  doc.setFillColor(ORANGE);
  doc.roundedRect(14, 22, w - 28, 52, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(WHITE);
  doc.text('Estimation Automobile', w / 2, 38, { align: 'center' });
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  const vehicleTitle = vehicleData.estimationName ||
    `${vehicleData.marque} ${vehicleData.modele} ${vehicleData.annee}`;
  doc.text(vehicleTitle, w / 2, 48, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Générée le ${formatDate(new Date().toISOString())}`, w / 2, 58, { align: 'center' });
  doc.text('Version bêta — À titre indicatif', w / 2, 66, { align: 'center' });

  // Résultat principal
  doc.setFillColor(DARK);
  doc.roundedRect(14, 82, w - 28, 38, 4, 4, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text('PRIX ESTIMÉ', w / 2, 93, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(ORANGE);
  doc.text(formatPrice(result.prixFinal), w / 2, 107, { align: 'center' });
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(
    `Fourchette : ${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`,
    w / 2, 116, { align: 'center' }
  );

  // Infos véhicule
  let y = 130;
  y = addSectionTitle(doc, 'Informations du véhicule', y);
  const infos: [string, string][] = [
    ['Marque / Modèle', `${vehicleData.marque} ${vehicleData.modele}${vehicleData.version ? ` — ${vehicleData.version}` : ''}`],
    ['Année', String(vehicleData.annee)],
    ['Kilométrage', `${vehicleData.kilometrage.toLocaleString('fr-FR')} km`],
    ['Motorisation', vehicleData.motorisation],
    ['Boîte de vitesses', vehicleData.boite],
    ['Carrosserie', vehicleData.carrosserie],
    ['Couleur', vehicleData.couleur || 'Non renseignée'],
  ];
  for (const [label, value] of infos) {
    y = addRow(doc, label, value, y);
  }

  // Score confiance
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(DARK);
  doc.text(`Score de confiance : ${result.scoreConfiance}%`, 16, y);
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(16, y + 3, w - 32, 5, 2, 2, 'F');
  const scoreColor = result.scoreConfiance >= 70 ? '#10b981' : result.scoreConfiance >= 50 ? ORANGE : '#ef4444';
  doc.setFillColor(scoreColor);
  doc.roundedRect(16, y + 3, (w - 32) * result.scoreConfiance / 100, 5, 2, 2, 'F');

  addPageFooter(doc);

  // ─────────────────────────────────────────────
  // PAGE 2 — MÉTHODOLOGIE + SOURCES
  // ─────────────────────────────────────────────
  doc.addPage();
  addPageHeader(doc, 2, TOTAL_PAGES);

  y = 22;
  y = addSectionTitle(doc, 'Méthodologie de calcul', y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(GRAY);
  const methText =
    'MonPrixJuste utilise une méthode hybride combinant quatre types de sources : la cote officielle ' +
    '(La Centrale, Argus), les annonces de particuliers, les annonces professionnelles (concessions, ' +
    'plateformes en ligne) et les offres de rachat cash (Aramisauto, Autohero, etc.). ' +
    'Chaque source est pondérée selon votre paramétrage. Des ajustements qualitatifs ' +
    '(état général, kilométrage, options, historique) sont appliqués en méthode additive. ' +
    'Le kilométrage est automatiquement calculé par paliers par rapport à la moyenne annuelle de 15 000 km.';
  const methLines = doc.splitTextToSize(methText, w - 28);
  doc.text(methLines, 14, y);
  y += methLines.length * 5 + 8;

  // Pondérations
  y = addSectionTitle(doc, 'Pondérations appliquées', y);
  const pondRows: [string, string, string][] = [
    ['Cote officielle', `${ponderations.coteOfficielle}%`, `Contribution : ${formatPrice(result.detailsSources.coteOfficielle.contribution)}`],
    ['Annonces particuliers', `${ponderations.annoncesParticulier}%`, `Contribution : ${formatPrice(result.detailsSources.annoncesParticulier.contribution)}`],
    ['Annonces pro', `${ponderations.annoncesPro}%`, `Contribution : ${formatPrice(result.detailsSources.annoncesPro.contribution)}`],
    ['Rachat cash', `${ponderations.rachatCash}%`, `Contribution : ${formatPrice(result.detailsSources.rachatCash.contribution)}`],
  ];
  for (const [label, pct, contrib] of pondRows) {
    doc.setFillColor(LIGHT_GRAY);
    doc.rect(14, y, w - 28, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(DARK);
    doc.text(label, 17, y + 6);
    doc.setTextColor(ORANGE);
    doc.text(pct, w / 2, y + 6, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(GRAY);
    doc.text(contrib, w - 16, y + 6, { align: 'right' });
    y += 11;
  }
  y += 6;

  // Cotes officielles
  if (sources.coteOfficielle.length > 0) {
    y = addSectionTitle(doc, `Cotes officielles (${sources.coteOfficielle.length})`, y);
    for (const c of sources.coteOfficielle) {
      y = addRow(doc, c.source, formatPrice(c.prix), y);
      if (y > h - 30) { doc.addPage(); addPageHeader(doc, 2, TOTAL_PAGES); addPageFooter(doc); y = 22; }
    }
    y += 4;
  }

  // Annonces particuliers
  if (sources.annoncesParticulier.length > 0) {
    y = addSectionTitle(doc, `Annonces particuliers (${sources.annoncesParticulier.length})`, y);
    for (const a of sources.annoncesParticulier) {
      const label = `${a.annee} — ${a.kilometrage.toLocaleString('fr-FR')} km`;
      y = addRow(doc, label, formatPrice(a.prix), y);
      if (y > h - 30) { doc.addPage(); addPageHeader(doc, 2, TOTAL_PAGES); addPageFooter(doc); y = 22; }
    }
    y += 4;
  }

  // Annonces pro
  if (sources.annoncesPro.length > 0) {
    y = addSectionTitle(doc, `Annonces professionnelles (${sources.annoncesPro.length})`, y);
    for (const a of sources.annoncesPro) {
      const label = `${a.source} — ${a.annee} — ${a.kilometrage.toLocaleString('fr-FR')} km`;
      y = addRow(doc, label, formatPrice(a.prix), y);
      if (y > h - 30) { doc.addPage(); addPageHeader(doc, 2, TOTAL_PAGES); addPageFooter(doc); y = 22; }
    }
    y += 4;
  }

  // Rachat cash
  if (sources.rachatCash.length > 0) {
    y = addSectionTitle(doc, `Offres de rachat cash (${sources.rachatCash.length})`, y);
    for (const r of sources.rachatCash) {
      const label = `${r.societe} — ${formatDate(r.date)}`;
      y = addRow(doc, label, formatPrice(r.prix), y);
      if (y > h - 30) { doc.addPage(); addPageHeader(doc, 2, TOTAL_PAGES); addPageFooter(doc); y = 22; }
    }
  }

  addPageFooter(doc);

  // ─────────────────────────────────────────────
  // PAGE 3 — RÉSULTAT + AJUSTEMENTS + CONSEILS
  // ─────────────────────────────────────────────
  doc.addPage();
  addPageHeader(doc, 3, TOTAL_PAGES);
  y = 22;

  // Résultat synthèse
  y = addSectionTitle(doc, 'Résultat de l\'estimation', y);
  const resultRows: [string, string, boolean][] = [
    ['Prix de base pondéré', formatPrice(result.prixBase), false],
    ['Prix final estimé', formatPrice(result.prixFinal), true],
    ['Fourchette basse', formatPrice(result.fourchetteBasse), false],
    ['Fourchette haute', formatPrice(result.fourchetteHaute), false],
    ['Positionnement marché', result.positionMarche, false],
  ];
  for (const [label, value, hl] of resultRows) {
    y = addRow(doc, label, value, y, hl);
  }
  y += 8;

  // Ajustements appliqués
  if (result.ajustementsAppliques.length > 0) {
    y = addSectionTitle(doc, 'Ajustements qualitatifs appliqués', y);
    for (const aj of result.ajustementsAppliques) {
      const sign = aj.valeur >= 0 ? '+' : '';
      const val = `${sign}${aj.valeur.toFixed(1)}% (${sign}${aj.impact.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €)`;
      y = addRow(doc, aj.nom, val, y);
    }
    y += 8;
  }

  // Conseils vendeur
  y = addSectionTitle(doc, 'Conseils pour le vendeur', y);
  const conseils = getConseilsVendeur(result, vehicleData, ajustements);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  for (const conseil of conseils) {
    const lines = doc.splitTextToSize(`• ${conseil}`, w - 32);
    doc.setFillColor(LIGHT_GRAY);
    doc.rect(14, y, w - 28, lines.length * 5 + 6, 'F');
    doc.setTextColor(DARK);
    doc.text(lines, 18, y + 5);
    y += lines.length * 5 + 8;
    if (y > h - 30) break;
  }

  // Conseils négociation
  y += 4;
  if (y < h - 60) {
    y = addSectionTitle(doc, 'Conseils de négociation', y);
    const negoConseils = getConseilsNegociation(result, ajustements);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    for (const conseil of negoConseils) {
      const lines = doc.splitTextToSize(`• ${conseil}`, w - 32);
      doc.setTextColor(DARK);
      doc.text(lines, 18, y);
      y += lines.length * 5 + 4;
      if (y > h - 30) break;
    }
  }

  addPageFooter(doc);

  const filename = `MonPrixJuste_Auto_${(vehicleData.estimationName || `${vehicleData.marque}_${vehicleData.modele}`).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

function getConseilsVendeur(result: CalculationResult, vehicleData: VehicleData, ajustements: Ajustements): string[] {
  const conseils: string[] = [];
  const ratio = result.prixFinal / result.prixBase;
  const ageVehicule = new Date().getFullYear() - vehicleData.annee;

  if (result.scoreConfiance < 50) {
    conseils.push(
      'Votre score de confiance est faible. Ajoutez davantage de sources (cote officielle, annonces) pour affiner l\'estimation avant de fixer votre prix de vente.'
    );
  }

  if (ajustements.accidentDeclare !== 'Aucun') {
    conseils.push(
      `Votre véhicule a un accident déclaré (${ajustements.accidentDeclare}). Soyez transparent dans votre annonce : c\'est une obligation légale et cela évite les litiges post-vente. Préparez le rapport d\'expertise ou les factures de réparation.`
    );
  }

  if (vehicleData.kilometrage > 150000) {
    conseils.push(
      'Avec plus de 150 000 km, les acheteurs seront attentifs à l\'historique d\'entretien. Préparez le carnet d\'entretien complet et les factures des dernières révisions pour rassurer.'
    );
  } else if (vehicleData.kilometrage < 50000) {
    conseils.push(
      'Faible kilométrage : c\'est un atout majeur. Mettez-le en avant dans votre annonce et justifiez-le avec le carnet d\'entretien.'
    );
  }

  if (ageVehicule > 10) {
    conseils.push(
      `Véhicule de ${ageVehicule} ans : pensez à faire un contrôle technique récent avant la vente. Cela rassure les acheteurs et évite les négociations sur des défauts potentiels.`
    );
  }

  if (ratio > 1.08) {
    conseils.push(
      'Votre bien est positionné au-dessus du marché de base. Assurez-vous que les ajustements positifs sont bien documentés (options, état, historique) pour justifier ce positionnement.'
    );
  } else if (ratio < 0.92) {
    conseils.push(
      'Votre véhicule est positionné en dessous du marché. Si c\'est pour une vente rapide, c\'est une bonne stratégie. Sinon, revérifiez les ajustements négatifs appliqués.'
    );
  }

  conseils.push(
    `Prix d\'annonce recommandé : entre ${(result.prixFinal * 1.03).toLocaleString('fr-FR')} € et ${(result.prixFinal * 1.06).toLocaleString('fr-FR')} € pour garder une marge de négociation de 3 à 6%.`
  );

  return conseils;
}

function getConseilsNegociation(result: CalculationResult, ajustements: Ajustements): string[] {
  const conseils: string[] = [];

  conseils.push(
    `La fourchette d\'estimation s\'étend de ${formatPrice(result.fourchetteBasse)} à ${formatPrice(result.fourchetteHaute)}. Votre prix plancher de négociation ne devrait pas descendre sous la fourchette basse.`
  );

  if (result.scoreConfiance >= 70) {
    conseils.push(
      'Avec un score de confiance élevé, vous pouvez défendre votre prix avec des arguments solides. Présentez les cotes officielles et les annonces comparables aux acheteurs.'
    );
  } else {
    conseils.push(
      'Score de confiance modéré : restez ouvert à une négociation de 5 à 8% sous votre prix affiché. Enrichissez votre dossier avec des sources supplémentaires.'
    );
  }

  if (ajustements.garantieConstructeur) {
    conseils.push(
      'La garantie constructeur restante est un argument fort. Mentionnez sa durée exacte et ce qu\'elle couvre pour justifier votre prix.'
    );
  }

  conseils.push(
    'Face à une offre basse, demandez à l\'acheteur de justifier son offre avec des comparables. Une contre-offre argumentée avec vos données de marché est toujours plus efficace qu\'un simple refus.'
  );

  conseils.push(
    'Si vous avez plusieurs acheteurs intéressés, ne le cachez pas. La concurrence est un levier de négociation légitime et efficace.'
  );

  return conseils;
}

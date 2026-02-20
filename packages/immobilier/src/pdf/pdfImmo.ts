import jsPDF from 'jspdf';
import type { PropertyData, Sources, Ponderations, Ajustements, CalculationResult } from '../types';

const ORANGE = '#ff6d11';
const DARK = '#1F2937';
const GRAY = '#6B7280';
const LIGHT_GRAY = '#F3F4F6';
const WHITE = '#FFFFFF';

const DISCLAIMER =
  'AVERTISSEMENT BÊTA — Cette estimation est fournie à titre purement indicatif par MonPrixJuste (version bêta). ' +
  'Elle ne constitue en aucun cas un avis professionnel, une expertise immobilière ou une garantie de valeur. ' +
  'MonPrixJuste est un projet open source porté par l\'association HERRICHAIN (Loi 1901, RNA : W641015204), développé par www.arteandigital.fr pour l\'association HERRICHAIN. ' +
  'L\'association et ses contributeurs déclinent toute responsabilité quant à l\'usage qui pourrait être fait de cette estimation. ' +
  'Consultez un professionnel de l\'immobilier pour toute décision d\'achat ou de vente.';

function isDVFAncienne(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const cinqAnsAvant = new Date();
  cinqAnsAvant.setFullYear(cinqAnsAvant.getFullYear() - 5);
  return date < cinqAnsAvant;
}

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
  // Bande orange en haut
  doc.setFillColor(ORANGE);
  doc.rect(0, 0, w, 14, 'F');
  // Logo texte
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(WHITE);
  doc.text('MonPrixJuste', 14, 9.5);
  // Numéro de page
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
    doc.setFillColor(255, 237, 213); // orange-50
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

export function generateImmoPDF(
  propertyData: PropertyData,
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
  doc.text('Estimation Immobilière', w / 2, 38, { align: 'center' });
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text(propertyData.estimationName || 'Sans titre', w / 2, 48, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Générée le ${formatDate(new Date().toISOString())}`, w / 2, 58, { align: 'center' });
  doc.text(`Version bêta — À titre indicatif`, w / 2, 66, { align: 'center' });

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

  // Infos bien
  let y = 130;
  y = addSectionTitle(doc, 'Informations du bien', y);
  const infos: [string, string][] = [
    ['Type de bien', propertyData.typeBien],
    ['Adresse', `${propertyData.adresse}, ${propertyData.codePostal} ${propertyData.ville}`],
    ['Surface', `${propertyData.surface} m²`],
    ['Pièces / Chambres', `${propertyData.pieces} pièces — ${propertyData.chambres} chambres`],
    ['Année de construction', String(propertyData.anneeConstruction)],
    ['Étage', `${propertyData.etage}${propertyData.ascenseur ? ' (avec ascenseur)' : ''}`],
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
    'MonPrixJuste utilise une méthode hybride combinant trois types de sources : les transactions réelles ' +
    'DVF (Demandes de Valeurs Foncières, données ETALAB/data.gouv.fr), les annonces du marché (PAP, SeLoger, ' +
    'Leboncoin) et les estimations d\'agences. Chaque source est pondérée selon votre paramétrage. ' +
    'Des ajustements qualitatifs limités (état, DPE, équipements) sont appliqués en méthode additive, ' +
    'plafonnés à ±20% du prix de base pour éviter les dérives. ' +
    'Les transactions DVF datant de plus de 5 ans voient leur contribution réduite de 30% pour tenir compte ' +
    'de l\'évolution du marché.';
  const methLines = doc.splitTextToSize(methText, w - 28);
  doc.text(methLines, 14, y);
  y += methLines.length * 5 + 8;

  // Pondérations
  y = addSectionTitle(doc, 'Pondérations appliquées', y);
  const ponds: [string, string, string][] = [
    ['DVF ETALAB (ventes réelles)', `${ponderations.dvf}%`, `Contribution : ${formatPrice(result.detailsSources.dvf.contribution)}`],
    ['Annonces marché', `${ponderations.annonces}%`, `Contribution : ${formatPrice(result.detailsSources.annonces.contribution)}`],
    ['Estimations agences', `${ponderations.estimations}%`, `Contribution : ${formatPrice(result.detailsSources.estimations.contribution)}`],
  ];
  for (const [label, pct, contrib] of ponds) {
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

  // Sources DVF
  if (sources.dvf.length > 0) {
    y = addSectionTitle(doc, `Sources DVF ETALAB (${sources.dvf.length} transaction${sources.dvf.length > 1 ? 's' : ''})`, y);
    for (const dvf of sources.dvf) {
      const ancienne = isDVFAncienne(dvf.date);
      const label = `${dvf.adresse || 'Adresse N/A'} — ${dvf.surface} m²`;
      const val = `${formatPrice(dvf.prix)} (${Math.round(dvf.prix / dvf.surface).toLocaleString('fr-FR')} €/m²)`;
      const dateLabel = `Vente : ${formatDate(dvf.date)}${ancienne ? ' ⚠ >5 ans (-30%)' : ''}`;
      doc.setFillColor(ancienne ? '#FEF3C7' : LIGHT_GRAY);
      doc.rect(14, y, w - 28, 13, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(label, 17, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(ancienne ? '#92400E' : GRAY);
      doc.text(dateLabel, 17, y + 10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(ORANGE);
      doc.text(val, w - 16, y + 7, { align: 'right' });
      y += 15;
      if (y > h - 30) { doc.addPage(); addPageHeader(doc, 2, TOTAL_PAGES); addPageFooter(doc); y = 22; }
    }
    y += 4;
  }

  // Sources Annonces
  if (sources.annonces.length > 0) {
    y = addSectionTitle(doc, `Annonces marché (${sources.annonces.length})`, y);
    for (const a of sources.annonces) {
      const label = `${a.source} — ${a.surface} m² — ${a.pieces} pièces`;
      const val = `${formatPrice(a.prix)} (${Math.round(a.prix / a.surface).toLocaleString('fr-FR')} €/m²)`;
      y = addRow(doc, label, val, y);
      if (y > h - 30) { doc.addPage(); addPageHeader(doc, 2, TOTAL_PAGES); addPageFooter(doc); y = 22; }
    }
    y += 4;
  }

  // Sources Estimations
  if (sources.estimations.length > 0) {
    y = addSectionTitle(doc, `Estimations agences (${sources.estimations.length})`, y);
    for (const e of sources.estimations) {
      const label = `${e.source} — ${formatDate(e.date)}`;
      const val = `${formatPrice(e.prixMin)} — ${formatPrice(e.prixMax)}`;
      y = addRow(doc, label, val, y);
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
    ['Prix au m²', `${result.prixM2.toLocaleString('fr-FR')} €/m²`, false],
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
  const conseils = getConseilsVendeur(result, propertyData);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(DARK);
  for (const conseil of conseils) {
    doc.setFillColor(LIGHT_GRAY);
    doc.roundedRect(14, y, w - 28, 1, 1, 1, 'F');
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
    const negoConseils = getConseilsNegociation(result);
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

  // Téléchargement
  const filename = `MonPrixJuste_Immo_${(propertyData.estimationName || 'estimation').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

function getConseilsVendeur(result: CalculationResult, propertyData: PropertyData): string[] {
  const conseils: string[] = [];
  const ratio = result.prixFinal / result.prixBase;

  if (result.scoreConfiance < 50) {
    conseils.push(
      'Votre score de confiance est faible (moins de 3 sources). Ajoutez davantage de comparables DVF et d\'annonces pour affiner l\'estimation avant de fixer votre prix de vente.'
    );
  }

  if (ratio > 1.10) {
    conseils.push(
      'Votre bien est positionné significativement au-dessus du marché de base. Assurez-vous que les ajustements appliqués sont bien justifiés et documentés pour convaincre les acheteurs potentiels.'
    );
  } else if (ratio < 0.90) {
    conseils.push(
      'Votre bien est positionné en dessous du marché. Si c\'est intentionnel (vente rapide), c\'est une bonne stratégie. Sinon, vérifiez si les ajustements négatifs sont bien représentatifs de l\'état réel du bien.'
    );
  } else {
    conseils.push(
      'Votre bien est positionné dans la moyenne du marché. C\'est une position favorable pour attirer des acheteurs sérieux sans sacrifier de valeur.'
    );
  }

  if (propertyData.typeBien === 'Appartement') {
    conseils.push(
      'Pour un appartement, mettez en avant les charges de copropriété, le montant des travaux votés et le DPE lors des visites. Ces éléments sont souvent décisifs pour les acheteurs.'
    );
  } else if (propertyData.typeBien === 'Maison') {
    conseils.push(
      'Pour une maison, l\'état de la toiture, la chaudière et l\'assainissement sont des points de négociation fréquents. Anticipez ces questions avec des devis ou des factures de travaux récents.'
    );
  }

  conseils.push(
    `Fourchette recommandée pour l\'annonce : entre ${(result.prixFinal * 1.02).toLocaleString('fr-FR')} € et ${(result.prixFinal * 1.05).toLocaleString('fr-FR')} € pour garder une marge de négociation de 2 à 5%.`
  );

  return conseils;
}

function getConseilsNegociation(result: CalculationResult): string[] {
  const conseils: string[] = [];
  const ecart = result.fourchetteHaute - result.fourchetteBasse;
  const ecartPct = Math.round((ecart / result.prixFinal) * 100);

  conseils.push(
    `La fourchette d\'estimation est de ${ecartPct}%. Plus cette fourchette est large, plus la marge de négociation est importante.`
  );

  if (result.scoreConfiance >= 70) {
    conseils.push(
      'Avec un score de confiance élevé, vous pouvez défendre votre prix avec des arguments solides basés sur des données réelles. Présentez vos sources DVF aux acheteurs intéressés.'
    );
  } else {
    conseils.push(
      'Avec un score de confiance modéré, restez ouvert à une négociation de 3 à 7% sous votre prix affiché. Enrichissez votre dossier avec des comparables supplémentaires.'
    );
  }

  conseils.push(
    'Prévoyez une marge de négociation de 3 à 5% dans votre prix d\'annonce. Les acheteurs s\'attendent généralement à négocier, même sur un bien bien positionné.'
  );

  conseils.push(
    'En cas d\'offre inférieure à la fourchette basse, demandez une justification chiffrée à l\'acheteur. Une contre-offre argumentée avec vos données de marché est toujours plus efficace.'
  );

  return conseils;
}

import jsPDF from 'jspdf';
import type { VehicleData, Sources, Ponderations, Ajustements, CalculationResult } from '../types';

const ORANGE = '#ff6d11';
const DARK = '#0F172A';
const SLATE = '#334155';
const GRAY = '#64748B';
const LIGHT_GRAY = '#F8FAFC';
const BORDER_GRAY = '#E2E8F0';
const BLUE_LINK = '#1D4ED8';
const BLUE_BG = '#EFF6FF';
const WHITE = '#FFFFFF';

const DISCLAIMER =
  'AVIS DE VALEUR INDICATIF — Document à usage strictement privé et indicatif. ' +
  'Cette estimation, réalisée avec l\'outil MonPrixJuste (version bêta), ne constitue ni un avis de valeur professionnel, ni un rapport d\'expertise, ni une garantie de prix d\'achat ou de vente. ' +
  'Elle n\'est pas opposable en justice. La valeur estimée est valable uniquement à la date indiquée et pour les caractéristiques déclarées par l\'utilisateur (kilométrage, état, équipements). ' +
  'Toute déclaration inexacte invalide la présente estimation. ' +
  'Pour toute transaction, consultez un expert automobile agréé ou un professionnel de l\'automobile. ' +
  'MonPrixJuste est un projet porté par l\'association HERRICHAIN (Loi 1901, RNA : W641015204). ' +
  'Artean Digital (SAS BASK\'IN BIARRITZ, SIRET 92991521300011) décline toute responsabilité quant à l\'usage de cette estimation.';

function formatPrice(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Non renseignée';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatShortUrl(url: string): string {
  try {
    const raw = url.trim();
    const parsed = new URL(raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`);
    const host = parsed.hostname.replace(/^www\./, '');
    let path = parsed.pathname;
    if (path === '/') path = '';
    if (path.length > 26) {
      path = path.slice(0, 14) + '…' + path.slice(-8);
    }
    return `${host}${path}`;
  } catch {
    const clean = url.replace(/^https?:\/\/(www\.)?/, '').trim();
    return clean.length > 28 ? clean.slice(0, 25) + '…' : clean;
  }
}

function getValidUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function getAutoPlatformFallbackUrl(sourceName: string, category: 'cote' | 'particulier' | 'pro' | 'rachat'): string {
  const lower = (sourceName || '').toLowerCase();
  if (lower.includes('centrale')) return 'https://www.lacentrale.fr/';
  if (lower.includes('vendezvotrevoiture') || lower.includes('vendez votre voiture')) return 'https://www.vendezvotrevoiture.fr/';
  if (lower.includes('leboncoin') || lower.includes('boncoin')) return 'https://www.leboncoin.fr/';
  if (lower.includes('autoscout')) return 'https://www.autoscout24.fr/';
  if (lower.includes('argus')) return 'https://www.largus.fr/';
  if (lower.includes('paruvendu')) return 'https://www.paruvendu.fr/';
  if (category === 'cote') return 'https://www.lacentrale.fr/';
  if (category === 'rachat') return 'https://www.vendezvotrevoiture.fr/';
  if (category === 'pro') return 'https://www.lacentrale.fr/';
  return 'https://www.leboncoin.fr/';
}

function addPageHeader(doc: jsPDF, pageNum: number, totalPages: number, refCode: string) {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(DARK);
  doc.rect(0, 0, w, 13, 'F');
  doc.setFillColor(ORANGE);
  doc.rect(0, 13, w, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(WHITE);
  doc.text('MonPrixJuste', 14, 8.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(`Dossier d'estimation automobile • Réf. ${refCode}`, 44, 8.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(WHITE);
  doc.text(`Page ${pageNum} / ${totalPages}`, w - 14, 8.8, { align: 'right' });
}

function addPageFooter(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setFillColor(LIGHT_GRAY);
  doc.rect(0, h - 19, w, 19, 'F');
  doc.setDrawColor(BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.line(14, h - 19, w - 14, h - 19);

  doc.setFontSize(6);
  doc.setTextColor(GRAY);
  doc.setFont('helvetica', 'italic');
  const lines = doc.splitTextToSize(DISCLAIMER, w - 28);
  doc.text(lines, 14, h - 14.5);
}

function addSectionTitle(doc: jsPDF, title: string, y: number, subtitle?: string): number {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(ORANGE);
  doc.roundedRect(14, y, 3.5, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(DARK);
  doc.text(title, 20.5, y + 5.3);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text(subtitle, w - 14, y + 5.3, { align: 'right' });
  }

  doc.setDrawColor(BORDER_GRAY);
  doc.setLineWidth(0.25);
  doc.line(14, y + 9, w - 14, y + 9);
  return y + 13;
}

function addClickableSourceBadge(
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  url: string,
  isDirectLink: boolean
) {
  const validUrl = getValidUrl(url);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  const textWidth = doc.getTextWidth(label);
  const pillW = textWidth + 8;
  const pillH = 5.5;

  if (isDirectLink) {
    doc.setFillColor(BLUE_BG);
    doc.setDrawColor(147, 197, 253);
    doc.setTextColor(BLUE_LINK);
  } else {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.setTextColor(SLATE);
  }

  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, pillW, pillH, 1.5, 1.5, 'FD');
  doc.textWithLink(label, x + 4, y + 3.9, { url: validUrl });
  doc.link(x, y, pillW, pillH, { url: validUrl });
}

function addRow(doc: jsPDF, label: string, value: string, y: number, highlight = false): number {
  const w = doc.internal.pageSize.getWidth();
  if (highlight) {
    doc.setFillColor(255, 237, 213);
    doc.roundedRect(14, y - 0.5, w - 28, 8.5, 1.5, 1.5, 'F');
  }
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(SLATE);
  doc.text(label, 17, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(highlight ? ORANGE : DARK);
  doc.text(value, w - 17, y + 5, { align: 'right' });
  if (!highlight) {
    doc.setDrawColor(235, 238, 242);
    doc.setLineWidth(0.2);
    doc.line(14, y + 7.5, w - 14, y + 7.5);
  }
  return y + 9.5;
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
  const refCode = `AUTO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
  const photos = (vehicleData.photos || []).filter(Boolean);

  // ═══════════════════════════════════════════════════════════
  // PAGE 1 — PAGE DE GARDE & PHOTO EN TÊTE DE PAGE
  // ═══════════════════════════════════════════════════════════
  let y = 19;

  // Bandeau Titre Exécutif
  doc.setFillColor(DARK);
  doc.roundedRect(14, y, w - 28, 26, 3, 3, 'F');
  doc.setFillColor(ORANGE);
  doc.roundedRect(14, y, 4, 26, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(ORANGE);
  doc.text('DOSSIER D\'ESTIMATION AUTOMOBILE HYBRIDE', 22, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(WHITE);
  const vehicleTitle =
    vehicleData.estimationName ||
    `${vehicleData.marque || 'Véhicule'} ${vehicleData.modele || ''} ${vehicleData.version ? `(${vehicleData.version})` : ''} — ${vehicleData.annee}`.trim();
  doc.text(vehicleTitle.slice(0, 58), 22, y + 15.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `${vehicleData.kilometrage.toLocaleString('fr-FR')} km • ${vehicleData.motorisation} • ${vehicleData.boite}  |  Édité le ${formatDate(new Date().toISOString())}`,
    22,
    y + 22
  );

  y += 30;

  // ── BLOC PHOTO EN TÊTE DE PAGE + CARTE DE VALORISATION ──
  if (photos.length > 0) {
    const coverPhoto = photos[0];
    const leftW = 92;
    const rightW = w - 28 - leftW - 4;
    const rightX = 14 + leftW + 4;
    const blockH = photos.length > 1 ? 72 : 58;
    const mainPhotoH = photos.length > 1 ? 52 : 58;

    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, y, leftW, mainPhotoH, 2.5, 2.5, 'FD');
    try {
      doc.addImage(coverPhoto, 'JPEG', 14.8, y + 0.8, leftW - 1.6, mainPhotoH - 1.6, undefined, 'FAST');
    } catch {
      doc.setFontSize(8);
      doc.setTextColor(GRAY);
      doc.text('Photo du véhicule', 14 + leftW / 2, y + mainPhotoH / 2, { align: 'center' });
    }

    doc.setFillColor(DARK);
    doc.roundedRect(16.5, y + 2.5, 38, 5.5, 1.2, 1.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(WHITE);
    doc.text('★ VUE PRINCIPALE VÉHICULE', 18.5, y + 6.2);

    if (photos.length > 1) {
      const extraPhotos = photos.slice(1, 4);
      const thumbGap = 2;
      const thumbW = (leftW - thumbGap * 2) / 3;
      const thumbH = 17.5;
      const thumbY = y + mainPhotoH + 2.5;

      extraPhotos.forEach((p, idx) => {
        const tx = 14 + idx * (thumbW + thumbGap);
        doc.setFillColor(LIGHT_GRAY);
        doc.setDrawColor(BORDER_GRAY);
        doc.roundedRect(tx, thumbY, thumbW, thumbH, 1.5, 1.5, 'FD');
        try {
          doc.addImage(p, 'JPEG', tx + 0.5, thumbY + 0.5, thumbW - 1, thumbH - 1, undefined, 'FAST');
        } catch {
          // ignore
        }
      });
    }

    // Carte Prix Estimé à droite
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(ORANGE);
    doc.setLineWidth(0.6);
    doc.roundedRect(rightX, y, rightW, blockH, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE);
    doc.text('COTE & VALEUR ESTIMÉE', rightX + rightW / 2, y + 9, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(23);
    doc.setTextColor(ORANGE);
    doc.text(formatPrice(result.prixFinal), rightX + rightW / 2, y + 21, { align: 'center' });

    doc.setFillColor(WHITE);
    doc.setDrawColor(253, 186, 116);
    doc.roundedRect(rightX + 8, y + 24.5, rightW - 16, 6.5, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(DARK);
    doc.text(`Base pondérée : ${formatPrice(result.prixBase)}`, rightX + rightW / 2, y + 29, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(SLATE);
    doc.text('Fourchette de transaction :', rightX + rightW / 2, y + 38, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(DARK);
    doc.text(
      `${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`,
      rightX + rightW / 2,
      y + 43.5,
      { align: 'center' }
    );

    doc.setDrawColor(254, 215, 170);
    doc.line(rightX + 6, y + 47.5, rightX + rightW - 6, y + 47.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE);
    doc.text(`Positionnement : ${result.positionMarche}`, rightX + 6, y + 53);

    const scoreColor = result.scoreConfiance >= 70 ? '#10b981' : result.scoreConfiance >= 50 ? ORANGE : '#ef4444';
    doc.text(`Indice de confiance : ${result.scoreConfiance}/100`, rightX + 6, y + (photos.length > 1 ? 61 : 56.5));
    if (photos.length > 1) {
      doc.setFillColor(226, 232, 240);
      doc.roundedRect(rightX + 6, y + 63.5, rightW - 12, 3.5, 1.5, 1.5, 'F');
      doc.setFillColor(scoreColor);
      doc.roundedRect(rightX + 6, y + 63.5, ((rightW - 12) * result.scoreConfiance) / 100, 3.5, 1.5, 1.5, 'F');
    }

    y += blockH + 7;
  } else {
    // Sans photo
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(ORANGE);
    doc.setLineWidth(0.6);
    doc.roundedRect(14, y, w - 28, 38, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(SLATE);
    doc.text('PRIX FINAL ESTIMÉ DU VÉHICULE (MÉTHODE HYBRIDE)', w / 2, y + 8.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(ORANGE);
    doc.text(formatPrice(result.prixFinal), w / 2, y + 20, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(DARK);
    doc.text(
      `Fourchette : ${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`,
      w / 2,
      y + 28,
      { align: 'center' }
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(GRAY);
    doc.text(
      `Prix de base pondéré : ${formatPrice(result.prixBase)}   •   Positionnement marché : ${result.positionMarche}   •   Confiance : ${result.scoreConfiance}/100`,
      w / 2,
      y + 34.5,
      { align: 'center' }
    );

    y += 45;
  }

  // ── FICHE TECHNIQUE DU VÉHICULE (GRILLE 2 COLONNES) ──
  y = addSectionTitle(doc, 'Fiche technique & État déclaré du véhicule', y, `État : ${ajustements.etatGeneral}`);

  const specsLeft: [string, string][] = [
    ['Marque / Modèle', `${vehicleData.marque || '—'} ${vehicleData.modele || ''}`.trim()],
    ['Version / Finition', vehicleData.version || 'Standard'],
    ['Année de mise en circ.', String(vehicleData.annee)],
    ['Kilométrage déclaré', `${vehicleData.kilometrage.toLocaleString('fr-FR')} km`],
    ['Motorisation', vehicleData.motorisation],
  ];

  const specsRight: [string, string][] = [
    ['Boîte de vitesses', vehicleData.boite],
    ['Carrosserie / Portes', `${vehicleData.carrosserie} (${vehicleData.nombrePortes} portes)`],
    ['Couleur', vehicleData.couleur || 'Non renseignée'],
    ['État général', ajustements.etatGeneral],
    ['Sinistre / Accident', ajustements.accidentDeclare],
  ];

  const colW = (w - 32) / 2;
  const startGridY = y;
  specsLeft.forEach(([lbl, val], i) => {
    const rowY = startGridY + i * 8.5;
    if (i % 2 === 0) {
      doc.setFillColor(LIGHT_GRAY);
      doc.rect(14, rowY - 1, colW, 8, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(GRAY);
    doc.text(lbl, 16, rowY + 4.3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK);
    doc.text(val.slice(0, 28), 14 + colW - 2, rowY + 4.3, { align: 'right' });
  });

  specsRight.forEach(([lbl, val], i) => {
    const rowY = startGridY + i * 8.5;
    const rx = 18 + colW;
    if (i % 2 === 0) {
      doc.setFillColor(LIGHT_GRAY);
      doc.rect(rx, rowY - 1, colW, 8, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(GRAY);
    doc.text(lbl, rx + 2, rowY + 4.3);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DARK);
    doc.text(val.slice(0, 28), rx + colW - 2, rowY + 4.3, { align: 'right' });
  });

  y = startGridY + specsLeft.length * 8.5 + 6;

  // ── SYNTHÈSE DES 4 FAMILLES DE SOURCES SUR LA PAGE 1 ──
  y = addSectionTitle(doc, 'Synthèse de la pondération hybride', y, '4 familles de sources croisées');

  const cards = [
    {
      title: 'Cote officielle',
      weight: `${ponderations.coteOfficielle}%`,
      avg: result.detailsSources.coteOfficielle.moyenne > 0 ? formatPrice(result.detailsSources.coteOfficielle.moyenne) : '—',
      contrib: `Contrib. ${formatPrice(result.detailsSources.coteOfficielle.contribution)}`,
    },
    {
      title: 'Particuliers',
      weight: `${ponderations.annoncesParticulier}%`,
      avg: result.detailsSources.annoncesParticulier.moyenne > 0 ? formatPrice(result.detailsSources.annoncesParticulier.moyenne) : '—',
      contrib: `Contrib. ${formatPrice(result.detailsSources.annoncesParticulier.contribution)}`,
    },
    {
      title: 'Pros / Concessions',
      weight: `${ponderations.annoncesPro}%`,
      avg: result.detailsSources.annoncesPro.moyenne > 0 ? formatPrice(result.detailsSources.annoncesPro.moyenne) : '—',
      contrib: `Contrib. ${formatPrice(result.detailsSources.annoncesPro.contribution)}`,
    },
    {
      title: 'Rachat cash',
      weight: `${ponderations.rachatCash}%`,
      avg: result.detailsSources.rachatCash.moyenne > 0 ? formatPrice(result.detailsSources.rachatCash.moyenne) : '—',
      contrib: `Contrib. ${formatPrice(result.detailsSources.rachatCash.contribution)}`,
    },
  ];

  const cardW = (w - 28 - 9) / 4;
  cards.forEach((c, idx) => {
    const cx = 14 + idx * (cardW + 3);
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, y, cardW, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE);
    doc.text(c.title, cx + 2.5, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(ORANGE);
    doc.text(c.weight, cx + cardW - 2.5, y + 6, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(DARK);
    doc.text(c.avg, cx + 2.5, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(GRAY);
    doc.text(c.contrib, cx + 2.5, y + 19.5);
  });

  y += 30;

  if (y < h - 38) {
    const scoreLabel =
      result.scoreConfiance >= 70
        ? 'Fiabilité élevée (sources croisées et homogènes)'
        : result.scoreConfiance >= 50
        ? 'Fiabilité correcte (recommandé : enrichir les comparables)'
        : 'Fiabilité limitée (peu de sources renseignées)';
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.roundedRect(14, y, w - 28, 16, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK);
    doc.text(`Indice de confiance global : ${result.scoreConfiance}% — ${scoreLabel}`, 18, y + 6.5);

    doc.setFillColor(226, 232, 240);
    doc.roundedRect(18, y + 9.5, w - 36, 3.5, 1.5, 1.5, 'F');
    const scoreColor = result.scoreConfiance >= 70 ? '#10b981' : result.scoreConfiance >= 50 ? ORANGE : '#ef4444';
    doc.setFillColor(scoreColor);
    doc.roundedRect(18, y + 9.5, ((w - 36) * result.scoreConfiance) / 100, 3.5, 1.5, 1.5, 'F');
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 2 — MÉTHODOLOGIE & SOURCES CLIQUABLES
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 20;

  y = addSectionTitle(doc, 'Méthodologie & Traçabilité des Sources Cliquables', y, 'Cliquez sur les badges bleus pour ouvrir les annonces');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(SLATE);
  const methText =
    'MonPrixJuste combine quatre catégories de références : la cote officielle (La Centrale, Argus), les annonces de particuliers ' +
    '(Leboncoin, ParuVendu), les annonces professionnelles (La Centrale, AutoScout24 — corrigées de la marge pro de -5%) ' +
    'et les offres de reprise/rachat immédiat (Vendezvotrevoiture.fr, etc.). Chaque source ci-dessous comporte un bouton « Source cliquable » permettant d\'accéder directement à l\'annonce ou au portail utilisé.';
  const methLines = doc.splitTextToSize(methText, w - 28);
  doc.text(methLines, 14, y);
  y += methLines.length * 4.5 + 5;

  const ensureSpace = (needed: number) => {
    if (y + needed > h - 24) {
      doc.addPage();
      y = 20;
    }
  };

  // 1. Cotes officielles
  if (sources.coteOfficielle.length > 0) {
    ensureSpace(24);
    y = addSectionTitle(
      doc,
      `Cotes officielles (${sources.coteOfficielle.length})`,
      y,
      `Pondération : ${ponderations.coteOfficielle}%`
    );

    for (const c of sources.coteOfficielle) {
      ensureSpace(17);
      const hasLink = Boolean(c.lien && c.lien.trim() !== '');
      const label = `${c.source || 'La Centrale'}${c.commentaire ? ` — ${c.commentaire}` : ''}`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(14, y, w - 28, 14.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(label.slice(0, 62), 17, y + 5.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(ORANGE);
      doc.text(formatPrice(c.prix), w - 17, y + 5.2, { align: 'right' });

      const targetUrl = hasLink ? c.lien! : getAutoPlatformFallbackUrl(c.source, 'cote');
      const badgeLabel = hasLink
        ? `Source cliquable : consulter la cote (${formatShortUrl(c.lien!)}) ↗`
        : `Plateforme de cote : ${formatShortUrl(targetUrl)} ↗`;
      addClickableSourceBadge(doc, 17, y + 7.2, badgeLabel, targetUrl, hasLink);

      y += 17;
    }
    y += 3;
  }

  // 2. Annonces particuliers
  if (sources.annoncesParticulier.length > 0) {
    ensureSpace(24);
    y = addSectionTitle(
      doc,
      `Annonces particuliers comparables (${sources.annoncesParticulier.length})`,
      y,
      `Pondération : ${ponderations.annoncesParticulier}%`
    );

    for (const a of sources.annoncesParticulier) {
      ensureSpace(17);
      const hasLink = Boolean(a.lien && a.lien.trim() !== '');
      const label = `Annonce particulier — Année ${a.annee} — ${a.kilometrage.toLocaleString('fr-FR')} km`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(14, y, w - 28, 14.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(label, 17, y + 5.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(ORANGE);
      doc.text(formatPrice(a.prix), w - 17, y + 5.2, { align: 'right' });

      const targetUrl = hasLink ? a.lien : getAutoPlatformFallbackUrl('Leboncoin', 'particulier');
      const badgeLabel = hasLink
        ? `Source cliquable : ouvrir l'annonce (${formatShortUrl(a.lien)}) ↗`
        : `Plateforme source : ${formatShortUrl(targetUrl)} ↗`;
      addClickableSourceBadge(doc, 17, y + 7.2, badgeLabel, targetUrl, hasLink);

      y += 17;
    }
    y += 3;
  }

  // 3. Annonces professionnelles
  if (sources.annoncesPro.length > 0) {
    ensureSpace(24);
    y = addSectionTitle(
      doc,
      `Annonces professionnelles (${sources.annoncesPro.length})`,
      y,
      `Pondération : ${ponderations.annoncesPro}% • Correction marge pro -5%`
    );

    for (const a of sources.annoncesPro) {
      ensureSpace(17);
      const hasLink = Boolean(a.lien && a.lien.trim() !== '');
      const label = `${a.source || 'Professionnel'} — Année ${a.annee} — ${a.kilometrage.toLocaleString('fr-FR')} km`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(14, y, w - 28, 14.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(label, 17, y + 5.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(ORANGE);
      doc.text(`${formatPrice(a.prix)} (${formatPrice(a.prix * 0.95)} net)`, w - 17, y + 5.2, { align: 'right' });

      const targetUrl = hasLink ? a.lien! : getAutoPlatformFallbackUrl(a.source, 'pro');
      const badgeLabel = hasLink
        ? `Source cliquable : ouvrir l'annonce pro (${formatShortUrl(a.lien!)}) ↗`
        : `Plateforme source : ${formatShortUrl(targetUrl)} ↗`;
      addClickableSourceBadge(doc, 17, y + 7.2, badgeLabel, targetUrl, hasLink);

      y += 17;
    }
    y += 3;
  }

  // 4. Offres de rachat cash
  if (sources.rachatCash.length > 0) {
    ensureSpace(24);
    y = addSectionTitle(
      doc,
      `Offres de reprise / rachat cash (${sources.rachatCash.length})`,
      y,
      `Pondération : ${ponderations.rachatCash}%`
    );

    for (const r of sources.rachatCash) {
      ensureSpace(17);
      const hasLink = Boolean(r.lien && r.lien.trim() !== '');
      const label = `${r.societe || 'Vendezvotrevoiture.fr'} — ${formatDate(r.date)}${r.conditions ? ` (${r.conditions})` : ''}`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(14, y, w - 28, 14.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(label.slice(0, 62), 17, y + 5.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(ORANGE);
      doc.text(formatPrice(r.prix), w - 17, y + 5.2, { align: 'right' });

      const targetUrl = hasLink ? r.lien! : getAutoPlatformFallbackUrl(r.societe, 'rachat');
      const badgeLabel = hasLink
        ? `Source cliquable : voir l'offre (${formatShortUrl(r.lien!)}) ↗`
        : `Plateforme de reprise : ${formatShortUrl(targetUrl)} ↗`;
      addClickableSourceBadge(doc, 17, y + 7.2, badgeLabel, targetUrl, hasLink);

      y += 17;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 3 — RÉSULTAT, AJUSTEMENTS & CONSEILS DE VENTE
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 20;

  y = addSectionTitle(doc, 'Synthèse financière de l\'estimation', y);
  const resultRows: [string, string, boolean][] = [
    ['Prix de base pondéré (avant ajustements)', formatPrice(result.prixBase), false],
    ['Prix final estimé', formatPrice(result.prixFinal), true],
    ['Fourchette basse (prix plancher conseillé)', formatPrice(result.fourchetteBasse), false],
    ['Fourchette haute (prix d\'affichage optimiste)', formatPrice(result.fourchetteHaute), false],
    ['Positionnement sur le marché', result.positionMarche, false],
  ];
  for (const [label, value, hl] of resultRows) {
    y = addRow(doc, label, value, y, hl);
  }
  y += 5;

  if (result.ajustementsAppliques.length > 0) {
    y = addSectionTitle(doc, 'Ajustements qualitatifs & équipements appliqués', y);
    for (const aj of result.ajustementsAppliques) {
      const sign = aj.valeur >= 0 ? '+' : '';
      const val = `${sign}${aj.valeur.toFixed(1)}% (${sign}${Math.round(aj.impact).toLocaleString('fr-FR')} €)`;
      y = addRow(doc, aj.nom, val, y);
      if (y > h - 65) break;
    }
    y += 5;
  }

  y = addSectionTitle(doc, 'Conseils personnalisés pour la mise en vente', y);
  const conseils = getConseilsVendeur(result, vehicleData, ajustements);
  for (const conseil of conseils) {
    const lines = doc.splitTextToSize(`• ${conseil}`, w - 34);
    const boxH = lines.length * 4.5 + 4;
    if (y + boxH > h - 45) break;
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.roundedRect(14, y, w - 28, boxH, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK);
    doc.text(lines, 17, y + 4.2);
    y += boxH + 2.5;
  }

  y += 3;
  if (y < h - 55) {
    y = addSectionTitle(doc, 'Stratégie de négociation', y);
    const negoConseils = getConseilsNegociation(result, ajustements);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    for (const conseil of negoConseils) {
      const lines = doc.splitTextToSize(`• ${conseil}`, w - 32);
      if (y + lines.length * 4.5 > h - 38) break;
      doc.setTextColor(SLATE);
      doc.text(lines, 16, y + 3);
      y += lines.length * 4.5 + 2.5;
    }
  }

  // Bandeau de ressources officielles cliquables en bas de page 3
  if (y < h - 34) {
    const refY = Math.max(y + 2, h - 34);
    doc.setFillColor(BLUE_BG);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(14, refY, w - 28, 12, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(DARK);
    doc.text('Portails de référence & historique officiel :', 17, refY + 4.5);

    addClickableSourceBadge(doc, 17, refY + 5.5, 'LaCentrale.fr ↗', 'https://www.lacentrale.fr/', true);
    addClickableSourceBadge(doc, 49, refY + 5.5, 'Vendezvotrevoiture.fr ↗', 'https://www.vendezvotrevoiture.fr/', true);
    addClickableSourceBadge(doc, 95, refY + 5.5, 'Leboncoin.fr ↗', 'https://www.leboncoin.fr/', true);
    addClickableSourceBadge(doc, 125, refY + 5.5, 'AutoScout24.fr ↗', 'https://www.autoscout24.fr/', true);
    addClickableSourceBadge(doc, 161, refY + 5.5, 'Histovec (Gouv) ↗', 'https://histovec.interieur.gouv.fr/histovec/accueil', true);
  }

  // Pass final pour numéroter toutes les pages exactement
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addPageHeader(doc, p, totalPages, refCode);
    addPageFooter(doc);
  }

  const filename = `MonPrixJuste_Auto_${(vehicleData.estimationName || `${vehicleData.marque}_${vehicleData.modele}`).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

function getConseilsVendeur(result: CalculationResult, vehicleData: VehicleData, ajustements: Ajustements): string[] {
  const conseils: string[] = [];
  const ratio = result.prixFinal / result.prixBase;
  const ageVehicule = new Date().getFullYear() - vehicleData.annee;

  if (result.scoreConfiance < 50) {
    conseils.push(
      'Votre score de confiance est inférieur à 50%. Ajoutez une cote La Centrale, 2 annonces Leboncoin et une offre Vendezvotrevoiture.fr pour consolider votre prix.'
    );
  }

  if (ajustements.accidentDeclare !== 'Aucun') {
    conseils.push(
      `Votre véhicule a un sinistre déclaré (${ajustements.accidentDeclare}). Soyez transparent dans votre annonce et présentez le rapport d'expertise ou les factures de réparation.`
    );
  }

  if (vehicleData.kilometrage > 150000) {
    conseils.push(
      'Au-delà de 150 000 km, préparez le carnet d\'entretien complet, le rapport Histovec et les factures des pièces d\'usure (distribution, embrayage, freins).'
    );
  } else if (vehicleData.kilometrage < 50000) {
    conseils.push(
      'Votre faible kilométrage est un atout majeur : mettez-le en avant dès le titre de l\'annonce et certifiez-le avec le rapport officiel Histovec.'
    );
  }

  if (ageVehicule >= 4) {
    conseils.push(
      'Pour toute vente à un particulier d\'un véhicule de plus de 4 ans, un contrôle technique de moins de 6 mois est légalement obligatoire.'
    );
  }

  if (ratio > 1.08) {
    conseils.push(
      'Votre véhicule se situe au-dessus de la moyenne grâce à ses options et son état. Détaillez chaque équipement optionnel et l\'historique d\'entretien dans l\'annonce.'
    );
  }

  conseils.push(
    `Prix d'annonce conseillé : entre ${formatPrice(result.prixFinal * 1.03)} et ${formatPrice(result.prixFinal * 1.06)} pour conserver une marge de négociation de 3 à 6%.`
  );

  return conseils;
}

function getConseilsNegociation(result: CalculationResult, ajustements: Ajustements): string[] {
  const conseils: string[] = [];

  conseils.push(
    `La fourchette estimée s'étend de ${formatPrice(result.fourchetteBasse)} à ${formatPrice(result.fourchetteHaute)}. Ne descendez pas sous ${formatPrice(result.fourchetteBasse)}.`
  );

  if (result.scoreConfiance >= 70) {
    conseils.push(
      'Présentez ce dossier PDF avec ses annonces sources cliquables lors de l\'essai du véhicule : cela démontre le sérieux de votre chiffrage.'
    );
  }

  if (ajustements.garantieConstructeur) {
    conseils.push(
      'La garantie constructeur transférable rassure fortement l\'acheteur particulier et limite les demandes de rabais.'
    );
  }

  conseils.push(
    'Privilégiez un paiement sécurisé (chèque de banque vérifié aux heures d\'ouverture ou virement instantané) lors de la cession.'
  );

  return conseils;
}

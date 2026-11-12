import jsPDF from 'jspdf';
import type { PropertyData, Sources, Ponderations, Ajustements, CalculationResult } from '../types';

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
  'AVERTISSEMENT IMPORTANT — Document à usage strictement indicatif. ' +
  'Cette estimation hybride, réalisée avec l\'outil MonPrixJuste (version bêta), ne constitue ni un avis de valeur professionnel, ni une expertise immobilière certifiée, ni un mandat de vente ou d\'achat, ni une offre d\'achat ou de vente. ' +
  'Elle n\'est pas opposable en justice ni à titre de preuve dans quelque procédure que ce soit. ' +
  'Les données utilisées sont saisies manuellement par l\'utilisateur ; MonPrixJuste n\'en garantit ni l\'exactitude, ni l\'exhaustivité. ' +
  'Pour toute décision d\'achat, de vente ou de financement, consultez un professionnel qualifié (notaire, agent immobilier, expert immobilier certifié). ' +
  'MonPrixJuste est un projet porté par l\'association HERRICHAIN (Loi 1901, RNA : W641015204). ' +
  'Code source propriété exclusive d\'Artean Digital (SAS BASK\'IN BIARRITZ, SIRET 92991521300011).';

function isDVFAncienne(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  const cinqAnsAvant = new Date();
  cinqAnsAvant.setFullYear(cinqAnsAvant.getFullYear() - 5);
  return date < cinqAnsAvant;
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

function getPlatformFallbackUrl(sourceName: string): string {
  const lower = (sourceName || '').toLowerCase();
  if (lower.includes('seloger') || lower.includes('se loger')) return 'https://www.seloger.com/';
  if (lower.includes('pap')) return 'https://www.pap.fr/';
  if (lower.includes('bien')) return 'https://www.bienici.com/';
  if (lower.includes('logic')) return 'https://www.logic-immo.com/';
  if (lower.includes('dvf') || lower.includes('etalab')) return 'https://app.dvf.etalab.gouv.fr/';
  if (lower.includes('immo-data') || lower.includes('immodata')) return 'https://www.immo-data.fr/';
  return 'https://www.leboncoin.fr/';
}

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
  doc.text(`Dossier d'estimation immobilière • Réf. ${refCode}`, 44, 8.8);

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
  const refCode = `IMMO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
  const photos = (propertyData.photos || []).filter(Boolean);

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
  doc.text('DOSSIER D\'ESTIMATION IMMOBILIÈRE HYBRIDE', 22, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(WHITE);
  const propTitle =
    propertyData.estimationName && propertyData.estimationName !== 'Estimation'
      ? propertyData.estimationName
      : `${propertyData.typeBien} ${propertyData.surface} m²${propertyData.ville ? ` — ${propertyData.ville}` : ''}`;
  doc.text(propTitle.slice(0, 58), 22, y + 15.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const fullAddr = [propertyData.adresse, `${propertyData.codePostal || ''} ${propertyData.ville || ''}`.trim()]
    .filter(Boolean)
    .join(' • ') || 'Localisation non renseignée';
  doc.text(`${fullAddr}  |  Édité le ${formatDate(new Date().toISOString())}`, 22, y + 22);

  y += 30;

  // ── BLOC PHOTO EN TÊTE DE PAGE + CARTE DE VALORISATION ──
  if (photos.length > 0) {
    const coverPhoto = photos[0];
    const leftW = 92;
    const rightW = w - 28 - leftW - 4;
    const rightX = 14 + leftW + 4;
    const blockH = photos.length > 1 ? 72 : 58;
    const mainPhotoH = photos.length > 1 ? 52 : 58;

    // Cadre photo principale en tête de page
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, y, leftW, mainPhotoH, 2.5, 2.5, 'FD');
    try {
      doc.addImage(coverPhoto, 'JPEG', 14.8, y + 0.8, leftW - 1.6, mainPhotoH - 1.6, undefined, 'FAST');
    } catch {
      // Fallback si format d'image non reconnu
      doc.setFontSize(8);
      doc.setTextColor(GRAY);
      doc.text('Photo principale', 14 + leftW / 2, y + mainPhotoH / 2, { align: 'center' });
    }

    // Badge sur la photo de couverture
    doc.setFillColor(DARK);
    doc.roundedRect(16.5, y + 2.5, 34, 5.5, 1.2, 1.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(WHITE);
    doc.text('★ VUE PRINCIPALE DU BIEN', 18.5, y + 6.2);

    // Miniatures supplémentaires si plusieurs photos ont été chargées
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

    // Carte Prix Estimé à droite de la photo
    doc.setFillColor(255, 247, 237); // orange-50
    doc.setDrawColor(ORANGE);
    doc.setLineWidth(0.6);
    doc.roundedRect(rightX, y, rightW, blockH, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE);
    doc.text('VALEUR ESTIMÉE DU BIEN', rightX + rightW / 2, y + 9, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(23);
    doc.setTextColor(ORANGE);
    doc.text(formatPrice(result.prixFinal), rightX + rightW / 2, y + 21, { align: 'center' });

    if (propertyData.surface > 0) {
      doc.setFillColor(WHITE);
      doc.setDrawColor(253, 186, 116);
      doc.roundedRect(rightX + rightW / 2 - 22, y + 24.5, 44, 6.5, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(DARK);
      doc.text(
        `${Math.round(result.prixFinal / propertyData.surface).toLocaleString('fr-FR')} € / m²`,
        rightX + rightW / 2,
        y + 29,
        { align: 'center' }
      );
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(SLATE);
    doc.text('Fourchette de marché recommandée :', rightX + rightW / 2, y + 38, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(DARK);
    doc.text(
      `${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`,
      rightX + rightW / 2,
      y + 43.5,
      { align: 'center' }
    );

    // Positionnement + Score dans la carte droite
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
    // Sans photo : Grand bloc de valorisation pleine largeur
    doc.setFillColor(255, 247, 237);
    doc.setDrawColor(ORANGE);
    doc.setLineWidth(0.6);
    doc.roundedRect(14, y, w - 28, 38, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(SLATE);
    doc.text('PRIX FINAL ESTIMÉ (MÉTHODE HYBRIDE)', w / 2, y + 8.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(ORANGE);
    doc.text(formatPrice(result.prixFinal), w / 2, y + 20, { align: 'center' });

    const subPrice =
      propertyData.surface > 0
        ? `${Math.round(result.prixFinal / propertyData.surface).toLocaleString('fr-FR')} €/m²   •   Fourchette : ${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`
        : `Fourchette : ${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(DARK);
    doc.text(subPrice, w / 2, y + 28, { align: 'center' });

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

  // ── FICHE DESCRIPTIVE DU BIEN (GRILLE 2 COLONNES) ──
  y = addSectionTitle(doc, 'Caractéristiques déclarées du bien', y, `État : ${ajustements.etatGeneral} • DPE : ${ajustements.dpe}`);

  const specsLeft: [string, string][] = [
    ['Type de bien', propertyData.typeBien],
    ['Surface habitable', `${propertyData.surface} m²`],
    ['Pièces / Chambres', `${propertyData.pieces || '—'} pièces / ${propertyData.chambres || '—'} ch.`],
    ['Étage / Ascenseur', `${propertyData.etage || 'RDC'}${propertyData.ascenseur ? ' (avec ascenseur)' : ''}`],
    ['Année construction', String(propertyData.anneeConstruction || 'Non renseignée')],
  ];

  const equipActifs: string[] = [];
  if (ajustements.balcon) equipActifs.push('Balcon');
  if (ajustements.terrasse) equipActifs.push('Terrasse');
  if (ajustements.jardin) equipActifs.push('Jardin');
  if (ajustements.parking) equipActifs.push('Parking');
  if (ajustements.cave) equipActifs.push('Cave');
  if (ajustements.vueDegagee) equipActifs.push('Vue dégagée');
  if (ajustements.calme) equipActifs.push('Calme');
  if (ajustements.travauxRecents) equipActifs.push('Travaux récents');

  const specsRight: [string, string][] = [
    ['Localisation', `${propertyData.codePostal || ''} ${propertyData.ville || 'Non renseignée'}`.trim()],
    ['État général', ajustements.etatGeneral],
    ['Classe DPE', ajustements.dpe],
    ['Exposition', ajustements.exposition],
    ['Atouts & équipements', equipActifs.length > 0 ? equipActifs.slice(0, 4).join(', ') : 'Standard'],
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

  // ── SYNTHÈSE DES SOURCES SUR LA PAGE 1 ──
  y = addSectionTitle(doc, 'Synthèse de la pondération hybride', y, '3 familles de données croisées');

  const cards = [
    {
      title: 'Ventes DVF / Immo-Data',
      weight: `${ponderations.dvf}%`,
      avg: result.detailsSources.dvf.moyenne > 0 ? formatPrice(result.detailsSources.dvf.moyenne) : 'Non utilisé',
      contrib: `Contribution : ${formatPrice(result.detailsSources.dvf.contribution)}`,
      count: `${sources.dvf.length} transaction(s)`,
    },
    {
      title: 'Annonces du marché (-5%)',
      weight: `${ponderations.annonces}%`,
      avg: result.detailsSources.annonces.moyenne > 0 ? formatPrice(result.detailsSources.annonces.moyenne) : 'Non utilisé',
      contrib: `Contribution : ${formatPrice(result.detailsSources.annonces.contribution)}`,
      count: `${sources.annonces.length} annonce(s)`,
    },
    {
      title: 'Estimations professionnelles',
      weight: `${ponderations.estimations}%`,
      avg: result.detailsSources.estimations.moyenne > 0 ? formatPrice(result.detailsSources.estimations.moyenne) : 'Non utilisé',
      contrib: `Contribution : ${formatPrice(result.detailsSources.estimations.contribution)}`,
      count: `${sources.estimations.length} évaluation(s)`,
    },
  ];

  const cardW = (w - 28 - 8) / 3;
  cards.forEach((c, idx) => {
    const cx = 14 + idx * (cardW + 4);
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, y, cardW, 25, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(SLATE);
    doc.text(c.title, cx + 3, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(ORANGE);
    doc.text(c.weight, cx + cardW - 3, y + 6, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(DARK);
    doc.text(c.avg, cx + 3, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(GRAY);
    doc.text(`${c.count} • ${c.contrib}`, cx + 3, y + 20.5);
  });

  y += 31;

  // Barre de confiance en bas de Page 1
  if (y < h - 38) {
    const scoreLabel =
      result.scoreConfiance >= 70
        ? 'Fiabilité élevée (sources croisées et homogènes)'
        : result.scoreConfiance >= 50
        ? 'Fiabilité correcte (recommandé : ajouter des comparables)'
        : 'Fiabilité limitée (peu de sources ou forte dispersion)';
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

  y = addSectionTitle(doc, 'Méthodologie & Traçabilité des Sources Cliquables', y, 'Cliquez sur les badges bleus pour ouvrir les sources');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(SLATE);
  const methText =
    'Ce rapport croise les transactions notariées officielles (DVF Etalab / Immo-Data), les annonces en ligne ' +
    '(Leboncoin, SeLoger, PAP, Bien\'ici — avec décote automatique de négociation de -5%) et les évaluations professionnelles. ' +
    'Toutes les annonces et références utilisées ci-dessous intègrent un lien « Source cliquable » vous permettant d\'ouvrir directement l\'annonce ou la base officielle.';
  const methLines = doc.splitTextToSize(methText, w - 28);
  doc.text(methLines, 14, y);
  y += methLines.length * 4.5 + 5;

  const ensureSpace = (needed: number) => {
    if (y + needed > h - 24) {
      doc.addPage();
      y = 20;
    }
  };

  // 1. Sources DVF / Immo-Data
  if (sources.dvf.length > 0) {
    ensureSpace(24);
    y = addSectionTitle(
      doc,
      `Transactions notariées DVF / Immo-Data (${sources.dvf.length})`,
      y,
      `Pondération : ${ponderations.dvf}%`
    );

    for (const dvf of sources.dvf) {
      ensureSpace(18);
      const ancienne = isDVFAncienne(dvf.date);
      const label =
        dvf.adresse && dvf.adresse.trim() !== ''
          ? `${dvf.adresse.trim()} — ${dvf.surface} m²`
          : `Transaction notariée DVF — ${dvf.surface} m²`;
      const val = `${formatPrice(dvf.prix)} (${Math.round(dvf.prix / dvf.surface).toLocaleString('fr-FR')} €/m²)`;
      const hasDate = Boolean(dvf.date && dvf.date.trim() !== '');
      const dateLabel = hasDate
        ? `Acte du ${formatDate(dvf.date)}${ancienne ? ' (plus de 5 ans : décote -30%)' : ''}`
        : 'Date d\'acte non précisée';

      doc.setFillColor(ancienne ? '#FFFBEB' : LIGHT_GRAY);
      doc.setDrawColor(ancienne ? '#FDE68A' : BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(14, y, w - 28, 15, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(label.slice(0, 62), 17, y + 5.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(ORANGE);
      doc.text(val, w - 17, y + 5.2, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(ancienne ? '#92400E' : GRAY);
      doc.text(dateLabel, 17, y + 11.2);

      const hasCustomLink = Boolean(dvf.lien && dvf.lien.trim() !== '');
      const targetUrl = hasCustomLink ? dvf.lien! : 'https://www.immo-data.fr/';
      const badgeLabel = hasCustomLink
        ? `Source cliquable : ${formatShortUrl(dvf.lien!)} ↗`
        : 'Source officielle : immo-data.fr ↗';
      const badgeW = doc.getTextWidth(badgeLabel) + 10;
      addClickableSourceBadge(doc, w - 16 - badgeW, y + 7.5, badgeLabel, targetUrl, true);

      y += 17.5;
    }
    y += 3;
  }

  // 2. Sources Annonces Marché
  if (sources.annonces.length > 0) {
    ensureSpace(24);
    y = addSectionTitle(
      doc,
      `Annonces immobilières comparables (${sources.annonces.length})`,
      y,
      `Pondération : ${ponderations.annonces}% • Décote négo -5%`
    );

    for (const a of sources.annonces) {
      ensureSpace(18);
      const hasLink = Boolean(a.lien && a.lien.trim() !== '');
      const label = `${a.source || 'Annonce'} — ${a.surface} m²${a.pieces ? ` — ${a.pieces} p.` : ''}`;
      const netPrice = Math.round(a.prix * 0.95);
      const val = `${formatPrice(a.prix)} affiché (${Math.round(netPrice / a.surface).toLocaleString('fr-FR')} €/m² net)`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(14, y, w - 28, 15, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(label, 17, y + 5.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(ORANGE);
      doc.text(val, w - 17, y + 5.2, { align: 'right' });

      const targetUrl = hasLink ? a.lien : getPlatformFallbackUrl(a.source);
      const badgeLabel = hasLink
        ? `Source cliquable : ouvrir l'annonce (${formatShortUrl(a.lien)}) ↗`
        : `Plateforme source : ${formatShortUrl(targetUrl)} ↗`;
      addClickableSourceBadge(doc, 17, y + 7.5, badgeLabel, targetUrl, hasLink);

      y += 17.5;
    }
    y += 3;
  }

  // 3. Sources Estimations Pro
  if (sources.estimations.length > 0) {
    ensureSpace(24);
    y = addSectionTitle(
      doc,
      `Évaluations & Avis de valeur (${sources.estimations.length})`,
      y,
      `Pondération : ${ponderations.estimations}%`
    );

    for (const e of sources.estimations) {
      ensureSpace(18);
      const hasLink = Boolean(e.lien && e.lien.trim() !== '');
      const hasDate = Boolean(e.date && e.date.trim() !== '');
      const label = `${e.source || 'Avis de valeur'}${hasDate ? ` — ${formatDate(e.date)}` : ''}`;
      const avg = Math.round((e.prixMin + e.prixMax) / 2);
      const val = `${formatPrice(e.prixMin)} à ${formatPrice(e.prixMax)} (moy. ${formatPrice(avg)})`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(14, y, w - 28, 15, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(label, 17, y + 5.2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(DARK);
      doc.text(val, w - 17, y + 5.2, { align: 'right' });

      if (hasLink) {
        const badgeLabel = `Source cliquable : consulter le document (${formatShortUrl(e.lien!)}) ↗`;
        addClickableSourceBadge(doc, 17, y + 7.5, badgeLabel, e.lien!, true);
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(GRAY);
        doc.text('Évaluation saisie manuellement (aucun lien externe associé)', 17, y + 11.2);
      }

      y += 17.5;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 3 — DÉTAIL FINANCIER, AJUSTEMENTS & CONSEILS PRO
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 20;

  y = addSectionTitle(doc, 'Synthèse financière & Indicateurs acquéreur', y);
  const fraisNotaire = Math.round(result.prixFinal * 0.08);
  const mensualite = Math.round((result.prixFinal * (0.035 / 12)) / (1 - Math.pow(1 + 0.035 / 12, -240)));

  const resultRows: [string, string, boolean][] = [
    ['Prix de base pondéré (avant ajustements)', formatPrice(result.prixBase), false],
    ['Prix final estimé net vendeur', formatPrice(result.prixFinal), true],
    ['Prix au m² estimé', `${result.prixM2.toLocaleString('fr-FR')} €/m²`, false],
    ['Fourchette basse de négociation', formatPrice(result.fourchetteBasse), false],
    ['Fourchette haute du marché', formatPrice(result.fourchetteHaute), false],
    ['Budget total acquéreur (frais de notaire ~8% inclus)', `${formatPrice(result.prixFinal + fraisNotaire)} (dont ~${formatPrice(fraisNotaire)} de frais)`, false],
    ['Mensualité crédit indicative (20 ans à 3,5% hors apport)', `~${mensualite.toLocaleString('fr-FR')} € / mois`, false],
  ];
  for (const [label, value, hl] of resultRows) {
    y = addRow(doc, label, value, y, hl);
  }
  y += 5;

  // Ajustements appliqués
  if (result.ajustementsAppliques.length > 0) {
    y = addSectionTitle(doc, 'Détail des ajustements qualitatifs appliqués (plafonnés à ±20%)', y);
    for (const aj of result.ajustementsAppliques) {
      const sign = aj.valeur >= 0 ? '+' : '';
      const val = `${sign}${aj.valeur.toFixed(1)}% (${sign}${Math.round(aj.impact).toLocaleString('fr-FR')} €)`;
      y = addRow(doc, aj.nom, val, y);
    }
    y += 5;
  }

  // Conseils vendeur
  y = addSectionTitle(doc, 'Recommandations stratégiques de mise en vente', y);
  const conseils = getConseilsVendeur(result, propertyData);
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

  // Conseils négociation
  y += 3;
  if (y < h - 55) {
    y = addSectionTitle(doc, 'Stratégie de négociation', y);
    const negoConseils = getConseilsNegociation(result);
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
    doc.text('Bases de données & plateformes de référence :', 17, refY + 4.5);

    addClickableSourceBadge(doc, 17, refY + 5.5, 'Immo-Data.fr ↗', 'https://www.immo-data.fr/', true);
    addClickableSourceBadge(doc, 48, refY + 5.5, 'DVF Etalab (Gouv) ↗', 'https://app.dvf.etalab.gouv.fr/', true);
    addClickableSourceBadge(doc, 88, refY + 5.5, 'Leboncoin.fr ↗', 'https://www.leboncoin.fr/', true);
    addClickableSourceBadge(doc, 120, refY + 5.5, 'SeLoger.com ↗', 'https://www.seloger.com/', true);
    addClickableSourceBadge(doc, 152, refY + 5.5, 'PAP.fr ↗', 'https://www.pap.fr/', true);
  }

  // Pass final pour numéroter toutes les pages exactement
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    addPageHeader(doc, p, totalPages, refCode);
    addPageFooter(doc);
  }

  const filename = `MonPrixJuste_Immo_${(propertyData.estimationName || propertyData.ville || 'estimation').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

function getConseilsVendeur(result: CalculationResult, propertyData: PropertyData): string[] {
  const conseils: string[] = [];
  const ratio = result.prixFinal / result.prixBase;

  if (result.scoreConfiance < 50) {
    conseils.push(
      'Votre score de confiance est inférieur à 50%. Ajoutez au moins 2 à 3 ventes DVF sur Immo-Data.fr et 2 annonces locales pour consolider votre prix.'
    );
  }

  if (ratio > 1.10) {
    conseils.push(
      'Votre bien ressort au-dessus des comparables bruts grâce à ses qualités intrinsèques. Préparez les justificatifs (DPE, factures de travaux, charges) pour défendre cette valorisation.'
    );
  } else if (ratio < 0.90) {
    conseils.push(
      'Votre estimation intègre une décote liée aux ajustements déclarés. Chiffrez les éventuels travaux avec un devis précis pour éviter une négociation excessive des acheteurs.'
    );
  } else {
    conseils.push(
      'Votre bien se situe au cœur du marché local : c\'est le positionnement idéal pour déclencher des visites qualifiées dès les 15 premiers jours de diffusion.'
    );
  }

  if (propertyData.typeBien === 'Appartement') {
    conseils.push(
      'Pour un appartement, préparez le pré-état daté, les 3 derniers PV d\'assemblée générale, le DPE et le décompte des charges de copropriété avant la première visite.'
    );
  } else if (propertyData.typeBien === 'Maison') {
    conseils.push(
      'Pour une maison, rassemblez les diagnostics complets, la taxe foncière, le contrôle d\'assainissement et les factures d\'entretien toiture/chauffage.'
    );
  }

  conseils.push(
    `Prix d'affichage conseillé en annonce : entre ${formatPrice(result.prixFinal * 1.02)} et ${formatPrice(result.prixFinal * 1.05)} afin de conserver une marge de négociation maîtrisée de 2 à 5%.`
  );

  return conseils;
}

function getConseilsNegociation(result: CalculationResult): string[] {
  const conseils: string[] = [];
  const ecart = result.fourchetteHaute - result.fourchetteBasse;
  const ecartPct = Math.round((ecart / result.prixFinal) * 100);

  conseils.push(
    `L'amplitude de la fourchette est de ${ecartPct}% (${formatPrice(result.fourchetteBasse)} à ${formatPrice(result.fourchetteHaute)}). Fixez votre prix plancher autour de ${formatPrice(result.fourchetteBasse)}.`
  );

  if (result.scoreConfiance >= 70) {
    conseils.push(
      'Appuyez-vous sur ce rapport PDF et ses sources cliquables (ventes notariées DVF / Immo-Data) lors des discussions : les données factuelles limitent les offres agressives.'
    );
  } else {
    conseils.push(
      'En cas d\'offre basse, demandez toujours à l\'acquéreur de justifier sa proposition par des biens réellement vendus dans le même secteur.'
    );
  }

  return conseils;
}

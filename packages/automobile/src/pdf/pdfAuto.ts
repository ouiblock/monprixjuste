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

const M = 16; // Page margin (mm)

const DISCLAIMER =
  'AVIS DE VALEUR INDICATIF — Document à usage strictement privé et indicatif. ' +
  'Cette estimation, réalisée avec l\'outil MonPrixJuste (version bêta), ne constitue ni un avis de valeur professionnel, ni un rapport d\'expertise, ni une garantie de prix d\'achat ou de vente. ' +
  'Elle n\'est pas opposable en justice. La valeur estimée est valable uniquement à la date indiquée et pour les caractéristiques déclarées par l\'utilisateur (kilométrage, état, équipements). ' +
  'Toute déclaration inexacte invalide la présente estimation. ' +
  'Pour toute transaction, consultez un expert automobile agréé ou un professionnel de l\'automobile. ' +
  'MonPrixJuste est un projet porté par l\'association HERRICHAIN (Loi 1901, RNA : W641015204). ' +
  'Artean Digital (SAS BASK\'IN BIARRITZ, capital 100 €, SIRET 92991521300011) décline toute responsabilité quant à l\'usage de cette estimation.';

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
    if (path.length > 20) {
      path = path.slice(0, 11) + '…' + path.slice(-6);
    }
    const res = `${host}${path}`;
    return res.length > 30 ? res.slice(0, 27) + '…' : res;
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

function drawDiscreetLogo(doc: jsPDF, x: number, y: number) {
  doc.setFillColor(ORANGE);
  doc.roundedRect(x, y, 6.5, 6.5, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(WHITE);
  doc.text('M', x + 3.25, y + 4.7, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(SLATE);
  doc.text('MonPrixJuste', x + 8.5, y + 4.7);
}

function addPageHeader(doc: jsPDF, pageNum: number, totalPages: number, refCode: string) {
  const w = doc.internal.pageSize.getWidth();
  drawDiscreetLogo(doc, M, 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(GRAY);
  doc.text(`Estimation automobile • Réf. ${refCode}`, w / 2, 11.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(SLATE);
  doc.text(`Page ${pageNum} / ${totalPages}`, w - M, 11.5, { align: 'right' });

  doc.setDrawColor(BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.line(M, 16, w - M, 16);
}

function addPageFooter(doc: jsPDF) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(BORDER_GRAY);
  doc.setLineWidth(0.25);
  doc.line(M, h - 14, w - M, h - 14);

  doc.setFontSize(6.5);
  doc.setTextColor(GRAY);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'MonPrixJuste — Document indicatif généré localement • Ne constitue pas une expertise automobile agréée.',
    w / 2,
    h - 9,
    { align: 'center' }
  );
}

function addSectionTitle(doc: jsPDF, title: string, y: number, subtitle?: string): number {
  const w = doc.internal.pageSize.getWidth();
  doc.setFillColor(ORANGE);
  doc.roundedRect(M, y, 3, 6.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(DARK);
  doc.text(title, M + 6, y + 5);

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(GRAY);
    doc.text(subtitle, w - M, y + 5, { align: 'right' });
  }

  doc.setDrawColor(BORDER_GRAY);
  doc.setLineWidth(0.25);
  doc.line(M, y + 8.5, w - M, y + 8.5);
  return y + 13;
}

function addClickableSourceBadge(
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  url: string,
  isDirectLink: boolean
): number {
  const validUrl = getValidUrl(url);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  const textWidth = doc.getTextWidth(label);
  const pillW = Math.min(textWidth + 8, 92);
  const pillH = 5.8;

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
  doc.textWithLink(label, x + 4, y + 4.1, { url: validUrl });
  doc.link(x, y, pillW, pillH, { url: validUrl });
  return pillW;
}

function addRow(doc: jsPDF, label: string, value: string, y: number, highlight = false): number {
  const w = doc.internal.pageSize.getWidth();
  const cw = w - M * 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const valWidth = doc.getTextWidth(value);
  const maxLabelWidth = Math.max(55, cw - valWidth - 12);

  doc.setFont('helvetica', 'normal');
  const labelLines = doc.splitTextToSize(label, maxLabelWidth);
  const rowH = Math.max(9, labelLines.length * 4.5 + 4.5);

  if (highlight) {
    doc.setFillColor(255, 237, 213);
    doc.roundedRect(M, y - 0.5, cw, rowH, 1.5, 1.5, 'F');
  }

  doc.setTextColor(SLATE);
  doc.text(labelLines, M + 3, y + 5.2);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(highlight ? ORANGE : DARK);
  doc.text(value, w - M - 3, y + 5.2, { align: 'right' });

  if (!highlight) {
    doc.setDrawColor(235, 238, 242);
    doc.setLineWidth(0.2);
    doc.line(M, y + rowH - 1, w - M, y + rowH - 1);
  }
  return y + rowH + 1.5;
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
  const cw = w - M * 2;
  const refCode = `AUTO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
  const photos = (vehicleData.photos || []).filter(Boolean);
  const role: 'vendeur' | 'acheteur' = vehicleData.role === 'acheteur' ? 'acheteur' : 'vendeur';

  // ═══════════════════════════════════════════════════════════
  // PAGE 1 — PAGE DE GARDE AÉRÉE (LOGO DISCRET, IMAGE, PRIX, DISCLAIMER)
  // ═══════════════════════════════════════════════════════════
  drawDiscreetLogo(doc, M, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(GRAY);
  doc.text(`Réf. ${refCode} • Édité le ${formatDate(new Date().toISOString())}`, w - M, 18.7, { align: 'right' });

  doc.setDrawColor(BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.line(M, 24, w - M, 24);

  let y = 33;

  // Badge Profil + Catégorie
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(253, 186, 116);
  doc.roundedRect(M, y, 76, 6.5, 1.5, 1.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(ORANGE);
  doc.text(
    `ESTIMATION AUTOMOBILE • PROFIL ${role.toUpperCase()}`,
    M + 38,
    y + 4.4,
    { align: 'center' }
  );

  y += 12;

  // Titre du véhicule
  const vehicleTitle =
    vehicleData.estimationName ||
    `${vehicleData.marque || 'Véhicule'} ${vehicleData.modele || ''} ${vehicleData.version ? `(${vehicleData.version})` : ''} — ${vehicleData.annee}`.trim();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(DARK);
  const titleLines = doc.splitTextToSize(vehicleTitle, cw);
  doc.text(titleLines, M, y);
  y += titleLines.length * 8 + 2;

  // Sous-titre caractéristiques clés
  const subInfo = `${vehicleData.kilometrage.toLocaleString('fr-FR')} km • ${vehicleData.motorisation} • ${vehicleData.boite}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(GRAY);
  doc.text(subInfo, M, y);
  y += 10;

  // Photo principale en couverture (si présente)
  if (photos.length > 0) {
    const mainPhotoH = photos.length > 1 ? 74 : 88;
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.setLineWidth(0.4);
    doc.roundedRect(M, y, cw, mainPhotoH, 3, 3, 'FD');
    try {
      doc.addImage(photos[0], 'JPEG', M + 1, y + 1, cw - 2, mainPhotoH - 2, undefined, 'FAST');
    } catch {
      doc.setFontSize(9);
      doc.setTextColor(GRAY);
      doc.text('Photo principale du véhicule', w / 2, y + mainPhotoH / 2, { align: 'center' });
    }
    y += mainPhotoH + 4;

    if (photos.length > 1) {
      const extra = photos.slice(1, 4);
      const gap = 3;
      const thumbW = (cw - gap * 2) / 3;
      const thumbH = 22;
      extra.forEach((p, idx) => {
        const tx = M + idx * (thumbW + gap);
        doc.setFillColor(LIGHT_GRAY);
        doc.setDrawColor(BORDER_GRAY);
        doc.roundedRect(tx, y, thumbW, thumbH, 2, 2, 'FD');
        try {
          doc.addImage(p, 'JPEG', tx + 0.6, y + 0.6, thumbW - 1.2, thumbH - 1.2, undefined, 'FAST');
        } catch {
          // ignore
        }
      });
      y += thumbH + 8;
    } else {
      y += 4;
    }
  } else {
    y += 10;
  }

  // Bloc Prix Estimé Aéré
  const priceCardH = 44;
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(ORANGE);
  doc.setLineWidth(0.6);
  doc.roundedRect(M, y, cw, priceCardH, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(SLATE);
  doc.text('VALEUR ESTIMÉE DU VÉHICULE', w / 2, y + 9.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(ORANGE);
  doc.text(formatPrice(result.prixFinal), w / 2, y + 22, { align: 'center' });

  const totalSourcesCount =
    sources.coteOfficielle.length +
    sources.annoncesParticulier.length +
    sources.annoncesPro.length +
    sources.rachatCash.length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(DARK);
  doc.text(
    `Fourchette : ${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}   •   Confiance : ${result.scoreConfiance}/100`,
    w / 2,
    y + 32,
    { align: 'center' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(GRAY);
  doc.text(
    `Positionnement : ${result.positionMarche}   •   Sources analysées : ${totalSourcesCount}`,
    w / 2,
    y + 38.5,
    { align: 'center' }
  );

  // Disclaimer complet sur la page de garde (en bas, bien encadré)
  const discLines = doc.splitTextToSize(DISCLAIMER, cw - 10);
  const discH = discLines.length * 3.3 + 8;
  const discY = h - M - discH;
  doc.setFillColor(LIGHT_GRAY);
  doc.setDrawColor(BORDER_GRAY);
  doc.setLineWidth(0.3);
  doc.roundedRect(M, discY, cw, discH, 2, 2, 'FD');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(GRAY);
  doc.text(discLines, M + 5, discY + 5.5);

  // ═══════════════════════════════════════════════════════════
  // PAGE 2 — CARACTÉRISTIQUES & SOURCES COMPARABLES CLIQUABLES
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 24;

  const ensureSpace = (needed: number) => {
    if (y + needed > h - 22) {
      doc.addPage();
      y = 24;
    }
  };

  y = addSectionTitle(doc, 'Fiche technique du véhicule', y, `État : ${ajustements.etatGeneral}`);

  const specsLeft: [string, string][] = [
    ['Marque / Modèle', `${vehicleData.marque || '—'} ${vehicleData.modele || ''}`.trim()],
    ['Version / Finition', vehicleData.version || 'Standard'],
    ['Année', String(vehicleData.annee || '—')],
    ['Kilométrage', `${vehicleData.kilometrage.toLocaleString('fr-FR')} km`],
    ['Motorisation', vehicleData.motorisation],
  ];

  const specsRight: [string, string][] = [
    ['Boîte de vitesses', vehicleData.boite],
    ['Carrosserie', `${vehicleData.carrosserie} (${vehicleData.nombrePortes || 5} p.)`],
    ['Couleur', vehicleData.couleur || 'Non renseignée'],
    ['État général', ajustements.etatGeneral],
    ['Sinistre déclaré', ajustements.accidentDeclare],
  ];

  const colW = (cw - 6) / 2;
  const startGridY = y;
  const drawSpecCol = (items: [string, string][], startX: number) => {
    items.forEach(([lbl, val], i) => {
      const rowY = startGridY + i * 8.5;
      if (i % 2 === 0) {
        doc.setFillColor(LIGHT_GRAY);
        doc.rect(startX, rowY - 1, colW, 8, 'F');
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(GRAY);
      doc.text(lbl, startX + 2.5, rowY + 4.3);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(DARK);
      const safeVal = val.length > 26 ? val.slice(0, 24) + '…' : val;
      doc.text(safeVal, startX + colW - 2.5, rowY + 4.3, { align: 'right' });
    });
  };
  drawSpecCol(specsLeft, M);
  drawSpecCol(specsRight, M + colW + 6);
  y = startGridY + specsLeft.length * 8.5 + 8;

  // Pondération
  ensureSpace(42);
  y = addSectionTitle(doc, 'Pondération des sources', y);
  const cards = [
    {
      title: 'Cotes réf.',
      weight: `${ponderations.coteOfficielle}%`,
      avg: result.detailsSources.coteOfficielle.moyenne > 0 ? formatPrice(result.detailsSources.coteOfficielle.moyenne) : 'Non utilisé',
      count: `${sources.coteOfficielle.length} cote(s)`,
    },
    {
      title: 'Particuliers',
      weight: `${ponderations.annoncesParticulier}%`,
      avg: result.detailsSources.annoncesParticulier.moyenne > 0 ? formatPrice(result.detailsSources.annoncesParticulier.moyenne) : 'Non utilisé',
      count: `${sources.annoncesParticulier.length} ann.`,
    },
    {
      title: 'Pros (-10%)',
      weight: `${ponderations.annoncesPro}%`,
      avg: result.detailsSources.annoncesPro.moyenne > 0 ? formatPrice(result.detailsSources.annoncesPro.moyenne) : 'Non utilisé',
      count: `${sources.annoncesPro.length} ann.`,
    },
    {
      title: 'Rachat (+15%)',
      weight: `${ponderations.rachatCash}%`,
      avg: result.detailsSources.rachatCash.moyenne > 0 ? formatPrice(result.detailsSources.rachatCash.moyenne) : 'Non utilisé',
      count: `${sources.rachatCash.length} offre(s)`,
    },
  ];
  const cardW = (cw - 9) / 4;
  cards.forEach((c, idx) => {
    const cx = M + idx * (cardW + 3);
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, y, cardW, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(SLATE);
    doc.text(c.title, cx + 2.5, y + 6);

    doc.setTextColor(ORANGE);
    doc.text(c.weight, cx + cardW - 2.5, y + 6, { align: 'right' });

    doc.setFontSize(9.5);
    doc.setTextColor(DARK);
    doc.text(c.avg, cx + 2.5, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(GRAY);
    doc.text(c.count, cx + 2.5, y + 19.8);
  });
  y += 30;

  // Sources détaillées avec liens cliquables
  if (sources.coteOfficielle.length > 0) {
    ensureSpace(26);
    y = addSectionTitle(doc, `Cotes de référence (${sources.coteOfficielle.length})`, y, `Pondération : ${ponderations.coteOfficielle}%`);
    for (const c of sources.coteOfficielle) {
      ensureSpace(20);
      const hasLink = Boolean(c.lien && c.lien.trim() !== '');
      const targetUrl = hasLink ? c.lien! : getAutoPlatformFallbackUrl(c.source, 'cote');
      const badgeLabel = hasLink
        ? `Source : ${formatShortUrl(c.lien!)} ↗`
        : `Portail : ${formatShortUrl(targetUrl)} ↗`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(M, y, cw, 16.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(DARK);
      doc.text((c.source || 'Cote officielle').slice(0, 52), M + 3.5, y + 5.5);

      doc.setTextColor(ORANGE);
      doc.text(formatPrice(c.prix), w - M - 3.5, y + 5.5, { align: 'right' });

      addClickableSourceBadge(doc, M + 3.5, y + 8.5, badgeLabel, targetUrl, hasLink);
      y += 19;
    }
    y += 3;
  }

  if (sources.annoncesParticulier.length > 0) {
    ensureSpace(26);
    y = addSectionTitle(doc, `Annonces particuliers (${sources.annoncesParticulier.length})`, y, `Pondération : ${ponderations.annoncesParticulier}%`);
    for (const a of sources.annoncesParticulier) {
      ensureSpace(20);
      const hasLink = Boolean(a.lien && a.lien.trim() !== '');
      const targetUrl = hasLink ? a.lien : getAutoPlatformFallbackUrl('', 'particulier');
      const badgeLabel = hasLink
        ? `Annonce : ${formatShortUrl(a.lien)} ↗`
        : `Rechercher sur ${formatShortUrl(targetUrl)} ↗`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(M, y, cw, 16.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(DARK);
      doc.text(`Particulier — ${a.annee} • ${a.kilometrage.toLocaleString('fr-FR')} km`, M + 3.5, y + 5.5);

      doc.setTextColor(ORANGE);
      doc.text(formatPrice(a.prix), w - M - 3.5, y + 5.5, { align: 'right' });

      addClickableSourceBadge(doc, M + 3.5, y + 8.5, badgeLabel, targetUrl, hasLink);
      y += 19;
    }
    y += 3;
  }

  if (sources.annoncesPro.length > 0) {
    ensureSpace(26);
    y = addSectionTitle(doc, `Annonces professionnels (${sources.annoncesPro.length})`, y, `Pondération : ${ponderations.annoncesPro}% • Décote -10%`);
    for (const a of sources.annoncesPro) {
      ensureSpace(20);
      const hasLink = Boolean(a.lien && a.lien.trim() !== '');
      const targetUrl = hasLink ? a.lien! : getAutoPlatformFallbackUrl(a.source, 'pro');
      const badgeLabel = hasLink
        ? `Annonce ${a.source || ''} : ${formatShortUrl(a.lien!)} ↗`
        : `Portail : ${formatShortUrl(targetUrl)} ↗`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(M, y, cw, 16.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(DARK);
      doc.text(`${a.source || 'Pro'} — ${a.annee} • ${a.kilometrage.toLocaleString('fr-FR')} km`, M + 3.5, y + 5.5);

      doc.setTextColor(ORANGE);
      doc.text(`${formatPrice(a.prix)} (${formatPrice(a.prix * 0.9)} net)`, w - M - 3.5, y + 5.5, { align: 'right' });

      addClickableSourceBadge(doc, M + 3.5, y + 8.5, badgeLabel, targetUrl, hasLink);
      y += 19;
    }
    y += 3;
  }

  if (sources.rachatCash.length > 0) {
    ensureSpace(26);
    y = addSectionTitle(doc, `Offres de rachat cash (${sources.rachatCash.length})`, y, `Pondération : ${ponderations.rachatCash}% • +15%`);
    for (const r of sources.rachatCash) {
      ensureSpace(20);
      const hasLink = Boolean(r.lien && r.lien.trim() !== '');
      const targetUrl = hasLink ? r.lien! : getAutoPlatformFallbackUrl(r.societe, 'rachat');
      const badgeLabel = hasLink
        ? `Offre : ${formatShortUrl(r.lien!)} ↗`
        : `Portail : ${formatShortUrl(targetUrl)} ↗`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(M, y, cw, 16.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(DARK);
      doc.text(`${r.societe || 'Reprise pro'}${r.date ? ` — ${formatDate(r.date)}` : ''}`, M + 3.5, y + 5.5);

      doc.setTextColor(ORANGE);
      doc.text(`${formatPrice(r.prix)} (équiv. ${formatPrice(r.prix * 1.15)} part.)`, w - M - 3.5, y + 5.5, { align: 'right' });

      addClickableSourceBadge(doc, M + 3.5, y + 8.5, badgeLabel, targetUrl, hasLink);
      y += 19;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 3 — SYNTHÈSE FINANCIÈRE, AJUSTEMENTS & CONSEILS NÉGOCIATION
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 24;

  y = addSectionTitle(doc, 'Synthèse financière & Détail du calcul', y);
  const resultRows: [string, string, boolean][] = [
    ['Prix de base pondéré (avant ajustements)', formatPrice(result.prixBase), false],
    ['Ajustement kilométrique appliqué', `${ajustements.kilometrageBonus >= 0 ? '+' : ''}${ajustements.kilometrageBonus.toFixed(1)}%`, false],
    ['Valeur finale estimée', formatPrice(result.prixFinal), true],
    ['Fourchette basse / haute', `${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`, false],
    ['Positionnement marché', result.positionMarche, false],
  ];
  for (const [label, value, hl] of resultRows) {
    ensureSpace(12);
    y = addRow(doc, label, value, y, hl);
  }
  y += 6;

  if (result.ajustementsAppliques.length > 0) {
    ensureSpace(22);
    y = addSectionTitle(doc, 'Ajustements qualitatifs & équipements appliqués', y);
    for (const aj of result.ajustementsAppliques) {
      ensureSpace(11);
      const sign = aj.valeur >= 0 ? '+' : '';
      const val = `${sign}${aj.valeur.toFixed(1)}% (${sign}${Math.round(aj.impact).toLocaleString('fr-FR')} €)`;
      y = addRow(doc, aj.nom, val, y);
    }
    y += 6;
  }

  // Conseils de négociation adaptés au profil (Vendeur ou Acheteur) et aux critères remplis
  ensureSpace(30);
  const sectionTitleConseils =
    role === 'acheteur'
      ? 'Conseils de négociation — Profil Acheteur'
      : 'Conseils de négociation — Profil Vendeur';
  y = addSectionTitle(doc, sectionTitleConseils, y, 'Personnalisés selon vos critères');

  const conseils =
    role === 'acheteur'
      ? getConseilsAcheteurAuto(result, vehicleData, ajustements, sources)
      : getConseilsVendeurAuto(result, vehicleData, ajustements, sources);

  for (const conseil of conseils) {
    const lines = doc.splitTextToSize(`• ${conseil}`, cw - 8);
    const boxH = lines.length * 4.5 + 5;
    ensureSpace(boxH + 3);
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.roundedRect(M, y, cw, boxH, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(DARK);
    doc.text(lines, M + 4, y + 4.8);
    y += boxH + 3;
  }

  // Bandeau portails cliquables avec retour à la ligne automatique (zéro hors-champ)
  const refLinks = [
    { label: 'LaCentrale.fr ↗', url: 'https://www.lacentrale.fr/' },
    { label: 'Vendezvotrevoiture.fr ↗', url: 'https://www.vendezvotrevoiture.fr/' },
    { label: 'Leboncoin.fr ↗', url: 'https://www.leboncoin.fr/c/voitures' },
    { label: 'AutoScout24.fr ↗', url: 'https://www.autoscout24.fr/' },
    { label: 'Histovec (Gouv) ↗', url: 'https://histovec.interieur.gouv.fr/histovec/accueil' },
  ];
  ensureSpace(24);
  y += 3;
  doc.setFillColor(BLUE_BG);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(M, y, cw, 22, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(DARK);
  doc.text('Portails automobiles & historique officiel :', M + 4, y + 5);

  let bx = M + 4;
  let by = y + 7.5;
  for (const link of refLinks) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const neededW = Math.min(doc.getTextWidth(link.label) + 8, 92);
    if (bx + neededW > w - M - 4) {
      bx = M + 4;
      by += 7;
    }
    const usedW = addClickableSourceBadge(doc, bx, by, link.label, link.url, true);
    bx += usedW + 3;
  }

  // Pass final pour numéroter les pages 2..N (la page 1 est la page de garde)
  const totalPages = doc.getNumberOfPages();
  for (let p = 2; p <= totalPages; p++) {
    doc.setPage(p);
    addPageHeader(doc, p, totalPages, refCode);
    addPageFooter(doc);
  }

  const filename = `MonPrixJuste_Auto_${(vehicleData.estimationName || `${vehicleData.marque}_${vehicleData.modele}`).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

function getConseilsVendeurAuto(
  result: CalculationResult,
  vehicleData: VehicleData,
  ajustements: Ajustements,
  sources: Sources
): string[] {
  const conseils: string[] = [];
  const ageVehicule = new Date().getFullYear() - vehicleData.annee;

  conseils.push(
    `Prix d'affichage conseillé en annonce : entre ${formatPrice(result.prixFinal * 1.03)} et ${formatPrice(result.prixFinal * 1.06)} pour conserver une marge de négociation de 3 à 6%, tout en gardant ${formatPrice(result.fourchetteBasse)} comme prix plancher.`
  );

  if (sources.rachatCash.length > 0 && result.detailsSources.rachatCash.moyenne > 0) {
    conseils.push(
      `Vous disposez d'une référence de rachat cash (${formatPrice(result.detailsSources.rachatCash.moyenne)}) : utilisez ce montant comme filet de sécurité pour refuser les offres de particuliers trop basses.`
    );
  }

  if (ajustements.garantieConstructeur) {
    conseils.push(
      'Garantie constructeur active : mettez-la en avant dès le début de la discussion pour bloquer les demandes de rabais liées au risque mécanique.'
    );
  }

  if (ajustements.accidentDeclare !== 'Aucun') {
    conseils.push(
      `Sinistre déclaré (${ajustements.accidentDeclare}) : jouez la transparence avec les factures de réparation et le rapport Histovec afin d'éviter une renégociation brutale sur place.`
    );
  }

  if (vehicleData.kilometrage > 140000) {
    conseils.push(
      `À ${vehicleData.kilometrage.toLocaleString('fr-FR')} km, anticipez les questions sur l'entretien coûteux (distribution, embrayage, freins, pneus) en préparant toutes les factures.`
    );
  } else if (vehicleData.kilometrage < 60000) {
    conseils.push(
      `Faible kilométrage (${vehicleData.kilometrage.toLocaleString('fr-FR')} km) : certifiez-le par le rapport officiel Histovec pour justifier un prix ferme.`
    );
  }

  if (ageVehicule >= 4) {
    conseils.push(
      'Véhicule de plus de 4 ans : fournissez un contrôle technique de moins de 6 mois et privilégiez un paiement sécurisé (virement instantané ou chèque de banque vérifié).'
    );
  }

  return conseils;
}

function getConseilsAcheteurAuto(
  result: CalculationResult,
  vehicleData: VehicleData,
  ajustements: Ajustements,
  sources: Sources
): string[] {
  const conseils: string[] = [];

  conseils.push(
    `Offre cible recommandée : débutez la négociation autour de ${formatPrice(result.fourchetteBasse)} avec un prix maximum cohérent à ${formatPrice(result.prixFinal)} par rapport aux comparables relevés.`
  );

  if (vehicleData.kilometrage > 120000) {
    conseils.push(
      `À ${vehicleData.kilometrage.toLocaleString('fr-FR')} km, vérifiez l'historique des grosses échéances (courroie de distribution, embrayage, amortisseurs, pneus) : toute opération à prévoir justifie une décote directe.`
    );
  }

  if (ajustements.accidentDeclare !== 'Aucun') {
    conseils.push(
      `Sinistre déclaré (${ajustements.accidentDeclare}) : exigez le rapport d'expertise complet et les factures de carrosserie, et négociez une décote de prudence.`
    );
  }

  if (!ajustements.garantieConstructeur) {
    conseils.push(
      'Absence de garantie constructeur : prévoyez une marge de sécurité sur votre offre pour couvrir d\'éventuels aléas mécaniques après l\'achat.'
    );
  }

  if (sources.coteOfficielle.length > 0 && result.detailsSources.coteOfficielle.moyenne > 0) {
    conseils.push(
      `Appuyez votre offre sur la cote de référence (${formatPrice(result.detailsSources.coteOfficielle.moyenne)}) et les annonces similaires du dossier pour objectiver votre proposition.`
    );
  }

  conseils.push(
    'Exigez systématiquement le rapport officiel Histovec partagé par le vendeur ainsi que le dernier contrôle technique avant tout versement d\'acompte.'
  );

  return conseils;
}

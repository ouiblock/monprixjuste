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

const M = 16; // Page margin (mm)

const DISCLAIMER =
  'AVERTISSEMENT IMPORTANT — Document à usage strictement indicatif. ' +
  'Cette estimation hybride, réalisée avec l\'outil MonPrixJuste (version bêta), ne constitue ni un avis de valeur professionnel, ni une expertise immobilière certifiée, ni un mandat de vente ou d\'achat, ni une offre d\'achat ou de vente. ' +
  'Elle n\'est pas opposable en justice ni à titre de preuve dans quelque procédure que ce soit. ' +
  'Les données utilisées sont saisies manuellement par l\'utilisateur ; MonPrixJuste n\'en garantit ni l\'exactitude, ni l\'exhaustivité. ' +
  'Pour toute décision d\'achat, de vente ou de financement, consultez un professionnel qualifié (notaire, agent immobilier, expert immobilier certifié). ' +
  'MonPrixJuste est un projet porté par l\'association HERRICHAIN (Loi 1901, RNA : W641015204). ' +
  'Code source propriété exclusive d\'Artean Digital (SAS BASK\'IN BIARRITZ, capital 100 €, SIRET 92991521300011).';

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
  doc.text(`Estimation immobilière • Réf. ${refCode}`, w / 2, 11.5, { align: 'center' });

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
    'MonPrixJuste — Document indicatif généré localement • Ne constitue pas une expertise immobilière certifiée.',
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
  const cw = w - M * 2;
  const refCode = `IMMO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
  const photos = (propertyData.photos || []).filter(Boolean);
  const role: 'vendeur' | 'acheteur' = propertyData.role === 'acheteur' ? 'acheteur' : 'vendeur';

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
    `ESTIMATION IMMOBILIÈRE • PROFIL ${role.toUpperCase()}`,
    M + 38,
    y + 4.4,
    { align: 'center' }
  );

  y += 12;

  // Titre du bien
  const propTitle =
    propertyData.estimationName && propertyData.estimationName !== 'Estimation'
      ? propertyData.estimationName
      : `${propertyData.typeBien} ${propertyData.surface} m²${propertyData.ville ? ` — ${propertyData.ville}` : ''}`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(DARK);
  const titleLines = doc.splitTextToSize(propTitle, cw);
  doc.text(titleLines, M, y);
  y += titleLines.length * 8 + 2;

  // Localisation
  const fullAddr =
    [propertyData.adresse, `${propertyData.codePostal || ''} ${propertyData.ville || ''}`.trim()]
      .filter(Boolean)
      .join(' • ') || 'Localisation non renseignée';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(GRAY);
  const addrLines = doc.splitTextToSize(fullAddr, cw);
  doc.text(addrLines, M, y);
  y += addrLines.length * 5 + 8;

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
      doc.text('Photo principale du bien', w / 2, y + mainPhotoH / 2, { align: 'center' });
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
  doc.text('VALEUR VÉNALE ESTIMÉE', w / 2, y + 9.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(ORANGE);
  doc.text(formatPrice(result.prixFinal), w / 2, y + 22, { align: 'center' });

  const subMetrics: string[] = [];
  if (propertyData.surface > 0) {
    subMetrics.push(`${Math.round(result.prixFinal / propertyData.surface).toLocaleString('fr-FR')} €/m²`);
  }
  subMetrics.push(`Fourchette : ${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`);
  subMetrics.push(`Confiance : ${result.scoreConfiance}/100`);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(DARK);
  doc.text(subMetrics.join('   •   '), w / 2, y + 32, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(GRAY);
  doc.text(
    `Positionnement : ${result.positionMarche}   •   Sources analysées : ${sources.dvf.length + sources.annonces.length + sources.estimations.length}`,
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

  y = addSectionTitle(doc, 'Caractéristiques déclarées du bien', y, `État : ${ajustements.etatGeneral} • DPE : ${ajustements.dpe}`);

  const equipActifs: string[] = [];
  if (ajustements.balcon) equipActifs.push('Balcon');
  if (ajustements.terrasse) equipActifs.push('Terrasse');
  if (ajustements.jardin) equipActifs.push('Jardin');
  if (ajustements.parking) equipActifs.push('Parking');
  if (ajustements.cave) equipActifs.push('Cave');
  if (ajustements.vueDegagee) equipActifs.push('Vue dégagée');
  if (ajustements.calme) equipActifs.push('Calme');
  if (ajustements.travauxRecents) equipActifs.push('Travaux récents');

  const specsLeft: [string, string][] = [
    ['Type de bien', propertyData.typeBien],
    ['Surface habitable', `${propertyData.surface} m²`],
    ['Pièces / Chambres', `${propertyData.pieces || '—'} p. / ${propertyData.chambres || '—'} ch.`],
    ['Étage / Ascenseur', `${propertyData.etage || 'RDC'}${propertyData.ascenseur ? ' (ascenseur)' : ''}`],
    ['Année construction', String(propertyData.anneeConstruction || 'Non renseignée')],
  ];

  const specsRight: [string, string][] = [
    ['Localisation', `${propertyData.codePostal || ''} ${propertyData.ville || 'Non renseignée'}`.trim()],
    ['État général', ajustements.etatGeneral],
    ['Classe DPE', ajustements.dpe],
    ['Exposition', ajustements.exposition],
    ['Atouts', equipActifs.length > 0 ? equipActifs.slice(0, 3).join(', ') : 'Standard'],
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
      title: 'Ventes DVF / Immo-Data',
      weight: `${ponderations.dvf}%`,
      avg: result.detailsSources.dvf.moyenne > 0 ? formatPrice(result.detailsSources.dvf.moyenne) : 'Non utilisé',
      contrib: `Contrib. : ${formatPrice(result.detailsSources.dvf.contribution)}`,
      count: `${sources.dvf.length} vente(s)`,
    },
    {
      title: 'Annonces marché (-5%)',
      weight: `${ponderations.annonces}%`,
      avg: result.detailsSources.annonces.moyenne > 0 ? formatPrice(result.detailsSources.annonces.moyenne) : 'Non utilisé',
      contrib: `Contrib. : ${formatPrice(result.detailsSources.annonces.contribution)}`,
      count: `${sources.annonces.length} annonce(s)`,
    },
    {
      title: 'Avis professionnels',
      weight: `${ponderations.estimations}%`,
      avg: result.detailsSources.estimations.moyenne > 0 ? formatPrice(result.detailsSources.estimations.moyenne) : 'Non utilisé',
      contrib: `Contrib. : ${formatPrice(result.detailsSources.estimations.contribution)}`,
      count: `${sources.estimations.length} avis`,
    },
  ];
  const cardW = (cw - 8) / 3;
  cards.forEach((c, idx) => {
    const cx = M + idx * (cardW + 4);
    doc.setFillColor(LIGHT_GRAY);
    doc.setDrawColor(BORDER_GRAY);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, y, cardW, 25, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE);
    doc.text(c.title, cx + 3, y + 6);

    doc.setTextColor(ORANGE);
    doc.text(c.weight, cx + cardW - 3, y + 6, { align: 'right' });

    doc.setFontSize(10.5);
    doc.setTextColor(DARK);
    doc.text(c.avg, cx + 3, y + 13.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(GRAY);
    doc.text(`${c.count} • ${c.contrib}`, cx + 3, y + 20.5);
  });
  y += 32;

  // Sources détaillées avec liens cliquables (Leboncoin, SeLoger, DVF, etc.)
  if (sources.dvf.length > 0) {
    ensureSpace(26);
    y = addSectionTitle(doc, `Transactions notariées DVF / Immo-Data (${sources.dvf.length})`, y, `Pondération : ${ponderations.dvf}%`);
    for (const dvf of sources.dvf) {
      ensureSpace(20);
      const ancienne = isDVFAncienne(dvf.date);
      const label =
        dvf.adresse && dvf.adresse.trim() !== ''
          ? `${dvf.adresse.trim()} — ${dvf.surface} m²`
          : `Transaction notariée DVF — ${dvf.surface} m²`;
      const val = `${formatPrice(dvf.prix)} (${Math.round(dvf.prix / dvf.surface).toLocaleString('fr-FR')} €/m²)`;
      const hasDate = Boolean(dvf.date && dvf.date.trim() !== '');
      const dateLabel = hasDate
        ? `Acte du ${formatDate(dvf.date)}${ancienne ? ' (>5 ans : -30%)' : ''}`
        : 'Date non précisée';

      doc.setFillColor(ancienne ? '#FFFBEB' : LIGHT_GRAY);
      doc.setDrawColor(ancienne ? '#FDE68A' : BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(M, y, cw, 16.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(DARK);
      doc.text(label.slice(0, 52), M + 3.5, y + 5.5);

      doc.setTextColor(ORANGE);
      doc.text(val, w - M - 3.5, y + 5.5, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(ancienne ? '#92400E' : GRAY);
      doc.text(dateLabel, M + 3.5, y + 12.2);

      const hasCustomLink = Boolean(dvf.lien && dvf.lien.trim() !== '');
      const targetUrl = hasCustomLink ? dvf.lien! : 'https://www.immo-data.fr/';
      const badgeLabel = hasCustomLink
        ? `Source : ${formatShortUrl(dvf.lien!)} ↗`
        : 'Immo-Data.fr ↗';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      const badgeW = Math.min(doc.getTextWidth(badgeLabel) + 8, 92);
      addClickableSourceBadge(doc, w - M - 3.5 - badgeW, y + 8.5, badgeLabel, targetUrl, true);

      y += 19;
    }
    y += 3;
  }

  if (sources.annonces.length > 0) {
    ensureSpace(26);
    y = addSectionTitle(doc, `Annonces immobilières comparables (${sources.annonces.length})`, y, `Pondération : ${ponderations.annonces}% • Décote -5%`);
    for (const a of sources.annonces) {
      ensureSpace(20);
      const hasLink = Boolean(a.lien && a.lien.trim() !== '');
      const label = `${a.source || 'Annonce'} — ${a.surface} m²${a.pieces ? ` (${a.pieces} p.)` : ''}`;
      const netPrice = Math.round(a.prix * 0.95);
      const val = `${formatPrice(a.prix)} (${Math.round(netPrice / a.surface).toLocaleString('fr-FR')} €/m² net)`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(M, y, cw, 16.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(DARK);
      doc.text(label.slice(0, 52), M + 3.5, y + 5.5);

      doc.setTextColor(ORANGE);
      doc.text(val, w - M - 3.5, y + 5.5, { align: 'right' });

      const targetUrl = hasLink ? a.lien : getPlatformFallbackUrl(a.source);
      const badgeLabel = hasLink
        ? `Annonce ${a.source || ''} : ${formatShortUrl(a.lien)} ↗`
        : `Rechercher sur ${formatShortUrl(targetUrl)} ↗`;
      addClickableSourceBadge(doc, M + 3.5, y + 8.5, badgeLabel, targetUrl, hasLink);

      y += 19;
    }
    y += 3;
  }

  if (sources.estimations.length > 0) {
    ensureSpace(26);
    y = addSectionTitle(doc, `Évaluations & Avis de valeur (${sources.estimations.length})`, y, `Pondération : ${ponderations.estimations}%`);
    for (const e of sources.estimations) {
      ensureSpace(20);
      const hasLink = Boolean(e.lien && e.lien.trim() !== '');
      const hasDate = Boolean(e.date && e.date.trim() !== '');
      const label = `${e.source || 'Avis de valeur'}${hasDate ? ` — ${formatDate(e.date)}` : ''}`;
      const avg = Math.round((e.prixMin + e.prixMax) / 2);
      const val = `${formatPrice(e.prixMin)} à ${formatPrice(e.prixMax)} (moy. ${formatPrice(avg)})`;

      doc.setFillColor(LIGHT_GRAY);
      doc.setDrawColor(BORDER_GRAY);
      doc.setLineWidth(0.25);
      doc.roundedRect(M, y, cw, 16.5, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(DARK);
      doc.text(label.slice(0, 52), M + 3.5, y + 5.5);
      doc.text(val, w - M - 3.5, y + 5.5, { align: 'right' });

      if (hasLink) {
        const badgeLabel = `Consulter le document : ${formatShortUrl(e.lien!)} ↗`;
        addClickableSourceBadge(doc, M + 3.5, y + 8.5, badgeLabel, e.lien!, true);
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(GRAY);
        doc.text('Évaluation saisie manuellement', M + 3.5, y + 12.2);
      }
      y += 19;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PAGE 3 — SYNTHÈSE FINANCIÈRE, AJUSTEMENTS & CONSEILS NÉGOCIATION
  // ═══════════════════════════════════════════════════════════
  doc.addPage();
  y = 24;

  y = addSectionTitle(doc, 'Synthèse financière & Indicateurs', y);
  const fraisNotaire = Math.round(result.prixFinal * 0.08);
  const mensualite = Math.round((result.prixFinal * (0.035 / 12)) / (1 - Math.pow(1 + 0.035 / 12, -240)));

  const resultRows: [string, string, boolean][] = [
    ['Prix de base pondéré (avant ajustements)', formatPrice(result.prixBase), false],
    ['Valeur finale estimée net vendeur', formatPrice(result.prixFinal), true],
    ['Prix au m² estimé', `${result.prixM2.toLocaleString('fr-FR')} €/m²`, false],
    ['Fourchette basse / haute', `${formatPrice(result.fourchetteBasse)} — ${formatPrice(result.fourchetteHaute)}`, false],
    ['Budget acquéreur (frais de notaire ~8% inclus)', `${formatPrice(result.prixFinal + fraisNotaire)} (dont ~${formatPrice(fraisNotaire)})`, false],
    ['Mensualité crédit indicative (20 ans à 3,5%)', `~${mensualite.toLocaleString('fr-FR')} € / mois`, false],
  ];
  for (const [label, value, hl] of resultRows) {
    ensureSpace(12);
    y = addRow(doc, label, value, y, hl);
  }
  y += 6;

  if (result.ajustementsAppliques.length > 0) {
    ensureSpace(22);
    y = addSectionTitle(doc, 'Ajustements qualitatifs appliqués', y, 'Cumul plafonné à ±20%');
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
      ? getConseilsAcheteurImmo(result, propertyData, ajustements, sources)
      : getConseilsVendeurImmo(result, propertyData, ajustements);

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

  // Bandeau ressources cliquables avec retour à la ligne automatique (zéro hors-champ)
  const refLinks = [
    { label: 'Immo-Data.fr ↗', url: 'https://www.immo-data.fr/' },
    { label: 'DVF Etalab ↗', url: 'https://app.dvf.etalab.gouv.fr/' },
    { label: 'Leboncoin.fr ↗', url: 'https://www.leboncoin.fr/c/ventes_immobilieres' },
    { label: 'SeLoger.com ↗', url: 'https://www.seloger.com/' },
    { label: 'PAP.fr ↗', url: 'https://www.pap.fr/' },
  ];
  ensureSpace(22);
  y += 3;
  doc.setFillColor(BLUE_BG);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(M, y, cw, 16, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(DARK);
  doc.text('Bases publiques & portails de référence :', M + 4, y + 5);

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

  const filename = `MonPrixJuste_Immo_${(propertyData.estimationName || propertyData.ville || 'estimation').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

function getConseilsVendeurImmo(
  result: CalculationResult,
  propertyData: PropertyData,
  ajustements: Ajustements
): string[] {
  const conseils: string[] = [];
  const ratio = result.prixFinal / result.prixBase;

  conseils.push(
    `Prix d'affichage conseillé en annonce : entre ${formatPrice(result.prixFinal * 1.02)} et ${formatPrice(result.prixFinal * 1.05)} pour intégrer une marge de négociation maîtrisée de 2 à 5%, sans descendre sous votre seuil plancher de ${formatPrice(result.fourchetteBasse)}.`
  );

  if (ajustements.dpe === 'F' || ajustements.dpe === 'G') {
    conseils.push(
      `DPE classé ${ajustements.dpe} : anticipez la négociation des acquéreurs sur le coût de la rénovation énergétique en présentant l'audit énergétique obligatoire et 1 ou 2 devis d'isolation chiffrés.`
    );
  } else if (ajustements.dpe === 'A' || ajustements.dpe === 'B') {
    conseils.push(
      `Excellent DPE (${ajustements.dpe}) : utilisez ce critère pour refuser les demandes de rabais excessives en mettant en avant les économies de charges et l'absence de travaux thermiques.`
    );
  }

  if (ajustements.etatGeneral === 'À rénover' || ajustements.etatGeneral === 'À rafraîchir') {
    conseils.push(
      `Bien déclaré « ${ajustements.etatGeneral} » : chiffrez les postes principaux par devis pour cadrer la discussion et éviter que les acheteurs n'appliquent une décote forfaitaire excessive.`
    );
  } else if (ratio > 1.06) {
    conseils.push(
      'Votre valorisation intègre des atouts qualitatifs supérieurs à la moyenne. Rassemblez factures de travaux, DPE et comparables DVF de ce dossier pour défendre cet écart face aux offres basses.'
    );
  }

  const atouts: string[] = [];
  if (ajustements.terrasse) atouts.push('terrasse');
  if (ajustements.jardin) atouts.push('jardin');
  if (ajustements.balcon) atouts.push('balcon');
  if (ajustements.parking) atouts.push('stationnement');
  if (atouts.length > 0) {
    conseils.push(
      `Leviers de défense du prix : appuyez-vous sur la rareté de vos équipements (${atouts.join(', ')}) dans le secteur pour maintenir votre prix face aux biens standards.`
    );
  }

  if (propertyData.typeBien === 'Appartement') {
    conseils.push(
      'Préparez dès la première visite les 3 derniers PV d\'AG, le montant des charges et le pré-état daté : un dossier transparent limite les renégociations après offre.'
    );
  }

  if (result.scoreConfiance < 50) {
    conseils.push(
      'Indice de confiance < 50% : ajoutez 2 à 3 ventes notariées DVF supplémentaires sur Immo-Data.fr pour renforcer votre argumentaire.'
    );
  }

  return conseils;
}

function getConseilsAcheteurImmo(
  result: CalculationResult,
  propertyData: PropertyData,
  ajustements: Ajustements,
  sources: Sources
): string[] {
  const conseils: string[] = [];

  conseils.push(
    `Cible de négociation : formulez une première offre argumentée autour de ${formatPrice(result.fourchetteBasse)} avec un plafond raisonnable à ${formatPrice(result.prixFinal)} (soit un budget acte en main d'environ ${formatPrice(result.prixFinal * 1.08)} avec frais de notaire).`
  );

  if (ajustements.dpe === 'F' || ajustements.dpe === 'G') {
    conseils.push(
      `DPE classé ${ajustements.dpe} : levier majeur de négociation. Exigez l'audit énergétique réglementaire et chiffrez le bouquet de travaux (isolation, fenêtres, chauffage) pour justifier une décote directe sur le prix affiché.`
    );
  }

  if (ajustements.etatGeneral === 'À rénover' || ajustements.etatGeneral === 'À rafraîchir') {
    conseils.push(
      `État « ${ajustements.etatGeneral} » : faites chiffrer les travaux par un artisan avant ou pendant la contre-visite et joignez les estimations chiffrées à votre offre d'achat.`
    );
  }

  if (propertyData.typeBien === 'Appartement' && propertyData.etage >= 3 && !propertyData.ascenseur) {
    conseils.push(
      `Étage ${propertyData.etage} sans ascenseur : utilisez cette contrainte d'accessibilité et de revente future pour négocier vers le bas de la fourchette.`
    );
  }

  if (sources.dvf.length > 0 && result.detailsSources.annonces.moyenne > result.detailsSources.dvf.moyenne * 1.05) {
    conseils.push(
      `Les annonces en ligne affichent des prix supérieurs aux ventes notariées réelles (DVF : ${formatPrice(result.detailsSources.dvf.moyenne)}). Appuyez-vous sur les actes notariés de ce dossier pour ramener le vendeur au prix réel du marché.`
    );
  }

  if (propertyData.typeBien === 'Appartement') {
    conseils.push(
      'Vérifiez les 3 derniers PV d\'assemblée générale avant l\'offre : d\'éventuels travaux votés ou à venir (ravalement, toiture, chaudière) constituent un argument direct de baisse de prix.'
    );
  } else {
    conseils.push(
      'Inspectez les postes coûteux (toiture, assainissement, humidité, taxe foncière) : tout défaut constaté lors de la visite doit être chiffré pour ajuster votre offre.'
    );
  }

  return conseils;
}

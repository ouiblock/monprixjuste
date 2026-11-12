import { Link } from 'react-router-dom';
import {
  Building2,
  Car,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Eye,
  Banknote,
  Camera,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';
import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'MonPrixJuste est-il vraiment gratuit et indépendant ?',
    a: 'Oui, 100% gratuit, sans inscription, sans publicité et totalement agnostique. Nous vous redirigeons uniquement vers les bases publiques officielles (Immo-Data.fr, DVF Etalab, Histovec) et les plateformes classiques du marché (Leboncoin, SeLoger, La Centrale, Vendezvotrevoiture.fr).',
  },
  {
    q: 'Mes données et mes photos sont-elles confidentielles ?',
    a: "Absolument. Toutes vos estimations et photos restent stockées localement dans votre navigateur. Aucune donnée n'est envoyée à un serveur externe. Tout est calculé directement sur votre appareil.",
  },
  {
    q: 'Peut-on exporter ou conserver son estimation ?',
    a: "Oui, un bouton vous permet de télécharger à tout moment un récapitulatif complet au format PDF (avec vos photos, le détail des calculs et vos sources) pour vos démarches.",
  },
  {
    q: "Qu'est-ce que le DVF et où trouver ces données ?",
    a: "DVF = Demandes de Valeurs Foncières. C'est la base officielle de l'État français recensant toutes les ventes immobilières notariées. Vous pouvez les consulter gratuitement sur immo-data.fr ou app.dvf.etalab.gouv.fr, puis reporter les ventes comparables dans le calculateur.",
  },
  {
    q: 'Puis-je utiliser MonPrixJuste pour une transaction professionnelle ?',
    a: "MonPrixJuste est un outil d'aide à la décision indicatif qui vous permet de constituer un dossier d'estimation sourcé et transparent. Il ne remplace pas une expertise certifiée par un notaire ou un expert agréé.",
  },
  {
    q: "Comment fonctionne la recherche par plaque d'immatriculation ?",
    a: "Notre outil vous guide vers Histovec, le service officiel gratuit du Ministère de l'Intérieur, pour vérifier l'historique certifié du véhicule (propriétaires, sinistres, kilométrage), ainsi que vers La Centrale et Vendezvotrevoiture.fr pour croiser cote et rachat express.",
  },
];

const WHY_ITEMS = [
  {
    icon: Eye,
    title: '100% Transparent & Agnostique',
    desc: "Aucun algorithme boîte noire ni affiliation cachée. Vous voyez chaque source (Immo-Data, DVF Etalab, La Centrale, Leboncoin, SeLoger), chaque pondération et chaque ajustement.",
  },
  {
    icon: Camera,
    title: 'Synthèse claire & Photos',
    desc: "Ajoutez des photos pour illustrer votre dossier, comparez vos sources et téléchargez un rapport récapitulatif structuré si vous le souhaitez.",
  },
  {
    icon: Shield,
    title: 'Privé par conception',
    desc: 'Toutes vos données et photos restent dans votre navigateur. Zéro serveur, zéro collecte, zéro revente de leads.',
  },
  {
    icon: Banknote,
    title: 'Gratuit sans conditions',
    desc: '100% gratuit, sans création de compte, sans publicité, avec accès illimité aux calculateurs.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative h-[680px] md:h-[820px] overflow-hidden">
        <div className="absolute inset-0">
          <img src="/header.svg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/50" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="max-w-4xl mx-auto animate-fade-in">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#ff6d11] mb-5">
                Outil d'estimation hybride — Immobilier & Automobile
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
                Vendez au juste prix.<br />
                <span className="text-[#ff6d11]">Achetez en connaissance de cause.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
                Croisez les données officielles (Immo-Data, DVF Etalab, Histovec) et les plateformes de référence (Leboncoin, SeLoger, La Centrale, Vendezvotrevoiture) pour estimer vos biens en toute indépendance.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {[
                  'Ventes notariées & cotes officielles',
                  '100% transparent & sans biais',
                  '100% privé & gratuit',
                  'Export PDF optionnel',
                ].map((label) => (
                  <span
                    key={label}
                    className="text-xs font-semibold text-gray-700 bg-gray-900/5 border border-gray-300 px-3 py-1.5 rounded-full"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/immobilier">
                  <button className="flex items-center gap-2 px-7 py-4 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                    <Building2 className="w-5 h-5" />
                    Estimer un bien immobilier
                  </button>
                </Link>
                <Link to="/auto">
                  <button className="flex items-center gap-2 px-7 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform">
                    <Car className="w-5 h-5" />
                    Estimer un véhicule
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Que souhaitez-vous estimer ? ─────────────────────── */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Que souhaitez-vous estimer ?
            </h2>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
              Deux calculateurs indépendants et transparents pour évaluer vos biens au plus juste.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Immobilier */}
            <Link to="/immobilier" className="block">
              <div className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-[#ff6d11] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                  <Building2 className="w-6 h-6 text-[#ff6d11]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Bien immobilier</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Appartement, maison, terrain — croisez les ventes notariées (Immo-Data, DVF Etalab), les annonces (Leboncoin, SeLoger, PAP) et les avis de valeur.
                </p>
                <ul className="space-y-2 mb-7 flex-1">
                  {[
                    'Ventes notariées réelles via Immo-Data.fr & DVF Etalab',
                    'Annonces du marché avec décote de négociation',
                    'Ajustements personnalisés (DPE, état, étage, calme…)',
                    'Synthèse financière (frais de notaire, crédit) & export PDF',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6d11] mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <span className="flex items-center gap-1 text-sm font-bold text-[#ff6d11] group-hover:gap-2 transition-all">
                  Estimer mon bien <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Automobile */}
            <Link to="/auto" className="block">
              <div className="group bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-[#ff6d11] hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                  <Car className="w-6 h-6 text-[#ff6d11]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Véhicule</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Voiture, SUV, utilitaire — combinez la cote La Centrale, les annonces particuliers/pros (Leboncoin, AutoScout24) et le rachat cash (Vendezvotrevoiture.fr).
                </p>
                <ul className="space-y-2 mb-7 flex-1">
                  {[
                    'Cote La Centrale & reprise cash Vendezvotrevoiture.fr',
                    'Vérification historique officiel via Histovec (plaque)',
                    'Ajustements kilométrage, motorisation et équipements',
                    'Indice de confiance & synthèse téléchargeable',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6d11] mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <span className="flex items-center gap-1 text-sm font-bold text-[#ff6d11] group-hover:gap-2 transition-all">
                  Estimer mon véhicule <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Méthode & Accompagnement ───────────────────────── */}
      <section className="py-12 sm:py-14 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6d11]/20 border border-[#ff6d11]/40 text-[#ff6d11] text-xs font-bold uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4" />
                Méthode transparente & indépendante
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Une estimation appuyée sur les données réelles du marché
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Chaque calcul combine les données publiques de l'État (DVF Etalab, Histovec) et les cotations de marché pour vous donner une vision claire, sans algorithme opaque ni démarchage commercial. Vous pouvez également éditer un récapitulatif clair de votre estimation.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  { label: 'Immo-Data.fr', url: 'https://www.immo-data.fr/' },
                  { label: 'DVF Etalab', url: 'https://app.dvf.etalab.gouv.fr/' },
                  { label: 'La Centrale', url: 'https://www.lacentrale.fr/' },
                  { label: 'Vendezvotrevoiture.fr', url: 'https://www.vendezvotrevoiture.fr/' },
                  { label: 'Leboncoin', url: 'https://www.leboncoin.fr/' },
                  { label: 'SeLoger', url: 'https://www.seloger.com/' },
                ].map((p) => (
                  <a
                    key={p.label}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#ff6d11] text-xs font-bold text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {p.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 bg-gray-800/90 border border-gray-700 rounded-2xl p-5 space-y-3 shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider text-[#ff6d11]">
                En résumé
              </span>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff6d11] font-bold">✓</span>
                  <span>Prix réellement signés et cotes constatées</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff6d11] font-bold">✓</span>
                  <span>Pondérations et ajustements 100% personnalisables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff6d11] font-bold">✓</span>
                  <span>Vos données restent dans votre navigateur</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400 pt-1 border-t border-gray-700/60">
                  <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Possibilité de télécharger un dossier récapitulatif PDF pour vos démarches.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Générateur annonces ───────────────────────────────── */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-4">
          <Link to="/annonces" className="block">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 bg-orange-50 border border-orange-200 rounded-2xl px-5 sm:px-8 py-6 hover:border-[#ff6d11] transition-colors group">
              <div className="w-12 h-12 bg-white shadow-xs rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#ff6d11]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1">
                  Générateur d'annonce immobilière conforme
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Particuliers et professionnels — Loi ALUR, Loi Hoguet, DPE, copropriété. Toutes les mentions légales générées automatiquement.
                </p>
              </div>
              <span className="w-full md:w-auto flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#ff6d11] px-5 py-2.5 rounded-lg group-hover:bg-[#e65a00] shadow-xs transition-colors flex-shrink-0">
                Créer mon annonce <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link to="/annonces-auto" className="block">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 bg-gray-50 border border-gray-200 rounded-2xl px-5 sm:px-8 py-6 hover:border-gray-900 transition-colors group">
              <div className="w-12 h-12 bg-white shadow-xs rounded-xl flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-gray-900" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1">
                  Générateur d'annonce automobile
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Annonce optimisée pour Leboncoin, La Centrale et toutes les marketplaces. Prompt IA inclus pour une rédaction parfaite.
                </p>
              </div>
              <span className="w-full md:w-auto flex items-center justify-center gap-2 text-sm font-bold text-white bg-gray-900 px-5 py-2.5 rounded-lg group-hover:bg-gray-800 shadow-xs transition-colors flex-shrink-0">
                Créer mon annonce <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Pourquoi MonPrixJuste ─────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Pourquoi MonPrixJuste ?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {WHY_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xs transition-all flex gap-4"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-[#ff6d11]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Questions fréquentes
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Tout savoir sur nos estimations hybrides et notre assistant intégré
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between py-4 sm:py-5 text-left gap-4 hover:text-[#ff6d11] transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm leading-snug">{item.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-[#ff6d11] flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-5">
            Prêt à faire votre estimation ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 font-medium mb-8 sm:mb-10">
            Gratuit, privé et sans inscription. Obtenez votre rapport PDF complet en quelques minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link to="/immobilier" className="w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-base sm:text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Building2 className="w-5 h-5" />
                Estimer un bien
              </button>
            </Link>
            <Link to="/auto" className="w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold text-base sm:text-lg rounded-xl border-2 border-gray-200 transition-all">
                <Car className="w-5 h-5" />
                Estimer un véhicule
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

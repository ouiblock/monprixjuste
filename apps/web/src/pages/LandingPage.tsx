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
    a: "Absolument. Toutes vos estimations et les photos importées restent dans votre navigateur. Aucune donnée ni photo n'est envoyée à un serveur externe. Elles servent exclusivement à générer votre dossier PDF localement.",
  },
  {
    q: 'Que contient le nouveau rapport PDF professionnel ?',
    a: "Votre rapport PDF (3 pages A4) met en valeur votre bien ou véhicule avec votre photo principale en tête de page, une galerie secondaire, le détail des pondérations, tous les ajustements chiffrés, et surtout des boutons « Source cliquable » permettant d'ouvrir en un clic chaque annonce ou référence ayant servi à l'estimation.",
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
    title: 'Rapport PDF Pro avec Photos & Liens',
    desc: "Importez jusqu'à 6 photos (dont une en couverture de page 1) et retrouvez toutes vos annonces comparables sous forme de « sources cliquables » directement dans le PDF.",
  },
  {
    icon: Shield,
    title: 'Privé par conception',
    desc: 'Toutes vos données et photos restent dans votre navigateur. Zéro serveur, zéro collecte, zéro revente de leads.',
  },
  {
    icon: Banknote,
    title: 'Gratuit sans conditions',
    desc: '100% gratuit, sans création de compte, sans publicité, avec téléchargement illimité de vos dossiers PDF.',
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative py-8 sm:py-12 md:py-16 overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img src="/header.svg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/65" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-center text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mx-auto animate-fade-in">
              <p className="text-xs font-bold uppercase tracking-widest text-[#ff6d11] mb-2 sm:mb-3">
                Outil d'estimation hybride — Immobilier & Automobile
              </p>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-3 sm:mb-4">
                Vendez au juste prix.<br />
                <span className="text-[#ff6d11]">Achetez en connaissance de cause.</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium mb-6 max-w-2xl mx-auto leading-relaxed">
                Croisez les données officielles (Immo-Data, DVF Etalab, Histovec) et les plateformes de référence (Leboncoin, SeLoger, La Centrale, Vendezvotrevoiture) pour générer un rapport PDF professionnel avec photos et sources cliquables.
              </p>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6">
                {[
                  'Photos en en-tête PDF',
                  'Sources cliquables dans le PDF',
                  '100% indépendant & privé',
                  'Gratuit sans inscription',
                ].map((label) => (
                  <span
                    key={label}
                    className="text-xs font-semibold text-gray-800 bg-white/90 border border-gray-300 px-2.5 py-1 rounded-full shadow-2xs"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3 max-w-md sm:max-w-none mx-auto">
                <Link to="/immobilier" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    Estimer un bien immobilier
                  </button>
                </Link>
                <Link to="/auto" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow-md">
                    <Car className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
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
              Deux calculateurs complets avec import de photos et génération d'un dossier d'estimation PDF ultra-pro.
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
                    'Ajout de photos du bien (photo de couverture PDF)',
                    'Ventes notariées via Immo-Data.fr & DVF Etalab',
                    'Liens des annonces en mode « Source cliquable » dans le PDF',
                    'Simulation frais de notaire, crédit et stratégie de négociation',
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
                    'Ajout de photos du véhicule en en-tête du rapport PDF',
                    'Sources cliquables vers La Centrale, Leboncoin, Vendezvotrevoiture',
                    'Vérification historique officiel via Histovec',
                    'Ajustements kilométrage, motorisation, état et équipements',
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

      {/* ── Mise en avant du Rapport PDF Professionnel ───────── */}
      <section className="py-14 sm:py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff6d11]/20 border border-[#ff6d11]/40 text-[#ff6d11] text-xs font-bold uppercase tracking-wider">
                <FileCheck2 className="w-4 h-4" />
                Nouveau • Dossier PDF Ultra-Pro
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Un rapport PDF de 3 pages prêt à présenter à votre acheteur, vendeur ou banquier
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Chaque estimation génère un véritable dossier exécutif : photo de couverture en tête de page, synthèse financière, méthodologie pondérée et tableau des comparables avec boutons <strong className="text-white">« Source cliquable »</strong> pour vérifier chaque annonce en direct.
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

            <div className="md:col-span-5 bg-gray-800/90 border border-gray-700 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#ff6d11]">
                  Aperçu structure PDF (A4)
                </span>
                <span className="text-xs text-gray-400 font-semibold">3 pages</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-700">
                  <div className="font-bold text-white mb-0.5">Page 1 — Couverture & Synthèse</div>
                  <p className="text-gray-400">Photo principale en en-tête, galerie photos, prix estimé, fourchette, indice de fiabilité et fiche technique.</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-700">
                  <div className="font-bold text-white mb-0.5">Page 2 — Sources Cliquables & Ajustements</div>
                  <p className="text-gray-400">Détail de chaque vente DVF, cote ou annonce avec badge cliquable (« Source cliquable ») ouvrant le lien web.</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-900/70 border border-gray-700">
                  <div className="font-bold text-white mb-0.5">Page 3 — Budget, Stratégie & Liens Officiels</div>
                  <p className="text-gray-400">Frais de notaire / crédit, recommandation de négociation et accès direct aux plateformes de référence.</p>
                </div>
              </div>
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

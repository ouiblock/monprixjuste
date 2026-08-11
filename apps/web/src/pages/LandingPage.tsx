import { Link } from 'react-router-dom';
import { Building2, Car, FileText, ChevronDown, ChevronUp, ArrowRight, Shield, Eye, Target, Banknote } from 'lucide-react';
import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: "MonPrixJuste est-il vraiment gratuit ?",
    a: "Oui, 100% gratuit, sans inscription, sans publicité, pour toujours. Notre modèle est basé sur la transparence et le service, pas sur la monétisation de vos données."
  },
  {
    q: "Mes données sont-elles confidentielles ?",
    a: "Absolument. Toutes vos estimations restent dans votre navigateur (localStorage). Aucune donnée n'est envoyée à nos serveurs. Vous êtes le seul propriétaire de vos informations. C'est la promesse fondatrice de MonPrixJuste."
  },
  {
    q: "Quelle est la fiabilité des estimations ?",
    a: "La fiabilité dépend de la qualité et du nombre des sources que vous saisissez. Avec 3 ventes DVF récentes, 2 annonces et 1 estimation d'agence, vous obtenez un score de confiance élevé (70+/100). L'outil vous indique toujours ce score pour que vous puissiez juger la robustesse du résultat."
  },
  {
    q: "Qu'est-ce que le DVF et où trouver ces données ?",
    a: "DVF = Demandes de Valeurs Foncières. C'est la base officielle de l'État français recensant toutes les ventes immobilières notariées depuis 2014. Accès gratuit sur app.dvf.etalab.gouv.fr ou immo-data.fr. Ces données sont les plus fiables car ce sont des transactions réelles, pas des prix annoncés."
  },
  {
    q: "Puis-je utiliser MonPrixJuste pour une transaction professionnelle ?",
    a: "Non. MonPrixJuste est un outil indicatif et ne remplace pas un avis de valeur professionnel (notaire, expert immobilier certifié, expert automobile agréé). Les résultats ne sont pas opposables en justice. Pour toute transaction importante, consultez un professionnel qualifié."
  },
  {
    q: "Comment fonctionne la recherche par plaque d'immatriculation ?",
    a: "Nous n'avons pas d'accès direct au SIV (données protégées). Notre outil vous guide vers Histovec, le service officiel gratuit du gouvernement, qui vous permet de consulter l'historique de n'importe quel véhicule. Vous reportez ensuite les informations dans le formulaire."
  }
];

const WHY_ITEMS = [
  {
    icon: Eye,
    title: 'Transparent',
    desc: 'Aucun algorithme caché. Vous voyez exactement d\'où viennent les données, comment les pondérations fonctionnent, et chaque ajustement appliqué avec son impact en euros.'
  },
  {
    icon: Shield,
    title: 'Privé par conception',
    desc: 'Toutes vos données restent dans votre navigateur. Zéro serveur, zéro collecte, zéro revente. Votre estimation est votre propriété.'
  },
  {
    icon: Target,
    title: 'Précis et argumenté',
    desc: 'Combine DVF (ventes notariées), annonces du marché et estimations professionnelles. Ajustements DPE, kilométrage, état, équipements — rien n\'est laissé au hasard.'
  },
  {
    icon: Banknote,
    title: 'Gratuit pour toujours',
    desc: '100% gratuit, sans inscription, sans publicité, sans freemium. Notre mission est le service, pas le profit.'
  }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">

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
                Que ce soit pour votre appartement, votre maison ou votre voiture — MonPrixJuste croise les données officielles et les annonces du marché pour vous donner une estimation fiable, en quelques minutes.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {['Données officielles (DVF, Argus)', 'Zéro algorithme opaque', '100% privé — aucun serveur', 'Gratuit sans conditions'].map((label) => (
                  <span key={label} className="text-xs font-semibold text-gray-700 bg-gray-900/5 border border-gray-300 px-3 py-1.5 rounded-full">
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Que souhaitez-vous estimer ?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Deux outils distincts, une même méthode : combiner plusieurs sources pour une estimation précise et argumentée.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Immobilier */}
            <Link to="/immobilier">
              <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#ff6d11] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                  <Building2 className="w-6 h-6 text-[#ff6d11]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Bien immobilier</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Appartement, maison, terrain — combinez les ventes DVF notariées, les annonces du marché et les estimations d'agences.
                </p>
                <ul className="space-y-2 mb-7 flex-1">
                  {[
                    'Ventes DVF officielles (État français)',
                    'Décote annonce → vente automatique (−5%)',
                    'Ajustements DPE, état, exposition',
                    'Rapport PDF avec mentions légales',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6d11] mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="flex items-center gap-1 text-sm font-bold text-[#ff6d11] group-hover:gap-2 transition-all">
                  Estimer mon bien <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Automobile */}
            <Link to="/auto">
              <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#ff6d11] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform h-full flex flex-col">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-orange-100 transition-colors">
                  <Car className="w-6 h-6 text-[#ff6d11]" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Véhicule</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  Voiture, SUV, berline — croisez la cote officielle, les annonces particuliers/pro et le prix de rachat cash.
                </p>
                <ul className="space-y-2 mb-7 flex-1">
                  {[
                    'Recherche par plaque via Histovec (officiel)',
                    'Facteur kilométrage électrique intégré',
                    '20+ ajustements équipements et historique',
                    'Avis de valeur PDF avec mentions légales',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6d11] mt-2 flex-shrink-0" />
                      {item}
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

      {/* ── Générateur annonces ───────────────────────────────── */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl space-y-4">
          <Link to="/annonces">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-orange-50 border border-orange-200 rounded-2xl px-8 py-7 hover:border-[#ff6d11] transition-colors group">
              <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-[#ff6d11]" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Générateur d'annonce immobilière conforme
                </h3>
                <p className="text-sm text-gray-600">
                  Particuliers et professionnels — Loi ALUR, Loi Hoguet, DPE, copropriété. Toutes les mentions légales générées automatiquement.
                </p>
              </div>
              <span className="flex items-center gap-2 text-sm font-bold text-white bg-[#ff6d11] px-5 py-2.5 rounded-lg group-hover:bg-[#e65a00] shadow-sm transition-colors flex-shrink-0">
                Créer mon annonce <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link to="/annonces-auto">
            <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 border border-gray-200 rounded-2xl px-8 py-7 hover:border-gray-900 transition-colors group">
              <div className="w-12 h-12 bg-white shadow-sm rounded-xl flex items-center justify-center flex-shrink-0">
                <Car className="w-6 h-6 text-gray-900" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-black text-gray-900 mb-1">
                  Générateur d'annonce automobile
                </h3>
                <p className="text-sm text-gray-600">
                  Annonce optimisée pour LeBonCoin, La Centrale et toutes les marketplaces. Prompt IA inclus pour une rédaction parfaite.
                </p>
              </div>
              <span className="flex items-center gap-2 text-sm font-bold text-white bg-gray-900 px-5 py-2.5 rounded-lg group-hover:bg-gray-800 shadow-sm transition-colors flex-shrink-0">
                Créer mon annonce <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Comment ça marche ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Comment ça marche ?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Une méthode en 3 étapes, entièrement transparente et contrôlable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: '1',
                title: 'Collectez vos sources',
                desc: 'Récupérez les prix sur DVF Etalab (ventes notariées gratuites), LeBonCoin, SeLoger, La Centrale ou via Histovec pour les véhicules.'
              },
              {
                n: '2',
                title: 'Saisissez et pondérez',
                desc: 'Entrez vos données et ajustez l\'importance de chaque source. Donnez plus de poids aux ventes réelles, affinez avec les ajustements qualitatifs.'
              },
              {
                n: '3',
                title: 'Obtenez votre rapport',
                desc: 'Un prix estimé avec fourchette, un score de confiance, et un rapport PDF avec méthodologie complète et avertissements légaux.'
              }
            ].map(({ n, title, desc }) => (
              <div key={n} className="relative">
                <div className="w-10 h-10 rounded-full bg-[#ff6d11] text-white font-black text-lg flex items-center justify-center mb-5">
                  {n}
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi MonPrixJuste ─────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Pourquoi MonPrixJuste ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {WHY_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all flex gap-4">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
              Questions fréquentes
            </h2>
            <p className="text-gray-500">Tout ce que vous devez savoir</p>
          </div>

          <div className="divide-y divide-gray-100">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between py-5 text-left gap-4 hover:text-[#ff6d11] transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm leading-snug">{item.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-[#ff6d11] flex-shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  }
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
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-5">
            Prêt à faire votre estimation ?
          </h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium mb-10">
            Gratuit, privé et sans inscription. Obtenez votre rapport en quelques minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/immobilier">
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-[#ff6d11] hover:bg-[#e65a00] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                <Building2 className="w-5 h-5" />
                Estimer un bien
              </button>
            </Link>
            <Link to="/auto">
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold text-lg rounded-xl border-2 border-gray-200 transition-all">
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

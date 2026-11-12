import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MessageCircleQuestion,
  X,
  Send,
  ExternalLink,
  Sparkles,
  Building2,
  Car,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';

type Category = 'all' | 'immo' | 'auto';

interface LinkItem {
  label: string;
  url: string;
}

interface FaqEntry {
  id: string;
  category: 'immo' | 'auto';
  question: string;
  keywords: string[];
  answer: string;
  links?: LinkItem[];
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  links?: LinkItem[];
}

const FAQ_KNOWLEDGE_BASE: FaqEntry[] = [
  // IMMOBILIER
  {
    id: 'immo-dvf',
    category: 'immo',
    question: 'Où trouver les vraies ventes notariées (DVF) ?',
    keywords: ['dvf', 'notaire', 'notarie', 'vente', 'immo-data', 'etalab', 'reel', 'historique', 'adresse', 'quartier'],
    answer:
      "Les données DVF (Demandes de Valeurs Foncières) recensent toutes les ventes immobilières notariées en France. C'est la base la plus fiable car il s'agit des prix réellement signés chez le notaire (et non des prix affichés). Consultez gratuitement Immo-Data.fr ou l'application officielle DVF Etalab, relevez 2 à 5 ventes proches de votre bien et collez leurs liens dans l'étape 2 !",
    links: [
      { label: 'Immo-Data.fr', url: 'https://www.immo-data.fr/' },
      { label: 'DVF Etalab (Officiel)', url: 'https://app.dvf.etalab.gouv.fr/' },
    ],
  },
  {
    id: 'immo-annonces',
    category: 'immo',
    question: 'Sur quels sites chercher les annonces immobilières ?',
    keywords: ['annonce', 'immo', 'leboncoin', 'seloger', 'pap', 'bienici', 'concurrent', 'marche', 'decote'],
    answer:
      "Pour comparer votre bien à l'offre actuelle, recherchez 2 à 4 biens similaires en vente dans votre secteur sur les plateformes classiques (Leboncoin, SeLoger, PAP, Bien'ici). MonPrixJuste applique par défaut une décote de négociation réglable (-5 %) pour passer du prix affiché au prix de vente probable.",
    links: [
      { label: 'Leboncoin Immobilier', url: 'https://www.leboncoin.fr/c/ventes_immobilieres' },
      { label: 'SeLoger', url: 'https://www.seloger.com/' },
      { label: 'PAP.fr', url: 'https://www.pap.fr/' },
      { label: "Bien'ici", url: 'https://www.bienici.com/' },
    ],
  },
  {
    id: 'immo-dpe',
    category: 'immo',
    question: "Quel est l'impact du DPE sur le prix immobilier ?",
    keywords: ['dpe', 'energie', 'passoire', 'thermique', 'classe', 'ges', 'ajustement', 'travaux', 'renovation'],
    answer:
      "Le Diagnostic de Performance Énergétique (DPE) a un impact direct sur la valeur vénale : un bien classé A ou B bénéficie d'une surcote verte (+5 à +8 %), tandis qu'une passoire énergétique (F ou G) subit une décote (-10 à -15 %) liée aux travaux de rénovation et aux interdictions de mise en location.",
  },
  {
    id: 'immo-ponderation',
    category: 'immo',
    question: 'Comment régler les pondérations en Immobilier ?',
    keywords: ['ponderation', 'poids', 'pourcentage', 'equilibre', 'fiabilite', 'confiance'],
    answer:
      "Nous recommandons de donner le poids principal aux ventes notariées DVF (50 %), complété par les annonces en ligne (30 %) et les avis de valeur (20 %). Si vous n'avez que des ventes DVF et des annonces, cliquez sur « Équilibrer auto » ou répartissez 60 % DVF / 40 % Annonces.",
  },

  // AUTOMOBILE
  {
    id: 'auto-cote',
    category: 'auto',
    question: 'Où trouver la cote et les annonces auto ?',
    keywords: ['cote', 'centrale', 'argus', 'voiture', 'auto', 'annonce', 'autoscout', 'leboncoin', 'occasion'],
    answer:
      "Pour estimer un véhicule avec précision, croisez la cote de référence sur La Centrale avec 3 à 5 annonces de véhicules proches (même motorisation, année et kilométrage voisin) sur La Centrale, Leboncoin ou AutoScout24.",
    links: [
      { label: 'La Centrale (Cote & Annonces)', url: 'https://www.lacentrale.fr/cote-voitures.php' },
      { label: 'Leboncoin Voitures', url: 'https://www.leboncoin.fr/c/voitures' },
      { label: 'AutoScout24', url: 'https://www.autoscout24.fr/' },
    ],
  },
  {
    id: 'auto-rachat',
    category: 'auto',
    question: 'Qu’est-ce que le prix de rachat cash (reprise pro) ?',
    keywords: ['rachat', 'cash', 'vendezvotrevoiture', 'reprise', 'concession', 'pro', 'rapide'],
    answer:
      "Le rachat cash correspond à une offre de reprise immédiate par un professionnel (ex: Vendezvotrevoiture.fr, concessionnaire). Ce prix est généralement inférieur de 15 à 25 % au prix entre particuliers car le professionnel déduit ses frais de remise en état, sa garantie et sa marge. C'est votre prix plancher pour une vente en 24h.",
    links: [
      { label: 'Vendezvotrevoiture.fr', url: 'https://www.vendezvotrevoiture.fr/' },
      { label: 'La Centrale Rachat Express', url: 'https://www.lacentrale.fr/' },
    ],
  },
  {
    id: 'auto-histovec',
    category: 'auto',
    question: 'Comment vérifier l’historique avec la plaque (Histovec) ?',
    keywords: ['plaque', 'immatriculation', 'histovec', 'siv', 'sinistre', 'proprietaire', 'historique', 'km'],
    answer:
      "Histovec est le service officiel et gratuit du Ministère de l'Intérieur. Il permet au vendeur de partager l'historique certifié du véhicule (date de 1ère mise en circulation, changements de propriétaires, sinistres graves, situation administrative et relevés de kilométrage aux contrôles techniques).",
    links: [
      { label: 'Histovec (Site Officiel Gouv)', url: 'https://histovec.interieur.gouv.fr/histovec/accueil' },
    ],
  },
  {
    id: 'auto-km',
    category: 'auto',
    question: 'Comment est calculé l’ajustement kilométrique ?',
    keywords: ['kilometrage', 'km', 'electrique', 'diesel', 'essence', 'usure', 'decote'],
    answer:
      "Le calculateur compare le kilométrage réel de votre véhicule à la moyenne annuelle standard (env. 15 000 km/an). L'impact par kilomètre est pondéré selon la motorisation (ex: un véhicule électrique subit moins d'usure mécanique au kilomètre qu'un moteur thermique, mais l'état de santé batterie SOH reste déterminant).",
  },
  {
    id: 'privacy-photos',
    category: 'immo',
    question: 'Mes photos et mes données restent-elles privées ?',
    keywords: ['prive', 'confidentialite', 'rgpd', 'serveur', 'stockage', 'securite', 'gratuit', 'photo', 'donnee'],
    answer:
      "Oui, 100 % privées ! Vos photos et vos données d'estimation restent stockées exclusivement dans votre navigateur web local. Aucun envoi n'est réalisé vers des serveurs distants.",
  },
];

export default function AssistantChatWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Bonjour 👋 Je suis l'assistant MonPrixJuste. Posez-moi une question ou cliquez sur un sujet ci-dessous (Immobilier ou Automobile) !",
      links: [
        { label: 'Immo-Data.fr', url: 'https://www.immo-data.fr/' },
        { label: 'DVF Etalab', url: 'https://app.dvf.etalab.gouv.fr/' },
        { label: 'La Centrale', url: 'https://www.lacentrale.fr/' },
        { label: 'Vendezvotrevoiture.fr', url: 'https://www.vendezvotrevoiture.fr/' },
      ],
    },
  ]);

  // Synchronise la catégorie par défaut selon la page active
  useEffect(() => {
    if (location.pathname.includes('auto')) {
      setActiveCategory('auto');
    } else if (location.pathname.includes('immo') || location.pathname.includes('annonces')) {
      setActiveCategory('immo');
    } else {
      setActiveCategory('all');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const filteredQuestions = FAQ_KNOWLEDGE_BASE.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  const handleSelectFaq = (entry: FaqEntry) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: entry.question,
    };
    const botMsg: ChatMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: entry.answer,
      links: entry.links,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleSendCustomQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputQuery.trim();
    if (!raw) return;

    const normalized = raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: raw,
    };

    // Recherche du meilleur match par mots-clés
    let bestMatch: FaqEntry | null = null;
    let bestScore = 0;

    for (const entry of FAQ_KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (normalized.includes(kw)) {
          score += 2;
        }
      }
      const qNorm = entry.question
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      if (qNorm.includes(normalized) && normalized.length > 3) {
        score += 3;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    let botMsg: ChatMessage;
    if (bestMatch && bestScore > 0) {
      botMsg = {
        id: `bot-${Date.now() + 1}`,
        sender: 'bot',
        text: bestMatch.answer,
        links: bestMatch.links,
      };
    } else {
      botMsg = {
        id: `bot-${Date.now() + 1}`,
        sender: 'bot',
        text: "Voici les ressources officielles et plateformes recommandées pour réaliser votre estimation en toute indépendance :",
        links: [
          { label: 'Immo-Data.fr (Ventes DVF)', url: 'https://www.immo-data.fr/' },
          { label: 'DVF Etalab (Officiel)', url: 'https://app.dvf.etalab.gouv.fr/' },
          { label: 'Leboncoin', url: 'https://www.leboncoin.fr/' },
          { label: 'SeLoger', url: 'https://www.seloger.com/' },
          { label: 'La Centrale', url: 'https://www.lacentrale.fr/' },
          { label: 'Vendezvotrevoiture.fr', url: 'https://www.vendezvotrevoiture.fr/' },
        ],
      };
    }

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputQuery('');
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "Bonjour 👋 Je suis l'assistant MonPrixJuste. Posez-moi une question ou cliquez sur un sujet ci-dessous !",
        links: [
          { label: 'Immo-Data.fr', url: 'https://www.immo-data.fr/' },
          { label: 'DVF Etalab', url: 'https://app.dvf.etalab.gouv.fr/' },
          { label: 'La Centrale', url: 'https://www.lacentrale.fr/' },
          { label: 'Vendezvotrevoiture.fr', url: 'https://www.vendezvotrevoiture.fr/' },
        ],
      },
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Fenêtre du Chatbot */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Assistant FAQ Immobilier et Automobile"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[80dvh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in"
        >
          {/* En-tête */}
          <div className="bg-gray-900 text-white px-4 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#ff6d11] flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-white truncate">Assistant MonPrixJuste</h3>
                <p className="text-[11px] text-gray-300 truncate">Aide & conseils estimation</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={resetChat}
                title="Réinitialiser la conversation"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Réinitialiser la conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Fermer l'assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Onglets de catégories */}
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
            {[
              { id: 'all' as Category, label: 'Tout', icon: HelpCircle },
              { id: 'immo' as Category, label: 'Immo', icon: Building2 },
              { id: 'auto' as Category, label: 'Auto', icon: Car },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#ff6d11] text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#ff6d11]/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Fil de messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-gray-50/60 min-h-[220px] max-h-[340px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#ff6d11] text-white font-semibold rounded-br-xs'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap gap-1.5">
                      {m.links.map((lnk) => (
                        <a
                          key={lnk.url}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 hover:bg-[#ff6d11] text-[#ff6d11] hover:text-white border border-orange-200 text-[11px] font-bold transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          {lnk.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions rapides */}
          <div className="px-3.5 py-2.5 bg-white border-t border-gray-100 flex-shrink-0">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Questions fréquentes :
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {filteredQuestions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSelectFaq(q)}
                  className="text-left text-[11px] font-semibold bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-[#ff6d11] border border-gray-200 hover:border-orange-300 rounded-lg px-2.5 py-1.5 transition-colors leading-tight"
                >
                  {q.question}
                </button>
              ))}
            </div>
          </div>

          {/* Champ de saisie */}
          <form
            onSubmit={handleSendCustomQuery}
            className="p-2.5 bg-gray-50 border-t border-gray-200 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Posez votre question (ex: DVF, photo PDF, cote)..."
              className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#ff6d11] text-gray-900"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              aria-label="Envoyer"
              className="p-2.5 bg-[#ff6d11] hover:bg-[#e65a00] disabled:opacity-40 text-white rounded-xl transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Bouton flottant d'ouverture */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Fermer l'assistant d'aide" : "Ouvrir l'assistant d'aide Auto & Immo"}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm shadow-xl border-2 border-[#ff6d11] transition-all hover:scale-105 cursor-pointer"
      >
        <span className="w-6 h-6 rounded-full bg-[#ff6d11] flex items-center justify-center flex-shrink-0">
          {isOpen ? <X className="w-3.5 h-3.5 text-white" /> : <MessageCircleQuestion className="w-4 h-4 text-white" />}
        </span>
        <span>{isOpen ? 'Fermer' : 'Aide Immo & Auto'}</span>
      </button>
    </div>
  );
}


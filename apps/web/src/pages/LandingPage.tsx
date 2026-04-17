import { Link } from 'react-router-dom';
import { Building2, Car, CheckCircle2, FileText } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section avec image */}
      <section className="relative h-[700px] md:h-[850px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/header.svg" 
            alt="" 
            className="w-full h-full object-cover"
          />
          {/* Overlay avec opacité */}
          <div className="absolute inset-0 bg-gray-900/30"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10 h-full flex items-center justify-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              Vendez au juste prix. Achetez en connaissance de cause.
            </h1>
            
            <h2 className="text-3xl md:text-4xl text-white font-black mb-8">
              Vous vendez votre bien immobilier ou votre véhicule ?
            </h2>
            
            <p className="text-xl md:text-2xl text-white font-medium mb-12 max-w-3xl mx-auto">
              Parce qu'estimer au doigt mouillé coûte cher. Trop haut = pas de vente. Trop bas = argent perdu. MonPrixJuste vous donne les données pour décider en confiance.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <CheckCircle2 className="w-6 h-6 text-[#ff6d11]" />
                <span>Zéro algorithme caché</span>
              </div>
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <CheckCircle2 className="w-6 h-6 text-[#ff6d11]" />
                <span>100% local et privé</span>
              </div>
              <div className="flex items-center gap-2 text-base font-bold text-white">
                <CheckCircle2 className="w-6 h-6 text-[#ff6d11]" />
                <span>Vous contrôlez tout</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choix Immobilier / Auto */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
            Que souhaitez-vous estimer ?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Immobilier */}
            <Link to="/immobilier">
              <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-[#ff6d11]">
                <div className="w-16 h-16 bg-[#ff6d11] rounded-xl flex items-center justify-center mb-6">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  Bien Immobilier
                </h3>
                <p className="text-base text-gray-700 font-medium mb-6">
                  Appartement, maison, terrain : obtenez une estimation basée sur les ventes réelles et les annonces du marché.
                </p>
                <button className="w-full py-3 bg-[#ff6d11] text-white font-bold text-lg rounded-lg hover:bg-[#E65A00] transition-colors">
                  Estimer mon bien
                </button>
              </div>
            </Link>

            {/* Automobile */}
            <Link to="/auto">
              <div className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-[#ff6d11]">
                <div className="w-16 h-16 bg-[#ff6d11] rounded-xl flex items-center justify-center mb-6">
                  <Car className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  Véhicule
                </h3>
                <p className="text-base text-gray-700 font-medium mb-6">
                  Voiture, moto, utilitaire : comparez avec les cotes officielles et les annonces du marché.
                </p>
                <button className="w-full py-3 bg-[#ff6d11] text-white font-bold text-lg rounded-lg hover:bg-[#E65A00] transition-colors">
                  Estimer mon véhicule
                </button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Générateur d'annonces */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/annonces">
            <div className="bg-gradient-to-r from-[#ff6d11] to-[#E65A00] rounded-2xl p-8 md:p-10 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-black text-white mb-2">
                    Facilitez-vous la vie avec notre générateur d'annonce immobilière
                  </h3>
                  <p className="text-white/90 text-base font-medium">
                    Pour les particuliers et les professionnels. Pour les particuliers : pas de conformité DGCCRF ni Loi ALUR requise. Pour les professionnels : conformité Loi Hoguet, Loi ALUR et Loi Climat. DPE, copropriété, mentions obligatoires : tout est pris en charge.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-block px-6 py-3 bg-white text-[#ff6d11] font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors">
                    Créer mon annonce
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6d11] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black">
                1
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">
                Renseignez votre bien
              </h3>
              <p className="text-base text-gray-700 font-medium">
                Indiquez les caractéristiques : type, surface, localisation, état...
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6d11] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black">
                2
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">
                Ajustez les pondérations
              </h3>
              <p className="text-base text-gray-700 font-medium">
                Donnez plus de poids aux ventes réelles, annonces ou estimations selon votre préférence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff6d11] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black">
                3
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">
                Obtenez votre estimation
              </h3>
              <p className="text-base text-gray-700 font-medium">
                Recevez instantanément une estimation précise et détaillée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi MonPrixJuste */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
            Pourquoi MonPrixJuste ?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-black text-gray-900 mb-3">
                ✅ Transparent
              </h3>
              <p className="text-base text-gray-700 font-medium">
                Aucun algorithme caché. Vous voyez exactement d'où viennent les données et comment le prix est calculé.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-black text-gray-900 mb-3">
                🔒 Privé
              </h3>
              <p className="text-base text-gray-700 font-medium">
                Toutes vos données restent dans votre navigateur. Aucune information n'est envoyée à des serveurs externes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-black text-gray-900 mb-3">
                🎯 Précis
              </h3>
              <p className="text-base text-gray-700 font-medium">
                Combine les ventes réelles (DVF), les annonces du marché et les estimations professionnelles.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-black text-gray-900 mb-3">
                🆓 Gratuit
              </h3>
              <p className="text-base text-gray-700 font-medium">
                100% gratuit, sans inscription, sans publicité. Et ça le restera toujours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-[#ff6d11]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Prêt à estimer votre bien ?
          </h2>
          <p className="text-xl text-white font-medium mb-8">
            Obtenez une estimation précise en quelques minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/immobilier">
              <button className="px-8 py-4 bg-white text-[#ff6d11] font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors">
                Estimer un bien immobilier
              </button>
            </Link>
            <Link to="/auto">
              <button className="px-8 py-4 bg-white text-[#ff6d11] font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors">
                Estimer une voiture
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

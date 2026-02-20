import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Database, Lock, Eye } from 'lucide-react';
import { Card } from '@monprixjuste/ui';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center text-[#ff6d11] hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Résumé en un coup d'œil */}
        <Card className="mb-8 bg-blue-50 border-2 border-blue-500">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              En résumé : Zéro collecte de données
            </h2>
            <ul className="space-y-3 text-blue-800">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <span><strong>100% local :</strong> Toutes vos estimations sont traitées dans votre navigateur</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🚫</span>
                <span><strong>Aucune donnée envoyée :</strong> Nous n'avons pas de serveur backend, pas de base de données</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">👁️</span>
                <span><strong>Zéro tracking :</strong> Pas de Google Analytics, pas de cookies tiers, zéro revente de données</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">💾</span>
                <span><strong>localStorage uniquement :</strong> Vos estimations sont sauvegardées sur votre appareil, pas ailleurs</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Sections détaillées */}
        <div className="space-y-8">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-[#ff6d11]" />
                1. Quelles données sont collectées ?
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  <strong>Réponse courte : AUCUNE.</strong>
                </p>
                <p className="text-gray-600 mb-4">
                  MonPrixJuste est une application 100% client-side (côté navigateur). Nous ne collectons, ne stockons 
                  et ne transmettons aucune donnée personnelle à des serveurs externes. <strong>Zéro revente de données.</strong>
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Ce qui est stocké localement (sur votre appareil uniquement) :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Vos estimations immobilières et automobiles (nom, prix, sources, ajustements)</li>
                  <li>Vos préférences d'interface</li>
                  <li>Votre acceptation de ce message de confidentialité</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  <strong>Important :</strong> Ces données restent dans le localStorage de votre navigateur. 
                  Elles ne quittent jamais votre appareil.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#ff6d11]" />
                2. Comment vos données sont-elles protégées ?
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  La meilleure protection est de ne pas collecter de données. C'est notre approche.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Pas de serveur backend :</strong> Impossible de pirater ce qui n'existe pas</li>
                  <li><strong>Pas de base de données :</strong> Vos données ne peuvent pas fuiter</li>
                  <li><strong>Hébergement statique :</strong> Uniquement des fichiers HTML/CSS/JS</li>
                  <li><strong>HTTPS obligatoire :</strong> Connexion sécurisée entre vous et le site</li>
                  <li><strong>Service 100% gratuit :</strong> Aucune monétisation de vos données</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-[#ff6d11]" />
                3. Cookies et technologies de suivi
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  <strong>Nous n'utilisons AUCUN cookie de tracking.</strong>
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Ce que nous N'utilisons PAS :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>❌ Google Analytics ou tout autre outil d'analytics</li>
                  <li>❌ Cookies publicitaires</li>
                  <li>❌ Pixels de tracking (Facebook, LinkedIn, etc.)</li>
                  <li>❌ Outils de profilage utilisateur</li>
                  <li>❌ Scripts tiers de collecte de données</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Ce que nous utilisons :
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>✅ localStorage : pour sauvegarder vos estimations sur votre appareil</li>
                  <li>✅ Un flag localStorage pour mémoriser que vous avez lu ce message</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Vos droits
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  Puisque nous ne collectons aucune donnée, vous avez un contrôle total :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Supprimer vos données :</strong> Videz le localStorage de votre navigateur (Paramètres → Confidentialité → Effacer les données)</li>
                  <li><strong>Exporter vos données :</strong> Utilisez la fonction "Exporter PDF" dans chaque estimation</li>
                  <li><strong>Ne pas être suivi :</strong> Déjà le cas par défaut !</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Partenaires et liens affiliés
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  MonPrixJuste peut mettre à disposition des codes promotionnels ou des liens vers nos partenaires.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Aucune donnée partagée :</strong> Nous ne transmettons aucune de vos données à nos partenaires</li>
                  <li><strong>Liens externes :</strong> Si vous cliquez sur un lien partenaire, vous quittez MonPrixJuste</li>
                  <li><strong>Service gratuit :</strong> Ces partenariats nous permettent de maintenir le service 100% gratuit</li>
                  <li><strong>Transparence totale :</strong> Les liens partenaires sont clairement identifiés</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Éditeur du service
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  MonPrixJuste est un service 100% gratuit déployé par :
                </p>
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Association HERRICHAIN</h3>
                  <ul className="list-none space-y-1 text-gray-600">
                    <li><strong>Type :</strong> Association Loi 1901</li>
                    <li><strong>RNA :</strong> W641015204</li>
                    <li><strong>Mission :</strong> Promouvoir l'accès à des outils numériques gratuits et transparents</li>
                  </ul>
                </div>
                <p className="text-gray-600 mb-4">
                  <strong>Outil en version bêta</strong> - Développé par :
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Artean Digital Studio</h3>
                  <ul className="list-none space-y-1 text-gray-600">
                    <li><strong>Site web :</strong> <a href="https://arteandigital.fr" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] hover:underline">arteandigital.fr</a></li>
                    <li><strong>Rôle :</strong> Développement technique et maintenance de l'application</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Hébergement et infrastructure
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  MonPrixJuste est hébergé sur un service d'hébergement de sites statiques.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Hébergement statique :</strong> Uniquement des fichiers HTML/CSS/JS</li>
                  <li><strong>HTTPS obligatoire :</strong> Connexion sécurisée</li>
                  <li><strong>Logs techniques :</strong> L'hébergeur peut collecter des logs (IP, user-agent) pour la sécurité</li>
                  <li><strong>Non accessible :</strong> Ces logs ne sont pas accessibles par MonPrixJuste ou l'association</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Modifications de cette politique
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600">
                  Si nous modifions cette politique (par exemple, si nous ajoutons un jour des fonctionnalités nécessitant 
                  un backend), nous mettrons à jour cette page et la date en haut. Nous vous informerons via un message 
                  sur le site.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Contact
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  Pour toute question sur cette politique de confidentialité ou sur MonPrixJuste :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Association HERRICHAIN</strong> - RNA : W641015204</li>
                  <li><strong>Développement technique :</strong> <a href="https://arteandigital.fr" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] hover:underline">Artean Digital Studio</a></li>
                  <li><strong>Transparence :</strong> Consultez le code source (open-source) pour vérifier nos affirmations</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-900 mb-2">
            ✅ Notre engagement
          </h3>
          <p className="text-sm text-green-800 leading-relaxed">
            MonPrixJuste restera toujours une application respectueuse de votre vie privée. 
            <strong> Zéro tracking, zéro revente de données, pas de publicité ciblée.</strong> 
            Service 100% gratuit déployé par l'association HERRICHAIN (Loi 1901, RNA : W641015204). 
            Votre confiance est notre priorité.
          </p>
        </div>
      </div>
    </div>
  );
}

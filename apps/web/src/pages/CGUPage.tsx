import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Gavel, AlertTriangle } from 'lucide-react';
import { Card } from '@monprixjuste/ui';

export default function CGUPage() {
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
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Résumé */}
        <Card className="mb-8 bg-orange-50 border-2 border-[#ff6d11]">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-[#ff6d11] mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              En acceptant d'utiliser MonPrixJuste, vous acceptez ces CGU
            </h2>
            <ul className="space-y-2 text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-xl">📄</span>
                <span>Service gratuit fourni par l'association HERRICHAIN</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <span>Outil indicatif, ne remplace pas un avis professionnel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">🔒</span>
                <span>Données traitées 100% en local dans votre navigateur</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-xl">🆓</span>
                <span>Usage personnel uniquement, sans réutilisation commerciale</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Sections détaillées */}
        <div className="space-y-8">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Gavel className="w-6 h-6 text-[#ff6d11]" />
                1. Objet des CGU
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du service 
                  <strong> MonPrixJuste</strong>, mis à disposition gratuitement par l'association HERRICHAIN.
                </p>
                <p className="text-gray-600 mb-4">
                  En accédant à ce site et en utilisant le service MonPrixJuste, l'utilisateur accepte sans réserve 
                  les présentes CGU. L'accès au site vaut acceptation des CGU.
                </p>
                <p className="text-gray-600">
                  Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce service.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Éditeur du service
              </h2>
              <div className="max-w-none">
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Association HERRICHAIN</h3>
                  <ul className="list-none space-y-1 text-gray-600">
                    <li><strong>Type :</strong> Association Loi 1901</li>
                    <li><strong>RNA :</strong> W641015204</li>
                    <li><strong>Site web :</strong> <a href="https://www.herrichain.org" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] hover:underline">herrichain.org</a></li>
                    <li><strong>Président :</strong> Xavier CHAUMET-NICOLAS</li>
                    <li><strong>Adresse de contact :</strong> contact@herrichain.org</li>
                    <li><strong>Mission :</strong> Promouvoir l'accès à des outils numériques gratuits et transparents</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Développement technique</h3>
                  <ul className="list-none space-y-1 text-gray-600">
                    <li><strong>Artean Digital</strong> - Cabinet de conseil en stratégie digitale et IA</li>
                    <li><strong>Site web :</strong> <a href="https://www.arteandigital.fr" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] hover:underline">arteandigital.fr</a></li>
                    <li><strong>Rôle :</strong> Développement et maintenance de MonPrixJuste pour l'association HERRICHAIN</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Description du service
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  <strong>MonPrixJuste</strong> est un service en ligne gratuit permettant :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>D'estimer le prix d'un bien immobilier (appartement, maison, terrain) en croisant plusieurs sources de données</li>
                  <li>D'estimer le prix d'un véhicule automobile</li>
                  <li>De générer des annonces immobilières conformes aux réglementations (DGCCRF, Loi Hoguet, Loi ALUR, Loi Climat)</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  Le service repose sur des données saisies par l'utilisateur et des sources publiques (DVF - Demandes de Valeurs Foncières, 
                  annonces du marché immobilier). Les estimations sont calculées localement dans le navigateur de l'utilisateur.
                </p>
                <p className="text-gray-600">
                  Le service est fourni <strong>en version bêta</strong> et peut évoluer sans préavis.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-[#ff6d11]" />
                4. Avertissement important
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  <strong>MonPrixJuste est un outil purement indicatif.</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Les estimations fournies ne constituent pas un avis de valeur professionnel</li>
                  <li>Elles ne remplacent pas une expertise immobilière certifiée</li>
                  <li>Elles ne remplacent pas l'avis d'un notaire, d'un expert immobilier ou d'une agence immobilière</li>
                  <li>Les résultats sont basés sur les données saisies par l'utilisateur et sur des sources publiques</li>
                  <li>Les prix du marché immobilier évoluent constamment</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-amber-900 font-semibold">
                    Pour toute transaction immobilière importante, consultez impérativement un professionnel qualifié 
                    (notaire, expert immobilier, agent immobilier).
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Conditions d'accès et d'utilisation
              </h2>
              <div className="max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Accès gratuit</h3>
                <p className="text-gray-600 mb-4">
                  L'accès à MonPrixJuste est <strong>gratuit pour un usage personnel</strong> et ouvert à tout utilisateur majeur capable de contracter.
                </p>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
                  <h4 className="text-base font-bold text-amber-900 mb-2">⚠️ Mise en garde importante</h4>
                  <p className="text-amber-800 text-sm mb-2">
                    MonPrixJuste est un outil indicatif. Les estimations ne constituent pas un avis de valeur professionnel. 
                    Pour toute transaction importante, consultez un professionnel qualifié (notaire, expert immobilier, agent immobilier).
                  </p>
                  <p className="text-amber-800 text-sm">
                    <strong>Gratuit pour usage personnel uniquement.</strong> Toute utilisation commerciale ou professionnelle sans autorisation préalable de l'association HERRICHAIN est strictement interdite.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Usage personnel vs commercial</h3>
                <p className="text-gray-600 mb-4">
                  <strong>Usage personnel autorisé :</strong> Utilisation du service pour vos propres besoins (estimation de votre bien, génération d'annonces pour votre vente).
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Usage commercial interdit sans autorisation :</strong> Toute utilisation professionnelle, récurrente ou à des fins lucratives nécessite une autorisation écrite de l'association HERRICHAIN.
                </p>
                <p className="text-gray-600 mb-4">
                  L'utilisateur s'engage à ne pas :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Utiliser MonPrixJuste à des fins commerciales ou professionnelles sans autorisation</li>
                  <li>Reproduire, copier, vendre, exploiter ou redistribuer le service</li>
                  <li>Tenter d'interférer avec le fonctionnement technique du service</li>
                  <li>Extraire les données du site par des moyens automatisés</li>
                </ul>
                <p className="text-gray-600">
                  Pour toute demande d'autorisation commerciale : <a href="mailto:contact@herrichain.org" className="text-[#ff6d11] hover:underline">contact@herrichain.org</a>
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Comportement de l'utilisateur</h3>
                <p className="text-gray-600 mb-4">
                  L'utilisateur s'engage à :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>Fournir des informations exactes et sincères</li>
                  <li>Ne pas utiliser le service à des fins illicites ou frauduleuses</li>
                  <li>Respecter les lois et réglementations en vigueur</li>
                  <li>Ne pas porter atteinte aux droits de tiers</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Données personnelles et protection
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  MonPrixJuste respecte votre vie privée et ne collecte aucune donnée personnelle :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>Toutes les données sont traitées localement dans votre navigateur (client-side)</li>
                  <li>Aucune donnée n'est envoyée vers un serveur backend</li>
                  <li>Aucune donnée n'est stockée dans une base de données</li>
                  <li>Aucun cookie de tracking n'est utilisé</li>
                  <li>Vos estimations sont sauvegardées uniquement dans le localStorage de votre navigateur</li>
                </ul>
                <p className="text-gray-600 mb-4">
                  Pour plus de détails, consultez notre <Link to="/privacy" className="text-[#ff6d11] hover:underline">Politique de Confidentialité</Link>.
                </p>
                <p className="text-gray-600">
                  <strong>DPO (Délégué à la Protection des Données) :</strong> contact@herrichain.org
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Propriété intellectuelle
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  Le code source de MonPrixJuste est open-source. Le design, l'interface utilisateur et les fonctionnalités 
                  sont la propriété de l'association HERRICHAIN.
                </p>
                <p className="text-gray-600 mb-4">
                  Les données publiques utilisées (DVF, annonces du marché) proviennent de sources officielles et ne sont 
                  pas la propriété de MonPrixJuste.
                </p>
                <p className="text-gray-600">
                  Toute reproduction partielle ou totale du service, par quelque procédé que ce soit, sans l'autorisation 
                  de l'association HERRICHAIN, est interdite.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Limitation de responsabilité
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  L'association HERRICHAIN et Artean Digital ne peuvent être tenus responsables des dommages directs ou 
                  indirects résultant de :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                  <li>L'utilisation du service MonPrixJuste</li>
                  <li>L'impossibilité d'accéder au service</li>
                  <li>L'inexactitude ou l'insuffisance des informations fournies</li>
                  <li>La perte de données sauvegardées dans le localStorage de votre navigateur</li>
                </ul>
                <p className="text-gray-600">
                  L'utilisateur utilise le service à ses risques et périls et assume l'entière responsabilité des décisions 
                  prises sur la base des estimations fournies.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Modification des CGU
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  L'association HERRICHAIN se réserve le droit de modifier les présentes CGU à tout moment.
                </p>
                <p className="text-gray-600 mb-4">
                  Les modifications prendront effet dès leur mise en ligne sur le site. L'utilisateur est invité à consulter 
                  régulièrement les CGU.
                </p>
                <p className="text-gray-600">
                  En cas de modification substantielle, l'association HERRICHAIN s'efforcera d'en informer les utilisateurs 
                  via un message sur le site.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Durée et résiliation
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  Les présentes CGU sont conclues pour une durée indéterminée.
                </p>
                <p className="text-gray-600 mb-4">
                  L'utilisateur peut cesser d'utiliser le service à tout moment sans formalité.
                </p>
                <p className="text-gray-600">
                  L'association HERRICHAIN se réserve le droit de suspendre ou d'interrompre le service à tout moment 
                  pour des raisons techniques, légales ou autres, sans préavis ni indemnité.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                11. Droit applicable et juridiction
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  Les présentes CGU sont régies par le droit français.
                </p>
                <p className="text-gray-600">
                  Tout litige relatif à l'interprétation ou à l'exécution des présentes CGU relèvera de la compétence 
                  exclusive des tribunaux français.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                12. Contact
              </h2>
              <div className="max-w-none">
                <p className="text-gray-600 mb-4">
                  Pour toute question relative aux présentes CGU ou au service MonPrixJuste :
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li><strong>Email :</strong> <a href="mailto:contact@herrichain.org" className="text-[#ff6d11] hover:underline">contact@herrichain.org</a></li>
                  <li><strong>Association HERRICHAIN</strong> - RNA : W641015204</li>
                  <li><strong>Site web :</strong> <a href="https://www.herrichain.org" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] hover:underline">herrichain.org</a></li>
                  <li><strong>Développement :</strong> <a href="https://www.arteandigital.fr" target="_blank" rel="noopener noreferrer" className="text-[#ff6d11] hover:underline">Artean Digital</a></li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 bg-[#ff6d11]/10 rounded-lg border-l-4 border-[#ff6d11]">
          <h3 className="text-lg font-bold text-[#ff6d11] mb-2">
            📜 Acceptation des CGU
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            En utilisant MonPrixJuste, vous reconnaissez avoir lu, compris et accepté les présentes Conditions Générales d'Utilisation. 
            Service gratuit fourni par l'association HERRICHAIN (Loi 1901, RNA : W641015204), développé par Artean Digital.
          </p>
        </div>
      </div>
    </div>
  );
}

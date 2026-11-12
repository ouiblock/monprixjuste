import { Card, Input } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import type { Motorisation, Boite, Carrosserie } from '../types';
import { useState } from 'react';
import { Search, ExternalLink, Info, Car } from 'lucide-react';
import Tooltip from '../../../../apps/web/src/components/Tooltip';
import PhotoUploader from '../../../../apps/web/src/components/PhotoUploader';

const MARQUES_COURANTES = [
  'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 'Audi',
  'Toyota', 'Ford', 'Opel', 'Nissan', 'Fiat', 'Seat', 'Skoda', 'Dacia', 'Hyundai', 'Kia', 'Tesla'
];

export default function VehicleForm() {
  const { vehicleData, setVehicleData } = useAutoStore();
  const [plaque, setPlaque] = useState('');
  const [plaqueError, setPlaqueError] = useState('');

  const formatPlaque = (val: string) => {
    return val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  };

  const handlePlaqueSearch = () => {
    const raw = plaque.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (raw.length < 5) {
      setPlaqueError('Saisissez une plaque valide (ex: AA-123-AA ou 123-ABC-45)');
      return;
    }
    setPlaqueError('');
    window.open(
      `https://histovec.interieur.gouv.fr/histovec/accueil`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-6">
      {/* ── ÉTAPE 0 : PHOTOS DU VÉHICULE (EN TÊTE DU PDF) ─────── */}
      <PhotoUploader
        photos={vehicleData.photos || []}
        onChange={(photos) => setVehicleData({ photos })}
        title="1. Photos du véhicule (En-tête du rapport PDF)"
        subtitle="Ajoutez une ou plusieurs photos de votre voiture (vue 3/4 avant, habitacle, compteur…). La photo principale sera affichée en grand en tête de la première page de votre PDF."
      />

      <Card>
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 flex items-center gap-2 flex-wrap">
            <Car className="w-6 h-6 text-[#ff6d11] flex-shrink-0" />
            <span>2. Informations du véhicule</span>
            <Tooltip
              content="Renseignez les caractéristiques exactes du véhicule. Le kilométrage et la motorisation permettent de calculer automatiquement le bonus ou malus kilométrique."
              position="top"
            />
          </h2>

          {/* ── Section lookup plaque ───────────────────────────── */}
          <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-blue-900">
                Vérifier l'historique via la plaque d'immatriculation
              </h3>
              <Tooltip
                content="Histovec est le service officiel et gratuit du Ministère de l'Intérieur permettant de vérifier l'historique administratif, les sinistres et le kilométrage des contrôles techniques."
                position="top"
              />
            </div>
            <p className="text-xs sm:text-sm text-blue-800 mb-4 leading-relaxed">
              Saisissez votre plaque pour ouvrir le portail officiel <strong>Histovec</strong> et retrouver la finition exacte et l'historique de votre véhicule.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={plaque}
                  onChange={(e) => setPlaque(formatPlaque(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePlaqueSearch();
                  }}
                  placeholder="Ex: AA123AA"
                  maxLength={9}
                  className="w-full px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base sm:text-lg font-mono font-bold uppercase tracking-widest text-gray-900 placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400"
                />
                {plaqueError && <p className="mt-1 text-xs font-medium text-red-600">{plaqueError}</p>}
              </div>
              <button
                type="button"
                onClick={handlePlaqueSearch}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap shadow-xs"
              >
                <ExternalLink className="w-4 h-4" />
                Consulter Histovec
              </button>
            </div>
            <div className="mt-3 flex items-start gap-2 bg-blue-100/50 p-2.5 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                <strong>Respect de la vie privée :</strong> Aucune plaque n'est enregistrée. Le bouton ouvre le portail officiel de l'État dans un nouvel onglet.
              </p>
            </div>
          </div>

          {/* ── Formulaire véhicule ─────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Nom de l'estimation */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">
                  Titre du dossier d'estimation (facultatif)
                </label>
                <Tooltip
                  content="Ce titre s'affichera en couverture de votre rapport PDF (ex: 'Peugeot 3008 GT Line 2021'). S'il est laissé vide, la marque, le modèle et l'année seront utilisés."
                  position="top"
                />
              </div>
              <Input
                label=""
                placeholder="Ex: Peugeot 308 GT — Dossier de vente"
                value={vehicleData.estimationName}
                onChange={(e) => setVehicleData({ estimationName: e.target.value })}
              />
            </div>

            {/* Marque */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">Marque *</label>
                <Tooltip
                  content="Sélectionnez une marque dans la liste suggérée ou saisissez-la librement."
                  position="top"
                />
              </div>
              <input
                type="text"
                list="marques"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-sm sm:text-base font-medium text-gray-900"
                placeholder="Ex: Renault"
                value={vehicleData.marque}
                onChange={(e) => setVehicleData({ marque: e.target.value })}
              />
              <datalist id="marques">
                {MARQUES_COURANTES.map((marque) => (
                  <option key={marque} value={marque} />
                ))}
              </datalist>
            </div>

            {/* Modèle */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">Modèle *</label>
                <Tooltip
                  content="Indiquez le modèle précis (ex: Clio V, 3008, Golf 8, Yaris)."
                  position="top"
                />
              </div>
              <Input
                label=""
                placeholder="Ex: Clio"
                value={vehicleData.modele}
                onChange={(e) => setVehicleData({ modele: e.target.value })}
              />
            </div>

            {/* Version / Finition */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">Version / Finition</label>
                <Tooltip
                  content="La finition (ex: RS Line, Allure, AMG Line, Techno) fait souvent varier la cote de 10% à 25%. Comparez toujours avec des annonces de finition équivalente."
                  position="top"
                />
              </div>
              <Input
                label=""
                placeholder="Ex: GT Line, RS, Intens"
                value={vehicleData.version}
                onChange={(e) => setVehicleData({ version: e.target.value })}
              />
            </div>

            {/* Année */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">Année de mise en circulation *</label>
                <Tooltip
                  content="Année figurant en rubrique B de votre certificat d'immatriculation (carte grise)."
                  position="top"
                />
              </div>
              <Input
                label=""
                type="number"
                min={1980}
                max={2027}
                placeholder="2020"
                value={vehicleData.annee}
                onChange={(e) => setVehicleData({ annee: parseInt(e.target.value) || 2020 })}
              />
            </div>

            {/* Kilométrage */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">Kilométrage (km) *</label>
                <Tooltip
                  content="Un bonus/malus kilométrique est automatiquement calculé par paliers (< 30 000 km : +4%, > 200 000 km : -12%). Pour les véhicules électriques, la décote kilométrique est réduite de 40%."
                  position="top"
                />
              </div>
              <Input
                label=""
                type="number"
                min={0}
                placeholder="50000"
                value={vehicleData.kilometrage}
                onChange={(e) => setVehicleData({ kilometrage: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Motorisation */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">Motorisation *</label>
                <Tooltip
                  content="L'énergie (Essence, Diesel, Hybride, Électrique) influence la demande et la vignette Crit'Air."
                  position="top"
                />
              </div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-sm sm:text-base font-medium text-gray-900"
                value={vehicleData.motorisation}
                onChange={(e) => setVehicleData({ motorisation: e.target.value as Motorisation })}
              >
                <option value="Essence">Essence</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybride essence">Hybride essence</option>
                <option value="Hybride diesel">Hybride diesel</option>
                <option value="Électrique">Électrique</option>
                <option value="GPL">GPL</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Boîte */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">Boîte de vitesses *</label>
                <Tooltip
                  content="Les boîtes automatiques et double embrayage sont aujourd'hui très recherchées sur les berlines et SUV."
                  position="top"
                />
              </div>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-sm sm:text-base font-medium text-gray-900"
                value={vehicleData.boite}
                onChange={(e) => setVehicleData({ boite: e.target.value as Boite })}
              >
                <option value="Manuelle">Manuelle</option>
                <option value="Automatique">Automatique</option>
                <option value="Double embrayage">Double embrayage</option>
              </select>
            </div>

            {/* Carrosserie */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Carrosserie *</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-sm sm:text-base font-medium text-gray-900"
                value={vehicleData.carrosserie}
                onChange={(e) => setVehicleData({ carrosserie: e.target.value as Carrosserie })}
              >
                <option value="Citadine">Citadine</option>
                <option value="Berline">Berline</option>
                <option value="SUV / Crossover">SUV / Crossover</option>
                <option value="Break">Break</option>
                <option value="Coupé">Coupé</option>
                <option value="Cabriolet">Cabriolet</option>
                <option value="Monospace">Monospace</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            {/* Nombre de portes */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Nombre de portes</label>
              <Input
                label=""
                type="number"
                min={2}
                max={7}
                placeholder="5"
                value={vehicleData.nombrePortes}
                onChange={(e) => setVehicleData({ nombrePortes: parseInt(e.target.value) || 5 })}
              />
            </div>

            {/* Couleur */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <label className="block text-sm font-bold text-gray-900">Couleur (optionnel)</label>
                <Tooltip
                  content="Mentionnée sur votre fiche véhicule dans le PDF. Vous pouvez ajuster son impact sur le prix dans la section 'Ajustements qualitatifs'."
                  position="top"
                />
              </div>
              <Input
                label=""
                placeholder="Ex: Gris Anthracite métallisé"
                value={vehicleData.couleur}
                onChange={(e) => setVehicleData({ couleur: e.target.value })}
              />
            </div>
          </div>

          {/* Récapitulatif */}
          {vehicleData.marque && vehicleData.modele && (
            <div className="mt-6 p-3.5 bg-orange-50 rounded-xl border-l-4 border-[#ff6d11]">
              <p className="text-sm font-bold text-gray-900">
                Véhicule : {vehicleData.marque} {vehicleData.modele}{' '}
                {vehicleData.version && `(${vehicleData.version})`}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 mt-0.5">
                {vehicleData.annee} • {vehicleData.kilometrage.toLocaleString('fr-FR')} km •{' '}
                {vehicleData.motorisation} • {vehicleData.boite}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

import { Card, Input } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import type { Motorisation, Boite, Carrosserie } from '../types';
import { useState } from 'react';
import { Search, ExternalLink, Info } from 'lucide-react';
import Tooltip from '../../../../apps/web/src/components/Tooltip';

const MARQUES_COURANTES = [
  'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 'Audi',
  'Toyota', 'Ford', 'Opel', 'Nissan', 'Fiat', 'Seat', 'Skoda', 'Dacia'
];

export default function VehicleForm() {
  const { vehicleData, setVehicleData } = useAutoStore();
  const [plaque, setPlaque] = useState('');
  const [plaqueError, setPlaqueError] = useState('');

  // Format plaque : AA-123-AA ou AA 123 AA
  const formatPlaque = (val: string) => {
    // Retire les tirets et espaces, met en majuscule
    return val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  };

  const handlePlaqueSearch = () => {
    const raw = plaque.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (raw.length < 5) {
      setPlaqueError('Saisissez une plaque valide (ex: AA-123-AA ou 123-ABC-45)');
      return;
    }
    setPlaqueError('');

    // Ouvre Histovec avec la plaque pré-remplie
    window.open(
      `https://histovec.interieur.gouv.fr/histovec/home`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Card className="mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-900 mb-6">
          Informations du véhicule
        </h2>

        {/* ── Section lookup plaque ───────────────────────────── */}
          <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-blue-900">
              Récupérer les données via la plaque d'immatriculation
            </h3>
            <Tooltip
              content="Le système d'immatriculation français (SIV) ne dispose pas d'API publique gratuite. Nous vous redirigeons vers le service officiel Histovec."
              position="right"
            />
          </div>
          <p className="text-sm text-blue-800 mb-4 leading-relaxed">
            Saisissez votre plaque pour ouvrir le registre officiel <strong>Histovec</strong> et retrouver les informations exactes de votre véhicule (marque, modèle, motorisation).
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
                placeholder="Ex: AA-123-AA"
                maxLength={9}
                className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-lg font-mono font-bold uppercase tracking-widest text-gray-900 placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400"
              />
              {plaqueError && <p className="mt-1 text-sm font-medium text-red-600">{plaqueError}</p>}
            </div>
            <button
              type="button"
              onClick={handlePlaqueSearch}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
            >
              <ExternalLink className="w-5 h-5" />
              Consulter Histovec
            </button>
          </div>
          <div className="mt-4 flex items-start gap-2 bg-blue-100/50 p-3 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>Action manuelle requise :</strong> Pour des raisons légales, le remplissage automatique n'est pas possible. Le bouton ouvrira un nouvel onglet vers le site de l'État. Vous pourrez y lire vos informations et les recopier ci-dessous.
            </p>
          </div>
        </div>

        {/* ── Formulaire véhicule ─────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nom de l'estimation */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-base font-bold text-gray-900">Nom de cette estimation *</label>
              <Tooltip
                content="Donnez un nom descriptif pour retrouver facilement cette estimation si vous en faites plusieurs (ex: 'Clio RS vente famille', 'Peugeot 308 reprise')."
                position="right"
              />
            </div>
            <Input
              label=""
              placeholder="Ex: Clio RS 2022 – Vente famille"
              value={vehicleData.estimationName}
              onChange={(e) => setVehicleData({ estimationName: e.target.value })}
              helperText="Donnez un nom pour retrouver facilement cette estimation"
            />
          </div>

          {/* Marque */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">Marque *</label>
            <input
              type="text"
              list="marques"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-base font-medium text-gray-900"
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
            <Input
              label="Modèle *"
              placeholder="Ex: Clio"
              value={vehicleData.modele}
              onChange={(e) => setVehicleData({ modele: e.target.value })}
            />
          </div>

          {/* Version / Finition */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-base font-bold text-gray-900">Version / Finition</label>
              <Tooltip
                content="La finition impacte significativement la cote. Une Volkswagen Golf GTI vaut 20-30% de plus qu'une Golf trendline. Soyez précis pour obtenir la cote correcte."
                position="right"
              />
            </div>
            <Input
              label=""
              placeholder="Ex: GT Line, RS, Limited"
              value={vehicleData.version}
              onChange={(e) => setVehicleData({ version: e.target.value })}
            />
          </div>

          {/* Année */}
          <div>
            <Input
              label="Année *"
              type="number"
              min={1980}
              max={2026}
              placeholder="2020"
              value={vehicleData.annee}
              onChange={(e) => setVehicleData({ annee: parseInt(e.target.value) || 2020 })}
            />
          </div>

          {/* Kilométrage */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-base font-bold text-gray-900">Kilométrage (km) *</label>
              <Tooltip
                content="Le kilométrage influe directement sur la valeur. Un bonus/malus est automatiquement calculé (ex: < 30 000 km = +4%, > 200 000 km = -12%). Pour les électriques, la pénalité est réduite de 40%."
                position="right"
              />
            </div>
            <Input
              label=""
              type="number"
              min={0}
              placeholder="50000"
              value={vehicleData.kilometrage}
              onChange={(e) => setVehicleData({ kilometrage: parseInt(e.target.value) || 0 })}
              helperText="Le bonus/malus sera calculé automatiquement"
            />
          </div>

          {/* Motorisation */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <label className="block text-base font-bold text-gray-900">Motorisation *</label>
              <Tooltip
                content="La motorisation influence la dépréciation et la demande. Les hybrides et électriques bénéficient d'une pénalité kilométrage réduite de 40% dans notre algorithme."
                position="right"
              />
            </div>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-base font-medium text-gray-900"
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
            <label className="block text-base font-bold text-gray-900 mb-2">Boîte de vitesses *</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-base font-medium text-gray-900"
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
            <label className="block text-base font-bold text-gray-900 mb-2">Carrosserie *</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6d11] focus:border-[#ff6d11] bg-white text-base font-medium text-gray-900"
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
            <Input
              label="Nombre de portes"
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
            <div className="flex items-center gap-1 mb-1">
              <label className="block text-base font-bold text-gray-900">Couleur (optionnel)</label>
              <Tooltip
                content="La couleur est pour votre référence. Son impact sur le prix est réglable dans la section 'Ajustements qualitatifs' via le curseur couleur."
                position="top"
              />
            </div>
            <Input
              label=""
              placeholder="Ex: Noir métallisé"
              value={vehicleData.couleur}
              onChange={(e) => setVehicleData({ couleur: e.target.value })}
            />
          </div>
        </div>

        {/* Récapitulatif */}
        {vehicleData.marque && vehicleData.modele && (
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border-l-4 border-[#ff6d11]">
            <p className="text-sm font-semibold text-gray-900">
              Véhicule : {vehicleData.marque} {vehicleData.modele} {vehicleData.version && `(${vehicleData.version})`}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {vehicleData.annee} • {vehicleData.kilometrage.toLocaleString('fr-FR')} km • {vehicleData.motorisation} • {vehicleData.boite}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

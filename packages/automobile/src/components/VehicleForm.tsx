import { Card, Input } from '@monprixjuste/ui';
import { useAutoStore } from '../stores/autoStore';
import type { Motorisation, Boite, Carrosserie } from '../types';

const MARQUES_COURANTES = [
  'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes', 'Audi',
  'Toyota', 'Ford', 'Opel', 'Nissan', 'Fiat', 'Seat', 'Skoda', 'Dacia'
];

export default function VehicleForm() {
  const { vehicleData, setVehicleData } = useAutoStore();

  return (
    <Card className="mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-black text-gray-900 mb-6">
          Informations du véhicule
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Nom de l'estimation */}
          <div className="md:col-span-2">
            <Input
              label="Nom de cette estimation *"
              placeholder="Ex: Clio RS 2022 – Vente famille"
              value={vehicleData.estimationName}
              onChange={(e) => setVehicleData({ estimationName: e.target.value })}
              helperText="Donnez un nom pour retrouver facilement cette estimation"
            />
          </div>

          {/* Marque */}
          <div>
            <label className="block text-base font-bold text-gray-900 mb-2">
              Marque *
            </label>
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
            <Input
              label="Version / Finition"
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
            <Input
              label="Kilométrage (km) *"
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
            <label className="block text-base font-bold text-gray-900 mb-2">
              Motorisation *
            </label>
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
            <label className="block text-base font-bold text-gray-900 mb-2">
              Boîte de vitesses *
            </label>
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
            <label className="block text-base font-bold text-gray-900 mb-2">
              Carrosserie *
            </label>
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
            <Input
              label="Couleur (optionnel)"
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

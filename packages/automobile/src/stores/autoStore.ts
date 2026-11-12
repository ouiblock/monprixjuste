import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AutoEstimationState, VehicleData, Sources, Ponderations, Ajustements } from '../types';
import { calculateAutoPrice, calculateKilometrageBonus } from '../calculation/calculatePrice';
import { format } from 'date-fns';

// Valeurs par défaut
const defaultVehicleData: VehicleData = {
  estimationName: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  marque: '',
  modele: '',
  version: '',
  annee: 2020,
  kilometrage: 50000,
  motorisation: 'Essence',
  boite: 'Manuelle',
  carrosserie: 'Berline',
  nombrePortes: 5,
  couleur: '',
  photos: []
};

const defaultSources: Sources = {
  coteOfficielle: [],
  annoncesParticulier: [],
  annoncesPro: [],
  rachatCash: []
};

const defaultPonderations: Ponderations = {
  coteOfficielle: 42,
  annoncesParticulier: 28,
  annoncesPro: 18,
  rachatCash: 12
};

const defaultAjustements: Ajustements = {
  // État & historique
  etatGeneral: 'Bon',
  carnetComplet: false,
  derniereRevisionMarque: false,
  premiereMain: false,
  nombreProprietaires: 2,
  accidentDeclare: 'Aucun',
  controletechniqueValide: false,
  
  // Kilométrage (calculé auto)
  kilometrageBonus: 0,
  
  // Options & équipements
  toitPanoramique: false,
  camera360: false,
  gps: false,
  siegesCuir: false,
  siegesChauffants: false,
  regulateurAdaptatif: false,
  pharesLED: false,
  jantesAlliage: false,
  equipementsHiver: false,
  
  // Autres
  couleurBonus: 0,
  pneumatiquesRecents: false,
  garantieConstructeur: false,
  etatInterieurImpeccable: false,
  etatExterieurImpeccable: false
};

// Génération d'ID unique
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useAutoStore = create<AutoEstimationState>()(
  persist(
    (set, get) => ({
      vehicleData: defaultVehicleData,
      sources: defaultSources,
      ponderations: defaultPonderations,
      ajustements: defaultAjustements,
      calculationResult: null,

      // Vehicle Data
      setVehicleData: (data) => {
        set((state) => {
          const newVehicleData = { ...state.vehicleData, ...data };
          
          // Recalculer automatiquement le bonus kilométrage si le km ou la motorisation change
          let newAjustements = state.ajustements;
          if (data.kilometrage !== undefined || data.motorisation !== undefined) {
            newAjustements = {
              ...state.ajustements,
              kilometrageBonus: calculateKilometrageBonus(
                data.kilometrage ?? state.vehicleData.kilometrage,
                data.motorisation ?? state.vehicleData.motorisation
              )
            };
          }
          
          return {
            vehicleData: newVehicleData,
            ajustements: newAjustements
          };
        });
      },

      // Cote Officielle
      addCoteOfficielle: (cote) => {
        set((state) => ({
          sources: {
            ...state.sources,
            coteOfficielle: [...state.sources.coteOfficielle, { ...cote, id: generateId() }]
          }
        }));
      },

      updateCoteOfficielle: (id, cote) => {
        set((state) => ({
          sources: {
            ...state.sources,
            coteOfficielle: state.sources.coteOfficielle.map((c) =>
              c.id === id ? { ...c, ...cote } : c
            )
          }
        }));
      },

      removeCoteOfficielle: (id) => {
        set((state) => ({
          sources: {
            ...state.sources,
            coteOfficielle: state.sources.coteOfficielle.filter((c) => c.id !== id)
          }
        }));
      },

      // Annonces Particulier
      addAnnonceParticulier: (annonce) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annoncesParticulier: [...state.sources.annoncesParticulier, { ...annonce, id: generateId() }]
          }
        }));
      },

      updateAnnonceParticulier: (id, annonce) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annoncesParticulier: state.sources.annoncesParticulier.map((a) =>
              a.id === id ? { ...a, ...annonce } : a
            )
          }
        }));
      },

      removeAnnonceParticulier: (id) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annoncesParticulier: state.sources.annoncesParticulier.filter((a) => a.id !== id)
          }
        }));
      },

      // Annonces Pro
      addAnnoncePro: (annonce) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annoncesPro: [...state.sources.annoncesPro, { ...annonce, id: generateId() }]
          }
        }));
      },

      updateAnnoncePro: (id, annonce) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annoncesPro: state.sources.annoncesPro.map((a) =>
              a.id === id ? { ...a, ...annonce } : a
            )
          }
        }));
      },

      removeAnnoncePro: (id) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annoncesPro: state.sources.annoncesPro.filter((a) => a.id !== id)
          }
        }));
      },

      // Rachat Cash
      addRachatCash: (rachat) => {
        set((state) => ({
          sources: {
            ...state.sources,
            rachatCash: [...state.sources.rachatCash, { ...rachat, id: generateId() }]
          }
        }));
      },

      updateRachatCash: (id, rachat) => {
        set((state) => ({
          sources: {
            ...state.sources,
            rachatCash: state.sources.rachatCash.map((r) =>
              r.id === id ? { ...r, ...rachat } : r
            )
          }
        }));
      },

      removeRachatCash: (id) => {
        set((state) => ({
          sources: {
            ...state.sources,
            rachatCash: state.sources.rachatCash.filter((r) => r.id !== id)
          }
        }));
      },

      // Pondérations
      setPonderations: (ponderations) => {
        set((state) => ({
          ponderations: { ...state.ponderations, ...ponderations }
        }));
      },

      // Ajustements
      setAjustements: (ajustements) => {
        set((state) => ({
          ajustements: { ...state.ajustements, ...ajustements }
        }));
      },

      // Calcul
      calculate: () => {
        const state = get();
        
        try {
          const result = calculateAutoPrice(
            state.vehicleData,
            state.sources,
            state.ponderations,
            state.ajustements
          );
          
          set({ calculationResult: result });
        } catch (error) {
          console.error('Erreur de calcul:', error);
          set({ calculationResult: null });
        }
      },

      // Reset
      reset: () => {
        set({
          vehicleData: { ...defaultVehicleData, date: format(new Date(), 'yyyy-MM-dd') },
          sources: defaultSources,
          ponderations: defaultPonderations,
          ajustements: defaultAjustements,
          calculationResult: null
        });
      }
    }),
    {
      name: 'monprixjuste-auto-storage',
      partialize: (state) => ({
        vehicleData: state.vehicleData,
        sources: state.sources,
        ponderations: state.ponderations,
        ajustements: state.ajustements
      })
    }
  )
);

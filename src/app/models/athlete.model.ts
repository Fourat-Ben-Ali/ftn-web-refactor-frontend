import { Club } from './club.model';

export interface Athlete {
  id: number;
  prenom: string;
  nom: string;
  genre: string;
  dateNaissance: string;
  nationalite: string;
  club?: Club;
  equipeNationale?: {
    id: number;
    nom: string;
  };
  photoUrl?: string;
  medals?: {
    gold?: number;
    silver?: number;
    bronze?: number;
  };
} 
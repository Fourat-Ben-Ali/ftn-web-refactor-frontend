export interface Athlete {
  id: number;
  prenom: string;
  nom: string;
  genre: string;
  dateNaissance: string;
  nationalite: string;
  club?: {
    id: number;
    clubName: string;
    description: string;
  };
  equipeNationale?: {
    id: number;
    nom: string;
  };
} 
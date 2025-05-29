import { Discipline } from "./disciplineDTO.model";

export interface Evenement {
    id: number;
    titre: string;
    date: Date;
    description: string;
    typeEvenement: TypeEvenement;
    discipline?: Discipline;
}

export enum TypeEvenement {
    COMPETITION = 'COMPETITION',
    FORMATION = 'FORMATION',
    REUNION = 'REUNION',
    AUTRE = 'AUTRE'
} 
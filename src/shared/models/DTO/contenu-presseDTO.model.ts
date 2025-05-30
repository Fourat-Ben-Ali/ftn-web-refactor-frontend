export interface ContenuPresse {
  id?: number;
  titre: string;
  type: 'ARTICLE' | 'COMMUNIQUE' | 'INTERVIEW'; // adapte selon ton enum
  contenu: string;
  datePublication: string; // format ISO : "2025-05-28"
}

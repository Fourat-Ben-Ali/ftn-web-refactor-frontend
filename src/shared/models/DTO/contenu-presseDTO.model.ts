export interface ContenuPresse {
  id?: number;
  titre: string;
  type: 'COMMUNIQUE' | 'DOCUMENT';
  contenu: string;
  datePublication: string; // format ISO : "2025-05-28"
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
}

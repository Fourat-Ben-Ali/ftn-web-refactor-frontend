import { Component, OnInit } from '@angular/core';
import { PresseService } from 'shared/services/presse.service.ts.service';
import { ContenuPresse } from 'shared/models/DTO/contenu-presseDTO.model';

@Component({
  selector: 'app-presse-list',
  templateUrl: './presse-list.component.html',
  styleUrls: ['./presse-list.component.scss']
})
export class PresseListComponent implements OnInit {
  contenus: ContenuPresse[] = [];
  filteredContenus: ContenuPresse[] = [];
  searchText: string = '';
  displayDialog: boolean = false;
  selectedContenu: ContenuPresse | null = null;

  // Filtres avancés
  selectedDate: Date | null = null;
  selectedType: string | null = null;
  searchTitle: string = '';
  typesPresseOptions = [
    { label: 'Communiqué', value: 'COMMUNIQUE' },
    { label: 'Document', value: 'DOCUMENT' }
  ];
  loading = false;

  constructor(private presseService: PresseService) {}

  ngOnInit(): void {
    this.loadContenus();
  }

  loadContenus(): void {
    this.loading = true;
    this.presseService.getAll().subscribe({
      next: (data) => {
        console.log('Données reçues de l\'API presse:', data);
        this.contenus = data;
        this.filteredContenus = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contenus presse :', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredContenus = this.contenus.filter(contenu => {
      const matchTitle = this.searchTitle === '' || (contenu.titre && contenu.titre.toLowerCase().includes(this.searchTitle.toLowerCase()));
      const matchType = !this.selectedType || contenu.type === this.selectedType;
      const matchDate = !this.selectedDate || (contenu.datePublication && new Date(contenu.datePublication).toDateString() === this.selectedDate.toDateString());
      return matchTitle && matchType && matchDate;
    });
  }

  clearFilters(): void {
    this.selectedDate = null;
    this.selectedType = null;
    this.searchTitle = '';
    this.searchText = '';
    this.filteredContenus = this.contenus;
  }

  onSearchChange(): void {
    this.filteredContenus = this.contenus.filter(contenu => {
      const titre = contenu.titre || '';
      const contenuText = contenu.contenu || '';
      return this.searchText === '' ||
        (titre && titre.toLowerCase().includes(this.searchText.toLowerCase())) ||
        (contenuText && contenuText.toLowerCase().includes(this.searchText.toLowerCase()));
    });
  }

  showDetails(contenu: ContenuPresse): void {
    this.selectedContenu = contenu;
    this.displayDialog = true;
  }

  // Méthode utilitaire pour formater le contenu pour l'affichage dans le tableau
  getFormattedContent(content: string): string {
    if (!content) return '';
    // Supprimer les balises HTML et limiter à 100 caractères
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
  }

  // Méthode pour obtenir le type traduit
  getTypeLabel(type: string): string {
    return type === 'COMMUNIQUE' ? 'Communiqué' : 'Document';
  }
} 
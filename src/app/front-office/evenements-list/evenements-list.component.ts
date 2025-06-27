import { Component, OnInit } from '@angular/core';
import { Evenement } from '../../shared/services/evenement.service';
import { EvenementService } from '../../shared/services/evenement.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-evenements-list',
  templateUrl: './evenements-list.component.html',
  styleUrls: ['./evenements-list.component.scss']
})
export class EvenementsListComponent implements OnInit {
  evenements: Evenement[] = [];
  filteredEvenements: Evenement[] = [];
  searchText: string = '';
  displayDialog: boolean = false;
  selectedEvenement: Evenement | null = null;

  constructor(private evenementService: EvenementService) {}

  ngOnInit(): void {
    this.loadEvenements();
  }

  loadEvenements(): void {
    this.evenementService.getAllEvenements().subscribe({
      next: (data) => {
        this.evenements = data;
        this.filteredEvenements = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements :', error);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.filterEvenements();
  }

  filterEvenements(): void {
    this.filteredEvenements = this.evenements.filter(evenement => {
      const titre = evenement.titre || evenement.nom || '';
      return this.searchText === '' ||
        (titre && titre.toLowerCase().includes(this.searchText.toLowerCase())) ||
        (evenement.description && evenement.description.toLowerCase().includes(this.searchText.toLowerCase()));
    });
  }

  showDetails(evenement: Evenement): void {
    this.selectedEvenement = evenement;
    this.displayDialog = true;
  }
} 
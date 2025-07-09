import { Component, OnInit } from '@angular/core';
import { Evenement } from '../../shared/services/evenement.service';
import { EvenementService } from '../../shared/services/evenement.service';
import { FormsModule } from '@angular/forms';
import { DisciplineService } from '../../../shared/services/discipline.service';
import { Discipline } from 'models';
import { TypeEvenement } from 'models';

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

  // Filtres avancés
  selectedDate: Date | null = null;
  selectedType: TypeEvenement | null = null;
  selectedDiscipline: Discipline | null = null;
  searchTitle: string = '';
  disciplines: Discipline[] = [];
  typesEvenement = Object.values(TypeEvenement);
  loading = false;

  constructor(
    private evenementService: EvenementService,
    private disciplineService: DisciplineService
  ) {}

  ngOnInit(): void {
    this.loadEvenements();
    this.loadDisciplines();
  }

  loadEvenements(): void {
    this.loading = true;
    this.evenementService.getAllEvenements().subscribe({
      next: (data) => {
        this.evenements = data;
        this.filteredEvenements = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements :', error);
        this.loading = false;
      }
    });
  }

  loadDisciplines(): void {
    this.disciplineService.getAllDisciplines().subscribe({
      next: (data: Discipline[]) => {
        this.disciplines = data;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des disciplines :', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredEvenements = this.evenements.filter(evenement => {
      const matchTitle = this.searchTitle === '' || (evenement.titre && evenement.titre.toLowerCase().includes(this.searchTitle.toLowerCase()));
      const matchType = !this.selectedType || evenement.typeEvenement === this.selectedType;
      const matchDiscipline = !this.selectedDiscipline || (evenement.discipline && evenement.discipline.id === this.selectedDiscipline.id);
      const matchDate = !this.selectedDate || (evenement.date && new Date(evenement.date).toDateString() === this.selectedDate.toDateString());
      return matchTitle && matchType && matchDiscipline && matchDate;
    });
  }

  clearFilters(): void {
    this.selectedDate = null;
    this.selectedType = null;
    this.selectedDiscipline = null;
    this.searchTitle = '';
    this.filteredEvenements = this.evenements;
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
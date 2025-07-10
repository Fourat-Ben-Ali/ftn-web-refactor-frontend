import { Component, OnInit } from '@angular/core';
import { ProgrammeFormationService, ProgrammeFormation } from 'app/services/programme-formation.service';

@Component({
  selector: 'app-progamme-formation-list',
  templateUrl: './progamme-formation-list.component.html',
  styleUrls: ['./progamme-formation-list.component.scss']
})
export class ProgammeFormationListComponent implements OnInit {
triggerDatePicker(arg0: string) {
throw new Error('Method not implemented.');
}
  programmes: ProgrammeFormation[] = [];
  filteredProgrammes: ProgrammeFormation[] = [];
  searchText: string = '';
  dateDebutFilter: string = '';
  dateFinFilter: string = '';
  displayDialog: boolean = false;
  selectedProgramme: ProgrammeFormation | null = null;

  constructor(private programmeService: ProgrammeFormationService) {}

  ngOnInit(): void {
    this.loadProgrammes();
  }

  loadProgrammes(): void {
    this.programmeService.getAllProgrammeFormations().subscribe({
      next: (data) => {
        this.programmes = data;
        this.filteredProgrammes = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des programmes de formation', err);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value.toLowerCase();
    this.filterProgrammes();
  }

  filterProgrammes(): void {
    this.filteredProgrammes = this.programmes.filter(p => {
      const titreMatch = p.titre.toLowerCase().includes(this.searchText);
      const descMatch = p.description.toLowerCase().includes(this.searchText);

      const dateDebut = new Date(p.dateDebut);
      const dateFin = new Date(p.dateFin);

      const filterDebut = this.dateDebutFilter ? new Date(this.dateDebutFilter) : null;
      const filterFin = this.dateFinFilter ? new Date(this.dateFinFilter) : null;

      const dateInRange =
        (!filterDebut || dateDebut >= filterDebut) &&
        (!filterFin || dateFin <= filterFin);

      return (titreMatch || descMatch) && dateInRange;
    });
  }

 
  showDetails(p: ProgrammeFormation): void {
    this.selectedProgramme = p;
    this.displayDialog = true;
  }
  onDateFilterChange() {
  this.filteredProgrammes = this.programmes.filter((p) => {
    const dateDebut = new Date(p.dateDebut);
    const dateFin = new Date(p.dateFin);
    const start = this.dateDebutFilter ? new Date(this.dateDebutFilter) : null;
    const end = this.dateFinFilter ? new Date(this.dateFinFilter) : null;

    if (!start && !end) return true;
    if (start && dateDebut < start) return false;
    if (end && dateFin > end) return false;
    return true;
  });
}

clearFilters() {
 
  this.filteredProgrammes = [...this.programmes];
}

}

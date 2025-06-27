import { Component, OnInit } from '@angular/core';
import { ProgrammeFormationService, ProgrammeFormation } from 'app/services/programme-formation.service';

@Component({
  selector: 'app-progamme-formation-list',
  templateUrl: './progamme-formation-list.component.html',
  styleUrls: ['./progamme-formation-list.component.scss'] // ← assure-toi que c’est bien .scss
})
export class ProgammeFormationListComponent implements OnInit {
  programmes: ProgrammeFormation[] = [];
  filteredProgrammes: ProgrammeFormation[] = [];
  searchText: string = '';
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
    this.filteredProgrammes = this.programmes.filter(p =>
      p.titre.toLowerCase().includes(this.searchText) ||
      p.description.toLowerCase().includes(this.searchText)
    );
  }

  showDetails(p: ProgrammeFormation): void {
    this.selectedProgramme = p;
    this.displayDialog = true;
  }
}

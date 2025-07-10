import { Component, OnInit } from '@angular/core';
import { ActualiteAcademie, ActualiteAcademieService } from 'app/services/actualite-academie.service';

@Component({
  selector: 'app-actualite-academique-list',
  templateUrl: './actualite-academique-list.component.html',
  styleUrls: ['./actualite-academique-list.component.scss']
})
export class ActualiteAcademiqueListComponent implements OnInit {
  actualites: ActualiteAcademie[] = [];
  filteredActualites: ActualiteAcademie[] = [];
  searchText: string = '';
  displayDialog: boolean = false;
  selectedActualite: ActualiteAcademie | null = null;

  constructor(private actualiteService: ActualiteAcademieService) {}

  ngOnInit(): void {
    this.loadActualites();
  }

  loadActualites(): void {
    this.actualiteService.getAllActualiteAcademies().subscribe({
      next: (data) => {
        console.log(data[0]); // Pour vérifier la structure
        this.actualites = data;
        this.filteredActualites = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des actualités :', error);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value.toLowerCase();
    this.filterActualites();
  }

  filterActualites(): void {
    this.filteredActualites = this.actualites.filter(actu =>
      actu.titre?.toLowerCase().includes(this.searchText) ||
      actu.contenu?.toLowerCase().includes(this.searchText)
    );
  }

  showDetails(actualite: ActualiteAcademie): void {
    this.selectedActualite = actualite;
    this.displayDialog = true;
  }

dateFilter: Date | null = null;

onDateFilterChange() {
  this.applyFilters(); // si tu centralises les filtres
}

applyFilters() {
  this.filteredActualites = this.actualites.filter((a) => {
    const matchesSearch =
      !this.searchText || a.titre.toLowerCase().includes(this.searchText.toLowerCase());

    const matchesDate =
      !this.dateFilter ||
      new Date(a.datePublication).toDateString() === new Date(this.dateFilter).toDateString();

    return matchesSearch && matchesDate;
  });
}

clearFilters() {
  this.dateFilter = null;

  this.filteredActualites = [...this.actualites];
}

}

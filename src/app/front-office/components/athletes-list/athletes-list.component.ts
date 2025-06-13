import { Component, OnInit } from '@angular/core';
import { AthleteService } from '../../../services/athlete.service';
import { Athlete } from '../../../models/athlete.model';

@Component({
  selector: 'app-athletes-list',
  template: `
    <div class="athletes-container">
      <p-card header="Athletes List" styleClass="mb-4">
        <div class="filters mb-4">
          <div class="grid">
            <div class="col-12 md:col-4">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search"></i>
                <input pInputText type="text" 
                       [(ngModel)]="searchText" 
                       (input)="filterAthletes()"
                       placeholder="Search athletes..." 
                       class="w-full" />
              </span>
            </div>
            <div class="col-12 md:col-4">
              <p-dropdown [options]="clubOptions" 
                         [(ngModel)]="selectedClub" 
                         (onChange)="filterAthletes()"
                         placeholder="Filter by Club"
                         [showClear]="true"
                         class="w-full">
              </p-dropdown>
            </div>
          </div>
        </div>

        <p-table [value]="filteredAthletes" 
                 [paginator]="true" 
                 [rows]="10"
                 [showCurrentPageReport]="true"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} athletes"
                 [rowsPerPageOptions]="[10,25,50]"
                 styleClass="p-datatable-striped">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
              <th pSortableColumn="surname">Surname <p-sortIcon field="surname"></p-sortIcon></th>
              <th pSortableColumn="club">Club <p-sortIcon field="club"></p-sortIcon></th>
              <th pSortableColumn="age">Age <p-sortIcon field="age"></p-sortIcon></th>
              <th>Details</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-athlete>
            <tr>
              <td>{{athlete.name}}</td>
              <td>{{athlete.surname}}</td>
              <td>{{athlete.club}}</td>
              <td>{{athlete.age}}</td>
              <td>
                <button pButton icon="pi pi-info-circle" 
                        class="p-button-rounded p-button-info" 
                        (click)="showAthleteDetails(athlete)">
                </button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    .athletes-container {
      padding: 1rem;
    }
    .filters {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
    }
    .mb-4 {
      margin-bottom: 1.5rem;
    }
  `]
})
export class AthletesListComponent implements OnInit {
  athletes: Athlete[] = [];
  filteredAthletes: Athlete[] = [];
  searchText: string = '';
  selectedClub: string | null = null;
  clubOptions: { label: string, value: string }[] = [];

  constructor(private athleteService: AthleteService) {}

  ngOnInit() {
    this.loadAthletes();
  }

  loadAthletes() {
    this.athleteService.getAllAthletes().subscribe(
      (data: Athlete[]) => {
        this.athletes = data;
        this.filteredAthletes = data;
        this.updateClubOptions();
      },
      (error: any) => {
        console.error('Error loading athletes:', error);
      }
    );
  }

  updateClubOptions() {
    const clubs = [...new Set(this.athletes.map(a => a.club))];
    this.clubOptions = clubs.map(club => ({
      label: club,
      value: club
    }));
  }

  filterAthletes() {
    this.filteredAthletes = this.athletes.filter(athlete => {
      const matchesSearch = !this.searchText || 
        athlete.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        athlete.surname.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesClub = !this.selectedClub || 
        athlete.club === this.selectedClub;

      return matchesSearch && matchesClub;
    });
  }

  showAthleteDetails(athlete: Athlete) {
    // TODO: Implement athlete details view
    console.log('Show details for:', athlete);
  }
} 
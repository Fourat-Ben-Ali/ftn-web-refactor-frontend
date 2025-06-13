import { Component, OnInit } from '@angular/core';
import { ClubService } from '../../../services/club.service';
import { Club } from '../../../models/club.model';

@Component({
  selector: 'app-clubs-list',
  template: `
    <div class="clubs-container">
      <p-card header="Clubs List" styleClass="mb-4">
        <div class="filters mb-4">
          <div class="grid">
            <div class="col-12 md:col-4">
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search"></i>
                <input pInputText type="text" 
                       [(ngModel)]="searchText" 
                       (input)="filterClubs()"
                       placeholder="Search clubs..." 
                       class="w-full" />
              </span>
            </div>
          </div>
        </div>

        <div class="grid">
          <div class="col-12 md:col-6 lg:col-4" *ngFor="let club of filteredClubs">
            <p-card [header]="club.name" styleClass="h-full">
              <ng-template pTemplate="header">
                <img [src]="club.logo || 'assets/default-club-logo.png'" 
                     [alt]="club.name"
                     style="width: 100%; height: 200px; object-fit: cover;">
              </ng-template>
              <div class="club-details">
                <p><i class="pi pi-map-marker"></i> {{club.address}}</p>
                <p><i class="pi pi-phone"></i> {{club.phone}}</p>
                <p><i class="pi pi-envelope"></i> {{club.email}}</p>
                <p><i class="pi pi-users"></i> {{club.memberCount}} Members</p>
              </div>
              <ng-template pTemplate="footer">
                <button pButton label="View Details" 
                        icon="pi pi-info-circle"
                        class="p-button-outlined p-button-info w-full"
                        (click)="showClubDetails(club)">
                </button>
              </ng-template>
            </p-card>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .clubs-container {
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
    .club-details {
      margin: 1rem 0;
    }
    .club-details p {
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .club-details i {
      color: #2196F3;
    }
  `]
})
export class ClubsListComponent implements OnInit {
  clubs: Club[] = [];
  filteredClubs: Club[] = [];
  searchText: string = '';

  constructor(private clubService: ClubService) {}

  ngOnInit() {
    this.loadClubs();
  }

  loadClubs() {
    this.clubService.getAllClubs().subscribe(
      (data: Club[]) => {
        this.clubs = data;
        this.filteredClubs = data;
      },
      (error: any) => {
        console.error('Error loading clubs:', error);
      }
    );
  }

  filterClubs() {
    this.filteredClubs = this.clubs.filter(club => {
      return !this.searchText || 
        club.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        club.address.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  showClubDetails(club: Club) {
    // TODO: Implement club details view
    console.log('Show details for:', club);
  }
} 
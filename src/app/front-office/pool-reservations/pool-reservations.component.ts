import { Component, OnInit } from '@angular/core';
import { PoolReservationService, PoolReservation, PoolReservationFilter } from '../../../shared/services/pool-reservation.service';
import { PoolService, Pool } from '../../../shared/services/pool.service';
import { ClubsService } from '../../../shared/services/clubs.service';
import { clubs } from 'models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pool-reservations',
  templateUrl: './pool-reservations.component.html',
  styleUrls: ['./pool-reservations.component.scss'],
  providers: [MessageService]
})
export class PoolReservationsComponent implements OnInit {
  reservations: PoolReservation[] = [];
  filteredReservations: PoolReservation[] = [];
  loading = false;
  
  // Filter properties
  filter: PoolReservationFilter = {};
  coaches: string[] = [];
  clubs: clubs[] = [];
  pools: Pool[] = [];
  
  // Filter form values
  selectedCoach: string | null = null;
  selectedClub: clubs | null = null;
  selectedPool: Pool | null = null;
  selectedDate: Date | null = null;

  constructor(
    private reservationService: PoolReservationService,
    private poolService: PoolService,
    private clubsService: ClubsService,
    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadReservations();
    this.loadFilterOptions();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.filteredReservations = data;
        this.extractCoaches();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load pool reservations'
        });
        this.loading = false;
      }
    });
  }

  loadFilterOptions() {
    // Load clubs
    this.clubsService.getAllClubs().subscribe({
      next: (data) => {
        this.clubs = data;
      },
      error: (error) => {
        console.error('Error loading clubs:', error);
      }
    });

    // Load pools
    this.poolService.getAllPools().subscribe({
      next: (data) => {
        this.pools = data;
      },
      error: (error) => {
        console.error('Error loading pools:', error);
      }
    });
  }

  extractCoaches() {
    // Extract unique coach names from reservations
    const coachSet = new Set<string>();
    this.reservations.forEach(reservation => {
      if (reservation.coach) {
        coachSet.add(reservation.coach);
      }
    });
    this.coaches = Array.from(coachSet).sort();
  }

  applyFilters() {
    this.loading = true;
    
    // Build filter object
    this.filter = {};
    
    if (this.selectedCoach) {
      this.filter.coach = this.selectedCoach;
    }
    
    if (this.selectedClub) {
      this.filter.clubId = this.selectedClub.id;
    }
    
    if (this.selectedPool) {
      this.filter.poolId = this.selectedPool.id;
    }
    
    if (this.selectedDate) {
      this.filter.date = this.formatDate(this.selectedDate);
    }

    // Check if any filters are applied
    const hasFilters = this.filter.coach || this.filter.clubId || this.filter.poolId || this.filter.date;
    
    if (hasFilters) {
      // Apply server-side filtering
      this.reservationService.filterReservations(this.filter).subscribe({
        next: (data) => {
          this.filteredReservations = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error filtering reservations:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to filter reservations'
          });
          this.loading = false;
        }
      });
    } else {
      // No filters, show all reservations
      this.filteredReservations = this.reservations;
      this.loading = false;
    }
  }

  clearFilters() {
    this.selectedCoach = null;
    this.selectedClub = null;
    this.selectedPool = null;
    this.selectedDate = null;
    this.filter = {};
    this.filteredReservations = this.reservations;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
} 
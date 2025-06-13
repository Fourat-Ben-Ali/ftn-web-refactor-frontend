import { Component, OnInit } from '@angular/core';
import { Athlete } from '../../models/athlete.model';
import { Club } from '../../models/club.model';
import { AthleteService } from '../../services/athlete.service';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'app-athletes-list',
  templateUrl: './athletes-list.component.html',
  styleUrls: ['./athletes-list.component.scss']
})
export class AthletesListComponent implements OnInit {
  athletes: Athlete[] = [];
  filteredAthletes: Athlete[] = [];
  clubs: Club[] = [];
  clubOptions: { label: string; value: Club }[] = [];
  selectedClub: Club | null = null;
  searchText: string = '';
  displayDialog: boolean = false;
  selectedAthlete: Athlete | null = null;

  constructor(
    private athleteService: AthleteService,
    private clubService: ClubService
  ) {}

  ngOnInit(): void {
    this.loadAthletes();
    this.loadClubs();
  }

  loadAthletes(): void {
    this.athleteService.getAthletes().subscribe({
      next: (data) => {
        this.athletes = data;
        this.filteredAthletes = data;
      },
      error: (error) => {
        console.error('Error loading athletes:', error);
      }
    });
  }

  loadClubs(): void {
    this.clubService.getClubs().subscribe({
      next: (clubs) => {
        this.clubs = clubs;
        this.clubOptions = clubs.map(club => ({
          label: club.clubName,
          value: club
        }));
      },
      error: (error) => {
        console.error('Error loading clubs:', error);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.filterAthletes();
  }

  onClubChange(): void {
    this.filterAthletes();
  }

  filterAthletes(): void {
    this.filteredAthletes = this.athletes.filter(athlete => {
      const matchesSearch = this.searchText === '' ||
        athlete.prenom.toLowerCase().includes(this.searchText.toLowerCase()) ||
        athlete.nom.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesClub = !this.selectedClub || 
        (athlete.club && athlete.club.id === this.selectedClub.id);

      return matchesSearch && matchesClub;
    });
  }

  showDetails(athlete: Athlete): void {
    this.selectedAthlete = athlete;
    this.displayDialog = true;
  }
} 
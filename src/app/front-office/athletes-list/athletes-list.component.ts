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
        // If clubs are already loaded, merge logoUrl into athlete.club
        if (this.clubs.length > 0) {
          this.athletes = data.map(athlete => {
            if (athlete.club) {
              const foundClub = this.clubs.find(c => c.id === athlete.club!.id);
              if (foundClub && (foundClub as Club).logoUrl) {
                (athlete.club as Club).logoUrl = (foundClub as Club).logoUrl;
              }
            }
            return athlete;
          });
        } else {
          this.athletes = data;
        }
        this.filteredAthletes = this.athletes;
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
        // If athletes are already loaded, merge logoUrl into athlete.club
        if (this.athletes.length > 0) {
          this.athletes = this.athletes.map(athlete => {
            if (athlete.club) {
              const foundClub = this.clubs.find(c => c.id === athlete.club!.id);
              if (foundClub && (foundClub as Club).logoUrl) {
                (athlete.club as Club).logoUrl = (foundClub as Club).logoUrl;
              }
            }
            return athlete;
          });
          this.filteredAthletes = this.athletes;
        }
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

  getAthleteBackgroundImage(athlete: Athlete): string {
    // Return the swimmer image URL
    return 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-82726781-1644942021.jpg?crop=0.6433534043538676xw:1xh;center,top&resize=640:*';
  }

  getAthleteBackgroundClass(athlete: Athlete): string {
    // Use unified blue gradient for all cards
    return 'gradient-unified-blue';
  }
} 
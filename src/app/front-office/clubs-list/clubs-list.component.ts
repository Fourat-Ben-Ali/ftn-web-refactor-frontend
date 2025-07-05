import { Component, OnInit } from '@angular/core';
import { Club } from '../../models/club.model';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'app-clubs-list',
  templateUrl: './clubs-list.component.html',
  styleUrls: ['./clubs-list.component.scss']
})
export class ClubsListComponent implements OnInit {
  clubs: Club[] = [];
  filteredClubs: Club[] = [];
  searchText: string = '';
  displayDialog: boolean = false;
  selectedClub: Club | null = null;

  constructor(private clubService: ClubService) {}

  ngOnInit(): void {
    this.loadClubs();
  }

  loadClubs(): void {
    this.clubService.getClubs().subscribe({
      next: (data) => {
        this.clubs = data;
        this.filteredClubs = data;
      },
      error: (error) => {
        console.error('Error loading clubs:', error);
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
    this.filterClubs();
  }

  filterClubs(): void {
    this.filteredClubs = this.clubs.filter(club => {
      return this.searchText === '' ||
        club.clubName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        club.description.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  showDetails(club: Club): void {
    this.selectedClub = club;
    this.displayDialog = true;
  }

  getClubBackgroundImage(club: Club): string {
    // Return the Tunisia national football team image
    return 'https://mrwallpaper.com/images/hd/tunisia-national-football-team-logo-on-red-banner-cvwaa4c2nlhyf57b.jpg';
  }

  getClubBackgroundClass(club: Club): string {
    // Use unified red gradient for all club cards
    return 'gradient-unified-red';
  }
} 
import { Component, OnInit } from '@angular/core';
import { ClubsService } from '../../../../shared/services/clubs.service';
import { clubs } from 'models';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.css',
})
export class ClubsComponent implements OnInit {
  clubs: clubs[] = [];

  constructor(private clubsService: ClubsService) {}
  ngOnInit(): void {
    this.getClubs();
  }

  getClubs() {
    this.clubsService.getAllClubs().subscribe((data) => {
      this.clubs = data
        .map((club) => ({
          ...club,
          clubName: club.clubName.replace(/^\d+\//, ''),
        }))
        .sort((a, b) => a.clubName.localeCompare(b.clubName));
    });
  }
}

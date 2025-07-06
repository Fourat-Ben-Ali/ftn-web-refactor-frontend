import { Component, OnInit } from '@angular/core';
import { ClubsService } from '../../../../shared/services/clubs.service';
import { clubs } from 'models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.css',
  providers: [ConfirmationService]
})
export class ClubsComponent implements OnInit {
  clubs: clubs[] = [];
  filteredClubs: clubs[] = [];
  displayDialog: boolean = false;
  editMode: boolean = false;
  selectedClub: clubs | null = null;
  clubForm: FormGroup;
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private clubsService: ClubsService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.clubForm = this.fb.group({
      clubName: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.getClubs();
  }

  getClubs() {
    this.loading = true;
    this.clubsService.getAllClubs().subscribe((data) => {
      this.clubs = data
        .map((club) => ({
          ...club,
          clubName: club.clubName.replace(/^\d+\//, ''),
        }))
        .sort((a, b) => a.clubName.localeCompare(b.clubName));
      this.filteredClubs = this.clubs;
      this.loading = false;
    });
  }

  onSearch(event: any) {
    const value = event.target.value.toLowerCase();
    this.searchTerm = value;
    this.filteredClubs = this.clubs.filter(club =>
      club.clubName.toLowerCase().includes(value) ||
      (club.description && club.description.toLowerCase().includes(value))
    );
  }

  getTotalClubs(): number {
    return this.clubs.length;
  }

  showAddDialog() {
    this.clubForm.reset();
    this.editMode = false;
    this.selectedClub = null;
    this.displayDialog = true;
  }

  showEditDialog(club: clubs) {
    this.clubForm.patchValue({
      clubName: club.clubName,
      description: club.description
    });
    this.selectedClub = club;
    this.editMode = true;
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.clubForm.reset();
    this.selectedClub = null;
  }

  saveClub() {
    if (this.clubForm.invalid) return;
    const clubData = { ...this.clubForm.value };
    if (this.editMode && this.selectedClub) {
      clubData.id = this.selectedClub.id;
      this.clubsService.updateClub(clubData).subscribe(() => {
        this.getClubs();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Club updated!' });
        this.hideDialog();
      });
    } else {
      this.clubsService.createClub(clubData).subscribe(() => {
        this.getClubs();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Club created!' });
        this.hideDialog();
      });
    }
  }

  confirmDelete(club: clubs) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${club.clubName}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteClub(club.id);
      }
    });
  }

  deleteClub(id: number) {
    this.clubsService.deleteClub(id).subscribe(() => {
      this.getClubs();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Club deleted!' });
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LicenceService } from '../../../../shared/services/licence.service';
import { ClubsService } from '../../../../shared/services/clubs.service';
import { AthleteService } from '../../../../shared/services/athlete.service';
import { Athlete, Licence, clubs } from 'models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-licences',
  templateUrl: './licences.component.html',
  styleUrl: './licences.component.css',
})
export class LicencesComponent implements OnInit {
  licences: Licence[] = [];
  filteredLicences: Licence[] = [];
  athletes: Athlete[] = [];
  clubs: clubs[] = [];
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  licenceForm: FormGroup;
  selectedLicence: Licence | null = null;
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private licenceService: LicenceService,
    private athleteService: AthleteService,
    private clubsService: ClubsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.licenceForm = this.formBuilder.group({
      athleteId: [null, Validators.required],
      clubId: [null, Validators.required],
      valideDepuis: ['', Validators.required],
      valideJusquA: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getLicences();
    this.getAthletes();
    this.getClubs();
  }

  getLicences() {
    this.loading = true;
    this.licenceService.getAllLicences().subscribe((data) => {
      this.licences = data;
      this.filteredLicences = data;
      this.loading = false;
    });
  }

  onSearch(event: any) {
    const value = event.target.value.toLowerCase();
    this.searchTerm = value;
    this.filteredLicences = this.licences.filter(licence =>
      this.getAthleteName(licence.athleteId).toLowerCase().includes(value) ||
      this.getClubName(licence.clubId).toLowerCase().includes(value)
    );
  }

  getTotalLicences(): number {
    return this.licences.length;
  }

  getAthletes() {
    this.athleteService.getAllAthletes().subscribe((data) => {
      this.athletes = data;
    });
  }

  getClubs() {
    this.clubsService.getAllClubs().subscribe((data) => {
      this.clubs = data;
    });
  }

  showAddDialog() {
    this.licenceForm.reset();
    this.displayAddDialog = true;
  }

  showEditDialog(licence: Licence) {
    this.selectedLicence = licence;
    this.licenceForm.patchValue({
      athleteId: licence.athleteId,
      clubId: licence.clubId,
      valideDepuis: new Date(licence.valideDepuis),
      valideJusquA: new Date(licence.valideJusquA)
    });
    this.displayEditDialog = true;
  }

  hideDialog() {
    this.displayAddDialog = false;
    this.displayEditDialog = false;
    this.licenceForm.reset();
    this.selectedLicence = null;
  }

  saveLicence() {
    if (this.licenceForm.valid) {
      const licenceData = this.licenceForm.value;
      
      if (this.displayAddDialog) {
        this.licenceService.createLicence(licenceData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Licence created successfully'
            });
            this.getLicences();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create licence'
            });
            console.error('Error creating licence:', error);
          }
        });
      } else if (this.displayEditDialog && this.selectedLicence) {
        this.licenceService.updateLicence(this.selectedLicence.id, licenceData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Licence updated successfully'
            });
            this.getLicences();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update licence'
            });
            console.error('Error updating licence:', error);
          }
        });
      }
    }
  }

  deleteLicence(id: number) {
    this.licenceService.deleteLicence(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Licence deleted successfully'
        });
        this.getLicences();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete licence'
        });
        console.error('Error deleting licence:', error);
      }
    });
  }

  getAthleteName(athleteId: number): string {
    const athlete = this.athletes.find(a => a.id === athleteId);
    return athlete ? `${athlete.prenom} ${athlete.nom}` : 'Unknown';
  }

  getClubName(clubId: number): string {
    const club = this.clubs.find(c => c.id === clubId);
    return club ? club.clubName : 'Unknown';
  }
} 
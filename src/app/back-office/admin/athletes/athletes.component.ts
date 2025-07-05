import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AthleteService } from '../../../../shared/services/athlete.service';
import { Athlete } from '../../../models/athlete.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-athletes',
  templateUrl: './athletes.component.html',
  styleUrl: './athletes.component.css',
  providers: [ConfirmationService]
})
export class AthletesComponent implements OnInit {
  athletes: Athlete[] = [];
  filteredAthletes: Athlete[] = [];
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  athleteForm: FormGroup;
  selectedAthlete: Athlete | null = null;
  loading: boolean = false;
  first: number = 0;
  totalRecords: number = 0;
  itemsPerPage: number = 12;
  currentFilter: string = 'all';
  private searchSubject = new Subject<string>();

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];

  constructor(
    private athleteService: AthleteService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.athleteForm = this.formBuilder.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      genre: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      nationalite: ['', Validators.required]
    });

    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchAthletes(searchTerm);
    });
  }

  ngOnInit(): void {
    this.getAthletes();
  }

  getAthletes() {
    this.loading = true;
    this.athleteService.getAllAthletes().subscribe({
      next: (data) => {
        this.athletes = data;
        this.filteredAthletes = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm.trim()) {
      this.searchSubject.next(searchTerm);
    } else {
      this.filterAthletes(this.currentFilter);
    }
  }

  searchAthletes(query: string) {
    this.loading = true;
    this.athleteService.searchAthletes(query).subscribe({
      next: (data) => {
        this.filteredAthletes = this.applyFilter(data, this.currentFilter);
        this.totalRecords = this.filteredAthletes.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error searching athletes'
        });
      }
    });
  }

  filterAthletes(filter: string) {
    this.currentFilter = filter;
    this.filteredAthletes = this.applyFilter(this.athletes, filter);
    this.totalRecords = this.filteredAthletes.length;
    this.first = 0; // Reset to first page
  }

  applyFilter(athletes: Athlete[], filter: string): Athlete[] {
    switch (filter) {
      case 'male':
        return athletes.filter(athlete => athlete.genre === 'Male');
      case 'female':
        return athletes.filter(athlete => athlete.genre === 'Female');
      case 'national':
        return athletes.filter(athlete => athlete.equipeNationale);
      default:
        return athletes;
    }
  }

  // Stats calculation methods
  getMaleCount(): number {
    return this.athletes.filter(athlete => athlete.genre === 'Male').length;
  }

  getFemaleCount(): number {
    return this.athletes.filter(athlete => athlete.genre === 'Female').length;
  }

  getTotalMedals(): number {
    return this.athletes.reduce((total, athlete) => {
      const medals = athlete.medals;
      if (medals) {
        return total + (medals.gold || 0) + (medals.silver || 0) + (medals.bronze || 0);
      }
      return total;
    }, 0);
  }



  onPageChange(event: any) {
    this.first = event.first;
    this.itemsPerPage = event.rows;
    // Update total records for pagination
    this.totalRecords = this.filteredAthletes.length;
  }

  trackByAthleteId(index: number, athlete: Athlete): number {
    return athlete.id;
  }

  viewAthleteDetails(athlete: Athlete) {
    // TODO: Implement detailed view dialog
    this.messageService.add({
      severity: 'info',
      summary: 'Athlete Details',
      detail: `Viewing details for ${athlete.prenom} ${athlete.nom}`
    });
  }

  confirmDelete(athlete: Athlete) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${athlete.prenom} ${athlete.nom}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteAthlete(athlete.id);
      }
    });
  }

  showAddDialog() {
    this.athleteForm.reset();
    this.displayAddDialog = true;
  }

  showEditDialog(athlete: Athlete) {
    this.selectedAthlete = athlete;
    this.athleteForm.patchValue({
      prenom: athlete.prenom,
      nom: athlete.nom,
      genre: athlete.genre,
      dateNaissance: new Date(athlete.dateNaissance),
      nationalite: athlete.nationalite
    });
    this.displayEditDialog = true;
  }

  hideDialog() {
    this.displayAddDialog = false;
    this.displayEditDialog = false;
    this.athleteForm.reset();
    this.selectedAthlete = null;
  }

  saveAthlete() {
    if (this.athleteForm.valid) {
      const athleteData = this.athleteForm.value;
      
      if (this.displayAddDialog) {
        this.athleteService.createAthlete(athleteData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Athlete created successfully'
            });
            this.getAthletes();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create athlete'
            });
            console.error('Error creating athlete:', error);
          }
        });
      } else if (this.displayEditDialog && this.selectedAthlete) {
        this.athleteService.updateAthlete(this.selectedAthlete.id, athleteData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Athlete updated successfully'
            });
            this.getAthletes();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update athlete'
            });
            console.error('Error updating athlete:', error);
          }
        });
      }
    }
  }

  deleteAthlete(id: number) {
    this.athleteService.deleteAthlete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Athlete deleted successfully'
        });
        this.getAthletes();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete athlete'
        });
        console.error('Error deleting athlete:', error);
      }
    });
  }
} 
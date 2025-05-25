import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AthleteService } from '../../../../shared/services/athlete.service';
import { Athlete } from 'models';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-athletes',
  templateUrl: './athletes.component.html',
  styleUrl: './athletes.component.css',
})
export class AthletesComponent implements OnInit {
  athletes: Athlete[] = [];
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  athleteForm: FormGroup;
  selectedAthlete: Athlete | null = null;
  loading: boolean = false;
  first: number = 0;
  totalRecords: number = 0;
  private searchSubject = new Subject<string>();

  constructor(
    private athleteService: AthleteService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
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
      this.getAthletes();
    }
  }

  searchAthletes(query: string) {
    this.loading = true;
    this.athleteService.searchAthletes(query).subscribe({
      next: (data) => {
        this.athletes = data;
        this.totalRecords = data.length;
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
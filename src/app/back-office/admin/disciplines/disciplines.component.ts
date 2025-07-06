import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DisciplineService } from '../../../../shared/services/discipline.service';
import { Discipline } from 'models';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrl: './disciplines.component.css',
})
export class DisciplinesComponent implements OnInit {
  disciplines: Discipline[] = [];
  filteredDisciplines: Discipline[] = [];
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  disciplineForm: FormGroup;
  selectedDiscipline: Discipline | null = null;
  loading: boolean = false;
  first: number = 0;
  totalRecords: number = 0;
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private disciplineService: DisciplineService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.disciplineForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: ['', Validators.required]
    });

    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.searchDisciplines(searchTerm);
    });
  }

  ngOnInit(): void {
    this.getDisciplines();
  }

  getDisciplines() {
    this.loading = true;
    this.disciplineService.getAllDisciplines().subscribe({
      next: (data) => {
        this.disciplines = data;
        this.filteredDisciplines = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(event: any) {
    const value = event.target.value.toLowerCase();
    this.searchTerm = value;
    this.filteredDisciplines = this.disciplines.filter(d =>
      d.nom.toLowerCase().includes(value) ||
      (d.description && d.description.toLowerCase().includes(value))
    );
  }

  searchDisciplines(query: string) {
    this.loading = true;
    this.disciplineService.searchDisciplines(query).subscribe({
      next: (data) => {
        this.disciplines = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error searching disciplines'
        });
      }
    });
  }

  showAddDialog() {
    this.disciplineForm.reset();
    this.displayAddDialog = true;
  }

  showEditDialog(discipline: Discipline) {
    this.selectedDiscipline = discipline;
    this.disciplineForm.patchValue({
      nom: discipline.nom,
      description: discipline.description
    });
    this.displayEditDialog = true;
  }

  hideDialog() {
    this.displayAddDialog = false;
    this.displayEditDialog = false;
    this.disciplineForm.reset();
    this.selectedDiscipline = null;
  }

  saveDiscipline() {
    if (this.disciplineForm.valid) {
      const disciplineData = this.disciplineForm.value;
      
      if (this.displayAddDialog) {
        this.disciplineService.createDiscipline(disciplineData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Discipline created successfully'
            });
            this.getDisciplines();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create discipline'
            });
            console.error('Error creating discipline:', error);
          }
        });
      } else if (this.displayEditDialog && this.selectedDiscipline) {
        this.disciplineService.updateDiscipline(this.selectedDiscipline.id, disciplineData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Discipline updated successfully'
            });
            this.getDisciplines();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update discipline'
            });
            console.error('Error updating discipline:', error);
          }
        });
      }
    }
  }

  deleteDiscipline(id: number) {
    this.disciplineService.deleteDiscipline(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Discipline deleted successfully'
        });
        this.getDisciplines();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete discipline'
        });
        console.error('Error deleting discipline:', error);
      }
    });
  }

  getTotalDisciplines(): number {
    return this.disciplines.length;
  }
} 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgrammeFormation, ProgrammeFormationService } from 'app/services/programme-formation.service';
import { StatutPublication } from 'app/shared/models/statut-publication.enum';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-programme-formation',
  templateUrl: './programme-formation.component.html',
  styleUrls: ['./programme-formation.component.scss']
})
export class ProgrammeFormationComponent implements OnInit {
  programmes: ProgrammeFormation[] = [];
  first: number = 0;
  totalRecords: number = 0;
  loading: boolean = false;
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  programmeForm!: FormGroup;
  selectedProgramme: ProgrammeFormation | null = null;
  
  publicationStatuses: { label: string; value: StatutPublication }[] = [
  { label: 'Published', value: StatutPublication.PUBLIE },
  { label: 'Draft', value: StatutPublication.EN_ATTENTE }
];

  private searchSubject = new Subject<string>();

  constructor(
    private programmeService: ProgrammeFormationService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.programmeForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateDebut: [new Date(), Validators.required],
      dateFin: [new Date(), Validators.required],
      statutPublication: [StatutPublication.EN_ATTENTE , Validators.required]
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchProgrammes(query);
    });
  }

  ngOnInit() {
    this.loadProgrammes();
    this.loadStatuses();
  }

  loadProgrammes() {
    this.loading = true;
    this.programmeService.getAllProgrammeFormations().subscribe({
      next: (data) => {
        this.programmes = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load training programs'
        });
        this.loading = false;
      }
    });
  }

loadStatuses() {
  this.programmeService.getAllStatuses().subscribe({
    next: (statuses) => {
      this.publicationStatuses = statuses.map(status => ({
        label: this.getStatusLabel(status),
        value: status
      }));
    },
    error: (error) => {
      console.error('Error loading statuses:', error);
      // fallback to default statuses
      this.publicationStatuses = [
        { label: 'Published', value: StatutPublication.PUBLIE },
        { label: 'Draft', value: StatutPublication.EN_ATTENTE },
        { label: 'Not Published', value: StatutPublication.NON_PUBLIE }
      ];
    }
  });
}
getStatusLabel(status: StatutPublication): string {
  switch (status) {
    case StatutPublication.PUBLIE:
      return 'Published';
    case StatutPublication.EN_ATTENTE:
      return 'Draft';
    case StatutPublication.NON_PUBLIE:
      return 'Not Published';
    default:
      return status;
  }
}
  showAddDialog() {
    this.selectedProgramme = null;
    this.programmeForm.reset({
      dateDebut: new Date(),
      dateFin: new Date(),
      statutPublication: StatutPublication.EN_ATTENTE 
    });
    this.displayAddDialog = true;
  }

  showEditDialog(programme: ProgrammeFormation) {
    this.selectedProgramme = programme;
    this.programmeForm.patchValue({
      titre: programme.titre,
      description: programme.description,
      dateDebut: new Date(programme.dateDebut),
      dateFin: new Date(programme.dateFin),
      statutPublication: programme.statutPublication
    });
    this.displayEditDialog = true;
  }

  hideDialog() {
    this.displayAddDialog = false;
    this.displayEditDialog = false;
    this.programmeForm.reset();
    this.selectedProgramme = null;
  }

  saveProgramme() {
    if (this.programmeForm.valid) {
      const formValue = this.programmeForm.value;
      const programmeData = {
        titre: formValue.titre,
        description: formValue.description,
        dateDebut: formValue.dateDebut instanceof Date ? 
          formValue.dateDebut.toISOString().split('T')[0] : formValue.dateDebut,
        dateFin: formValue.dateFin instanceof Date ? 
          formValue.dateFin.toISOString().split('T')[0] : formValue.dateFin,
        statutPublication: formValue.statutPublication
      };

      if (this.displayAddDialog) {
        this.programmeService.saveProgrammeFormation(programmeData as ProgrammeFormation).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Training program created successfully'
            });
            this.loadProgrammes();
            this.hideDialog();
          },
          error: (error) => {
            console.error('Error creating training program:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create training program'
            });
          }
        });
      } else if (this.displayEditDialog && this.selectedProgramme) {
        const updatedProgramme = {
          ...programmeData,
          id: this.selectedProgramme.id
        };
        
        this.programmeService.updateProgrammeFormation(this.selectedProgramme.id!, updatedProgramme).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Training program updated successfully'
            });
            this.loadProgrammes();
            this.hideDialog();
          },
          error: (error) => {
            console.error('Error updating training program:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update training program'
            });
          }
        });
      }
    } else {
      Object.keys(this.programmeForm.controls).forEach(key => {
        const control = this.programmeForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  deleteProgramme(id: number) {
    if (confirm('Are you sure you want to delete this training program?')) {
      this.programmeService.deleteProgrammeFormation(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Training program deleted successfully'
          });
          this.loadProgrammes();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete training program'
          });
        }
      });
    }
  }

  publishProgramme(id: number) {
    this.programmeService.updateProgrammeStatus(id, StatutPublication.PUBLIE).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Training program published successfully'
        });
        this.loadProgrammes();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to publish training program'
        });
      }
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm.trim()) {
      this.searchSubject.next(searchTerm);
    } else {
      this.loadProgrammes();
    }
  }

  searchProgrammes(query: string) {
    this.loading = true;
    this.programmeService.searchProgrammeFormations(query).subscribe({
      next: (data) => {
        this.programmes = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error searching training programs'
        });
      }
    });
  }
}

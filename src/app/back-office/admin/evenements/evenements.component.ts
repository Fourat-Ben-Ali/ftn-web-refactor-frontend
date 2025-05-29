import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Discipline, Evenement, TypeEvenement } from 'models';
import { EvenementService } from 'shared/services/evenement.service';
import { DisciplineService } from 'shared/services/discipline.service';

@Component({
  selector: 'app-evenements',
  templateUrl: './evenements.component.html',
  styleUrl: './evenements.component.css'
})
export class EvenementsComponent implements OnInit {
  evenements: Evenement[] = [];
  disciplines: Discipline[] = [];
  typeEvenements = Object.values(TypeEvenement);
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  evenementForm: FormGroup;
  selectedEvenement: Evenement | null = null;
  loading: boolean = false;
  first: number = 0;
  totalRecords: number = 0;

  constructor(
    private evenementService: EvenementService,
    private disciplineService: DisciplineService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.evenementForm = this.formBuilder.group({
      titre: ['', Validators.required],
      date: [null, Validators.required],
      description: ['', Validators.required],
      typeEvenement: ['', Validators.required],
      discipline: [null]
    });
  }

  ngOnInit(): void {
    this.loadEvenements();
    this.loadDisciplines();
  }

  loadEvenements(): void {
    this.loading = true;
    this.evenementService.getAllEvenements().subscribe({
      next: (data) => {
        this.evenements = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des événements:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des événements'
        });
      }
    });
  }

  loadDisciplines(): void {
    this.disciplineService.getAllDisciplines().subscribe({
      next: (data) => {
        this.disciplines = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des disciplines:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des disciplines'
        });
      }
    });
  }

  showAddDialog(): void {
    this.evenementForm.reset();
    this.displayAddDialog = true;
    this.displayEditDialog = false;
    this.selectedEvenement = null;
  }

  showEditDialog(evenement: Evenement): void {
    this.selectedEvenement = evenement;
    this.evenementForm.patchValue({
      titre: evenement.titre,
      date: new Date(evenement.date),
      description: evenement.description,
      typeEvenement: evenement.typeEvenement,
      discipline: evenement.discipline
    });
    this.displayEditDialog = true;
    this.displayAddDialog = false;
  }

  hideDialog(): void {
    this.displayAddDialog = false;
    this.displayEditDialog = false;
    this.evenementForm.reset();
    this.selectedEvenement = null;
  }

  saveEvenement() {
    if (this.evenementForm.valid) {
      const formValue = this.evenementForm.value;
      const evenementData = {
        titre: formValue.titre,
        date: formValue.date instanceof Date ? 
          formValue.date.toISOString().split('T')[0] : formValue.date,
        description: formValue.description,
        typeEvenement: formValue.typeEvenement,
        discipline: formValue.discipline
      };

      if (this.displayAddDialog) {
        this.evenementService.createEvenement(evenementData as Evenement).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Événement créé avec succès'
            });
            this.loadEvenements();
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la création'
            });
          }
        });
      } else if (this.displayEditDialog && this.selectedEvenement) {
        const updatedEvenement = {
          ...evenementData,
          id: this.selectedEvenement.id
        };
        
        this.evenementService.updateEvenement(this.selectedEvenement.id!, updatedEvenement).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Événement mis à jour avec succès'
            });
            this.loadEvenements();
            this.hideDialog();
          },
          error: (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour'
            });
          }
        });
      }
    } else {
      Object.keys(this.evenementForm.controls).forEach(key => {
        const control = this.evenementForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  deleteEvenement(evenement: Evenement): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.evenementService.deleteEvenement(evenement.id!).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Événement supprimé avec succès'
          });
          this.loadEvenements();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Erreur lors de la suppression'
          });
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Discipline, Evenement, TypeEvenement } from 'models';
import { EvenementService } from 'shared/services/evenement.service';
import { DisciplineService } from 'shared/services/discipline.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-evenements',
  templateUrl: './evenements.component.html',
  styleUrls: ['./evenements.component.scss']
})
export class EvenementsComponent implements OnInit {
  evenements: Evenement[] = [];
  filteredEvenements: Evenement[] = [];
  disciplines: Discipline[] = [];
  typeEvenements = Object.values(TypeEvenement);
  displayDialog: boolean = false;
  editMode: boolean = false;
  evenementForm: FormGroup;
  selectedEvenement: Evenement | null = null;
  loading: boolean = false;
  first: number = 0;
  totalRecords: number = 0;
  searchTitle: string = '';

  constructor(
    private evenementService: EvenementService,
    private disciplineService: DisciplineService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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
        this.filteredEvenements = data;
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

  applyFilters(): void {
    const search = this.searchTitle.trim().toLowerCase();
    if (!search) {
      this.filteredEvenements = this.evenements;
      return;
    }
    this.filteredEvenements = this.evenements.filter(evenement =>
      evenement.titre && evenement.titre.toLowerCase().includes(search)
    );
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
    this.editMode = false;
    this.selectedEvenement = null;
    this.displayDialog = true;
  }

  showEditDialog(evenement: Evenement): void {
    this.evenementForm.patchValue({
      titre: evenement.titre,
      date: evenement.date,
      description: evenement.description,
      typeEvenement: evenement.typeEvenement,
      discipline: evenement.discipline
    });
    this.selectedEvenement = evenement;
    this.editMode = true;
    this.displayDialog = true;
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.evenementForm.reset();
    this.selectedEvenement = null;
    this.editMode = false;
  }

  saveEvenement() {
    if (this.evenementForm.invalid) return;
    let evenementData: any = { ...this.evenementForm.value };
    if (this.editMode && this.selectedEvenement) {
      evenementData = { ...evenementData, id: this.selectedEvenement.id };
      this.evenementService.updateEvenement(evenementData.id, evenementData as Evenement).subscribe(() => {
        this.loadEvenements();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Event updated!' });
        this.hideDialog();
      });
    } else {
      this.evenementService.createEvenement(evenementData as Evenement).subscribe(() => {
        this.loadEvenements();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Event created!' });
        this.hideDialog();
      });
    }
  }

  deleteEvenement(evenement: Evenement): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${evenement.titre}?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
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
    });
  }
}

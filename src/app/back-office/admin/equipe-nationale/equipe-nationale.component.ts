import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipeNationaleService } from '../../../../shared/services/equipe-nationale.service';
import { DisciplineService } from '../../../../shared/services/discipline.service';
import { Discipline, EquipeNationale } from 'models';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-equipe-nationale',
  templateUrl: './equipe-nationale.component.html',
  styleUrl: './equipe-nationale.component.css',
})
export class EquipeNationaleComponent implements OnInit {
  equipes: EquipeNationale[] = [];
  disciplines: Discipline[] = [];
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  equipeForm: FormGroup;
  selectedEquipe: EquipeNationale | null = null;

  constructor(
    private equipeService: EquipeNationaleService,
    private disciplineService: DisciplineService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.equipeForm = this.formBuilder.group({
      nom: ['', Validators.required],
      disciplineId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getEquipes();
    this.getDisciplines();
  }

  getEquipes() {
    this.equipeService.getAllEquipesNationales().subscribe((data) => {
      this.equipes = data;
    });
  }

  getDisciplines() {
    this.disciplineService.getAllDisciplines().subscribe((data) => {
      this.disciplines = data;
    });
  }

  showAddDialog() {
    this.equipeForm.reset();
    this.displayAddDialog = true;
  }

  showEditDialog(equipe: EquipeNationale) {
    this.selectedEquipe = equipe;
    this.equipeForm.patchValue({
      nom: equipe.nom,
      disciplineId: equipe.discipline?.id
    });
    this.displayEditDialog = true;
  }

  hideDialog() {
    this.displayAddDialog = false;
    this.displayEditDialog = false;
    this.equipeForm.reset();
    this.selectedEquipe = null;
  }

  saveEquipe() {
    if (this.equipeForm.valid) {
      const formValue = this.equipeForm.value;
      const equipeData: EquipeNationale = {
        nom: formValue.nom,
        discipline: {
          id: formValue.disciplineId,
          nom: this.disciplines.find(d => d.id === formValue.disciplineId)?.nom || '',
          description: this.disciplines.find(d => d.id === formValue.disciplineId)?.description || ''
        }
      };
      
      if (this.displayAddDialog) {
        this.equipeService.createEquipeNationale(equipeData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'National Team created successfully'
            });
            this.getEquipes();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create National Team'
            });
            console.error('Error creating National Team:', error);
          }
        });
      } else if (this.displayEditDialog && this.selectedEquipe && this.selectedEquipe.id) {
        const updateData: EquipeNationale = {
          ...equipeData,
          id: this.selectedEquipe.id
        };
        
        this.equipeService.updateEquipeNationale(this.selectedEquipe.id, updateData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'National Team updated successfully'
            });
            this.getEquipes();
            this.hideDialog();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update National Team'
            });
            console.error('Error updating National Team:', error);
          }
        });
      }
    }
  }

  deleteEquipe(id: number) {
    this.equipeService.deleteEquipeNationale(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'National Team deleted successfully'
        });
        this.getEquipes();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete National Team'
        });
        console.error('Error deleting National Team:', error);
      }
    });
  }
} 
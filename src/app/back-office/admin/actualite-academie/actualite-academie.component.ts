import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActualiteAcademie, ActualiteAcademieService } from 'app/services/actualite-academie.service';
import { StatutPublication } from 'app/shared/models/statut-publication.enum';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthenticationService } from 'shared/services/authentication.service';

@Component({
  selector: 'app-actualite-academie',
  templateUrl: './actualite-academie.component.html',
  styleUrls: ['./actualite-academie.component.css']
})
export class ActualiteAcademieComponent implements OnInit {
  actualites: ActualiteAcademie[] = [];
  first: number = 0;
  totalRecords: number = 0;
  loading: boolean = false;
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  actualiteForm!: FormGroup;
  selectedActualite: ActualiteAcademie | null = null;
  
  publicationStatuses: { label: string; value: StatutPublication }[] = [
    { label: 'Published', value: StatutPublication.PUBLIE },
    { label: 'Draft', value: StatutPublication. EN_ATTENTE}
  ];

  private searchSubject = new Subject<string>();

  constructor(
    private actualiteService: ActualiteAcademieService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.actualiteForm = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      contenu: ['', [Validators.required, Validators.minLength(10)]],
      datePublication: [new Date(), Validators.required],
      statutPublication: [StatutPublication. EN_ATTENTE, Validators.required]
    });

    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchActualites(query);
    });
  }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return;
    }
    this.loadActualites();
    this.loadStatuses();
  }

  loadActualites() {
    this.loading = true;
    this.actualiteService.getAllActualiteAcademies().subscribe({
      next: (data: ActualiteAcademie[]) => {
        this.actualites = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.loading = false;
      }
    });
  }

loadStatuses() {
 this.actualiteService.getActualitesByStatut(StatutPublication.PUBLIE).subscribe({
  next: (actualites) => {
    this.actualites = actualites;
  },
  error: (error) => {
    console.error('Error loading actualites by statut:', error);
  }
});
}


  showAddDialog() {
    this.selectedActualite = null;
    this.actualiteForm.reset({
      datePublication: new Date(),
      statutPublication: StatutPublication.EN_ATTENTE
    });
    this.displayAddDialog = true;
  }

  showEditDialog(actualite: ActualiteAcademie) {
    this.selectedActualite = actualite;
    this.actualiteForm.patchValue({
      titre: actualite.titre,
      contenu: actualite.contenu,
      datePublication: new Date(actualite.datePublication),
      statutPublication: actualite.statutPublication
    });
    this.displayEditDialog = true;
  }

  hideDialog() {
    this.displayAddDialog = false;
    this.displayEditDialog = false;
    this.actualiteForm.reset();
    this.selectedActualite = null;
  }
  

  saveActualite() {
    if (this.actualiteForm.valid) {
      const formValue = this.actualiteForm.value;
      const actualiteData = {
        titre: formValue.titre,
        contenu: formValue.contenu,
        datePublication: formValue.datePublication instanceof Date ? 
          formValue.datePublication.toISOString().split('T')[0] : formValue.datePublication,
        statutPublication: formValue.statutPublication
      };

      if (this.displayAddDialog) {
        this.actualiteService.createActualite(actualiteData as ActualiteAcademie).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'News created successfully'
            });
            this.loadActualites();
            this.hideDialog();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else if (this.displayEditDialog && this.selectedActualite) {
        const updatedActualite = {
          ...actualiteData,
          id: this.selectedActualite.id
        };
        
        this.actualiteService.updateActualite(this.selectedActualite.id!, updatedActualite).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'News updated successfully'
            });
            this.loadActualites();
            this.hideDialog();
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    }
  }

  deleteActualite(id: number) {
    if (confirm('Are you sure you want to delete this news item?')) {
      this.actualiteService.deleteActualite(id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'News deleted successfully'
          });
          this.loadActualites();
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  publishActualite(id: number) {
    this.actualiteService.publishActualite(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'News published successfully'
        });
        this.loadActualites();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm.trim()) {
      this.searchSubject.next(searchTerm);
    } else {
      this.loadActualites();
    }
  }

  searchActualites(query: string) {
    this.loading = true;
    this.actualiteService.searchActualites(query).subscribe({
      next: (data: ActualiteAcademie[]) => {
        this.actualites = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.handleError(error);
      }
    });
  }

  private handleError(error: any) {
    console.error('Error:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occurred while processing your request'
    });
  }
}
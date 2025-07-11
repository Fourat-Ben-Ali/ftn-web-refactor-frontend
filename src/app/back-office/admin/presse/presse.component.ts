import { Component, OnInit } from '@angular/core';
import { PresseService } from 'shared/services/presse.service.ts.service';
import { ContenuPresse } from 'shared/models/DTO/contenu-presseDTO.model';

@Component({
  selector: 'app-presse',
  templateUrl: './presse.component.html',
  styleUrl: './presse.component.css'
})
export class PresseComponent implements OnInit {
  contenus: ContenuPresse[] = [];
  nouveauContenu: ContenuPresse = {
    titre: '',
    type: 'COMMUNIQUE',
    contenu: '',
    datePublication: ''
  };
  edition: boolean = false;
  contenuEnEdition?: ContenuPresse;

  // Popup logic
  popupVisible: boolean = false;
  articleSelectionne?: ContenuPresse;

  typesPresse: Array<'COMMUNIQUE' | 'DOCUMENT'> = ['COMMUNIQUE', 'DOCUMENT'];

  constructor(private presseService: PresseService) {}

  ngOnInit(): void {
    this.chargerContenus();
  }

  chargerContenus() {
    this.presseService.getAll().subscribe(data => this.contenus = data);
  }

  ajouterContenu() {
    if (!this.nouveauContenu.titre || !this.nouveauContenu.type || !this.nouveauContenu.contenu || !this.nouveauContenu.datePublication) return;
    // Correction : s'assurer que la date est bien au format 'YYYY-MM-DD'
    const contenuToSend = {
      ...this.nouveauContenu,
      datePublication: this.nouveauContenu.datePublication.substring(0, 10)
    };
    this.presseService.add(contenuToSend).subscribe(() => {
      this.chargerContenus();
      this.nouveauContenu = { titre: '', type: 'COMMUNIQUE', contenu: '', datePublication: '' };
    });
  }

  supprimerContenu(id: number | undefined) {
    if (!id) return;
    this.presseService.delete(id).subscribe(() => this.chargerContenus());
  }

  preparerEdition(contenu: ContenuPresse) {
    this.edition = true;
    this.contenuEnEdition = { ...contenu };
  }

  annulerEdition() {
    this.edition = false;
    this.contenuEnEdition = undefined;
  }

  validerEdition() {
    if (!this.contenuEnEdition || !this.contenuEnEdition.id) return;
    // Correction : s'assurer que la date est bien au format 'YYYY-MM-DD' lors de l'édition
    const contenuToSend = {
      ...this.contenuEnEdition,
      datePublication: this.contenuEnEdition.datePublication.substring(0, 10)
    };
    this.presseService.update(this.contenuEnEdition.id, contenuToSend).subscribe(() => {
      this.chargerContenus();
      this.annulerEdition();
    });
  }

  // Method to open popup with selected article
  ouvrirPopup(contenu: ContenuPresse) {
    this.articleSelectionne = contenu;
    this.popupVisible = true;
  }

  // Method to close popup
  fermerPopup() {
    this.popupVisible = false;
    this.articleSelectionne = undefined;
  }
} 

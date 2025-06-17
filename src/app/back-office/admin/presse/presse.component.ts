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
    type: 'ARTICLE',
    contenu: '',
    datePublication: ''
  };
  edition: boolean = false;
  contenuEnEdition?: ContenuPresse;

  constructor(private presseService: PresseService) {}

  ngOnInit(): void {
    this.chargerContenus();
  }

  chargerContenus() {
    this.presseService.getAll().subscribe(data => this.contenus = data);
  }

  ajouterContenu() {
    if (!this.nouveauContenu.titre || !this.nouveauContenu.type || !this.nouveauContenu.contenu || !this.nouveauContenu.datePublication) return;
    this.presseService.add(this.nouveauContenu).subscribe(() => {
      this.chargerContenus();
      this.nouveauContenu = { titre: '', type: 'ARTICLE', contenu: '', datePublication: '' };
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
    this.presseService.update(this.contenuEnEdition.id, this.contenuEnEdition).subscribe(() => {
      this.chargerContenus();
      this.annulerEdition();
    });
  }
} 

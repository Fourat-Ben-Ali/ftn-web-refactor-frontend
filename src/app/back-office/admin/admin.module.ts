import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin.component';
import { TableModule } from 'primeng/table';
import { ClubsComponent } from './clubs/clubs.component';
import { AthletesComponent } from './athletes/athletes.component';
import { DisciplinesComponent } from './disciplines/disciplines.component';
import { EquipeNationaleComponent } from './equipe-nationale/equipe-nationale.component';
import { LicencesComponent } from './licences/licences.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent, 
    AdminComponent, 
    ClubsComponent,
    AthletesComponent,
    DisciplinesComponent,
    EquipeNationaleComponent,
    LicencesComponent
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModule, TableModule],
})
export class AdminModule {}

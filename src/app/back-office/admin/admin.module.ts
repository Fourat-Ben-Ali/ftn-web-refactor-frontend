import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
import { ProgrammeFormationComponent } from './programme-formation/programme-formation.component';
import { ActualiteAcademieComponent } from './actualite-academie/actualite-academie.component';

// PrimeNG Modules
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    HomeComponent, 
    AdminComponent, 
    ClubsComponent,
    AthletesComponent,
    DisciplinesComponent,
    EquipeNationaleComponent,
    LicencesComponent,
    ProgrammeFormationComponent,
    ActualiteAcademieComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    TableModule,
    ReactiveFormsModule,
    HttpClientModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    TagModule,
    TooltipModule
  ],
  providers: [
    MessageService
  ]
})
export class AdminModule {}

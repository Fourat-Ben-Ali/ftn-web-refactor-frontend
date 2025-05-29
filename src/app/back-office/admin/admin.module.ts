import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
import { ClubsComponent } from './clubs/clubs.component';
import { AthletesComponent } from './athletes/athletes.component';
import { DisciplinesComponent } from './disciplines/disciplines.component';
import { EquipeNationaleComponent } from './equipe-nationale/equipe-nationale.component';
import { LicencesComponent } from './licences/licences.component';
import { ActualiteAcademieComponent } from './actualite-academie/actualite-academie.component';
import { ProgrammeFormationComponent } from './programme-formation/programme-formation.component';
import { EvenementsComponent } from './evenements/evenements.component';
import { SharedModule } from '../../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AdminComponent,
    HomeComponent,
    ClubsComponent,
    AthletesComponent,
    DisciplinesComponent,
    EquipeNationaleComponent,
    LicencesComponent,
    ActualiteAcademieComponent,
    ProgrammeFormationComponent,
    EvenementsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MessageService]
})
export class AdminModule { }

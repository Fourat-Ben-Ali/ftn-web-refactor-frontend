import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from './services/breadcrumb.service';
import { ButtonComponent } from './components/UI/button/button.component';
import { ButtonModule } from 'primeng/button';
import { ClubsService } from './services/clubs.service';
import { AthleteService } from './services/athlete.service';
import { DisciplineService } from './services/discipline.service';
import { EquipeNationaleService } from './services/equipe-nationale.service';
import { LicenceService } from './services/licence.service';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InputFieldComponent } from './components/UI/input-field/input-field.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableComponent } from './components/table/table.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { AuthenticationService } from './services/authentication.service';
import { AuthInterceptor } from 'app/core/interceptors/auth.interceptor';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MessageService } from 'primeng/api';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ActualiteAcademieService } from 'app/services/actualite-academie.service';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    ButtonComponent,
    InputFieldComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    NotFoundComponent,
  ],
  imports: [
    ButtonModule,
    CalendarModule,
    CommonModule,
    DialogModule,
    DropdownModule,
    HttpClientModule,
    InputTextModule,
    InputTextareaModule,
    PaginatorModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    TooltipModule,
    SplitButtonModule,
  ],
  exports: [
    BreadcrumbComponent,
    ButtonModule,
    ButtonComponent,
    CalendarModule,
    DialogModule,
    DropdownModule,
    InputFieldComponent,
    InputTextModule,
    InputTextareaModule,
    NavbarComponent,
    ReactiveFormsModule,
    SidebarComponent,
    TableComponent,
    NotFoundComponent,
  ],
  providers: [
    BreadcrumbService,
    ClubsService,
    AthleteService,
    DisciplineService,
    EquipeNationaleService,
    LicenceService,
    AuthenticationService,
    ActualiteAcademieService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}

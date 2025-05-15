import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from './services/breadcrumb.service';
import { ButtonComponent } from './components/UI/button/button.component';
import { ButtonModule } from 'primeng/button';
import { ClubsService } from './services/clubs.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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

@NgModule({
  declarations: [
    BreadcrumbComponent,
    ButtonComponent,
    InputFieldComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    TooltipModule,
    PaginatorModule,
  ],
  exports: [
    BreadcrumbComponent,
    ButtonComponent,
    InputFieldComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
  ],
  providers: [BreadcrumbService, ClubsService, AuthenticationService],
})
@NgModule()
export class SharedModule {}

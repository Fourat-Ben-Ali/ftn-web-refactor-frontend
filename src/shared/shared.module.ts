import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbService } from './services/breadcrumb.service';
import { ButtonComponent } from './components/UI/button/button.component';
import { ButtonModule } from 'primeng/button';
import { ClubsService } from './services/clubs.service';
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
    CommonModule,
    HttpClientModule,
    PaginatorModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    TooltipModule,
    SplitButtonModule,
  ],
  exports: [
    BreadcrumbComponent,
    ButtonComponent,
    InputFieldComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    NotFoundComponent,
  ],
  providers: [
    BreadcrumbService,
    ClubsService,
    AuthenticationService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
@NgModule()
export class SharedModule {}

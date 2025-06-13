import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrontOfficeComponent } from './front-office.component';
import { AthletesListComponent } from './athletes-list/athletes-list.component';
import { ClubsListComponent } from './clubs-list/clubs-list.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FrontOfficeRoutingModule } from './front-office-routing.module';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [
    FrontOfficeComponent,
    AthletesListComponent,
    ClubsListComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FrontOfficeRoutingModule,
    // PrimeNG modules
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    MenubarModule,
    PasswordModule,
    ToastModule,
    TableModule
  ]
})
export class FrontOfficeModule { }

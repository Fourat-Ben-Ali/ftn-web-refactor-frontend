import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import { AthletesListComponent } from './athletes-list/athletes-list.component';
import { ClubsListComponent } from './clubs-list/clubs-list.component';
import { PoolReservationsComponent } from './pool-reservations/pool-reservations.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FrontOfficeComponent,
    children: [
      { path: 'athletes', component: AthletesListComponent, canActivate: [AuthGuard] },
      { path: 'clubs', component: ClubsListComponent, canActivate: [AuthGuard] },
      { path: 'pool-reservations', component: PoolReservationsComponent, canActivate: [AuthGuard] },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }

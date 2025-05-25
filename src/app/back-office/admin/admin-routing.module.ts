import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin.component';
import { ClubsComponent } from './clubs/clubs.component';
import { AthletesComponent } from './athletes/athletes.component';
import { DisciplinesComponent } from './disciplines/disciplines.component';
import { EquipeNationaleComponent } from './equipe-nationale/equipe-nationale.component';
import { LicencesComponent } from './licences/licences.component';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'' , 
  component:AdminComponent,
  data: { breadcrumb: 'Admin', icon: 'pi pi-user' },
  children:[
    {path:'home', component:HomeComponent, data: { breadcrumb: 'Dashboard', icon: 'pi pi-chart-bar'}},
    {path:'clubs', component:ClubsComponent, data: { breadcrumb: 'Clubs list', icon: 'pi pi-building'}},
    {path:'athletes', component:AthletesComponent, data: { breadcrumb: 'Athletes list', icon: 'pi pi-users'}},
    {path:'disciplines', component:DisciplinesComponent, data: { breadcrumb: 'Disciplines list', icon: 'pi pi-list'}},
    {path:'equipe-nationale', component:EquipeNationaleComponent, data: { breadcrumb: 'National Teams', icon: 'pi pi-flag'}},
    {path:'licences', component:LicencesComponent, data: { breadcrumb: 'Licences list', icon: 'pi pi-id-card'}}
  ]  
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

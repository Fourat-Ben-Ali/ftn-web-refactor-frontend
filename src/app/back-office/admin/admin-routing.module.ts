import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin.component';
import { ClubsComponent } from './clubs/clubs.component';
import { AthletesComponent } from './athletes/athletes.component';
import { DisciplinesComponent } from './disciplines/disciplines.component';
import { EquipeNationaleComponent } from './equipe-nationale/equipe-nationale.component';
import { LicencesComponent } from './licences/licences.component';
<<<<<<< Updated upstream
import { ActualiteAcademieComponent } from './actualite-academie/actualite-academie.component';
import { ProgrammeFormationComponent } from './programme-formation/programme-formation.component';
import { EvenementsComponent } from './evenements/evenements.component';
import { authGuard } from 'app/core/guards/auth.guard';
import { roleGuard } from 'app/core/guards/role.guard';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {
    path:'',
    component: AdminComponent,
    canActivate: [authGuard],
    data: { 
      breadcrumb: 'Admin', 
      icon: 'pi pi-user',
      roles: ['ADMIN']
    },
    children:[
      {
        path:'home', 
        component: HomeComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'Dashboard', 
          icon: 'pi pi-chart-bar',
          roles: ['ADMIN']
        }
      },
      {
        path:'clubs', 
        component: ClubsComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'Clubs list', 
          icon: 'pi pi-building',
          roles: ['ADMIN']
        }
      },
      {
        path:'athletes', 
        component: AthletesComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'Athletes list', 
          icon: 'pi pi-users',
          roles: ['ADMIN']
        }
      },
      {
        path:'disciplines', 
        component: DisciplinesComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'Disciplines list', 
          icon: 'pi pi-list',
          roles: ['ADMIN']
        }
      },
      {
        path:'equipe-nationale', 
        component: EquipeNationaleComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'National Teams', 
          icon: 'pi pi-flag',
          roles: ['ADMIN']
        }
      },
      {
        path:'licences', 
        component: LicencesComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'Licences list', 
          icon: 'pi pi-id-card',
          roles: ['ADMIN']
        }
      },
      {
        path:'actualite-academie', 
        component: ActualiteAcademieComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'Academy News', 
          icon: 'pi pi-bell',
          roles: ['ADMIN']
        }
      },
      {
        path:'programme-formation', 
        component: ProgrammeFormationComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'Training Programs', 
          icon: 'pi pi-calendar',
          roles: ['ADMIN']
        }
      },
      {
        path:'evenements', 
        component: EvenementsComponent, 
        canActivate: [roleGuard],
        data: { 
          breadcrumb: 'Liste des événements', 
          icon: 'pi pi-calendar',
          roles: ['ADMIN']
        }
      }
    ]
  }
=======
import { PresseComponent } from './presse/presse.component';

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
    {path:'licences', component:LicencesComponent, data: { breadcrumb: 'Licences list', icon: 'pi pi-id-card'}},
     {path:'presse', component:PresseComponent, data: { breadcrumb: 'Presse list', icon: 'pi pi-id-card'}}
  ]  
},
>>>>>>> Stashed changes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

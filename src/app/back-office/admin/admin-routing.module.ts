import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin.component';
import { ClubsComponent } from './clubs/clubs.component';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'' , 
  component:AdminComponent,
  data: { breadcrumb: 'Admin', icon: 'pi pi-user' },
  children:[
    {path:'home', component:HomeComponent ,  data: { breadcrumb: 'Accueil' , icon: 'pi pi-home'},},
    {path:'clubs', component:ClubsComponent ,  data: { breadcrumb: 'Liste des clubs' , icon: 'pi pi-building'}}
  ]  
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

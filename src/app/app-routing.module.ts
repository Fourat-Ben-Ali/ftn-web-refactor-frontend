import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'back-office',
    loadChildren: () =>
      import('./back-office/back-office.module').then(
        (m) => m.BackOfficeModule
      ),
  },
  {
    path: 'front-office',
    loadChildren: () =>
      import('./front-office/front-office.module').then(
        (m) => m.FrontOfficeModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'front-office',
    loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule)
  },
  {
    path: '',
    redirectTo: 'front-office',
    pathMatch: 'full'
  },
  {
    path: 'back-office',
    loadChildren: () =>
      import('./back-office/back-office.module').then(
        (m) => m.BackOfficeModule
      ),
      canActivate: [authGuard],
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

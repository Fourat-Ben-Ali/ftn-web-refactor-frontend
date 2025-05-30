import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from 'shared/services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  } else router.navigate(['/auth/login']);
  return false;
};

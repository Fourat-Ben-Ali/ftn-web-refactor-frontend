import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from 'shared/services/authentication.service';
import { TokenService } from 'shared/services/token.service';

export const roleGuard: CanActivateFn = (route) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const userRoles: string[] =tokenService.getRoles();

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles) {
    return false;
  }
  const hasRole = requiredRoles.some(role => userRoles.includes(role));
  return hasRole ? true : router.parseUrl('/unauthorized');


};

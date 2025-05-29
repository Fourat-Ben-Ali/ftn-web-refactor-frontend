import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from 'shared/services/token.service';

export const roleGuard: CanActivateFn = (route) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  
  const userRoles = tokenService.getRoles();
  const requiredRoles = route.data['roles'] as Array<string>;

  console.log('Role Guard - Checking route:', route.url);
  console.log('Role Guard - Required roles:', requiredRoles);
  console.log('Role Guard - User roles:', userRoles);

  if (!requiredRoles || requiredRoles.length === 0) {
    console.error('Role Guard - No required roles specified for route');
    return router.parseUrl('/unauthorized');
  }

  if (!userRoles || userRoles.length === 0) {
    console.error('Role Guard - No user roles found in token');
    return router.parseUrl('/auth');
  }

  const hasRole = requiredRoles.some(role => 
    userRoles.some(userRole => {
      const matches = userRole.toUpperCase() === role.toUpperCase();
      console.log(`Role Guard - Comparing ${userRole} with ${role}: ${matches}`);
      return matches;
    })
  );

  if (!hasRole) {
    console.error('Role Guard - User does not have required roles. Required:', requiredRoles, 'Has:', userRoles);
    return router.parseUrl('/unauthorized');
  }

  console.log('Role Guard - Access granted');
  return true;
};

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/login-auth/auth.service';

export const homeGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (!inject(AuthService).isLoggedOut()) {
    inject(Router).navigate(['/home-page']);
  } else {
    false;
  }
  return true;
};

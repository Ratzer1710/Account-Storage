import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const setupGuard: CanActivateFn = async (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isActive = await authService.isActive();
  if (isActive) {
    router.navigate(['']);
    return false;
  }
  return true;
};

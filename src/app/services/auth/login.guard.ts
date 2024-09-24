import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = async (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  const isActive = await authService.isActive();
  if (!isActive) {
    router.navigate(['setup']);
    return false;
  }
  return isActive;
};

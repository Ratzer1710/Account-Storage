import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isLogged$.pipe(
    map((isLogged: boolean) => {
      if (!isLogged) {
        router.navigate(['login']);
        return false;
      }

      return isLogged;
    }),
    catchError(() => {
      router.navigate(['login']);
      return of(false);
    })
  );
};

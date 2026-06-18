import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const anonGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    if (state.url.includes('login') || state.url === '/') {
      return router.navigate(['/admin/users']);
    }
    return true;
  }

  return true;
};

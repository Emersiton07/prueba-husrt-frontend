import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import Swal from 'sweetalert2';
import { isTokenExpired, getDecodedAccessToken } from './utilidades';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (!isTokenExpired()) {
    return true;
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Sesion Expirada',
      text: 'Ha llegado al límite de tiempo de sesión activa.'
    })
    router.navigate(['/login']);
    return false;
  }
};

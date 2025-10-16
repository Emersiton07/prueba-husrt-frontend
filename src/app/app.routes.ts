import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { Login } from './Components/login/login'
import { Superadmin } from './Components/home/superadmin/superadmin';


export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {path: 'login', component: Login},
  {path: 'superadmin', component: Superadmin, canActivate: [authGuard]},
];

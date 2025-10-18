import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';
import { Login } from './Components/login/login'
import { Superadmin } from './Components/home/superadmin/superadmin';
import { EquiposListaComponent } from './Components/equipos-lista/equipos-lista.component';
import { EquiposNuevoComponent } from './Components/equipos-nuevo/equipos-nuevo.component';
import { CheckreportComponent } from './Components/checkreport/checkreport.component';


export const routes: Routes = [
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {path: 'login', component: Login},
  {path: 'superadmin', component: Superadmin, canActivate: [authGuard]},
  {path: 'equipos', component: EquiposListaComponent},
  {path: 'equipos-nuevo', component: EquiposNuevoComponent},
  {path: 'reportes', component: CheckreportComponent},
];

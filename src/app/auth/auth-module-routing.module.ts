import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { homeGuard } from '../guard/home-guard/home-guard.guard';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [homeGuard],

  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [homeGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [homeGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthModuleRoutingModule { }

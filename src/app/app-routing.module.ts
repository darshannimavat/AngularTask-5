import { authGuard } from './guard/login-guard/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AdminHomeComponent } from './home/admin/admin-home/admin-home.component';
import { UserHomeComponent } from './home/user-home/user-home.component';
import { AllJobsComponent } from './home/admin/all-jobs/all-jobs.component';
import { PendingJobsComponent } from './home/admin/pending-jobs/pending-jobs.component';
import { CompanyHomeComponent } from './home/company/company-home.component';
import { HomeComponent } from './home/dashboard/home.component';

const routes: Routes = [
  {
    path: 'company-home',
    component: CompanyHomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin-home',
    component: AdminHomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user-home',
    component: UserHomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'home-page',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: PendingJobsComponent,
      },
      {
        path: 'all-jobs',
        component: AllJobsComponent,
      },
      {
        path: 'pending-jobs',
        component: PendingJobsComponent,
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

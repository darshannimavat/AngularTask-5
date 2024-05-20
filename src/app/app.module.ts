import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { AdminHomeComponent } from './home/admin/admin-home/admin-home.component';
import { UserHomeComponent } from './home/user-home/user-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PendingJobsComponent } from './home/admin/pending-jobs/pending-jobs.component';
import { AllJobsComponent } from './home/admin/all-jobs/all-jobs.component';
import { CompanyHomeComponent } from './home/company/company-home.component';
import { TotalDaysPipe } from './pipes/convert-day-pipe/total-days.pipe';
import { HomeComponent } from './home/dashboard/home.component';
import { AuthModuleModule } from './auth/auth-module.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { JobComponent } from './components/job/job.component';


@NgModule({
  declarations: [
    AppComponent,
    CompanyHomeComponent,
    AdminHomeComponent,
    UserHomeComponent,
    AllJobsComponent,
    PendingJobsComponent,
    TotalDaysPipe,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    JobComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModuleModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

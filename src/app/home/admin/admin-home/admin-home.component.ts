import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/interface/job';
import { Registration } from 'src/app/interface/registration';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: [
    '../../company/company-home.component.scss',
    './admin-home.component.scss',
  ],
})
export class AdminHomeComponent {
  pendingJobData: Job[] = [];
  companyData?: Registration;
  email?: string;
  displayData?: true;
  activeBtn?: boolean;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private localStorageService: LocalStorageService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        this.pendingJobData = response.filter(
          (data) => data.status === 'Pending'
        );
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });

    this.email = this.localStorageService.getItemInLocalStorage('email');
    this.userDataService.getRegistrationData().subscribe({
      next: (response) => {
        this.companyData = response.find((data) => data.email === this.email);
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  logout(): void {
    this.localStorageService.removeItemInLocalStorage('email');
    this.router.navigate(['/login']);
  }
}

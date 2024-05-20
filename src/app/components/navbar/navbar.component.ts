import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/interface/job';
import { Registration } from 'src/app/interface/registration';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  approveJobData: Job[] = [];
  filterJobData: Job[] = [];
  jobTypes: string[] = [];
  loggedInUser?: Registration;
  activeBtn?: boolean;
  btnManage = false;

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
    const email = this.localStorageService.getItemInLocalStorage('email');
    this.userDataService.getRegistrationData().subscribe({
      next: (response) => {
        this.loggedInUser = response.find((data) => data.email === email);
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  //  Search
  searchJobs(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        const approveData = response.filter(
          (data) => data.status === 'Approve'
        );
        if (!this.jobTypes.length) {
          this.approveJobData = approveData.filter((data) =>
            data.jobName?.toLocaleLowerCase().includes(searchValue)
          );
        } else {
          this.approveJobData = this.filterJobData.filter((data) =>
            data.jobName?.toLocaleLowerCase().includes(searchValue)
          );
        }
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

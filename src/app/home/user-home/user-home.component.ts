import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilterOnType } from 'src/app/interface/filter-on-type';
import { Job } from 'src/app/interface/job';
import { Registration } from 'src/app/interface/registration';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHomeComponent implements OnInit {
  approveJobData: Job[] = [];
  filterJobData: Job[] = [];
  userInfo?: Registration;
  loggedInUser?: string | null;
  jobTypes: string[] = [];
  filterOnType: FilterOnType = {
    experienceLevel: [],
    jobType: [],
    jobStyle: [],
    bookmark: false,
    applied: false,
  };

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private alertService: AlertService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.localStorageService.getItemInLocalStorage('email');
    this.getData();
  }

  getData(): void {
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        this.approveJobData = response.filter(
          (data) => data.status === 'Approve'
        );
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });

    this.userDataService.getRegistrationData().subscribe({
      next: (response) => {
        this.userInfo = response.find(
          (data) => data.email === this.loggedInUser
        );
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  //  Action buttons
  addToBookmark(id?: string): void {
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        const bookmarked = response.find((data) => data.id === id);
        const addMarkedData = bookmarked?.bookmark;
        addMarkedData?.push(this.loggedInUser);
        const bookmarkedData: object = { bookmark: addMarkedData };
        this.userDataService
          .patchCreatedJobData(id!, bookmarkedData)
          .subscribe({
            next: () => {
              this.getData();
            },
            error: (err) => {
              this.alertService.showError(err);
            },
          });
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  removeBookmark(id?: string): void {
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        const bookmarked = response.find((data) => data.id === id);
        const findMarkedData = bookmarked?.bookmark?.findIndex(
          (data) => data === this.loggedInUser
        );
        bookmarked?.bookmark?.splice(findMarkedData!, 1);
        const bookmarkedData: object = { bookmark: bookmarked?.bookmark };
        this.userDataService
          .patchCreatedJobData(id!, bookmarkedData)
          .subscribe({
            next: () => {
              this.getData();
            },
            error: (err) => {
              this.alertService.showError(err);
            },
          });
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  applyForJob(id?: string): void {
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        const appliedJob = response.find((data) => data.id === id);
        const appliedJobData = appliedJob?.applied;
        appliedJobData?.push(this.loggedInUser);
        const applyJob: object = { applied: appliedJobData };
        this.userDataService.patchCreatedJobData(id!, applyJob).subscribe({
          next: () => {
            this.getData();
            this.alertService.showSuccess('Successfully applied');
          },
          error: (err) => {
            this.alertService.showError(err);
          },
        });
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  cancelJob(id?: string): void {
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        const appliedJob = response.find((data) => data.id === id);
        const findAppliedJob = appliedJob?.applied?.findIndex(
          (data) => data === this.loggedInUser
        );
        appliedJob?.applied?.splice(findAppliedJob!, 1);
        const cancelJob: object = { applied: appliedJob?.applied };
        this.userDataService.patchCreatedJobData(id!, cancelJob).subscribe({
          next: () => {
            this.getData();
          },
          error: (err) => {
            this.alertService.showError(err);
          },
        });
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

  //  For all filters
  allFilters(isFilterData: any) {
    const displayData = isFilterData
      .filter((data: Job) => {
        if (!this.filterOnType['applied']) {
          return data;
        } else if (data.applied?.includes(this.loggedInUser)) {
          return data;
        } else {
          return;
        }
      })
      .filter((data: Job) => {
        if (!this.filterOnType['bookmark']) {
          return data;
        } else if (data.bookmark?.includes(this.loggedInUser)) {
          return data;
        } else {
          return;
        }
      })
      .filter((data: Job) => {
        if (!(this.filterOnType['experienceLevel'] as string[]).length) {
          return data;
        } else if (
          (this.filterOnType['experienceLevel'] as string[]).includes(
            data.experienceLevel as string
          )
        ) {
          return data;
        } else {
          return;
        }
      })
      .filter((data: Job) => {
        if (!(this.filterOnType['jobStyle'] as string[]).length) {
          return data;
        } else if (
          (this.filterOnType['jobStyle'] as string[]).includes(
            data.jobStyle as string
          )
        ) {
          return data;
        } else {
          return;
        }
      })
      .filter((data: Job) => {
        if (!(this.filterOnType['jobType'] as string[]).length) {
          return data;
        } else if (
          (this.filterOnType['jobType'] as string[]).includes(
            data.jobType as string
          )
        ) {
          return data;
        } else {
          return;
        }
      });
    this.approveJobData = displayData;
    this.filterJobData = displayData;
  }

  filterAllData(event: Event, value: string, filterType: keyof Job) {
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        const approvedData = response.filter(
          (data) => data.status === 'Approve'
        );
        if ((event.target as HTMLInputElement).checked) {
          this.jobTypes?.push(filterType);

          if (filterType === value) {
            this.filterOnType[filterType] = true;
          } else {
            (this.filterOnType[filterType] as string[]).push(value);
          }
          this.allFilters(approvedData);
        } else {
          const removeType = this.jobTypes?.findIndex((data) => data === value);
          this.jobTypes?.splice(removeType, 1);

          if (filterType === value) {
            this.filterOnType[filterType] = false;
          } else {
            const removeFilteredType = (
              this.filterOnType[filterType] as string[]
            ).findIndex((data: string) => data === value);
            (this.filterOnType[filterType] as string[]).splice(
              removeFilteredType,
              1
            );
          }
          this.allFilters(approvedData);
        }
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  //  Logout
  logout(): void {
    this.localStorageService.removeItemInLocalStorage('email');
    this.router.navigate(['/login']);
  }
}

import { Component } from '@angular/core';
import { FilterOnType } from 'src/app/interface/filter-on-type';
import { Job } from 'src/app/interface/job';
import { Registration } from 'src/app/interface/registration';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
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
    private userDataService: UserDataService,
    private alertService: AlertService
  ) {}

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

}

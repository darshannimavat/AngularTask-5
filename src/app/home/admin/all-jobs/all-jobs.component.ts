import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/interface/job';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: [
    './all-jobs.component.scss',
    '../../admin/pending-jobs/pending-jobs.component.scss',
  ],
})
export class AllJobsComponent implements OnInit {
  allJobData: Job[] = [];
  todaysTime =  new Date().toLocaleTimeString();


  constructor(
    private userData: UserDataService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.userData.getCreatedJobData().subscribe({
      next: (response) => {
        this.allJobData = response.filter((data) => data);
      },
      error: (err) => {
        this.alertService.showError(err);
      }
    });
  }

}

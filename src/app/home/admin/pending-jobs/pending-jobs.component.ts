import { Component, OnInit } from '@angular/core';
import { Job } from 'src/app/interface/job';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-pending-jobs',
  templateUrl: './pending-jobs.component.html',
  styleUrls: ['./pending-jobs.component.scss'],
})
export class PendingJobsComponent implements OnInit {
  pendingJobData: Job[] = [];

  constructor(
    private userDataService: UserDataService,
    private alertService: AlertService,
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
        this.alertService.showError(err)
      }
    });
  }

  rejectJob(id?: string): void {
    if (confirm('Are you sure you want to reject this job?')) {
      const newStatus: {status: string} = { status: 'Reject' };
      this.userDataService.patchCreatedJobData(id!, newStatus).subscribe({
        next: () => {
          this.getData();
        },
        error: (err) => {
          this.alertService.showError(err);
        },
      });
    }
  }

  approveJob(id?: string): void {
    if (confirm('Are you sure you want to approve this job?')) {
      const newStatus: object = { status: 'Approve' };
      this.userDataService.patchCreatedJobData(id!, newStatus).subscribe({
        next: () => {
          this.getData();
        },
        error: (err) => {
          this.alertService.showError(err);
        },
      });
    }
  }
}

import { Component } from '@angular/core';
import { Job } from 'src/app/interface/job';
import { Registration } from 'src/app/interface/registration';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent {
  approveJobData: Job[] = [];
  filterJobData: Job[] = [];
  userInfo?: Registration;
  loggedInUser?: string | null;

  constructor(
    private userDataService: UserDataService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
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

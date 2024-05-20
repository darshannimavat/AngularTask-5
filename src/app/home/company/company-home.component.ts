import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Job } from 'src/app/interface/job';
import { Registration } from 'src/app/interface/registration';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: [
    './company-home.component.scss',
    '../admin/pending-jobs/pending-jobs.component.scss',
  ],
})
export class CompanyHomeComponent implements OnInit {
  @ViewChild('myModalClose') modalClose?: ElementRef;

  allJobData: Job[] = [];
  companyData?: Registration;
  editJobData?: Job;
  imgUrl?: string | null | ArrayBuffer;
  btnManage = false;
  editJobId?: string;
  loggedInData?: string;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private alertService: AlertService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loggedInData = this.localStorageService.getItemInLocalStorage('email');
    this.getData();
  }

  getData(): void {
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        this.allJobData = response.filter(
          (data) => data.email === this.loggedInData
        );
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
    this.userDataService.getRegistrationData().subscribe({
      next: (response) => {
        this.companyData = response.find(
          (data) => data.email === this.loggedInData
        );
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  resetModal(): void {
    this.imgUrl = null;
    this.createJobForm.reset();
    this.createJobForm.patchValue({
      experienceLevel: '',
      jobType: '',
      jobStyle: '',
    });
  }

  addLogo(event: Event): void {
    if ((event.target as HTMLInputElement).files) {
      const fileData = (event.target as HTMLInputElement).files;
      var reader = new FileReader();
      reader.readAsDataURL((fileData as FileList)[0]);
      reader.onload = (event) => {
        this.imgUrl = event.target?.result;
      };
    }
  }

  createJobForm = new FormGroup({
    companyName: new FormControl('', [Validators.required]),
    jobName: new FormControl('', [Validators.required]),
    experienceLevel: new FormControl('', [Validators.required]),
    jobType: new FormControl('', [Validators.required]),
    jobStyle: new FormControl('', [Validators.required]),
    jobDescription: new FormControl('', [Validators.required]),
    timeAndDate: new FormControl(0),
    logoUrl: new FormControl(null),
  });

  submitForm() {
    if (this.createJobForm.invalid) {
      this.createJobForm.markAllAsTouched();
      return;
    }
    let createJobFormData = {
      companyName: this.createJobForm.value.companyName,
      jobName: this.createJobForm.value.jobName,
      experienceLevel: this.createJobForm.value.experienceLevel,
      jobType: this.createJobForm.value.jobType,
      jobStyle: this.createJobForm.value.jobStyle,
      jobDescription: this.createJobForm.value.jobDescription,
      logoUrl: this.imgUrl,
      date: new Date().getTime(),
      status: 'Pending',
      email: this.loggedInData,
      applied: [],
      bookmark: [],
    };
    if (this.createJobForm.valid) {
      this.userDataService
        .postCreatedJobData(createJobFormData as Job)
        .subscribe({
          next: () => {
            this.getData();
            this.resetModal();
            this.modalClose?.nativeElement.click();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  deleteJob(id?: string): void {
    if (confirm('Are you sure, you want to delete this job?')) {
      this.userDataService.deleteCreatedJobData(id!).subscribe({
        next: () => {
          this.getData();
        },
        error: (error) => {
          this.alertService.showError(error);
        },
      });
    }
  }

  editJob(id?: string): void {
    this.editJobId = id;
    this.userDataService.getCreatedJobData().subscribe({
      next: (response) => {
        this.editJobData = response.find((data) => data.id === id);
        this.createJobForm.patchValue({
          companyName: this.editJobData?.companyName,
          jobName: this.editJobData?.jobName,
          experienceLevel: this.editJobData?.experienceLevel,
          jobType: this.editJobData?.jobType,
          jobStyle: this.editJobData?.jobStyle,
          jobDescription: this.editJobData?.jobDescription,
        });
        this.imgUrl = this.editJobData?.logoUrl;
      },
      error: (err) => {
        this.alertService.showError(err);
      },
    });
  }

  updateData(): void {
    if (this.createJobForm.invalid) {
      this.createJobForm.markAllAsTouched();
      return;
    }
    let editJobFormData = {
      companyName: this.createJobForm.value.companyName,
      jobName: this.createJobForm.value.jobName,
      experienceLevel: this.createJobForm.value.experienceLevel,
      jobType: this.createJobForm.value.jobType,
      jobStyle: this.createJobForm.value.jobStyle,
      jobDescription: this.createJobForm.value.jobDescription,
      logoUrl: this.imgUrl,
      date: new Date().getTime(),
      status: 'Pending',
    };
    if (this.createJobForm.valid) {
      this.userDataService
        .patchCreatedJobData(this.editJobId!, editJobFormData)
        .subscribe({
          next: () => {
            this.getData();
            this.resetModal();
            this.modalClose?.nativeElement.click();
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  logout(): void {
    this.localStorageService.removeItemInLocalStorage('email');
    this.router.navigate(['/login']);
  }
}

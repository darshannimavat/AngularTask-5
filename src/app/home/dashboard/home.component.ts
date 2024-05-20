import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  email?: string | null;
  isRole?: string;

  constructor(
    private userDataService: UserDataService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    if (this.email) {
      const localData = JSON.parse(this.email);
      this.userDataService.getRegistrationData().subscribe({
        next: (response) => {
          const findData = response.find((data) => data.email === localData);
          if (findData?.role === 'Admin') {
            this.isRole = 'Admin';
          } else if (findData?.role === 'Company') {
            this.isRole = 'Company';
          } else if (findData?.role === 'User') {
            this.isRole = 'User';
          }
        },
        error: (err) => {
          this.alertService.showError(err);
        },
      });
    }
  }
}

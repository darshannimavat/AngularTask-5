import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
  ],
})
export class LoginComponent {
  constructor(
    private userDataService: UserDataService,
    private router: Router,
    private alertService: AlertService,
    private localStorageService: LocalStorageService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  submitLoginForm(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.userDataService.getRegistrationData().subscribe((data) => {
      const FindUserData = data.find(
        (data) =>
          data.email === this.loginForm.value.email &&
          data.password === this.loginForm.value.password
      );
      if (!FindUserData) {
        this.alertService.showError('Invalid credentials');
        return;
      }
      if (FindUserData) {
        this.router.navigate(['/home-page'], {
          queryParams: { email: this.loginForm.value.email },
        });
      }
      this.localStorageService.setItemInLocalStorage(
        'email',
        this.loginForm.value.email as string
      );
      this.alertService.showSuccess('Login successfully');
      this.loginForm.reset();
    });
  }
}

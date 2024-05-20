import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Registration } from 'src/app/interface/registration';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { passwordMatch } from 'src/app/custom-validator/password-match';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  isAdmin?: boolean;

  constructor(
    private router: Router,
    private userDataService: UserDataService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.userDataService.getRegistrationData().subscribe((response) => {
      this.isAdmin = !!response.find((data) => data.role === 'Admin');
    });
  }

  registrationForm = new FormGroup(
    {
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    },
    [passwordMatch('password', 'confirmPassword')]
  );

  submitData(): void {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    this.userDataService.getRegistrationData().subscribe((data) => {
      const registerObj = data.find(
        (data) => data.email === this.registrationForm.value.email
      );
      if (registerObj) {
        this.alertService.showError('This user is already exist');
        return;
      }
      let registrationFormData = {
        firstName: this.registrationForm.value.firstName,
        lastName: this.registrationForm.value.lastName,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password,
        role: this.registrationForm.value.role,
      };
      if (this.registrationForm.valid) {
        this.userDataService
          .postRegistrationData(registrationFormData as Registration)
          .subscribe({
            next: () => {
              this.router.navigate(['/login']);
              this.alertService.showSuccess('Registration successfully');
              this.registrationForm.reset();
            },
            error: (err) => {
              this.alertService.showError(err);
            },
          });
      }
    });
  }
}

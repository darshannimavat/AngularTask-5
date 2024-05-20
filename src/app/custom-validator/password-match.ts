import { AbstractControl } from "@angular/forms";

export function passwordMatch(password: string, confirmPassword: string) {
  return function (form: AbstractControl) {
    const passwordValue = form.get(password)?.value;
    const confirmPasswordValue = form.get(confirmPassword)?.value;
    return passwordValue === confirmPasswordValue ? null : { passwordMismatchError: true }
  }
}

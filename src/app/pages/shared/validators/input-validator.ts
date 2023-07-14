import { FormControl, ValidationErrors } from '@angular/forms';

export function nameValidator(control: FormControl): ValidationErrors | null {
  const regex =  /^[a-zA-Z ]+$/;
  const valid = regex.test(control.value);
  return valid ? null : { invalidName: true };
}

export function usernameValidator(control: FormControl): ValidationErrors | null {
    const regex = /^[a-zA-Z0-9]+$/;
    const valid = regex.test(control.value);
    return valid ? null : { invalidUsername: true };
  }

import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../user.service';
import { nameValidator, usernameValidator } from '../../shared/validators/input-validator';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required, nameValidator]);
  username = new FormControl('', [Validators.required, usernameValidator]);
  selectedAllergens: any;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  registerNewUser() {
    const email = this.email.value!;
    const password = this.password.value!;
    const name = this.name.value!;
    const username = this.username.value!;
    const allergens = this.selectedAllergens;

    this.userService.Register(email, name, password, username, allergens).then(
      (RegisterResult) => {
        if (RegisterResult == "email-already-in-use") {
          this.sharedService.showSnackbar("The email is already in use. Please sign in or try a different email. ❌", "ok");
        } else if (RegisterResult == "register-success") {
          window.location.href = "login";
        }
      }).catch(error => {
        this.sharedService.showSnackbar("Something Went Wrong, Please Contact the Admin! ❌", "ok");
      });
  }

  getErrorMessage() {
    if (this.email.hasError('required') || this.password.hasError('required')
      || this.name.hasError('required') || this.username.hasError('required')) {
      return 'Field cannot be empty!';
    }

    if (this.email.hasError('email')) {
      return 'Not a valid email!';
    }

    if (this.name.hasError('invalidName')) {
      return 'Not a valid name! (A-Z only)';
    }

    if (this.username.hasError('invalidUsername')) {
      return 'Not a valid username! (A-Z, 0-9 only)';
    }

    return '';
  }

  onAllergensSelectionChange(event: any) {
    this.selectedAllergens = event.value;
  }

}

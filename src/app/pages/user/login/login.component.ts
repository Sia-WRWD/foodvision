import { Component } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { SharedService } from '../../shared/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: UntypedFormGroup;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('registerSuccess')) {
      this.sharedService.showSnackbar(`Successfully Registered! You can now login to your account. ✅`, "ok");
      sessionStorage.removeItem('registerSuccess');
    }
  }

  getErrorMessage() {
    if (this.email.hasError('required') || this.password.hasError('required')) {
      return 'Field cannot be empty!';
    }

    return this.email.hasError('email') ? 'Not a valid email!' : '';
  }

  verifyLoginDetails() {
    this.userService.Login(this.email.value!, this.password.value!).then(
      (LoginResult) => {
        if (LoginResult == "no-user-record") {
          this.sharedService.showSnackbar("Your Password or Username might be wrong, Please Try Again! ❌", "ok");
        } else if (LoginResult == "login-success") {
          window.location.href = "home";
        }
      }).catch(error => {
        this.sharedService.showSnackbar("Something Went Wrong, Please Contact the Admin! ❌", "ok");
      });
  }

  direct(path: string) {
    this.router.navigate([path]);
  }
}

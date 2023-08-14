import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { SharedService } from '../../shared/shared.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  email = new FormControl('', [Validators.required, Validators.email]);

  ngOnInit() {

  }

  constructor(
    private userService: UserService,
    private sharedService: SharedService
  ) {}

  submitResetPasswordRequest() {
    const email = this.email.value!;

    this.userService.sendPasswordResetEmail(email).then(res => {
      if (res == "Successfully Sent Reset Password.") {
        this.sharedService.showSnackbar("Password reset email has been sent, please check your email! ✅", "ok");
      } else if (res == "Error sending password reset email") {
        this.sharedService.showSnackbar("The email you provided do not exist, please try again later! ❌", "ok");
      } else {
        this.sharedService.showSnackbar("Something went wrong, please try again later! ⚠️", "ok");
      }
    })
    this.email.reset();
  }

  getErrorMessage(control: FormControl) {
    if (control.hasError('required')) {
      return 'Field cannot be empty!';
    }

    if (control.hasError('email')) {
      return 'Not a valid email!';
    }

    return '';
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  faMobileScreenButton = faMobileScreenButton;

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem('loginSuccess')) {
      this.sharedService.showSnackbar(`Successfully Logged In! ✅`, "ok");
      sessionStorage.removeItem('loginSuccess');
    }
  }

  navigateToSearch() {
    this.router.navigate(['search']);
  }
}

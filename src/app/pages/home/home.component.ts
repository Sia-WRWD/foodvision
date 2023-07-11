import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  faMobileScreenButton = faMobileScreenButton;

  constructor(
    private router: Router
  ) {}
  
  navigateToSearch() {
    this.router.navigate(['search']);
  }
}

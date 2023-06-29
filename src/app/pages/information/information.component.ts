import { Component } from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  selectedAllergens: string[] = [];

  loadSelectedAllergens(): void {
    const storedAllergens = sessionStorage.getItem('selectedAllergens');
    if (storedAllergens) {
      this.selectedAllergens = JSON.parse(storedAllergens);
    }
  }
}

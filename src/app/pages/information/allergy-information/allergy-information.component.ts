import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-allergy-information',
  templateUrl: './allergy-information.component.html',
  styleUrls: ['./allergy-information.component.scss']
})
export class AllergyInformationComponent {
  @Input() allergens!: string[];
  test: any = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  ngOnInit() {
    console.log(this.allergens);
  }
}

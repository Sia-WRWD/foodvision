import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { faFire, faClockRotateLeft, faCarrot, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  selectedAllergens: string[] = [];
  classifiedFoodData: any;
  classifiedFood: string = "";
  @ViewChild('foodImage', { static: false }) foodImage!: ElementRef<HTMLImageElement>;
  faFire = faFire;
  faClockRotateLeft = faClockRotateLeft;
  faCarrot = faCarrot;
  faTriangleExclamation = faTriangleExclamation;
  badgeText!: string;
  showFullText: boolean = false;
  caloriePercentages: any = [];

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getFoodData();
  }

  ngAfterViewInit() {
    this.setFoodImage();
    this.setBadgeText();
    this.calFoodCalorie();
  }

  getFoodData() {
    //Get Firebase Food Info
    this.classifiedFoodData = JSON.parse(sessionStorage.getItem("foodInfo")!);
    //Get Food Name
    this.classifiedFood = sessionStorage.getItem("classifiedFood")!;
    this.classifiedFood = this.classifiedFood.replace(/"/g, '');
  }

  setFoodImage() {
    const foodImgUrl = sessionStorage.getItem("originalImage")!;
    const foodCroppedImgUrl = sessionStorage.getItem("croppedImage")!;

    if (!foodCroppedImgUrl) {
      console.log(foodImgUrl);
      this.foodImage.nativeElement.setAttribute('src', foodImgUrl);
    } else {
      this.foodImage.nativeElement.setAttribute('src', foodCroppedImgUrl);
    }
  }

  loadSelectedAllergens(): void {
    const storedAllergens = sessionStorage.getItem('selectedAllergens');
    if (storedAllergens) {
      this.selectedAllergens = JSON.parse(storedAllergens);
    }
  }

  checkFoodAllergens() {
    const selectedAllergens = JSON.parse(sessionStorage.getItem('selectedAllergens')!);
    const foodAllergens = this.classifiedFoodData.allergens;

    if (selectedAllergens && selectedAllergens.length > 0 && foodAllergens && foodAllergens.length > 0) {
      const hasMatchingAllergen = foodAllergens.some((allergen: string) => selectedAllergens.includes(allergen));

      if (hasMatchingAllergen) {
        console.log('At least one selected allergen matches an allergen in the food.');
        // Perform your desired action for a match
      } else {
        console.log('No selected allergens match any allergen in the food.');
        // Perform your desired action for no match
      }
    }
  }

  setBadgeText() {
    if (this.classifiedFoodData.halal == "both") {
      this.badgeText = "🍲"
    } else if (this.classifiedFoodData.halal == "halal") {
      this.badgeText = "🍏"
    } else if (this.classifiedFoodData.halal == "not halal") {
      this.badgeText = "🐷";
    }
  }

  calFoodCalorie() {
    const values = this.classifiedFoodData['calorie-info'];
  
    // Regular expression pattern to match numerical values
    const pattern = /[0-9.]+/;
  
    // Extract numerical values and round them off
    const roundedValues = values.map((value: any) => {
      const numericString = value.match(pattern)[0];
      const numericValue = parseFloat(numericString);
      return Math.round(numericValue);
    });
  
    // Retrieve the second to fourth values
    const valuesToCalculate = roundedValues.slice(1, 4);
  
    // Calculate the total sum
    const totalSum = valuesToCalculate.reduce((sum: any, value: any) => sum + value, 0);
  
    // Calculate the percentages
    const percentages = valuesToCalculate.map((value: any) => Math.round((value / totalSum) * 100));
  
    this.caloriePercentages = percentages;
  }
  

  showAllergens() {

  }

  toggleText() {
    if (this.showFullText == true) {
      this.showFullText = false;
    } else {
      this.showFullText = true;
    }
  }
}

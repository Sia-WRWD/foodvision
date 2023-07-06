import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { faFire, faClockRotateLeft, faCarrot, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  @ViewChild('foodImage', { static: false }) foodImage!: ElementRef<HTMLImageElement>;
  @ViewChild('allergenInfo') allergenInfo!: TemplateRef<any>;

  selectedAllergens: string[] = [];
  classifiedFoodData: any;
  classifiedFood: string = "";
  matchedAllergens: string[] = [];

  badgeText!: string;
  showFullText: boolean = false;
  caloriePercentages: any = [];

  //Fontawesome
  faFire = faFire;
  faClockRotateLeft = faClockRotateLeft;
  faCarrot = faCarrot;
  faTriangleExclamation = faTriangleExclamation;

  constructor(
    private router: Router,
    public dialog: MatDialog, 
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (!sessionStorage.getItem("classifiedFood") && !JSON.parse(sessionStorage.getItem("foodInfo")!)) {
      this.router.navigate(["/search"]);
    }

    this.getFoodData();
  }

  ngAfterViewInit() {
    this.setFoodImage();
    this.setBadgeText();
    this.calFoodCalorie();
    this.checkFoodAllergens();
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
      foodAllergens.forEach((allergen: string) => {
        if (selectedAllergens.includes(allergen)) {
          this.matchedAllergens.push(allergen); // Add the matched allergen to the array
        }
      });
    }
  }

  setBadgeText() {
    if (this.classifiedFoodData.halal == "both") {
      this.badgeText = "🍲";
    } else if (this.classifiedFoodData.halal == "halal") {
      this.badgeText = "🍏";
    } else if (this.classifiedFoodData.halal == "not halal") {
      this.badgeText = "🐷";
    }
    
    this.cdr.detectChanges(); // Trigger change detection
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

    this.cdr.detectChanges();
  }
  

  showAllergens() {
    this.dialog.open(this.allergenInfo);
  }

  toggleText() {
    if (this.showFullText == true) {
      this.showFullText = false;
    } else {
      this.showFullText = true;
    }
  }
}

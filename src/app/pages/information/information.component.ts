import { ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { faFire, faClockRotateLeft, faCarrot, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';


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
  classifiedFoodRecipe: string = "";
  matchedAllergens: string[] = [];

  badgeText!: string;
  showFullText: boolean = false;
  caloriePercentages: any = [];

  //Fontawesome
  faFire = faFire;
  faClockRotateLeft = faClockRotateLeft;
  faCarrot = faCarrot;
  faTriangleExclamation = faTriangleExclamation;

  //Sharing Function Variables
  sharedParam: boolean = false;
  foodParam: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sharedParam = params.hasOwnProperty('shared');
      this.foodParam = params['food'] || null;

      if (this.sharedParam) { //If Shared is true.
        this.foodParam = this.foodParam.replace(/_/g, '-');
        this.sharedService.getFoodInfo(this.foodParam).subscribe((data: any) => {
          this.classifiedFoodData = data;
          this.calFoodCalorie();
          this.checkFoodAllergens(true);
          this.setBadgeText();
        });
        this.classifiedFood = this.foodParam
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        this.classifiedFoodRecipe = this.classifiedFood.toLowerCase().replace(/\s+/g, '_'); //for Recipe
      } else { //If not shared, but classified.
        if (!sessionStorage.getItem("classifiedFood") && !JSON.parse(sessionStorage.getItem("foodInfo")!)) {
          this.router.navigate(["/search"]);
        }

        this.getFoodData();
        this.calFoodCalorie();
      }
    })
  }

  ngAfterViewInit() {
    if (this.sharedParam) {
      this.setFoodImage(true, this.foodParam);
    } else {
      this.setFoodImage(false, "");
      this.checkFoodAllergens(false);
      this.setBadgeText();
    }
  }

  getFoodData() {
    //Get Firebase Food Info
    this.classifiedFoodData = JSON.parse(sessionStorage.getItem("foodInfo")!);
    //Get Food Name
    this.classifiedFood = sessionStorage.getItem("classifiedFood")!;
    this.classifiedFood = this.classifiedFood.replace(/"/g, '');
    this.classifiedFoodRecipe = this.classifiedFood.toLowerCase().replace(/\s+/g, '_'); //for Recipe
  }

  setFoodImage(shared: boolean, foodName: string) {
    if (shared === true) {
      const foodImgUrl = "../../../assets/shared-food-image/" + foodName + ".jpg";

      this.foodImage.nativeElement.setAttribute('src', foodImgUrl);
    } else {
      const foodImgUrl = sessionStorage.getItem("originalImage")!;

      this.foodImage.nativeElement.setAttribute('src', foodImgUrl);
    }
  }

  loadSelectedAllergens(): void {
    const storedAllergens = sessionStorage.getItem('selectedAllergens');
    if (storedAllergens) {
      this.selectedAllergens = JSON.parse(storedAllergens);
    }
  }

  checkFoodAllergens(shared: boolean) {
    if (shared == true) {
      this.matchedAllergens = this.classifiedFoodData.allergens;
    } else {
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
  }

  setBadgeText() {
    if (this.classifiedFoodData?.halal == "both") {
      this.badgeText = "🍲";
    } else if (this.classifiedFoodData?.halal == "halal") {
      this.badgeText = "🍏";
    } else if (this.classifiedFoodData?.halal == "not halal") {
      this.badgeText = "🐷";
    }

    this.cdr.detectChanges(); // Trigger change detection
  }

  calFoodCalorie() {
    const values = this.classifiedFoodData['calorie-info'];

    // Regular expression pattern to match numerical values
    const pattern = /[0-9.]+/;

    // Extract numerical values and round them off
    const roundedValues = values?.map((value: any) => {
      const numericString = value.match(pattern)[0];
      const numericValue = parseFloat(numericString);
      return Math.round(numericValue);
    });

    // Retrieve the second to fourth values
    const valuesToCalculate = roundedValues?.slice(1, 4);

    // Calculate the total sum
    const totalSum = valuesToCalculate?.reduce((sum: any, value: any) => sum + value, 0);

    // Calculate the percentages
    const percentages = valuesToCalculate?.map((value: any) => Math.round((value / totalSum) * 100));

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

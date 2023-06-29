import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faEgg, faWheatAlt, faCow, faTree, faShrimp, faFishFins, faSeedling, faPlateWheat } from '@fortawesome/free-solid-svg-icons';
import { SharedService } from '../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  imgUrl: string = "";
  @ViewChild('imageEditor') imageEditor!: TemplateRef<any>;
  @ViewChild('imageInput') imageInput!: any;
  @ViewChild('imagePreview') imagePreview!: HTMLElement;
  hasFile: boolean = false;
  response: string = "";
  classifiedFoodData: any;

  allergens = [
    { icon: faEgg, name: "Eggs", checked: false },
    { icon: faFishFins, name: "Fish", checked: false },
    { icon: faShrimp, name: "Shellfish", checked: false },
    { icon: faWheatAlt, name: "Wheat", checked: false },
    { icon: faTree, name: "Peanuts", checked: false },
    { icon: faCow, name: "Milk", checked: false },
    { icon: faSeedling, name: "Soybeans", checked: false },
    { icon: faPlateWheat, name: "Sesame", checked: false },
  ];
  selectedAllergens: string[] = [];

  constructor(public dialog: MatDialog, private sharedService: SharedService, private http: HttpClient) { }

  ngOnInit() {

  }

  openDialog() {
    const dialogRef = this.dialog.open(this.imageEditor, {
      data: { imageUrl: this.imgUrl }
    })

    dialogRef.afterClosed().subscribe(result => {
      this.sharedService.croppedImage$.subscribe(croppedImage => {
        if (croppedImage) {
          this.imgUrl = croppedImage;
          sessionStorage.setItem("croppedImage", this.imgUrl);
        }
      });
    });

  }

  onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;

    if (files && files.length > 0) {
      const file = files[0];
      const fileType = file.type;

      // Validate File Type
      if (fileType.startsWith('image/')) {
        this.hasFile = true;
        this.saveImageFile(file);
        this.readImageFile(file);
      } else {
        this.imageInput.nativeElement.value = '';
        this.hasFile = false;
        //Message Handler to Inform user.
        this.sharedService.showSnackbar("Please only upload image files! ❌", "ok");
      }
    }
  }

  saveImageFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileDataUrl = e.target?.result as string;
      sessionStorage.setItem('originalImage', fileDataUrl); // Save the file data URL in session storage
    };

    reader.readAsDataURL(file);
  }

  readImageFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imgUrl = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  }

  removeImage() {
    this.hasFile = false;
    sessionStorage.removeItem('originalImage');
  }

  getSelectedAllergens() {
    this.selectedAllergens = this.allergens.filter(allergen => allergen.checked).map(allergen => allergen.name);
    sessionStorage.setItem('selectedAllergens', JSON.stringify(this.selectedAllergens));
  }

  predict() {
    this.getSelectedAllergens();
    this.classify();
  }

  async classify() {
    // Prepare Picture File for sending to prediction API
    const dataUrl = this.imgUrl;

    try {
      const response = await this.http.get(dataUrl, { responseType: 'blob' }).toPromise();
      const blob = response as Blob;

      const formData = new FormData();
      formData.append('image', blob, 'to-predict.jpg');

      this.http.post('http://localhost:5000/predict', formData).subscribe(
        (data: any) => {
          this.response = data.predicted_label;
          this.getClassifiedFoodData(this.response);
        },
        (error: any) => {
          console.error(error);
        }
      );
    } catch (error) {
      console.error(error);
    }
  }

  getClassifiedFoodData(food: string) {
    this.sharedService.getFoodInfo(food).subscribe((data: any) => {
      const foodInfo = data;
      // Continue with further processing or assign the variable to a class property
      this.classifiedFoodData = foodInfo;
      console.log(this.classifiedFoodData);
    }, (error: any) => {
      console.error(error);
    });
  }
}

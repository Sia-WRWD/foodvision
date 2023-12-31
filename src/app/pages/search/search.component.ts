import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { faEgg, faWheatAlt, faCow, faTree, faShrimp, faFishFins, faSeedling, faPlateWheat } from '@fortawesome/free-solid-svg-icons';
import { SharedService } from '../shared/shared.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [DatePipe]
})
export class SearchComponent {

  imgUrl: string = "";
  originalUrl: string = "";
  @ViewChild('imageEditor') imageEditor!: TemplateRef<any>;
  @ViewChild('progressLoader') progressLoader!: TemplateRef<any>;
  @ViewChild('imageInput') imageInput!: any;
  @ViewChild('imagePreview') imagePreview!: HTMLElement;
  @ViewChild('elementCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
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
  isLoading: boolean = false;
  statusMessage: string = "";
  status: string = "";

  isLoggedIn: string = "";
  userAllergens: string[] = [];
  userInfo: any;
  accuracy: any;

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.checkLoggedIn();

    if (!this.isLoggedIn) {
      this.checkExistingAllergens();
    }
  }

  checkLoggedIn() {
    this.isLoggedIn = sessionStorage.getItem("isLoggedIn")!;
    if (this.isLoggedIn) {
      const uid = sessionStorage.getItem("token");
      this.userService.fetchUserInfo(uid).subscribe(res => {
        this.userInfo = res;
        this.userAllergens = this.userInfo.allergens;
        this.checkExistingAllergens();
      })
    }
  }

  checkExistingAllergens() {
    const selectedAllergens = JSON.parse(sessionStorage.getItem('selectedAllergens')!);

    if (this.isLoggedIn) {
      this.handleLoggedInUser(selectedAllergens);
    } else {
      this.handleLoggedOutUser(selectedAllergens);
    }
  }

  handleLoggedInUser(selectedAllergens: string[]) {
    if (this.userAllergens && this.userAllergens.length > 0) {
      const allergensToCheck = selectedAllergens || this.userAllergens;

      this.setAllergensChecked(allergensToCheck);
    }
  }

  handleLoggedOutUser(selectedAllergens: string[]) {
    if (selectedAllergens && selectedAllergens.length > 0) {
      this.setAllergensChecked(selectedAllergens);
    }
  }

  setAllergensChecked(allergensToCheck: string[]) {
    const matchingAllergens = this.allergens.filter(allergen =>
      allergensToCheck.includes(allergen.name)
    );

    matchingAllergens.forEach(allergen => {
      allergen.checked = true;
    });
  }

  openCropDialog() {
    const dialogRef = this.dialog.open(this.imageEditor, {
      data: { imageUrl: this.imgUrl }
    })

    this.sharedService.croppedImage$.subscribe(croppedImage => {
      this.imgUrl = croppedImage;
      sessionStorage.setItem("croppedImage", this.imgUrl);
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

      } else {
        this.imageInput.nativeElement.value = '';
        this.hasFile = false;
        //Message Handler to Inform user.
        this.sharedService.showSnackbar("Only image files allowed! ❌", "ok");
      }
    }
  }

  saveImageFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileDataUrl = e.target?.result as string;

      // Create a promise to handle image loading and canvas drawing
      const loadImagePromise = new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          const canvas = this.canvas.nativeElement;
          const context = canvas.getContext('2d');
          context?.clearRect(0, 0, canvas.width, canvas.height);
          canvas.width = image.width;
          canvas.height = image.height;
          context?.drawImage(image, 0, 0);
          resolve();
        };
        image.src = fileDataUrl;
        image.onerror = reject;
      });

      // After the canvas drawing is completed, save the modified image data URL to session storage
      loadImagePromise.then(() => {
        const canvas = this.canvas.nativeElement;
        const modifiedImageDataURL = canvas.toDataURL('image/jpeg'); // Use 'image/png' for PNG format
        sessionStorage.setItem('originalImage', modifiedImageDataURL);
        this.readImageFileFromCanvas();
        this.sharedService.setCroppedImage(this.imgUrl);
        //Message Handler to Inform user.
        this.sharedService.showSnackbar("Successfully uploaded file! 💯", "ok");
      }).catch((error) => {
        console.error('Error loading and drawing image:', error);
      });
    };

    reader.readAsDataURL(file);
  }



  readImageFileFromCanvas(): void {
    // Read the modified image data URL from session storage
    const modifiedImageDataURL = sessionStorage.getItem('originalImage');
    if (modifiedImageDataURL) {
      // Set the imgUrl to the modified image data URL
      this.imgUrl = modifiedImageDataURL;
      this.originalUrl = this.imgUrl;
    }
  }

  removeImage() {
    this.hasFile = false;
    sessionStorage.removeItem('originalImage');
    sessionStorage.removeItem('croppedImage');
    this.imgUrl = "";
  }

  getSelectedAllergens() {
    this.selectedAllergens = this.allergens.filter(allergen => allergen.checked).map(allergen => allergen.name);
    sessionStorage.setItem('selectedAllergens', JSON.stringify(this.selectedAllergens));
  }

  predict() {
    this.getSelectedAllergens();
    this.openProgressDialog();
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

      const headers = new HttpHeaders();
      headers.set('Access-Control-Allow-Origin', '*'); // Set the CORS header
      // Add any other headers if needed
      // headers.set('Authorization', 'Bearer YourAuthToken');

      this.http.post('https://hyena-great-jay.ngrok-free.app/predict', formData, { headers }).subscribe(
        (data: any) => {
          this.response = data.predicted_label;
          this.accuracy = data.accuracy;

          sessionStorage.setItem('classifiedFood', this.response); //Save Classified Food's Name.
          this.getClassifiedFoodData(this.response); //Get Classified Food's Data from Firebase.
          if (this.isLoggedIn) {
            this.createHistory(this.response, this.accuracy);
          }
          this.statusMessage = 'Successfully classified the food!';
          this.status = 'success';
        },
        (error: any) => {
          if (error.status === 0) {
            this.statusMessage = 'Something is wrong with the server, please try again later! 🛠️';
          } else if (error.status === 400) {
            this.statusMessage = 'Something is wrong with the file sent, please try again later! ⚠️';
          } else if (error.status === 500) {
            this.statusMessage = 'Input is empty or incompatible image type! 😞';
          }
          this.status = 'failure';
          this.isLoading = false;
        }
      );
    } catch (error) {
      // Handle error
      // console.error(error);
    }
  }


  getClassifiedFoodData(food: string) {
    this.sharedService.getFoodInfo(food).subscribe((data: any) => {
      this.classifiedFoodData = data; //Assign data to variable
      sessionStorage.setItem("foodInfo", JSON.stringify(this.classifiedFoodData));
      this.isLoading = false;
    }, (error: any) => {
      //console.error(error);
    });
  }

  openProgressDialog() {
    this.isLoading = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    this.dialog.open(this.progressLoader, dialogConfig);
  }

  closeProgressDialog() {
    if (this.status == "failure") {
      this.dialog.closeAll();
      this.hasFile = false;
      this.imageInput.nativeElement.value = '';
    } else {
      this.dialog.closeAll();
      this.router.navigate(['/information']);
    }
  }

  createHistory(food: string, confidence: string) {
    const token = sessionStorage.getItem('token')!;
    const food_classified = food;
    const last_added = this.getFormattedDate();
    const accuracy = confidence;

    this.userService.uploadImage().subscribe(res => {
      const formattedData = `{"input": "${res}", "food_classified": "${food_classified}", "last_added": "${last_added}", "accuracy": "${accuracy}"}`
      this.userService.updateHistory(token, formattedData);
    });
  }

  getFormattedDate(): string {
    const date = new Date();
    return this.datePipe.transform(date, 'dd/MM/yyyy')!;
  }
}

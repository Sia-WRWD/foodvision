import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faEgg, faWheatAlt, faCow, faTree, faShrimp, faFishFins, faSeedling, faPlateWheat } from '@fortawesome/free-solid-svg-icons';

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

  allergens = [
    {icon: faEgg, name: "Eggs", checked: false},
    {icon: faFishFins, name: "Fish", checked: false},
    {icon: faShrimp, name: "Shellfish", checked: false},
    {icon: faWheatAlt, name: "Wheat", checked: false},
    {icon: faTree, name: "Peanuts", checked: false},
    {icon: faCow, name: "Milk", checked: false},
    {icon: faSeedling, name: "Soybeans", checked: false},
    {icon: faPlateWheat, name: "Sesame", checked: false},
  ];
  selectedAllergens: string[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit() {

  }

  openDialog() {
    const dialogRef = this.dialog.open(this.imageEditor, {
      data: { imageUrl: this.imgUrl }
    })

    dialogRef.afterClosed().subscribe(result => {
      // Handle any actions after the dialog is closed
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
        this.readImageFile(file);
      } else {
        this.imageInput.nativeElement.value = '';
        this.hasFile = false;
        //Message Handler to Inform user.
      }
    }
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
  }

  getSelectedAllergens() {
    this.selectedAllergens = this.allergens.filter(allergen => allergen.checked).map(allergen => allergen.name);
  }

  getFinalCropImage() {
    
  }
}

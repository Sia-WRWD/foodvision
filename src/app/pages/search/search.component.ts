import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  imgUrl: string = "../../../assets/asdf.jpg";
  @ViewChild('imageEditor') imageEditor!: TemplateRef<any>;

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
}

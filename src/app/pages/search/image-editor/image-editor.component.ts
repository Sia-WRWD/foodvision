import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent {

  cropInstance: Cropper | null = null;
  data: any;
  @ViewChild('canvasConfirm', { static: true }) canvasConfirm!: ElementRef;
  @ViewChild('canvasMain', { static: true }) canvasMain!: ElementRef;
  @Input() imageUrl!: string;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.hideConfirmCanvas();
    this.startCropper();
  }

  startCropper() {
    var image = document.getElementById('originalImage');

    if (image instanceof HTMLImageElement) {
      this.cropInstance = new Cropper(image, {
        initialAspectRatio: .75,
        viewMode: 2
      });
    } else {
      console.error('Invalid element');
    }
  }

  crop() {
    if (this.cropInstance) {
      this.cropInstance.crop();

      this.data = this.cropInstance.getCroppedCanvas().toDataURL('image/jpeg');

      var image2 = document.getElementById("croppedImage");
      image2?.setAttribute("src", this.data);

      this.showConfirmCanvas();
      this.hideMainCanvas();
    }
  }

  restore() {
    this.hideConfirmCanvas();
    this.showMainCanvas();
  }

  hideConfirmCanvas() {
    const canvasConfirmElement: HTMLElement = this.canvasConfirm.nativeElement;
    canvasConfirmElement.style.display = "none";
  }

  showConfirmCanvas() {
    const canvasConfirmElement: HTMLElement = this.canvasConfirm.nativeElement;
    canvasConfirmElement.style.display = "flex";
  }

  showMainCanvas() {
    const canvasMainElement: HTMLElement = this.canvasMain.nativeElement;
    canvasMainElement.style.display = "flex";
  }

  hideMainCanvas() {
    const canvasMainElement: HTMLElement = this.canvasMain.nativeElement;
    canvasMainElement.style.display = "none";
  }
}

import { Component } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss']
})
export class ImageEditorComponent {

  cropInstance: Cropper | null = null;
  data: any;

  constructor() { }

  ngOnInit() {
    this.startCropper();
  }

  startCropper() {
    var image = document.getElementById('image');

    if (image instanceof HTMLImageElement) {
      this.cropInstance = new Cropper(image, {
        // options here
      });
    } else {
      console.error('Invalid element');
    }
  }

  onConfirm() {
    if (this.cropInstance) {
      this.cropInstance.crop();
      var heightWidth = this.cropInstance.getData();

      this.data = this.cropInstance.getCroppedCanvas().toDataURL('image/jpeg');

      var canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
      var context = canvas.getContext('2d');

      if (canvas && context) {
        canvas.width = heightWidth.width;
        canvas.height = heightWidth.height;

        console.log(canvas.width);

        var image = new Image();
        image.onload = function () {
          context?.drawImage(image, 0, 0);
        };
        image.src = this.data;

        var image2 = document.getElementById("image");
        image2?.setAttribute("src", this.data);
      }
    }
  }
}

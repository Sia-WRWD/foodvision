import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  private croppedImageSubject = new BehaviorSubject<string>("");
  croppedImage$ = this.croppedImageSubject.asObservable();

  constructor(
    private _snackBar: MatSnackBar,
    private store: AngularFirestore,
    ) { }

  showSnackbar(msg: string, type: string) {
    this._snackBar.open(msg, type, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3 * 1000
    })
  }

  setCroppedImage(imgUrl: string) {
    this.croppedImageSubject.next(imgUrl);
  }

  getFoodInfo(food: string) {
    const uid = food.toLowerCase().replace(/\s/g, '-');

    return this.store.collection("food").doc(uid).valueChanges();
  }

  getRecipeInfo(food: string) {
    const uid = food.toLowerCase().replace(/\s/g, '-');

    return this.store.collection("recipe").doc(uid).valueChanges();
  }
}

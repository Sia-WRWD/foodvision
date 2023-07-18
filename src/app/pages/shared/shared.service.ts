import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, combineLatest, of, switchMap, throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface Recipe {
  instructions: any;
  source: string;
}

interface Section {
  title: string;
  ingredients: string;
}

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

  getRecipeInfo(food: string): Observable<[Recipe, Section[]]> {
    const uid = food.toLowerCase().replace(/_/g, '-');
  
    return this.store.collection('recipes').doc(uid).snapshotChanges().pipe(
      switchMap((recipeDoc) => {
        if (recipeDoc.payload.exists) {
          const recipeData = recipeDoc.payload.data() as Recipe;
  
          // Fetch the sections separately
          return this.store.collection<Section>(`recipes/${uid}/sections`).valueChanges().pipe(
            switchMap((sections: Section[]) => {
              const mergedData: [Recipe, Section[]] = [recipeData, sections];
              return of(mergedData);
            })
          );
        } else {
          return throwError('Recipe not found.');
        }
      })
    );
  }
}

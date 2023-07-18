import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { arrayUnion, arrayRemove } from 'firebase/firestore';
import { Observable, finalize, from, map, switchMap, throwError } from 'rxjs';
import firebase from 'firebase/compat/app';

interface UserData {
  allergens: string[];
  bookmark: string[];
  email: string;
  history: string[];
  name: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  LoginResult = "";
  RegisterResult = "";
  uid: any = "";
  private dbPath = '/users';
  private storagePath = '/user_food_image'
  userRef = this.store.collection(this.dbPath);

  constructor(
    private router: Router,
    private store: AngularFirestore,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) { }

  async Login(email: string, password: string) {
    const loggedInTime = JSON.stringify(new Date().getTime());

    await this.afAuth.signInWithEmailAndPassword(email, password)
      .then(userCreds => {
        this.uid = userCreds.user?.uid;

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("token", this.uid);
        sessionStorage.setItem("lastLoggedIn", loggedInTime);
        sessionStorage.setItem("loginSuccess", "true");

        this.LoginResult = "login-success";
      })
      .catch(err => {
        if (err.message.includes("no user record")) {
          this.LoginResult = "no-user-record";
        } else {
          this.LoginResult = "There's Error in Signing In, Please Contact the Admin!";
        }
      });

    return this.LoginResult;
  }

  fetchUserInfo(uid: any) {
    return this.store.collection("users").doc(uid).valueChanges();
  }

  async Register(email: string, name: string, password: string, username: string, allergens: string) {
    const loggedInTime = JSON.stringify(new Date().getTime());

    await this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(userCreds => {
        this.uid = userCreds.user?.uid;
        sessionStorage.setItem("registerSuccess", "true");

        this.userRef.doc(this.uid).set({
          email: email,
          name: name,
          username: username,
          allergens: allergens,
          bookmark: [],
          history: []
        });

        this.RegisterResult = "register-success";

      }).catch(error => {
        if (error.message.includes("email-already-in-use")) {
          this.RegisterResult = "email-already-in-use";
        }
      });

    return this.RegisterResult;
  }

  updateUserProfile(uid: string, name: string, username: string, allergens: string[]): Promise<string> {
    const userRef = this.store.collection('users').doc(uid);

    // Update the fields using the set method with { merge: true } option
    return userRef.set(
      {
        name: name,
        username: username,
        allergens: allergens
      },
      { merge: true }
    )
      .then(() => {
        return 'Profile Updated Successfully.';
      })
      .catch((error) => {
        return 'Error Updating profile: ' + error.message;
      });
  }

  updateHistory(uid: string, newValue: string) {
    this.store.collection("users").doc(uid).update({ history: arrayUnion(newValue) })
      .then(() => {
        // console.log("New Value added to user history successfully!");
      })
      .catch((error) => {
        console.error("Error adding new value: ", error);
      })
  }

  async updateBookmark(uid: string, value: string, operation: string): Promise<string> {
    try {
      if (operation === "add") {
        await this.store.collection("users").doc(uid).update({ bookmark: firebase.firestore.FieldValue.arrayUnion(value) });
        return "Added Food to Bookmark!";
      } else if (operation === "remove") {
        const bookmarkArray = await this.getUserBookmarkArray(uid);
        const matchingIndex = bookmarkArray.findIndex((item: string) => {
          const parsedItem = JSON.parse(item);
          return parsedItem.food === value;
        });

        if (matchingIndex !== -1) {
          bookmarkArray.splice(matchingIndex, 1);
          await this.store.collection("users").doc(uid).update({ bookmark: bookmarkArray });
          return "Removed Food from Bookmark!";
        } else {
          return "Food not found in Bookmark.";
        }
      } else {
        throw new Error("Invalid operation. Please use 'add' or 'remove'.");
      }
    } catch (error) {
      console.error("Error updating bookmark: ", error);
      throw error;
    }
  }


  async getUserBookmarkArray(uid: string): Promise<string[]> {
    const userSnapshot = await this.store.collection("users").doc(uid).get().toPromise();
    const userData = userSnapshot?.data() as UserData;

    return userData?.bookmark || [];
  }

  uploadImage(): Observable<string> {
    const fileDataUrl = sessionStorage.getItem('originalImage');
    const token = sessionStorage.getItem("token");

    if (fileDataUrl) {
      return this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            const timestamp = new Date().getTime();
            const fileName = `image_${timestamp}_${token}`;
            const filePath = `${this.storagePath}/${fileName}`;

            const byteString = atob(fileDataUrl.split(',')[1]);
            const mimeString = fileDataUrl.split(',')[0].split(':')[1].split(';')[0];
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uintArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
              uintArray[i] = byteString.charCodeAt(i);
            }
            const fileBlob = new Blob([arrayBuffer], { type: mimeString });

            const fileRef = this.storage.ref(filePath);
            const task: AngularFireUploadTask = this.storage.upload(filePath, fileBlob);

            return from(task).pipe(
              switchMap(() => fileRef.getDownloadURL()),
              finalize(() => fileRef.getDownloadURL().toPromise())
            );
          } else {
            return throwError('User is not authenticated.');
          }
        })
      );
    } else {
      return throwError('File data URL not found.');
    }
  }

  async sendPasswordResetEmail(email: string): Promise<string> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      return 'Successfully Sent Reset Password.';
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email. Please try again later.');
    }
  }

  logOut() {
    this.afAuth.signOut();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('lastLoggedIn');
    sessionStorage.removeItem('user-details');
    sessionStorage.removeItem("isLoggedIn");
    window.location.href = "home";
  }

  checkLastLogin() {
    const lastLoggedIn = sessionStorage.getItem('lastLoggedIn');

    if (!lastLoggedIn) {
      return null;
    }

    const hours = 1;
    const cLastLoggedIn = JSON.parse(lastLoggedIn);
    const now = new Date().getTime();

    if (now - cLastLoggedIn > hours * 60 * 60 * 1000) {
      this.logOut();
    }

    return lastLoggedIn;
  }

}

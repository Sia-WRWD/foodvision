import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  LoginResult = "";
  RegisterResult = "";
  uid: any = "";
  private dbPath = '/users';
  userRef = this.store.collection(this.dbPath);

  constructor(
    private router: Router,
    private store: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { }

  async Login(email: string, password: string) {
    console.log(this.userRef);

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

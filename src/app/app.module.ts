import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AMModule } from './am.module';
import { SharedModule } from './pages/shared/shared.module';

import { NavigationComponent } from './pages/shared/components/navigation/navigation.component';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error404/error404.component';
import { InformationComponent } from './pages/information/information.component';
import { AllergyInformationComponent } from './pages/information/allergy-information/allergy-information.component';
import { FoodInformationComponent } from './pages/information/food-information/food-information.component';

//Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from './environments/environment';

//Other Libraries
import { NgxHideOnScrollModule } from 'ngx-hide-on-scroll';
import { SearchComponent } from './pages/search/search.component';
import { ImageEditorComponent } from './pages/search/image-editor/image-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    InformationComponent,
    Error404Component,
    AllergyInformationComponent,
    FoodInformationComponent,
    SearchComponent,
    ImageEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AMModule,
    SharedModule,
    NgxHideOnScrollModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

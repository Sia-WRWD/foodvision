import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from  '@angular/common/http';

import { AMModule } from './am.module';
import { SharedModule } from './pages/shared/shared.module';
import { UserModule } from './pages/user/user.module';

import { NavigationComponent } from './pages/shared/components/navigation/navigation.component';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error404/error404.component';
import { InformationComponent } from './pages/information/information.component';
import { AllergyInformationComponent } from './pages/information/allergy-information/allergy-information.component';
import { SearchComponent } from './pages/search/search.component';
import { ImageEditorComponent } from './pages/search/image-editor/image-editor.component';
import { SocialMediaComponent } from './pages/information/social-media/social-media.component';
import { RecipeComponent } from './pages/recipe/recipe.component';

//Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from './environments/environment';

//Other Libraries
import { NgxHideOnScrollModule } from 'ngx-hide-on-scroll';
import { AGoogTransModule } from 'a-goog-trans';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    InformationComponent,
    Error404Component,
    AllergyInformationComponent,
    SearchComponent,
    ImageEditorComponent,
    SocialMediaComponent,
    RecipeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AMModule,
    SharedModule,
    UserModule,
    NgxHideOnScrollModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FontAwesomeModule,
    HttpClientModule,
    AGoogTransModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './components/footer/footer.component';
import { GoogleTranslatorComponent } from './components/google-translator/google-translator.component';
import { AMModule } from 'src/app/am.module';
import { AGoogTransModule } from 'a-goog-trans';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
    declarations: [
      FooterComponent,
      GoogleTranslatorComponent,
    ],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      AMModule,
      AGoogTransModule,
      FontAwesomeModule
    ],
    exports: [
      FooterComponent,
      GoogleTranslatorComponent,
      FormsModule,
      ReactiveFormsModule,
      FontAwesomeModule
    ],
    providers: [],
    bootstrap: []
  })
  export class SharedModule { }
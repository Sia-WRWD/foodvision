import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FooterComponent } from './components/footer/footer.component';
import { GoogleTranslatorComponent } from './components/google-translator/google-translator.component';
import { AMModule } from 'src/app/am.module';



@NgModule({
    declarations: [
      FooterComponent,
      GoogleTranslatorComponent,
    ],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      AMModule
    ],
    exports: [
      FooterComponent,
      GoogleTranslatorComponent,
      FormsModule,
      ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: []
  })
  export class SharedModule { }
import { Component } from '@angular/core';

@Component({
  selector: 'app-google-translator',
  templateUrl: './google-translator.component.html',
  styleUrls: ['./google-translator.component.scss']
})
export class GoogleTranslatorComponent {
  languagesToInclude: string = "";
  defaultLanguage: string = "en";

  constructor() {}

}

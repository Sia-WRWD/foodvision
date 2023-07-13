import { Component } from '@angular/core';

@Component({
  selector: 'app-google-translator',
  templateUrl: './google-translator.component.html',
  styleUrls: ['./google-translator.component.scss']
})
export class GoogleTranslatorComponent {
  languagesToInclude: string = "";
  defaultLanguage: string = "en";
  domainName: string = "foodvision-5132c.web.app"; //domainName: For Development === "localhost" || For Production === ".foodvision-5132c.web.app"

  constructor() {}

}

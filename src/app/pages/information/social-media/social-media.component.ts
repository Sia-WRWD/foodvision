import { Component, Input, ViewChild } from '@angular/core';
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent {
  @Input() foodData: any;
  @Input() foodName: any;

  urlFoodName!: string;
  imgFoodName!: string;
  smFoodName!: string;

  faShareFromSquare = faShareFromSquare;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faWhatsapp = faWhatsapp;

  isShowButtons: boolean = false;

  constructor() { }

  ngOnInit() {
    this.urlFoodName = this.foodName.replace(/ /g, '_').toLowerCase();
    this.imgFoodName = this.foodName.replace(/ /g, '-').toLowerCase();
    this.smFoodName = this.foodName.replace(/ /g, '').toLowerCase();
  }

  showHideButtons() {
    var smc = document.getElementById('smc');

    if (this.isShowButtons == false) {
      smc!.style.width = "250px";
      //smc!.style.padding = "15px";
      this.isShowButtons = true;
    } else {
      smc!.style.width = "50px";
      //smc!.style.padding = "10px";
      this.isShowButtons = false;
    }
  }

  shareFacebook() {
    const link = `${document.baseURI}information?shared=true&food=${this.urlFoodName}`; // URL to share

    const encodedLink = encodeURIComponent(link);

    const facebookUrl = `https://www.facebook.com/sharer.php?u=${encodedLink}`;

    window.open(facebookUrl, '_blank');
  }

  shareTwitter() {
    const link = `${document.baseURI}information?shared=true&food=${this.urlFoodName}`; // URL to share
    const msg = `Check out the food that I have just found out about called "${this.foodName}" #Malaysia #${this.smFoodName} #FoodVision`;; // Quote or message
    const encodedLink = encodeURIComponent(link);
    const encodedMsg = encodeURIComponent(msg);

    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedLink}&text=${encodedMsg}`;

    window.open(twitterUrl, '_blank');
  }

  shareWhatsapp() {
    const link = `${document.baseURI}information?shared=true&food=${this.urlFoodName}`; // URL to share
    const msg = `Check out the food that I have just found out about called "${this.foodName}" #Malaysia #${this.smFoodName} #FoodVision`;; // Quote or message
    const encodedLink = encodeURIComponent(link);
    const encodedMsg = encodeURIComponent(msg);
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMsg} @ ${encodedLink}`;
  
    window.open(whatsappUrl, '_blank');
  }
}

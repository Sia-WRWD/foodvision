import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-allergy-information',
  templateUrl: './allergy-information.component.html',
  styleUrls: ['./allergy-information.component.scss']
})
export class AllergyInformationComponent {
  @Input() allergens!: string[];
  symptoms: any =
    [
      { name: "Eczema", img: "../../../../assets/symptom-img/eczema.jpg", description: "Dry, itchy, inflamed skin.", threatLevel: "Low" },
      { name: "Abdominal Pain", img: "../../../../assets/symptom-img/abdominal-pain.jpg", description: "Pain or discomfort in the abdominal area.", threatLevel: "Low" },
      { name: "Swelling Face", img: "../../../../assets/symptom-img/swollen-face.jpg", description: "Swelling or puffiness of the face.", threatLevel: "Moderate" },
      { name: "Swelling Tongue", img: "../../../../assets/symptom-img/swollen-tongue.jpg", description: "Swelling of the tongue.", threatLevel: "High" },
      { name: "Swelling Lips", img: "../../../../assets/symptom-img/swollen-lips.jpg", description: "Swelling and itching sensation of the lips.", threatLevel: "High" },
      { name: "Vomitting", img: "../../../../assets/symptom-img/vomitting.jpg", description: "Feeling of sickness or discomfort in the stomach.", threatLevel: "Low" },
      { name: "Headache", img: "../../../../assets/symptom-img/headache.jpg", description: "Pain or discomfort in the head.", threatLevel: "Low" },
      { name: "Trouble Breathing", img: "../../../../assets/symptom-img/trouble-breathing.jpg", description: "Difficulty breathing or shortness of breath.", threatLevel: "High" },
      { name: "Diarrhea", img: "../../../../assets/symptom-img/diarrhea.jpg", description: "Frequent and watery bowel movements.", threatLevel: "Low" }
    ]

  selectedSymptom: any;
  treatments: any =
    [
      { name: "Adrenaline Injection", img: "../../../../assets/symptom-img/adrenaline-injection.jpg", description: "First-line treatment for severe allergic reactions." },
      { name: "Antihistamines", img: "../../../../assets/symptom-img/antihistamine.jpg", description: "Relieves mild to moderate allergic symptoms." },
      { name: "Corticosteroids", img: "../../../../assets/symptom-img/corticosteroid.jpg", description: "Reduces inflammation and suppresses immune response." },
      { name: "Emergency Services", img: "../../../../assets/symptom-img/emergency-services.jpg", description: "Requesting for immediate assistance from emergency medical services." }
    ]


  selectedTreatment: any;


  ngOnInit() {
    this.selectedSymptom = this.symptoms[0];
    this.selectedTreatment = this.treatments[0];
  }

  displaySymptom(symptomNo: number) {
    this.selectedSymptom = this.symptoms[symptomNo];
  }

  displayTreatment(treatmentNo: number) {
    this.selectedTreatment = this.treatments[treatmentNo];
  }
}

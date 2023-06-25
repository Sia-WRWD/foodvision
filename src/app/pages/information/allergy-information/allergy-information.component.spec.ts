import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllergyInformationComponent } from './allergy-information.component';

describe('AllergyInformationComponent', () => {
  let component: AllergyInformationComponent;
  let fixture: ComponentFixture<AllergyInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllergyInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllergyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

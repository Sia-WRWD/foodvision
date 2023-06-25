import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodInformationComponent } from './food-information.component';

describe('FoodInformationComponent', () => {
  let component: FoodInformationComponent;
  let fixture: ComponentFixture<FoodInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

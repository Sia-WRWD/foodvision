import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleTranslatorComponent } from './google-translator.component';

describe('GoogleTranslatorComponent', () => {
  let component: GoogleTranslatorComponent;
  let fixture: ComponentFixture<GoogleTranslatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoogleTranslatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleTranslatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorBankDetailsComponent } from './tutor-bank-details.component';

describe('TutorBankDetailsComponent', () => {
  let component: TutorBankDetailsComponent;
  let fixture: ComponentFixture<TutorBankDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorBankDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorBankDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

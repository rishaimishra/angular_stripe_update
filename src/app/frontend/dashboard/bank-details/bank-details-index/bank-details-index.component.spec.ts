import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsIndexComponent } from './bank-details-index.component';

describe('BankDetailsIndexComponent', () => {
  let component: BankDetailsIndexComponent;
  let fixture: ComponentFixture<BankDetailsIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDetailsIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

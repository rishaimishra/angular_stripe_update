import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsManageComponent } from './bank-details-manage.component';

describe('BankDetailsManageComponent', () => {
  let component: BankDetailsManageComponent;
  let fixture: ComponentFixture<BankDetailsManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDetailsManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

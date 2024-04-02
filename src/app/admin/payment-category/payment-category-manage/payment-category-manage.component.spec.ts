import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCategoryManageComponent } from './payment-category-manage.component';

describe('PaymentCategoryManageComponent', () => {
  let component: PaymentCategoryManageComponent;
  let fixture: ComponentFixture<PaymentCategoryManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCategoryManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCategoryManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

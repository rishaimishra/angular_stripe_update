import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCategoryListComponent } from './payment-category-list.component';

describe('PaymentCategoryListComponent', () => {
  let component: PaymentCategoryListComponent;
  let fixture: ComponentFixture<PaymentCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

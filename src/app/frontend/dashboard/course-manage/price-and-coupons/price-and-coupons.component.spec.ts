import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceAndCouponsComponent } from './price-and-coupons.component';

describe('PriceAndCouponsComponent', () => {
  let component: PriceAndCouponsComponent;
  let fixture: ComponentFixture<PriceAndCouponsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceAndCouponsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceAndCouponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

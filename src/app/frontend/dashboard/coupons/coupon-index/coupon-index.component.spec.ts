import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponIndexComponent } from './coupon-index.component';

describe('CouponIndexComponent', () => {
  let component: CouponIndexComponent;
  let fixture: ComponentFixture<CouponIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

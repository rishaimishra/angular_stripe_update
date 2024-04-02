import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponEditModalComponent } from './coupon-edit-modal.component';

describe('CouponEditModalComponent', () => {
  let component: CouponEditModalComponent;
  let fixture: ComponentFixture<CouponEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

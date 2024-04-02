import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsOrderDetailsComponent } from './vendors-order-details.component';

describe('VendorsOrderDetailsComponent', () => {
  let component: VendorsOrderDetailsComponent;
  let fixture: ComponentFixture<VendorsOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorsOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorsOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

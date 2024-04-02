import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutListComponent } from './payout-list.component';

describe('PayoutListComponent', () => {
  let component: PayoutListComponent;
  let fixture: ComponentFixture<PayoutListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

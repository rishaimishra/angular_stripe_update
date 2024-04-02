import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedPayoutsListComponent } from './requested-payouts-list.component';

describe('RequestedPayoutsListComponent', () => {
  let component: RequestedPayoutsListComponent;
  let fixture: ComponentFixture<RequestedPayoutsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedPayoutsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedPayoutsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

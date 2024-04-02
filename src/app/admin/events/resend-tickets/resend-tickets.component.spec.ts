import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendTicketsComponent } from './resend-tickets.component';

describe('ResendTicketsComponent', () => {
  let component: ResendTicketsComponent;
  let fixture: ComponentFixture<ResendTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResendTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

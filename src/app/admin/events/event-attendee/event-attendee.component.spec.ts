import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAttendeeComponent } from './event-attendee.component';

describe('EventAttendeeComponent', () => {
  let component: EventAttendeeComponent;
  let fixture: ComponentFixture<EventAttendeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAttendeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

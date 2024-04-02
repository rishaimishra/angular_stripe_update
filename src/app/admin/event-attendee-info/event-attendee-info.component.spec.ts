import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAttendeeInfoComponent } from './event-attendee-info.component';

describe('EventAttendeeInfoComponent', () => {
  let component: EventAttendeeInfoComponent;
  let fixture: ComponentFixture<EventAttendeeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventAttendeeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAttendeeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

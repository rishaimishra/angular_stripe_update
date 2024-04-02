import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsLandingPageComponent } from './events-landing-page.component';

describe('EventsLandingPageComponent', () => {
  let component: EventsLandingPageComponent;
  let fixture: ComponentFixture<EventsLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

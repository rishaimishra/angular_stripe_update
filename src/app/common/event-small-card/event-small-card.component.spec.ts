import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSmallCardComponent } from './event-small-card.component';

describe('EventSmallCardComponent', () => {
  let component: EventSmallCardComponent;
  let fixture: ComponentFixture<EventSmallCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSmallCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSmallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

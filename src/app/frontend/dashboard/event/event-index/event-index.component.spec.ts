import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventIndexComponent } from './event-index.component';

describe('EventIndexComponent', () => {
  let component: EventIndexComponent;
  let fixture: ComponentFixture<EventIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarousalEventCardComponent } from './carousal-event-card.component';

describe('CarousalEventCardComponent', () => {
  let component: CarousalEventCardComponent;
  let fixture: ComponentFixture<CarousalEventCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarousalEventCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarousalEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

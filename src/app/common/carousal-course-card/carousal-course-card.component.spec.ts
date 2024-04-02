import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarousalCourseCardComponent } from './carousal-course-card.component';

describe('CarousalCourseCardComponent', () => {
  let component: CarousalCourseCardComponent;
  let fixture: ComponentFixture<CarousalCourseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarousalCourseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarousalCourseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

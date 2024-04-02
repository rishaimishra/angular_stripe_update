import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorCourseDetailsComponent } from './tutor-course-details.component';

describe('TutorCourseDetailsComponent', () => {
  let component: TutorCourseDetailsComponent;
  let fixture: ComponentFixture<TutorCourseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorCourseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

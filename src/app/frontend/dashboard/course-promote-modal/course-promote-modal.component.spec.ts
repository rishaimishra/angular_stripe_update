import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePromoteModalComponent } from './course-promote-modal.component';

describe('CoursePromoteModalComponent', () => {
  let component: CoursePromoteModalComponent;
  let fixture: ComponentFixture<CoursePromoteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePromoteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePromoteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

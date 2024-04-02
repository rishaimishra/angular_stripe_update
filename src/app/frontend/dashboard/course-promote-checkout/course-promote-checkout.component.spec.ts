import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePromoteCheckoutComponent } from './course-promote-checkout.component';

describe('CoursePromoteCheckoutComponent', () => {
  let component: CoursePromoteCheckoutComponent;
  let fixture: ComponentFixture<CoursePromoteCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursePromoteCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursePromoteCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

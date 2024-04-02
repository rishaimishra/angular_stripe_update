import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLandingPageComponent } from './course-landing-page.component';

describe('CourseLandingPageComponent', () => {
  let component: CourseLandingPageComponent;
  let fixture: ComponentFixture<CourseLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

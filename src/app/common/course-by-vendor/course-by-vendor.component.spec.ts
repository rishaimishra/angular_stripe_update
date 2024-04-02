import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseByVendorComponent } from './course-by-vendor.component';

describe('CourseByVendorComponent', () => {
  let component: CourseByVendorComponent;
  let fixture: ComponentFixture<CourseByVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseByVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseByVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

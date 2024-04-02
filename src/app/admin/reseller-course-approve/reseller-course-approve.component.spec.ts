import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerCourseApproveComponent } from './reseller-course-approve.component';

describe('ResellerCourseApproveComponent', () => {
  let component: ResellerCourseApproveComponent;
  let fixture: ComponentFixture<ResellerCourseApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerCourseApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerCourseApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

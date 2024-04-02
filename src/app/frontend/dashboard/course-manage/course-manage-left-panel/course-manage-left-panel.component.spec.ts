import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseManageLeftPanelComponent } from './course-manage-left-panel.component';

describe('CourseManageLeftPanelComponent', () => {
  let component: CourseManageLeftPanelComponent;
  let fixture: ComponentFixture<CourseManageLeftPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseManageLeftPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseManageLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesManageComponent } from './courses-manage.component';

describe('CoursesManageComponent', () => {
  let component: CoursesManageComponent;
  let fixture: ComponentFixture<CoursesManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

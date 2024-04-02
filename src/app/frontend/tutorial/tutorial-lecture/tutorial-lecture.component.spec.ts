import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialLectureComponent } from './tutorial-lecture.component';

describe('TutorialLectureComponent', () => {
  let component: TutorialLectureComponent;
  let fixture: ComponentFixture<TutorialLectureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialLectureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

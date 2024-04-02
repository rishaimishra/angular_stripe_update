import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorQuestionAnswerReplyModalComponent } from './tutor-question-answer-reply-modal.component';

describe('TutorQuestionAnswerReplyModalComponent', () => {
  let component: TutorQuestionAnswerReplyModalComponent;
  let fixture: ComponentFixture<TutorQuestionAnswerReplyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorQuestionAnswerReplyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorQuestionAnswerReplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

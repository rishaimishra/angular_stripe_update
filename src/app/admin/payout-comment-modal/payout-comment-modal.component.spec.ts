import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutCommentModalComponent } from './payout-comment-modal.component';

describe('PayoutCommentModalComponent', () => {
  let component: PayoutCommentModalComponent;
  let fixture: ComponentFixture<PayoutCommentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayoutCommentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

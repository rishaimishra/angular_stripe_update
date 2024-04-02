import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketReplyModalComponent } from './ticket-reply-modal.component';

describe('TicketReplyModalComponent', () => {
  let component: TicketReplyModalComponent;
  let fixture: ComponentFixture<TicketReplyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketReplyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketReplyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

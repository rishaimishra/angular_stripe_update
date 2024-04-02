import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutMsgComponent } from './logout-msg.component';

describe('LogoutMsgComponent', () => {
  let component: LogoutMsgComponent;
  let fixture: ComponentFixture<LogoutMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

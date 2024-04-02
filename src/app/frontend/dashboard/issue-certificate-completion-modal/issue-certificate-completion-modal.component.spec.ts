import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCertificateCompletionModalComponent } from './issue-certificate-completion-modal.component';

describe('IssueCertificateCompletionModalComponent', () => {
  let component: IssueCertificateCompletionModalComponent;
  let fixture: ComponentFixture<IssueCertificateCompletionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueCertificateCompletionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCertificateCompletionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

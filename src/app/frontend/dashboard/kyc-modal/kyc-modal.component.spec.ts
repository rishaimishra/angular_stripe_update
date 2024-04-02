import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycModalComponent } from './kyc-modal.component';

describe('KycModalComponent', () => {
  let component: KycModalComponent;
  let fixture: ComponentFixture<KycModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerManageComponent } from './speaker-manage.component';

describe('SpeakerManageComponent', () => {
  let component: SpeakerManageComponent;
  let fixture: ComponentFixture<SpeakerManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeakerManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeakerManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

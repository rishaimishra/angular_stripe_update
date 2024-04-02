import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySpeakerManageComponent } from './my-speaker-manage.component';

describe('MySpeakerManageComponent', () => {
  let component: MySpeakerManageComponent;
  let fixture: ComponentFixture<MySpeakerManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySpeakerManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySpeakerManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

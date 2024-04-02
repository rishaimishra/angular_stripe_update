import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySpeakerListComponent } from './my-speaker-list.component';

describe('MySpeakerListComponent', () => {
  let component: MySpeakerListComponent;
  let fixture: ComponentFixture<MySpeakerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MySpeakerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySpeakerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

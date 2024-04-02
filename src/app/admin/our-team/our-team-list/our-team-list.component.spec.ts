import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurTeamListComponent } from './our-team-list.component';

describe('OurTeamListComponent', () => {
  let component: OurTeamListComponent;
  let fixture: ComponentFixture<OurTeamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurTeamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurTeamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

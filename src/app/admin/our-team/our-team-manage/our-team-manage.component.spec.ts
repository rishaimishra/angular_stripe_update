import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurTeamManageComponent } from './our-team-manage.component';

describe('OurTeamManageComponent', () => {
  let component: OurTeamManageComponent;
  let fixture: ComponentFixture<OurTeamManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurTeamManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurTeamManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

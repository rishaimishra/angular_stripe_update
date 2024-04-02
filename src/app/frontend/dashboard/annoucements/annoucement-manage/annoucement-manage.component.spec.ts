import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoucementManageComponent } from './annoucement-manage.component';

describe('AnnoucementManageComponent', () => {
  let component: AnnoucementManageComponent;
  let fixture: ComponentFixture<AnnoucementManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoucementManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoucementManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetYourStudentsComponent } from './target-your-students.component';

describe('TargetYourStudentsComponent', () => {
  let component: TargetYourStudentsComponent;
  let fixture: ComponentFixture<TargetYourStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetYourStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetYourStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

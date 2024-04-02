import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialIndexComponent } from './tutorial-index.component';

describe('TutorialIndexComponent', () => {
  let component: TutorialIndexComponent;
  let fixture: ComponentFixture<TutorialIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

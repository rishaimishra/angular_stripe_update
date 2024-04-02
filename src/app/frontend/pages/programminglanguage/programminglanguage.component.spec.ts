import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramminglanguageComponent } from './programminglanguage.component';

describe('ProgramminglanguageComponent', () => {
  let component: ProgramminglanguageComponent;
  let fixture: ComponentFixture<ProgramminglanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramminglanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramminglanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

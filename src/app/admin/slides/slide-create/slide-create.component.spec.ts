import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideCreateComponent } from './slide-create.component';

describe('SlideCreateComponent', () => {
  let component: SlideCreateComponent;
  let fixture: ComponentFixture<SlideCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

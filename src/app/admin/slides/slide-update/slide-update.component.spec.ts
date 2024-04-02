import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideUpdateComponent } from './slide-update.component';

describe('SlideUpdateComponent', () => {
  let component: SlideUpdateComponent;
  let fixture: ComponentFixture<SlideUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

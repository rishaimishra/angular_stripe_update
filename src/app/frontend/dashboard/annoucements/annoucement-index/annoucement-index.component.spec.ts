import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoucementIndexComponent } from './annoucement-index.component';

describe('AnnoucementIndexComponent', () => {
  let component: AnnoucementIndexComponent;
  let fixture: ComponentFixture<AnnoucementIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoucementIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoucementIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

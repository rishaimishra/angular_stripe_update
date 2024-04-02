import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoucementListComponent } from './annoucement-list.component';

describe('AnnoucementListComponent', () => {
  let component: AnnoucementListComponent;
  let fixture: ComponentFixture<AnnoucementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoucementListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoucementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPageEditComponent } from './cms-page-edit.component';

describe('CmsPageEditComponent', () => {
  let component: CmsPageEditComponent;
  let fixture: ComponentFixture<CmsPageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

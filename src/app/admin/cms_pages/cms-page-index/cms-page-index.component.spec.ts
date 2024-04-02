import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPageIndexComponent } from './cms-page-index.component';

describe('CmsPageIndexComponent', () => {
  let component: CmsPageIndexComponent;
  let fixture: ComponentFixture<CmsPageIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPageIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPageIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

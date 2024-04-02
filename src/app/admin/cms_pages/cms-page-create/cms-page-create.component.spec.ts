import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPageCreateComponent } from './cms-page-create.component';

describe('CmsPageCreateComponent', () => {
  let component: CmsPageCreateComponent;
  let fixture: ComponentFixture<CmsPageCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmsPageCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsPageCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

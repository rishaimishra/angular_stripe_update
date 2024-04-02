import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendPaginationComponent } from './frontend-pagination.component';

describe('FrontendPaginationComponent', () => {
  let component: FrontendPaginationComponent;
  let fixture: ComponentFixture<FrontendPaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontendPaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontendPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideListingComponent } from './slide-listing.component';

describe('SlideListingComponent', () => {
  let component: SlideListingComponent;
  let fixture: ComponentFixture<SlideListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

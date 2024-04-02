import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialIndexComponent } from './testimonial-index.component';

describe('TestimonialIndexComponent', () => {
	let component: TestimonialIndexComponent;
	let fixture: ComponentFixture<TestimonialIndexComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestimonialIndexComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestimonialIndexComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

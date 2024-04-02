import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimoniaCreateComponent } from './testimonial-create.component';

describe('TestimoniaCreateComponent', () => {
	let component: TestimoniaCreateComponent;
	let fixture: ComponentFixture<TestimoniaCreateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestimoniaCreateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestimoniaCreateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimoniaEditComponent } from './testimonial-edit.component';

describe('TestimoniaEditComponent', () => {
	let component: TestimoniaEditComponent;
	let fixture: ComponentFixture<TestimoniaEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestimoniaEditComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestimoniaEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

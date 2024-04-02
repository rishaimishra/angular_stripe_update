import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgReactiveFormValidatorModule } from 'ng-reactive-form-validator';
import { CommonService } from './services/common.service';
import { CourseService } from './services/course.service';
import { OwlModule } from 'ngx-owl-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from './pagination/pagination.component';
import { FrontendPaginationComponent } from './frontend-pagination/frontend-pagination.component';
import { BannerSliderComponent } from './banner-slider/banner-slider.component';

import { DatePipe } from '@angular/common';
@NgModule({
	imports: [
		CommonModule,
		OwlModule,
		RouterModule,
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [
		PaginationComponent, 
		FrontendPaginationComponent, 
		BannerSliderComponent, 
	
	],
	exports: [
		ReactiveFormsModule,
		PaginationComponent,
		BannerSliderComponent,
		FrontendPaginationComponent,
		NgReactiveFormValidatorModule,
		
	],

	providers: [
		FormBuilder,
		CommonService,
		CourseService,
		
		DatePipe
	],
	entryComponents: [
		
	],
})
export class GlobalModule { }

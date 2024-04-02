import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { GlobalModule } from '../global/global.module';
import { MomentModule } from 'ngx-moment';

import { NotificationMessageComponent } from '../common/notification-message/notification-message.component';
import { ValidationMessageComponent } from '../common/validation-message/validation-message.component';
import { AccessDeniedComponent } from '../common/access-denied/access-denied.component';
import { BreadcrumbComponent } from '../common/breadcrumb/breadcrumb.component';
import { PageLoaderComponent } from '../common/page-loader/page-loader.component';

import { HeaderComponent } from './include/header/header.component';
import { FooterComponent } from './include/footer/footer.component';
import { LogoutMsgComponent } from './include/logout-msg/logout-msg.component';
import { CourseByVendorComponent } from './course-by-vendor/course-by-vendor.component';
import { CarousalCourseCardComponent } from './carousal-course-card/carousal-course-card.component';
import { EventCardComponent } from './event-card/event-card.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { ProductByVendorComponent } from './product-by-vendor/product-by-vendor.component';
import { FilterComponent } from './filter/filter.component';
import { Ng5SliderModule } from 'ng5-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventSmallCardComponent } from './event-small-card/event-small-card.component';
import { CarousalEventCardComponent } from './carousal-event-card/carousal-event-card.component';
import { CouponEditModalComponent } from './coupon-edit-modal/coupon-edit-modal.component';

@NgModule({
	imports: [
		CommonModule,
		GlobalModule,
		NgbModule,
		RouterModule,
		Ng5SliderModule,
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		MomentModule
	],
	declarations: [
		/*
			|--------------------------------------------------------------------------
			| Common Component
			|--------------------------------------------------------------------------
			*/
		NotificationMessageComponent,
		ValidationMessageComponent,
		BreadcrumbComponent,
		AccessDeniedComponent,
		PageLoaderComponent,
		CourseByVendorComponent,
		CarousalCourseCardComponent,

		HeaderComponent,
		FooterComponent,
		LogoutMsgComponent,
		EventCardComponent,
		ProductCardComponent,
		CourseCardComponent,
		ProductByVendorComponent,
		FilterComponent,
		EventSmallCardComponent,
		CarousalEventCardComponent,
		CouponEditModalComponent
	],
	exports: [
		/*
		   |--------------------------------------------------------------------------
		   | Common Component
		   |--------------------------------------------------------------------------
		   */
		NotificationMessageComponent,
		ValidationMessageComponent,
		BreadcrumbComponent,
		AccessDeniedComponent,
		//   PaginationComponent,
		PageLoaderComponent,
		CourseByVendorComponent,
		CarousalCourseCardComponent,

		HeaderComponent,
		FooterComponent,
		LogoutMsgComponent,
		EventCardComponent,
		ProductCardComponent,
		CourseCardComponent,
		ProductByVendorComponent,
		FilterComponent,
		EventSmallCardComponent,
		CarousalEventCardComponent,
		CouponEditModalComponent
	],
	entryComponents: [
		LogoutMsgComponent
	]
})
export class SharedModule { }

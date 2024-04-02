import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
import { DataTableModule } from 'angular-6-datatable';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';

import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { AdminRoutingModule } from './admin-routing.module';
import { GlobalModule } from '../global/global.module';
import { AdminComponent } from './admin.component';


import { HeaderComponent } from './include/header/header.component';
import { FooterComponent } from './include/footer/footer.component';
import { SidebarComponent } from './include/sidebar/sidebar.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CmsPageIndexComponent } from './cms_pages/cms-page-index/cms-page-index.component';
import { CmsPageCreateComponent } from './cms_pages/cms-page-create/cms-page-create.component';
import { CmsPageEditComponent } from './cms_pages/cms-page-edit/cms-page-edit.component';

import { UserComponent } from './users/user-listing/users.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { UserChangePasswordComponent } from './users/change-password/change-password.component';
import { UpdatePasswordComponent } from './users/update-password/update-password.component';
import { UpdateProfileComponent } from './users/update-profile/update-profile.component';

import { CategoryIndexComponent } from './category/category-index/category-index.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { CategoryEditComponent } from './category/category-edit/category-edit.component';

import { RoleIndexComponent } from './role/role-index/role-index.component';
import { RoleCreateComponent } from './role/role-create/role-create.component';
import { RoleEditComponent } from './role/role-edit/role-edit.component';

import { CourseListComponent } from './course/course-list/course-list.component';

import { SharedModule } from '../common/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*******Import Dirtective list ********/
import { CustomDirective } from '../directive/directive';

/*******Import Pipe list ********/
import { CustomPipes } from '../pipe/pipe';
import { MomentModule } from 'ngx-moment';

import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CapitalizePipe } from '../common/CapitalizePipe';
import { PaginationComponent } from '../common/pagination/pagination.component';
import { SlideListingComponent } from './slides/slide-listing/slide-listing.component';
import { SlideCreateComponent } from './slides/slide-create/slide-create.component';
import { SlideUpdateComponent } from './slides/slide-update/slide-update.component';

import { S3BucketService } from '../services/s3-bucket.service';
import { EventListComponent } from './events/event-list/event-list.component';
import { ProductListComponent } from './products/product-list/product-list.component';

import { TestimonialIndexComponent } from './testimonial/testimonial-index/testimonial-index.component';
import { TestimoniaCreateComponent } from './testimonial/testimonial-create/testimonial-create.component';
import { TestimoniaEditComponent } from './testimonial/testimonial-edit/testimonial-edit.component';

import { ChartsModule } from 'ng2-charts';
import { RequestedPayoutsListComponent } from './payout/requested-payouts-list/requested-payouts-list.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { NotificationManageComponent } from './notification/notification-manage/notification-manage.component';
import { AnnoucementListComponent } from './annoucements/annoucement-list/annoucement-list.component';

import { Ng5SliderModule } from 'ng5-slider';
import { TutorBankDetailsComponent } from './tutor-management/tutor-bank-details/tutor-bank-details.component';
import { OurTeamListComponent } from './our-team/our-team-list/our-team-list.component';
import { OurTeamManageComponent } from './our-team/our-team-manage/our-team-manage.component';
import { SettingsComponent } from './settings/settings.component';
import { ResellerCourseApproveComponent } from './reseller-course-approve/reseller-course-approve.component';
import { PaymentCategoryListComponent } from './payment-category/payment-category-list/payment-category-list.component';
import { PaymentCategoryManageComponent } from './payment-category/payment-category-manage/payment-category-manage.component';
import { SpeakerListComponent } from './speaker/speaker-list/speaker-list.component';
import { SpeakerManageComponent } from './speaker/speaker-manage/speaker-manage.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PayoutListComponent } from './payout/payout-list/payout-list.component';
import { PayoutCommentModalComponent } from './payout-comment-modal/payout-comment-modal.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CommissionReportComponent } from './commission-report/commission-report.component';
import { VideoListComponent } from './video/video-list/video-list.component';
import { VideoManageComponent } from './video/video-manage/video-manage.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { TicketReplyComponent } from './ticket/ticket-reply/ticket-reply.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EventAttendeeInfoComponent } from './event-attendee-info/event-attendee-info.component';
import { EventAttendeeComponent } from './events/event-attendee/event-attendee.component';
import { ResendTicketsComponent } from './events/resend-tickets/resend-tickets.component';


@NgModule({
	imports: [
		CommonModule,
		AdminRoutingModule,
		SharedModule,
		DataTableModule,
		FormsModule,
		ReactiveFormsModule,
		SweetAlert2Module.forRoot(environment.notificationConfig),
		CKEditorModule,
		CustomDirective,
		CustomPipes,
		NgbModule,
		ImageCropperModule,
		NgbModule,
		NgSelectModule,
		ChartsModule,
		GlobalModule,
		MomentModule,
		Ng5SliderModule,
		InfiniteScrollModule
	],
	declarations: [

		CapitalizePipe,


		HeaderComponent,
		FooterComponent,
		SidebarComponent,
		PaginationComponent,

		AdminComponent,
		DashboardComponent,
		CmsPageIndexComponent,
		CmsPageCreateComponent,
		CmsPageEditComponent,

		UserComponent,
		UserDetailsComponent,
		UserEditComponent,
		UserChangePasswordComponent,
		UpdateProfileComponent,
		UpdatePasswordComponent,

		SlideListingComponent,
		SlideCreateComponent,
		SlideUpdateComponent,

		CategoryIndexComponent,
		CategoryCreateComponent,
		CategoryEditComponent,

		RoleIndexComponent,
		RoleCreateComponent,
		RoleEditComponent,
		CourseListComponent,
		EventListComponent,
		ProductListComponent,

		TestimonialIndexComponent,
		TestimoniaCreateComponent,
		TestimoniaEditComponent,
		RequestedPayoutsListComponent,
		NotificationListComponent,
		NotificationManageComponent,
		AnnoucementListComponent,
		TutorBankDetailsComponent,
		OurTeamListComponent,
		OurTeamManageComponent,
		SettingsComponent,
		ResellerCourseApproveComponent,
		PaymentCategoryListComponent,
		PaymentCategoryManageComponent,
		SpeakerListComponent,
		SpeakerManageComponent,
		OrdersComponent,
		OrderDetailsComponent,
		PayoutListComponent,
		PayoutCommentModalComponent,
		CourseDetailsComponent,
		CommissionReportComponent,
		VideoListComponent,
		VideoManageComponent,
		TicketListComponent,
		TicketReplyComponent,
		EventAttendeeInfoComponent,
		EventAttendeeComponent,
		ResendTicketsComponent,


	],
	providers: [
		S3BucketService


	],
	entryComponents: [
		PayoutCommentModalComponent
	]
})
export class AdminModule { }

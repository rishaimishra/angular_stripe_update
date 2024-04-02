import { environment } from '../../../environments/environment';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { DataTableModule } from 'angular-6-datatable';

import { SharedModule } from '../../common/shared.module';
import { CustomDirective } from '../../directive/directive';

/*******Import Pipe list ********/
import { CustomPipes } from '../../pipe/pipe';
import { MomentModule } from 'ngx-moment';

import { RoleGuard } from '../../services/role-guard.service';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { ProductLayoutComponent } from './product-layout.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';
import { DashboardLeftPanelComponent } from './dashboard-left-panel/dashboard-left-panel.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { MyCourseComponent } from './my-course/my-course.component';

import { GlobalModule } from '../../global/global.module';


import { ImageCropperModule } from 'ngx-image-cropper';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { ChartsModule } from 'ng2-charts';
import { WalletDetailsComponent } from './wallet-details/wallet-details.component';
import { PayoutComponent } from './payout/payout.component';
import { MyPayoutsComponent } from './my-payouts/my-payouts.component';
import { TutorCourseDetailsComponent } from './tutor-course-details/tutor-course-details.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { TutorQuestionAnswerReplyModalComponent } from './tutor-question-answer-reply-modal/tutor-question-answer-reply-modal.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import {
	IssueCertificateCompletionModalComponent
} from './issue-certificate-completion-modal/issue-certificate-completion-modal.component';

import { DatePipe } from '@angular/common';
import { CoursePromoteCheckoutComponent } from './course-promote-checkout/course-promote-checkout.component';
import { CoursePromoteModalComponent } from './course-promote-modal/course-promote-modal.component';
import { QRCodeModule } from 'angularx-qrcode';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { AgreementComponent } from './agreement/agreement.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { VendorsOrderDetailsComponent } from './vendors-order-details/vendors-order-details.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { MySpeakerListComponent } from './speaker/my-speaker-list/my-speaker-list.component';
import { MySpeakerManageComponent } from './speaker/my-speaker-manage/my-speaker-manage.component';
import { KycModalComponent } from './kyc-modal/kyc-modal.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { CategoryIndexComponent } from './category/category-index/category-index.component';
import { CategoryEditComponent } from './category/category-edit/category-edit.component';
import { CouponIndexComponent } from './coupons/coupon-index/coupon-index.component';
import { CouponManageComponent } from './coupons/coupon-manage/coupon-manage.component';
import { CouponEditModalComponent } from '../../common/coupon-edit-modal/coupon-edit-modal.component';

@NgModule({
	imports: [
		CommonModule,
		DashboardRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		SharedModule,
		CustomDirective,
		CustomPipes,
		NgSelectModule,
		DataTableModule,
		ImageCropperModule,
		NgbModule,
		SweetAlert2Module.forRoot(environment.notificationConfig),
		GlobalModule,
		ChartsModule,
		MomentModule,
		QRCodeModule,
		PdfViewerModule
	],
	declarations: [

		DashboardComponent,
		ProductLayoutComponent,
		DashboardHeaderComponent,
		DashboardFooterComponent,
		DashboardLeftPanelComponent,
		DashboardContentComponent,
		ProfileComponent,
		ChangePasswordComponent,
		CourseCreateComponent,
		MyCourseComponent,
		ProfileImageComponent,
		CustomerOrdersComponent,
		VendorOrdersComponent,
		WishListComponent,
		MyCoursesComponent,
		MyWalletComponent,
		WalletDetailsComponent,
		PayoutComponent,
		MyPayoutsComponent,
		TutorCourseDetailsComponent,
		NotificationListComponent,
		TutorQuestionAnswerReplyModalComponent,
		TransactionDetailsComponent,
		IssueCertificateCompletionModalComponent,
		CoursePromoteCheckoutComponent,
		CoursePromoteModalComponent,
		CheckoutAddressComponent,
		AgreementComponent,
		VendorsOrderDetailsComponent,
		MyEventsComponent,
		MySpeakerListComponent,
		MySpeakerManageComponent,
		KycModalComponent,
		CategoryCreateComponent,
		CategoryIndexComponent,
		CategoryEditComponent,
		CouponIndexComponent,
		CouponManageComponent,
		
		
	],
	providers: [
		RoleGuard,
		DatePipe
	],
	entryComponents: [
		WalletDetailsComponent,
		ProfileImageComponent,
		PayoutComponent,
		TutorQuestionAnswerReplyModalComponent,
		IssueCertificateCompletionModalComponent,
		CoursePromoteModalComponent,
		KycModalComponent,
		CouponEditModalComponent
	],

})
export class DashboardModule { }

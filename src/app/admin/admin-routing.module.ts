import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../services/auth-guard.service';

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


import { AdminComponent } from './admin.component';
import { SlideListingComponent } from './slides/slide-listing/slide-listing.component';
import { SlideCreateComponent } from './slides/slide-create/slide-create.component';
import { SlideUpdateComponent } from './slides/slide-update/slide-update.component';
import { CategoryIndexComponent } from './category/category-index/category-index.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { CategoryEditComponent } from './category/category-edit/category-edit.component';

import { RoleIndexComponent } from './role/role-index/role-index.component';
import { RoleCreateComponent } from './role/role-create/role-create.component';
import { RoleEditComponent } from './role/role-edit/role-edit.component';

import { CourseListComponent } from './course/course-list/course-list.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { EventListComponent } from './events/event-list/event-list.component';

import { TestimonialIndexComponent } from './testimonial/testimonial-index/testimonial-index.component';
import { TestimoniaCreateComponent } from './testimonial/testimonial-create/testimonial-create.component';
import { TestimoniaEditComponent } from './testimonial/testimonial-edit/testimonial-edit.component';
import { RequestedPayoutsListComponent } from './payout/requested-payouts-list/requested-payouts-list.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { NotificationManageComponent } from './notification/notification-manage/notification-manage.component';
import { AnnoucementListComponent } from './annoucements/annoucement-list/annoucement-list.component';
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
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CommissionReportComponent } from './commission-report/commission-report.component';
import { VideoListComponent } from './video/video-list/video-list.component';
import { VideoManageComponent } from './video/video-manage/video-manage.component';
import { TicketListComponent } from './ticket/ticket-list/ticket-list.component';
import { TicketReplyComponent } from './ticket/ticket-reply/ticket-reply.component';
import { EventAttendeeInfoComponent } from './event-attendee-info/event-attendee-info.component';
import { EventAttendeeComponent } from './events/event-attendee/event-attendee.component';
import { ResendTicketsComponent } from './events/resend-tickets/resend-tickets.component';

const routes: Routes = [{
	path: '',
	component: AdminComponent,
	children: [
		{ path: '', component: DashboardComponent },
		{ path: 'dashboard', component: DashboardComponent },

		{ path: 'pages', component: CmsPageIndexComponent },
		{ path: 'pages/create', component: CmsPageCreateComponent },
		{ path: 'pages/:id/edit', component: CmsPageEditComponent },

		{ path: 'users/customer', component: UserComponent },
		{ path: 'users/vendor', component: UserComponent },
		{ path: 'users/reseller', component: UserComponent },
		{ path: 'users/:id/:userRole/details', component: UserDetailsComponent },
		{ path: 'users/:id/edit', component: UserEditComponent },
		{ path: 'users/:id/change-password', component: UserChangePasswordComponent },
		{ path: 'my-profile', component: UpdateProfileComponent },

		{ path: 'slides', component: SlideListingComponent },
		{ path: 'slides/create', component: SlideCreateComponent },
		{ path: 'slides/edit', component: SlideUpdateComponent },
		{ path: 'update-password', component: UpdatePasswordComponent },

		{ path: 'courses/category', component: CategoryIndexComponent },
		{ path: 'courses/category/create', component: CategoryCreateComponent },
		{ path: 'courses/category/:id/edit', component: CategoryEditComponent },

		{ path: 'events/category', component: CategoryIndexComponent },
		{ path: 'events/category/create', component: CategoryCreateComponent },
		{ path: 'events/category/:id/edit', component: CategoryEditComponent },

		{ path: 'role', component: RoleIndexComponent },
		{ path: 'role/create', component: RoleCreateComponent },
		{ path: 'role/:id/edit', component: RoleEditComponent },

		{ path: 'course-list', component: CourseListComponent },
		{ path: 'course/details/:id', component: CourseDetailsComponent },
		
		{ path: 'product-list', component: ProductListComponent },
		{ path: 'event-list', component: EventListComponent },
		{ path: 'event-attendee', component:EventAttendeeComponent},

		{ path: 'testimonial', component: TestimonialIndexComponent },
		{ path: 'testimonial/create', component: TestimoniaCreateComponent },
		{ path: 'testimonial/:id/edit', component: TestimoniaEditComponent },

		{ path: 'requested-payout-list', component: RequestedPayoutsListComponent },
		{ path: 'payout-list', component: PayoutListComponent },
		{ path: 'notifications', component: NotificationListComponent },
		{ path: 'notification/create', component: NotificationManageComponent },
		{ path: 'notification/edit/:id', component: NotificationManageComponent },

		{ path: 'annoucements', component: AnnoucementListComponent },

		{ path: 'tutor-bank-details', component: TutorBankDetailsComponent },

		{ path: 'our-team', component: OurTeamListComponent },
		{ path: 'our-team/create', component: OurTeamManageComponent },
		{ path: 'our-team/edit/:id', component: OurTeamManageComponent },

		{ path: 'speaker', component: SpeakerListComponent },
		{ path: 'speaker/create', component: SpeakerManageComponent },
		{ path: 'speaker/edit/:id', component: SpeakerManageComponent },

		{ path: 'settings', component: SettingsComponent },
		{ path: 'reseller/courses-request', component: ResellerCourseApproveComponent },

		{ path: 'payment-category', component: PaymentCategoryListComponent },
		{ path: 'payment-category/create', component: PaymentCategoryManageComponent },
		{ path: 'payment-category/edit/:id', component: PaymentCategoryManageComponent },

		{ path: 'orders', component: OrdersComponent },
		{ path: 'orders/detail/:id', component: OrderDetailsComponent },

		{ path: 'commission-report/tutor', component: CommissionReportComponent },
		{ path: 'commission-report/reseller', component: CommissionReportComponent },

		{ path: 'videos', component: VideoListComponent },
		{ path: 'video/create', component: VideoManageComponent },
		{ path: 'video/edit/:id', component: VideoManageComponent },

		{ path: 'support-ticket',  component: TicketListComponent},
		{ path: 'support-ticket/reply/:id',  component: TicketReplyComponent},

		{ path: 'event-attendee-info',component: EventAttendeeInfoComponent },
		{ path: 'resend-ticket', component:ResendTicketsComponent }
	]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }

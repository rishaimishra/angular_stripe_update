import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProductLayoutComponent } from './product-layout.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { MyCourseComponent } from './my-course/my-course.component';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { MyPayoutsComponent } from './my-payouts/my-payouts.component';
import { TutorCourseDetailsComponent } from './tutor-course-details/tutor-course-details.component';

import { RoleGuard } from '../../services/role-guard.service';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { CoursePromoteCheckoutComponent } from './course-promote-checkout/course-promote-checkout.component';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { AgreementComponent } from './agreement/agreement.component';
import { CourseEditGurd } from '../../services/course-edit-gurd.service';
import { VendorsOrderDetailsComponent } from './vendors-order-details/vendors-order-details.component';
import { MySpeakerListComponent } from './speaker/my-speaker-list/my-speaker-list.component';
import { MySpeakerManageComponent } from './speaker/my-speaker-manage/my-speaker-manage.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { CategoryIndexComponent } from './category/category-index/category-index.component';
import { CategoryEditComponent } from './category/category-edit/category-edit.component';

import { CouponIndexComponent } from './coupons/coupon-index/coupon-index.component';
import { CouponManageComponent } from './coupons/coupon-manage/coupon-manage.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		canActivate: [RoleGuard],
		data: { role: 'customer|vendor|reseller' },
		children: [
			{ path: '', component: DashboardContentComponent },
			{ path: 'profile', component: ProfileComponent },
			{ path: 'change-password', component: ChangePasswordComponent },
			{ path: 'course-create', component: CourseCreateComponent, canActivate: [RoleGuard], data: { role: 'vendor' } },
			{ path: 'my-course', component: MyCourseComponent, canActivate: [RoleGuard], data: { role: 'vendor' } },
			{ path: 'tutor-course-details/:slug', component: TutorCourseDetailsComponent, canActivate: [RoleGuard], data: { role: 'vendor' } },
			{ path: 'notifications', component: NotificationListComponent, canActivate: [RoleGuard], data: { role: 'vendor|customer' } },
			{ path: 'tutor-agreement', component: AgreementComponent, canActivate: [RoleGuard], data: { role: 'vendor' } },
			{ path: 'my-speaker-list', component: MySpeakerListComponent, canActivate: [RoleGuard], data: { role: 'vendor' } },
			{ path: 'my-speaker/create', component: MySpeakerManageComponent, canActivate: [RoleGuard], data: { role: 'vendor' } },
			{ path: 'my-speaker/edit/:id', component: MySpeakerManageComponent, canActivate: [RoleGuard], data: { role: 'vendor' } },
			{ path: 'courses/category', component: CategoryIndexComponent ,canActivate: [RoleGuard], data: { role: 'vendor' }},
			{ path: 'courses/category/create', component: CategoryCreateComponent ,canActivate: [RoleGuard], data: { role: 'vendor' }},
			{ path: 'courses/category/:id/edit', component: CategoryEditComponent,canActivate: [RoleGuard], data: { role: 'vendor' } },

			{ path: 'events/category', component: CategoryIndexComponent ,canActivate: [RoleGuard], data: { role: 'vendor' }},
			{ path: 'events/category/create', component: CategoryCreateComponent ,canActivate: [RoleGuard], data: { role: 'vendor' }},
			{ path: 'events/category/:id/edit', component: CategoryEditComponent,canActivate: [RoleGuard], data: { role: 'vendor' } },

			{ path: 'coupons/:id', component: CouponIndexComponent ,canActivate: [RoleGuard], data: { role: 'vendor' }},
			{ path: 'coupon/create/:id', component: CouponManageComponent ,canActivate: [RoleGuard], data: { role: 'vendor' }},
		],
	},
	{
		path: 'transactions',
		component: ProductLayoutComponent,
		children: [
			{ path: '', component: CustomerOrdersComponent },
			{ path: 'details/:id', component: TransactionDetailsComponent }
		]
	},
	{
		path: 'sales',
		component: ProductLayoutComponent,
		children: [
			{ path: '', component: VendorOrdersComponent },
			{ path: 'details/:id', component: VendorsOrderDetailsComponent }
			
		]
	},
	{
		path: 'wishlist',
		component: ProductLayoutComponent,
		children: [
			{ path: '', component: WishListComponent }
		]
	},
	{
		path: 'my-courses',
		component: ProductLayoutComponent,
		children: [
			{ path: '', component: MyCoursesComponent }
		]
	},
	{
		path: 'my-events',
		component: ProductLayoutComponent,
		children: [
			{ path: '', component: MyEventsComponent }
		]
	},
	{
		path: 'course-promote-checkout',
		component: ProductLayoutComponent,
		children: [
			{ path: '', component: CoursePromoteCheckoutComponent  }
		]
	},
	{
		path: 'course-promote-checkout-address',
		component: ProductLayoutComponent,
		children: [
			{ path: '', component: CheckoutAddressComponent  }
		]
	},
	{
		path: 'my-wallet',
		component: ProductLayoutComponent,
		children: [
			{ path: '', component: MyWalletComponent }
		]
	},
	{
		path: 'ticket',
		component: ProductLayoutComponent,
		loadChildren: './event/event.module#EventModule'
	},
	{
		path: 'product',
		component: ProductLayoutComponent,
		loadChildren: './product/product.module#ProductModule'
	},
	{
		path: 'reseller',
		component: ProductLayoutComponent,
		loadChildren: './reseller/reseller.module#ResellerModule'
	},
	{
		path: 'course-edit',
		loadChildren: './course-manage/course-manage.module#CourseManageModule',
		canActivate: [CourseEditGurd, RoleGuard],data: { role: 'vendor' },
		
	},
	{
		path: 'my-payouts',
		component: ProductLayoutComponent,
		canActivate: [RoleGuard], data: { role: 'vendor' },
		children: [
			{ path: '', component: MyPayoutsComponent }
		]
	},
	{
		path: 'annoucement',
		component: ProductLayoutComponent,
		canActivate: [RoleGuard], data: { role: 'vendor' },
		loadChildren: './annoucements/annoucements.module#AnnoucementsModule'
	},
	{
		path: 'bank-details',
		component: ProductLayoutComponent,
		canActivate: [RoleGuard], data: { role: 'vendor' },
		loadChildren: './bank-details/bank-details.module#BankDetailsModule'
	},

	{
		path: 'support-ticket',
		component: ProductLayoutComponent,
		canActivate: [RoleGuard],
		data: { role: 'customer|vendor|reseller' },
		loadChildren: './ticket/ticket.module#TicketModule'
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DashboardRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../services/auth-guard.service';

import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { EventsComponent } from './pages/events/events.component';

import { EventdetailsComponent } from './pages/eventdetails/eventdetails.component';
import { CategoriesComponent } from './pages/categories/categories.component';

import { ShopComponent } from './pages/shop/shop.component';
import { AboutComponent } from './pages/about/about.component';
import { BlogComponent } from './pages/blog/blog.component';
import { HowitworksComponent } from './pages/howitworks/howitworks.component';
import { MembershipComponent } from './pages/membership/membership.component';
import { ContactComponent } from './pages/contact/contact.component';

import { CartComponent } from './pages/cart/cart.component';
import { ProgramminglanguageComponent } from './pages/programminglanguage/programminglanguage.component';
import { SearchresultComponent } from './pages/searchresult/searchresult.component';
import { CheckoutAddressComponent } from './pages/checkout-address/checkout-address.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { FrontendComponent } from './frontend.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { ResellerComponent } from './pages/reseller/reseller.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ServicesComponent } from './pages/services/services.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import { CookiepolicyComponent } from './pages/cookiepolicy/cookiepolicy.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyComponent } from './verify/verify.component';
import { ResetPasswordSuccessComponent } from './pages/reset-password-success/reset-password-success.component';
import { RegistrationSuccessComponent } from './pages/registration-success/registration-success.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { ShopDetailsComponent } from './pages/shop-details/shop-details.component';

import { PublicProfileComponent } from './pages/public-profile/public-profile.component';

import { OrderStatusComponent } from './pages/order-status/order-status.component';

import { SearchComponent } from './pages/search/search.component';
import { ReviewRatingComponent } from './pages/review-rating/review-rating.component';
import { LectureComponent } from './pages/lecture/lecture.component';

import { InviteComponent } from './pages/invite/invite.component';

import { ReturnTransactionComponent } from './pages/return-transaction/return-transaction.component';
import { HelpComponent } from './pages/help/help.component';
//import { NotFoundComponent } from '../not-found/not-found.component';
const routes: Routes = [
	{
		path: 'consumer-registration-succcess',
		component: RegistrationSuccessComponent,
	},
	{
		path: 'tutor-registration-succcess',
		component: RegistrationSuccessComponent,
	},
	{
		path: 'reseller-registration-succcess',
		component: RegistrationSuccessComponent,
	},
	{
		path: 'return-transaction',
		component: ReturnTransactionComponent
	},
	{
		path: 'dashboard', canActivate: [AuthGuard],
		loadChildren: './dashboard/dashboard.module#DashboardModule'
	},

	{
		path: 'reset/:reset-password/:token',
		component: ResetPasswordComponent
	},
	{
		path: 'token/:porpuse/:token',
		component: VerifyComponent,
	},
	{
		path: 'reset-password-succcess',
		component: ResetPasswordSuccessComponent,
	},
	{
		path: 'event-attendee-info',
		loadChildren: './event-attendee-info/event-attendee-info.module#EventAttendeeInfoModule'
	},

	// {
	// 	path: '404-not-found',
	// 	component: NotFoundComponent
	// },
	{
		path: '',
		component: FrontendComponent,
		children: [
			{
				path: '',
				component: HomeComponent
			},
			{
				path: 'home/logout',
				component: HomeComponent
			},
			{
				path: 'courses1',
				component: CoursesComponent
			},
			{
				path: 'course-details/:slug',
				component: CourseDetailsComponent
			},
			{
				path: 'affiliate/:reseller/course-details/:slug',
				component: CourseDetailsComponent
			},
			{
				path: 'events1',
				component: EventsComponent
			},

			{
				path: 'event-details/:slug',
				component: EventdetailsComponent
			},
			{
				path: 'product-details/:slug',
				component: ShopDetailsComponent
			},
			{
				path: 'categories',
				component: CategoriesComponent
			},

			{
				path: 'shop1',
				component: ShopComponent
			},
			{
				path: 'about',
				component: AboutComponent
			},
			{
				path: 'blog',
				component: BlogComponent
			},
			{
				path: 'how-it-works',
				component: HowitworksComponent
			},
			{
				path: 'help',
				component: HelpComponent
			},
			{
				path: 'membership',
				component: MembershipComponent
			},
			{
				path: 'contact',
				component: ContactComponent
			},

			{
				path: 'review/:type/:slug',
				component: ReviewRatingComponent
			},
			{
				path: 'review/:type/:slug/:id',
				component: ReviewRatingComponent
			},
			{
				path: 'cart',
				component: CartComponent
			},
			{
				path: 'checkout-address',
				component: CheckoutAddressComponent
			},
			{
				path: 'programminglanguage',
				component: ProgramminglanguageComponent
			},
			{
				path: 'searchresult',
				component: SearchresultComponent
			},

			{
				path: 'checkout',
				component: CheckoutComponent
			},

			{
				path: 'order-success',
				component: OrderStatusComponent,
				data: {
					status: 'success'
				}
			},
			{
				path: 'order-failure',
				component: OrderStatusComponent,
				data: {
					status: 'error'
				}
			},

			{
				path: 'tutor',
				component: VendorComponent
			},

			{
				path: 'reseller',
				component: ResellerComponent
			},

			{
				path: 'faq',
				component: FaqComponent
			},

			{
				path: 'services',
				component: ServicesComponent
			},

			{
				path: 'terms',
				component: TermsComponent
			},

			{
				path: 'privacy-policy',
				component: PrivacypolicyComponent
			},

			{
				path: 'cookie-policy',
				component: CookiepolicyComponent
			},
			{
				path: '',
				loadChildren: './listing/listing.module#ListingModule'
			},
			{ 	path: 'tutorial',
				loadChildren: './tutorial/tutorial.module#TutorialModule'
			},
			{
				path: 'search',
				component: SearchComponent
			},
			{
				path: 'invite',
				component: InviteComponent
			},
			
			{
				path: ':slug',
				component: PublicProfileComponent
			},
			
		]
	},
	{
		path: 'tutorial/:courseSlug/:lectureSlug', canActivate: [AuthGuard],
		component: LectureComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FrontendRoutingModule { }

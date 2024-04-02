import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlModule } from 'ngx-owl-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxGalleryModule } from 'ngx-gallery';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng5SliderModule } from 'ng5-slider';
import { MomentModule } from 'ngx-moment';
import { QRCodeModule } from 'angularx-qrcode';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

/****For social login ******/
import {
	SocialLoginModule,
	AuthServiceConfig,
	GoogleLoginProvider,
	FacebookLoginProvider,
	LinkedinLoginProvider,
} from 'angular-6-social-login';
import { ShareButtonModule } from '@ngx-share/button';

import { GlobalModule } from '../global/global.module';

/*******Import Services list ********/
import { GlobalConstantService } from '../services/global-constant.service';
import { HttpRequestService } from '../services/http-request.service';
import { AuthGuard } from '../services/auth-guard.service';
import { PermissionGuard } from '../services/permission-guard.service';
import { RoleGuard } from '../services/role-guard.service';
import { HttpInterceptorService } from '../services/http-interceptor.service';
import { S3BucketService } from '../services/s3-bucket.service';

/*******Import Dirtective list ********/
import { CustomDirective } from '../directive/directive';

/*******Import Pipe list ********/
import { CustomPipes } from '../pipe/pipe';


import { SharedModule } from '../common/shared.module';
import { FrontendRoutingModule } from './frontend-routing.module';


import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { EventsComponent } from './pages/events/events.component';
import { ShopComponent } from './pages/shop/shop.component';
import { BlogComponent } from './pages/blog/blog.component';
import { HowitworksComponent } from './pages/howitworks/howitworks.component';
import { MembershipComponent } from './pages/membership/membership.component';
import { ContactComponent } from './pages/contact/contact.component';
import { EventdetailsComponent } from './pages/eventdetails/eventdetails.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProgramminglanguageComponent } from './pages/programminglanguage/programminglanguage.component';
import { SearchresultComponent } from './pages/searchresult/searchresult.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { FrontendComponent } from './frontend.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { VendorComponent } from './pages/vendor/vendor.component';
import { ResellerComponent } from './pages/reseller/reseller.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ServicesComponent } from './pages/services/services.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import { CookiepolicyComponent } from './pages/cookiepolicy/cookiepolicy.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { VerifyComponent } from './verify/verify.component';
import { ResetPasswordSuccessComponent } from './pages/reset-password-success/reset-password-success.component';
import { RegistrationSuccessComponent } from './pages/registration-success/registration-success.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { EventTicketComponent } from './pages/event-ticket/event-ticket.component';
import { ShopDetailsComponent } from './pages/shop-details/shop-details.component';

import { PublicProfileComponent } from './pages/public-profile/public-profile.component';

import { CheckoutAddressComponent } from './pages/checkout-address/checkout-address.component';
import { OrderStatusComponent } from './pages/order-status/order-status.component';



import { SearchComponent } from './pages/search/search.component';
import { AgmCoreModule } from '@agm/core';
import { Constant } from '../global/constant';
import { ReviewRatingComponent } from './pages/review-rating/review-rating.component';
import { LectureComponent } from './pages/lecture/lecture.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InviteComponent } from './pages/invite/invite.component';
import { ReturnTransactionComponent } from './pages/return-transaction/return-transaction.component';
import { HelpComponent } from './pages/help/help.component';

import { environment as env } from '../../environments/environment';
// Configs  for social login
export function getAuthServiceConfigs() {
	const config = new AuthServiceConfig(
		[
			{
				id: FacebookLoginProvider.PROVIDER_ID,
				provider: new FacebookLoginProvider(env.FaceBookProviderId) // 280368629334099
			},
			{
				id: GoogleLoginProvider.PROVIDER_ID,
				provider: new GoogleLoginProvider(env.GoogleProviderId)
			},
		]);
	return config;
}

@NgModule({
	imports: [
		CommonModule,
		MomentModule,
		QRCodeModule,
		NgSelectModule,
		GlobalModule,
		FrontendRoutingModule,
		OwlModule,
		NgbModule,
		NgxGalleryModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		SharedModule,
		CustomDirective,
		CustomPipes,
		// for social login
		SocialLoginModule,
		Ng5SliderModule,
		PdfViewerModule,
		InfiniteScrollModule,
		AgmCoreModule.forRoot({
			// apiKey: 'AIzaSyBTRGoP-2AP5BFsKrylUcgU1byphFT4VKM'
			apiKey: Constant.GOOGLE_API_KEY,
		}),
		ShareButtonModule,
	
	],
	declarations: [

		FrontendComponent,
		AboutComponent,
		HomeComponent,
		CoursesComponent,
		EventsComponent,
		ShopComponent,
		BlogComponent,
		HowitworksComponent,
		MembershipComponent,
		ContactComponent,
		EventdetailsComponent,
		CategoriesComponent,
		CartComponent,
		ProgramminglanguageComponent,
		SearchresultComponent,
		CheckoutComponent,
		RegistrationComponent,
		LoginComponent,
		VendorComponent,
		ResellerComponent,
		FaqComponent,
		ServicesComponent,
		TermsComponent,
		PrivacypolicyComponent,
		CookiepolicyComponent,
		ForgetPasswordComponent,
		ResetPasswordComponent,
		VerifyComponent,
		ResetPasswordSuccessComponent,
		RegistrationSuccessComponent,
		CourseDetailsComponent,
		EventTicketComponent,
		ShopDetailsComponent,

		PublicProfileComponent,


		CheckoutAddressComponent,

		OrderStatusComponent,

		SearchComponent,

		ReviewRatingComponent,

		LectureComponent,

		InviteComponent,

		ReturnTransactionComponent,

		HelpComponent,

	

	],
	providers: [
		HttpRequestService,
		GlobalConstantService,
		AuthGuard,
		PermissionGuard,
		RoleGuard,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpInterceptorService,
			multi: true
		},
		{
			provide: AuthServiceConfig,
			useFactory: getAuthServiceConfigs
		},
		S3BucketService
	],
	entryComponents: [
		LoginComponent,
		RegistrationComponent,
		ForgetPasswordComponent,
		EventTicketComponent
	],

})
export class FrontendModule { }

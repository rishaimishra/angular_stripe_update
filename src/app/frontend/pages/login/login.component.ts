import {
	Component,
	OnInit
} from '@angular/core';

import {
	NgbModal,
	ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';

import {
	FormBuilder,
	Validators,
	FormGroup
} from '@angular/forms';

import {
	Router,
	ActivatedRoute
} from '@angular/router';

import { HttpRequestService } from '../../../services/http-request.service';
import { CustomValidator } from '../../../common/validator';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

import { CommonService } from '../../../global/services/common.service';
import { RegistrationComponent } from '../../pages/registration/registration.component';
import { ForgetPasswordComponent } from '../../pages/forget-password/forget-password.component';
// For social site login
import {
	AuthService,
	FacebookLoginProvider,
	GoogleLoginProvider
} from 'angular-6-social-login';
import { mergeMap } from 'rxjs/operators';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	public messages: any = [];
	loginForm: FormGroup;
	socialLoginForm = {};
	public wishListsearchParams: any = {
		product_details: true,
		images: true,
		user_id: null,
		order_by: '-id',
		limit: 2,
		page: 1
	};
	public wishListRecords: any = [];
	public wishListCounts: any = '';
	
	constructor(private modalService: NgbModal,
		private fb: FormBuilder,
		private myRoute: Router,
		private http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
		public activeModal: NgbActiveModal,
		private ngxService: NgxUiLoaderService,
		// for social login
		public commonService: CommonService,
		private socialAuthService: AuthService
	) { }

	ngOnInit() {
		this.loginForm = this.fb.group({
			user_name: ['', [Validators.required, CustomValidator.email]],
			password: ['', Validators.required],
		});
	}

	// open(content) {
	//    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

	//   }, (reason) => {
	//   });
	// }
	closeModal() {
		this.activeModal.close('Modal Closed');
	}
	login() {
		if (this.loginForm.valid) {
			this.ngxService.start();
			const form_data = this.loginForm.value;
			this.http.authinticate(form_data).then((response) => {
				this.getWishListRecords();
				// this.ngxService.stop();
				if (response) {
					this.activeModal.close();
					// const redirectUrl = this.activeRoute.snapshot.queryParamMap.get('redirectUrl');
					// this.myRoute.navigate([redirectUrl || '/']);
					// console.log(this.myRoute.url);
					const redirectUrl = this.myRoute.url;

					if(redirectUrl !='/') {
						this.myRoute.navigate([redirectUrl]);
					} else {
						if (localStorage.getItem('userRole') === 'admin') {
							this.myRoute.navigate(['/admin/dashboard']);
						} else if (localStorage.getItem('userRole') === 'vendor') {
							this.myRoute.navigate(['/dashboard']);
						} else if (localStorage.getItem('userRole') === 'customer') {
							this.myRoute.navigate(['/dashboard/profile']);
						} else {
							this.myRoute.navigate(['/dashboard']);
						}
					}


				}
			}).catch((errors) => {
				this.ngxService.stop();
				this.messages = errors;
			});
		}
	}
	getWishListRecords() {
		
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.wishListsearchParams.user_id = user.user.id;
					return this.http.setModule('wishlist').search(this.wishListsearchParams);
				}
			})
		).subscribe((response) => {
			if (response) {
				this.wishListRecords = response.data;
				localStorage.setItem('wishListRecords', JSON.stringify(this.wishListRecords));
				localStorage.setItem('wishListCount',this.wishListRecords.length);
				
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	registerFormModal() {
		this.activeModal.dismiss();
		const ngbModalOptions: NgbModalOptions = {
			backdrop: 'static',
			keyboard: false
		};
		const modalRef = this.modalService.open(RegistrationComponent,ngbModalOptions);
		modalRef.componentInstance.role = 'customer';
		modalRef.result.then((result) => {
			//console.log(result);
			//this.myRoute.navigate(['/consumer-registration-succcess']);
			if(result.provider=='normal'){
				this.myRoute.navigate(['/consumer-registration-succcess']);
			} else {
				this.myRoute.navigate(['/']);
			}
		}).catch((error) => {
			//console.log(error);
		});
	}

	forgotPasswordFormModal() {
		this.activeModal.dismiss();
		const ngbModalOptions: NgbModalOptions = {
			backdrop: 'static',
			keyboard: false
		};

		const modalRef = this.modalService.open(ForgetPasswordComponent, ngbModalOptions);
		modalRef.result.then((result) => {
			//console.log(result);
		}).catch((error) => {
			//console.log(error);
		});
	}
	redirectToTermsOfUse() {
		this.activeModal.dismiss();
		this.myRoute.navigate(['/terms']);
	}

	redirectToPrivacyPolicy() {
		this.activeModal.dismiss();
		this.myRoute.navigate(['/privacy-policy']);
	}

	//for social login
	public socialSignIn(socialPlatform: string) {
		let socialPlatformProvider;
		if (socialPlatform === "facebook") {
			socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
		} else if (socialPlatform === "google") {
			socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
		}

		this.socialAuthService.signIn(socialPlatformProvider).then(
			(userData) => {
				// console.log(socialPlatform+" sign in data : " , userData);
				// Now sign-in with userData
				this.socialLoginForm['user_name'] = userData.email;
				this.socialLoginForm['provider'] = userData.provider;
				this.socialLoginForm['provider_id'] = userData.id;
				//console.log(this.socialLoginForm);

				this.http.authinticate(this.socialLoginForm, 'social').then((response) => {
					this.ngxService.stop();
					if (response) {
						this.activeModal.close();
						// const redirectUrl = this.activeRoute.snapshot.queryParamMap.get('redirectUrl');
						// this.myRoute.navigate([redirectUrl || '/']);

					}
				}).catch((errors) => {
					this.ngxService.stop();
					this.messages = errors;
				});
			}
		);
	}

}

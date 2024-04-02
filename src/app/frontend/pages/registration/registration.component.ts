import {
	Component,
	OnInit,
	Input
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
import { Router } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { CustomValidator } from '../../../common/validator';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { LoginComponent } from '../login/login.component';
import { GlobalConstantService } from '../../../services/global-constant.service';
import { CommonService } from '../../../global/services/common.service';
import { ToasterService } from 'angular2-toaster';
// For social site login
import {
	AuthService,
	FacebookLoginProvider,
	GoogleLoginProvider
} from 'angular-6-social-login';


@Component({
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {



	@Input() role: number;
	registrationForm: FormGroup;
	successMsg: any;
	errorMsg: any;
	socialRegistrationForm = {};
	checkRole: any = [];

	public messages: any = [];
	public countryList: any = [];
	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		private myRoute: Router,
		private http: HttpRequestService,
		public activeModal: NgbActiveModal,
		private ngxService: NgxUiLoaderService,
		private constant: GlobalConstantService,
		private commonService: CommonService,
		private toasterService: ToasterService,
		// for social login
		private socialAuthService: AuthService
	) { }

	ngOnInit() {
		this.successMsg = false;
		this.errorMsg = false;
		this.registrationForm = this.fb.group({
			user_name: ['', [Validators.required, CustomValidator.email]],
			password: ['', [Validators.required, CustomValidator.password]],
			mobile_no: ['', [Validators.required]],
			phone_code: ['+91(IN)', [Validators.required]],
			role: [this.role],
			detailsCheck: ['', Validators.requiredTrue]
		});
		this.checkRole = this.role;
		this.getCountries();
	}

	getCountries() {
		const params = {};
		this.http.get(`utility/location/countries`)
		.subscribe((response) => {
			if (response) {
				if (response['data']) {
					this.countryList  = response['data'].map((i) => { 
						i.label = '+'+i.phone_code + '(' + i.code + ')';
						i.image = 'assets/flag_png/'+i.code.toLowerCase()+'.png';
						 return i; });
				}
			}
		}, (error) => {
			this.countryList = {};
		});
	}

	keyPress(event: any) {
		const pattern = /[0-9\+\-\ ]/;

		let inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode !== 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
	}

	closeModal() {
		this.activeModal.close('Modal Closed');
	}

	register() {

		if (this.registrationForm.valid && this.registrationForm.value.detailsCheck) {
			this.ngxService.start();
			//console.log(this.registrationForm.value);
			const form_data = this.registrationForm.value;
			form_data['email_link'] = this.constant.BASE_URL + '/token/token/verify-email/:token';
			form_data['phone_code']=form_data['phone_code'].toString();
			this.http.post('user', form_data).subscribe((response) => {

				this.ngxService.stop();
				if (response['status'] === 'success') {
					this.messages = response['status'];
					// this.myRoute.navigate(['/']);
					this.successMsg = 'Registerd successfully';
					this.errorMsg = false;
					this.registrationForm.reset();
					response.provider="normal";
					this.activeModal.close(response);
				}

			}, (errors) => {
				
				this.ngxService.stop();
				this.messages = errors.error.errors;
				//console.log(this.messages);
				this.successMsg = '';
				this.errorMsg = true;
				this.commonService.showErrors(errors);
			});
		}
	}

	loginFormModal() {
		this.activeModal.dismiss();
		const ngbModalOptions: NgbModalOptions = {
			backdrop: 'static',
			keyboard: false
		};

		const modalRef = this.modalService.open(LoginComponent, ngbModalOptions);

		modalRef.result.then((result) => {
			// console.log(result);
			// console.log(this.http.getUser());

			localStorage.setItem('name', this.http.getUser().profile.first_name ? this.http.getUser().profile.first_name + ' ' + this.http.getUser().profile.last_name : this.http.getUser().user_name);

			// console.log(this.http.getUserRole()[0]);

			localStorage.setItem('userRole', this.http.getUserRole()[0]);
			this.myRoute.navigate(['/admin/dashboard']);
		}).catch((error) => {
			// console.log(error);
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
				this.socialRegistrationForm['user_name'] = userData.email;
				this.socialRegistrationForm['provider'] = userData.provider;
				this.socialRegistrationForm['provider_id'] = userData.id;
				this.socialRegistrationForm['role'] = this.role;

				// console.log(this.socialRegistrationForm);
			
				this.http.post('user', this.socialRegistrationForm).subscribe((response) => {
					this.ngxService.stop();
					if (response['status'] === 'success') {
						this.messages = response['status'];
						this.toasterService.pop('success', 'Registerd successfully');
						this.myRoute.navigate(['/']);
						this.successMsg = 'Registerd successfully';
						this.errorMsg = false;
						this.registrationForm.reset();

						response.provider="social";
						this.activeModal.close(response);
					}
				}, (errors) => {
					// console.log(errors);
					this.ngxService.stop();
					this.messages = errors;
					this.successMsg = '';
					this.errorMsg = true;
				});


			}
		);
	}

}

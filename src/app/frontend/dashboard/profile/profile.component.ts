import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CustomValidators } from 'ng2-validation';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../global/services/common.service';
import { SeoServiceService }  from '../../../services/seo-service.service';
import { environment as env } from './../../../../environments/environment';
import { EncrDecrService } from '../../../services/encr-decr.service';
@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	id: any;
	user: any;
	userProfileForm: FormGroup;
	successMsg: any;
	errorMsg: any;
	messages: any;
	submitted: boolean;
	private toasterService: ToasterService;
	public countries: Array<any> = [];
	public states: Array<any> = [];
	public cities: Array<any> = [];

	constructor(
		toasterService: ToasterService,
		public router: Router,
		private http: HttpRequestService,
		private fb: FormBuilder,
		private myRoute: Router,
		private ngxService: NgxUiLoaderService,
		private commonService: CommonService,
		public SeoService:SeoServiceService
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scrollTo(0, 0);
		this.SeoService.getMetaInfo();
		this.submitted = false;
		this.id = this.http.getUser();
		this.successMsg = false;
		this.errorMsg = false;
		this.getUserInfo();
		// console.log(this.id.id);
		this.userProfileForm = this.fb.group({
			first_name: ['', [Validators.required]],
			last_name: ['', [Validators.required]],
			head_line: ['', [Validators.required]],
			biography: ['', [Validators.required]],
			ethereum_address:['', [Validators.required]],
			social_links: this.fb.group({
				links: [''],
				twitter: [''],
				facebook: [''],
				linkedin: [''],
				youtube: [''],
			}),
			country_id: ['',[Validators.required]],
			state_id: ['',],
			city_id: ['',],
			address: [null, [Validators.required]],
			timezone: ['india'],
			user_id: [this.id.id],
		});

	}

	ngAfterViewInit() {
		this.getCountries();
	}

	getUserInfo() {
		this.ngxService.start();
		this.http.get(`profile/${this.id.id}?search_by=user_id&user=true`).subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.user = response['data'];
				if (response['data'].length === undefined) {
					this.user.social_links = JSON.parse(this.user.social_links);
					this.userProfileForm.get('first_name').setValue(this.user.first_name);
					this.userProfileForm.get('last_name').setValue(this.user.last_name);
					this.userProfileForm.get('head_line').setValue(this.user.head_line);
					this.userProfileForm.get('biography').setValue(this.user.biography);
					this.userProfileForm.get('ethereum_address').setValue(this.user.ethereum_address);
					this.userProfileForm.get('address').setValue(this.user.address);
					this.userProfileForm.get('country_id').setValue(this.user.country_id);
					

					if (this.user.country) {
						this.onCountryChange(this.user.country);
					}
					this.userProfileForm.get('state_id').setValue(this.user.state_id);
					if (this.user.state) {
						this.onStateChange(this.user.state);
					}
					
					this.userProfileForm.get('city_id').setValue(this.user.city_id);

					this.userProfileForm.get('social_links').get('facebook').setValue(this.user.social_links.facebook);
					this.userProfileForm.get('social_links').get('links').setValue(this.user.social_links.links);
					this.userProfileForm.get('social_links').get('twitter').setValue(this.user.social_links.twitter);
					this.userProfileForm.get('social_links').get('linkedin').setValue(this.user.social_links.linkedin);
					this.userProfileForm.get('social_links').get('youtube').setValue(this.user.social_links.youtube);
				}

			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}
	getCountries() {
		this.http.setModule('country').search({}).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.countries = response.data;
				}
			}
		}, (error) => {
			//console.log(error);
		});
	}

	onCountryChange(event) {
		this.userProfileForm.patchValue({
			state_id: null,
			city_id: null
		});
		this.states = [];
		this.cities = [];

		if (event) {
			this.http.setModule('state').findOne(event.id).subscribe((response) => {
				if (response) {
					if (response.data) {
						this.states = response.data;
					}
				}
			}, (error) => {
				// console.log(error);
			});
		}
	}

	onStateChange(event) {
		this.userProfileForm.patchValue({
			city_id: null
		});
		this.cities = [];

		if (event) {
			this.http.setModule('city').findOne(event.id).subscribe((response) => {
				if (response) {
					if (response.data) {
						this.cities = response.data;
					}
				}
			}, (error) => {
				// console.log(error);
			});
		}
	}

	profileSubmit() {
		window.scrollTo(0, 0);
		this.submitted = true;
		if (this.userProfileForm.valid) {
			const form_data = this.userProfileForm.value;
			this.ngxService.start();

			this.http.put(`profile/${this.id.id}?update_by=user_id`, form_data).subscribe((response) => {
				this.ngxService.stop();
				if (response['status'] === 'success') {
					// this.messages = response['status'];
					// this.successMsg = 'Updated successfully';
					// this.errorMsg = false;
					
					localStorage.setItem('token', response['data']['token']);
					localStorage.setItem('login_at', new Date().getTime().toString());
					localStorage.setItem('name', this.http.getUser().profile.first_name ? this.http.getUser().profile.first_name + ' ' + this.http.getUser().profile.last_name : this.http.getUser().user_name);
					localStorage.setItem('userRole', this.http.getUserRole()[0]);
					this.submitted = false;
					window.scroll(0, 0);
					this.toasterService.pop('success', 'Updated successfully');
					this.router.navigate(['/']);
				}

			}, (errors) => {
				window.scrollTo(0, 0);
				// console.log(errors);
				this.ngxService.stop();
				// this.messages = errors;
				// this.successMsg = '';
				// this.errorMsg = true;
				// this.toasterService.pop('error', 'Error', errors.message);
				this.commonService.showErrors(errors);
			});
		}
	}

}

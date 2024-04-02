import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SeoServiceService }  from '../../../services/seo-service.service';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent implements OnInit {

  public addresses: Array<any> = [];
	public countries: Array<any> = [];
	public states: Array<any> = [];
	public cities: Array<any> = [];
	public defaultAddress: any;
	public typeAddress: Array<any> = [
		{
			code: 'office',
			name: 'Office'
		},
		{
			code: 'home',
			name: 'Home'
		},
		{
			code: 'others',
			name: 'Others'
		},
	];

	public formObj: FormGroup;
	public formError: any;

	private addressModalRef: NgbModalRef;

	constructor(
		public router: Router,
		public modalService: NgbModal,
		public formBuilder: FormBuilder,
		public validatorService: NgReactiveFormValidatorService,
		public httpService: HttpRequestService,
		public commonService: CommonService,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
		window.scrollTo(0,0);
		this.SeoService.getMetaInfo();
		this.formObj = this.formBuilder.group({
			id: [null],
			user_id: [null, Validators.required],
			type: ['home', Validators.required],
			is_default: [0, Validators.required],
			address: [null, Validators.required],
			state_id: [null, Validators.required],
			country_id: [null, Validators.required],
			city_id: [null, Validators.required],
			postcode: [null, Validators.required]
		});
	}

	ngAfterViewInit() {
		this.getAddresses();
		this.getCountries();
	}

	/**
	 * Get all addresses of the logged in user
	 */
	getAddresses() {
		return this.httpService.getLoggedUser().pipe(
			mergeMap((loggedUser) => {
				if (loggedUser) {
					return this.httpService.setModule('address').search({
						user_id: loggedUser.user.id,
						user: true,
						profile: true,
						country: true,
						state: true,
						city: true,
					});
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				this.addresses = response.data;

				this.defaultAddress = this.addresses.find((el) => (el.is_default === 1));
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	getAddressType(item) {
		let addressType = '';
		if (item) {
			const selectedType = this.typeAddress.find((el) => (el.code === item.type));
			if (selectedType) {
				addressType = selectedType.name;
			}
		}
		return addressType;
	}

	isAddressDefault(item) {
		let flag = false;
		if (item) {
			flag = (item.is_default === 1) ? true : false;
		}
		return flag;
	}

	onChangeDefaultAddress(item) {
		if (item) {
			this.httpService.getLoggedUser().pipe(
				mergeMap((loggedUser) => {
					if (loggedUser) {
						const params = {
							id: item.id,
							user_id: loggedUser.user.id,
							is_default: 1
						};
						return this.httpService.setModule('defaultAddress').create(params);
					} else {
						return of(null);
					}
				})
			).subscribe((response) => {
				if (response) {
					this.defaultAddress = item;
					this.commonService.showMessage({type: 'success', title: '', message: 'Address set to your default shipping address'});
				}
			}, (error) => {
				this.commonService.showErrors(error);
			});
		}
	}

	opemNewAddress(content) {
		this.httpService.getLoggedUser().subscribe((user) => {
			if (user) {
				this.formObj.patchValue({
					user_id: user.user.id
				});
				this.addressModalRef = this.modalService.open(content, {backdrop: 'static', keyboard: false, size: 'lg'});
			} else {
				this.commonService.showMessage({type: 'warning', title: '', message: 'Please login first'});
			}
		});

	}

	getCountries() {
		this.httpService.setModule('country').search({}).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.countries = response.data;
				}
			}
		}, (error) => {
			// console.log(error);
		});
	}

	onCountryChange(event) {
		this.formObj.patchValue({
			state_id: null,
			city_id: null
		});
		this.states = [];
		this.cities = [];

		if (event) {
			this.httpService.setModule('state').findOne(event.id).subscribe((response) => {
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
		this.formObj.patchValue({
			city_id: null
		});
		this.cities = [];

		if (event) {
			this.httpService.setModule('city').findOne(event.id).subscribe((response) => {
				if (response) {
					if (response.data) {
						this.cities = response.data;
					}
				}
			}, (error) => {
				//console.log(error);
			});
		}
	}

	isAddressDefaultCheckbox() {
		let flag = false;
		flag = (this.formObj.value['is_default'] === 1) ? true : false;
		return flag;
	}

	onChangeDefault(event) {
		if (event) {
			this.formObj.patchValue({
				is_default: (this.formObj.value['is_default'] === 1) ? 0 : 1
			});
		}
	}

	saveNewAddress() {
		if (this.formObj.valid) {

			this.httpService.setModule('address').create(this.formObj.value).subscribe((res) => {
				if (res) {
					this.defaultAddress = (res.data.is_default === 1) ? res.data : null;
					this.closeAddressForm();
					this.commonService.showMessage({type: 'success', title: '', message: 'Address successfully added'});
					this.getAddresses();
				}
			}, (error) => {
				this.commonService.showErrors(error);
			});
		} else {
			this.formError = this.validatorService.validationError(this.formObj, {});
		}
	}

	closeAddressForm() {
		this.formError = null;
		this.addressModalRef.close();
	}

	redirectToCheckout() {
		if (this.defaultAddress) {
			// this.commonService.setDefaultAddress(this.defaultAddress).subscribe((res) => {
			// 	if (res) {
			// 		this.router.navigate(['/course-promote-checkout']);
			// 	}
			// }, (error) => {
			// 	this.commonService.showMessage({type: 'warning', title: '', message: error.message});
			// });
			this.router.navigate(['dashboard/course-promote-checkout']);
		} else {
			this.commonService.showMessage({type: 'warning', title: '', message: 'Please make an address as your default shipping address'});
		}
	}

}

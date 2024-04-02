import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { environment as env } from '../../../../environments/environment';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { of, throwError, Observable, interval, timer, Subscription } from 'rxjs';
import { mergeMap, retry, retryWhen, delayWhen, tap, catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-course-promote-checkout',
  templateUrl: './course-promote-checkout.component.html',
  styleUrls: ['./course-promote-checkout.component.scss']
})
export class CoursePromoteCheckoutComponent implements OnInit {

  public coursePromoteInfo: any;
  public user: any;
  public billing_address:any;

  public wallet: any = null;
  public paypalFormObj: FormGroup;
	public paypalFormError: any;
  public isWalletChecked: Boolean = false;
  public orderLoader: Boolean = false;
  public addresses: Array<any> = [];
  public defaultAddress: any;
  public order_address_id: any;
  public monthArr: Array<any> = [
		{ value: '01', name: 'JAN' },
		{ value: '02', name: 'FEB' },
		{ value: '03', name: 'MAR' },
		{ value: '04', name: 'APR' },
		{ value: '05', name: 'MAY' },
		{ value: '06', name: 'JUN' },
		{ value: '07', name: 'JUL' },
		{ value: '08', name: 'AUG' },
		{ value: '09', name: 'SEP' },
		{ value: '10', name: 'OCT' },
		{ value: '11', name: 'NOV' },
		{ value: '12', name: 'DEC' },
	];

	public yearArr: Array<any> = [];

	public paymentMethods: Array<any> = [
		{ code: 'cod', name: 'COD', checked: false },
		{ code: 'cyber-source', name: 'Cyber Source', checked: false },
		{ code: 'sxl', name: 'SuccessLife (SXL) Token', checked: false },
		{ code: 'paypal', name: 'Paypal', checked: false },
		{ code: 'local', name: 'Pay by Mobile Using Local method', checked: false }
  ];
  private _formErrorMessage = {
		card_no: {
			required: 'Enter Card Number',
			cardLength: 'Please enter 16 digit number'
		},
		exp_mo: {
			required: 'Select expiry month',
		},
		exp_yr: {
			required: 'Select expiry year',
		},
		cvn: {
			required: 'Enter CVN',
		},
		card_holder_name: {
			required: 'Enter Card Holder Name'
		}
	};
  public formErrorMsg: string;
  
  @ViewChild('content')
	slxModal: TemplateRef<any>;

	@ViewChild('copyElm')		
	copyElm: ElementRef<any>;

	public slxTokenResponse: any;
	private slxTimeFinish: Date;
	public slxTransactionInterval: String = '15:00';
	public slxInterval$: Observable<any>;
	private slxIntercalSubs: Subscription;
	private slxModalRef: NgbActiveModal;
	private totalDuration: number = 15;
	public slxLoader: Boolean = false;
	public slxPerMinuteObj: any = {
		seconds: 59,
		secondsText: '59 Sec',
		currentDurationObj: { diffMs: 0, times: 0 }
	};
	private toasterService: ToasterService;

  constructor(
		public router: Router,
		public httpService: HttpRequestService,
		public commonService: CommonService,
		public formBuilder: FormBuilder,
		private modalService: NgbModal,
		public validatorService: NgReactiveFormValidatorService,
		toasterService: ToasterService,
		public datepipe: DatePipe,
		public SeoService:SeoServiceService
  ) {
		this.toasterService = toasterService;
	 }

  ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
    this.user = this.httpService.getUser();
    this.paypalFormObj = this.formBuilder.group({
			card_no: [null, [Validators.required, this.cardLength(16, 16)]],
			exp_mo: ['', Validators.required],
			exp_yr: ['', Validators.required],
			cvn: [null, Validators.required],
			card_holder_name: [null, Validators.required]
		});

		for (let index = 0; index < 20; index++) {
			this.yearArr.push({ name: (2019 + index), value: (2019 + index) });
		}
    var retrievedObject = localStorage.getItem('promoteInfo');
    //  console.log(JSON.parse(retrievedObject));
    this.coursePromoteInfo = JSON.parse(retrievedObject);
    // console.log(this.coursePromoteInfo);
    this.getAddresses();
		this.getWallet();
		this.totalDuration = 15;		
		this.slxPerMinuteObj.currentDurationObj.diffMs = (this.totalDuration * 60000);
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
    
        // console.log(this.addresses);
        this.defaultAddress = this.addresses.find((el) => (el.is_default === 1));
        if (this.defaultAddress) {
            this.order_address_id = this.defaultAddress.id;
           
              // cartObj.billing_address =  {
              //   ...address,
              //   user: {
              //     first_name: address.user.profile.first_name || '',
              //     last_name: address.user.profile.last_name || '',
              //     email: address.user.email || '',
              //     mobile_no: address.user.mobile_no || ''
              //   }
              // };
              this.billing_address = {
                  ...this.defaultAddress,
                  user: {
                    first_name: this.defaultAddress.user.profile.first_name || '',
                    last_name: this.defaultAddress.user.profile.last_name || '',
                    email: this.defaultAddress.user.email || '',
                    mobile_no: this.defaultAddress.user.mobile_no || ''
                  }
                };
          }
        }
		}, (error) => {
			this.commonService.showErrors(error);
		});
  }
  
  /**
	 * Get wallet data of logged in customer
	 */
	getWallet() {
		this.httpService.getLoggedUser().pipe(
			mergeMap((user) => {
				if (user) {
					const paramsObj = {
						search_by: 'user_id'
					};
					return this.httpService.setModule('wallet').findOne(user.user.id, paramsObj);
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				this.wallet = null;
				if (Object.keys(response.data).length > 0) {
					this.wallet = response.data;

					if (this.wallet.amount > 0) {
						this.isWalletChecked = true;
					}
				}
			}
		}, (error) => {
			if (error) {
				this.commonService.showErrors(error);
			}
		});
  }
  /**
	 * Function to check credit card section need to show or not
	 */
	isShowCard() {
		let flag = true;
		if (this.wallet) {
			if (this.wallet.amount > 0) {
				if (this.wallet.amount >= this.coursePromoteInfo.amount) {
					flag = (this.isWalletChecked) ? false : true;
				} else {
					flag = true;
				}
			} else {
				flag = true;
			}
		}
		return flag;
  }
  
  /**
	 * Event handler for wallet order process
	 * @param event MouseEvent
	 */
	orderWalletMethod(event) {
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		if (event) {
			const paramsOrder = {
				// ...this.cartObj,
				// payment_mode: 'W',
        //ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
        

        user_id:this.user.id,
	      reseller_id:0,
	      order_address_id: this.order_address_id,
	      total_discount_price: 0,
	      total_tax_price: 0,
	      total_order_price: this.coursePromoteInfo.amount,
	      payment_status:"pending",
	      order_status:"pending",
	      send_data:'',
	      ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
	      payment_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
        order_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
        payment_mode: 'W',
			};
			// delete paramsOrder.id;
			// delete paramsOrder.items;
			this.httpService.getLoggedUser().pipe(
				mergeMap((user) => {
					if (user) {
						logUser = user;
						return this.httpService.setModule('orders').create(paramsOrder);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						orderResponse = response.data;
						return this.saveOrderDetails(orderResponse);
					} else {
						return of(null);
					}
				}),
			
				
				mergeMap((response) => {
					if (response) {
						return this.savePromoteData(orderResponse);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						const orderResObj = {
							...orderResponse,
							payment_status: 'complete',
							logUser: logUser
						};
	
						return this.savePayment(orderResObj);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						return this.sendWalletRequest(orderResponse);
					} else {
						return of(null);
					}
				}),
				// mergeMap((response) => {
				// 	if (response) {
				// 		return this.saveVendorWallet(orderResponse);
				// 	} else {
				// 		return of(null);
				// 	}
				// })
			).subscribe((response) => {
				this.orderLoader = false;
				if (response) {
					this.commonService.setFlashMessage(response['data']);
					this.commonService.removeCart();
					// console.log(response, ' - order details');
					this.router.navigate(['/dashboard/my-course']);
					this.toasterService.pop('success', "Promoted Successfully");
				}
			}, (error) => {
				this.orderLoader = false;
				// this.commonService.setFlashMessage(error.error);
				// console.log(error, ' - order details error');
				this.router.navigate(['/dashboard/my-course']);
				this.commonService.showErrors(error.error);
			});
		}
  }

  /**
	 * Event handler for free order process
	 * @param event MouseEvent
	 */
	orderFreeMethod(event) {
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		if (event) {
			const paramsOrder = {
				// ...this.cartObj,
				// payment_mode: 'FREE',
        // ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
        
        user_id:this.user.id,
	      reseller_id:0,
	      order_address_id: this.order_address_id,
	      total_discount_price: 0,
	      total_tax_price: 0,
	      total_order_price: this.coursePromoteInfo.amount,
	      payment_status:"pending",
	      order_status:"pending",
	      send_data:'',
	      ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
	      payment_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
        order_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
        payment_mode: 'FREE'
			 };
			// delete paramsOrder.id;
			// delete paramsOrder.items;
			this.httpService.getLoggedUser().pipe(
				mergeMap((user) => {
					if (user) {
						logUser = user;
						return this.httpService.setModule('orders').create(paramsOrder);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						orderResponse = response.data;
						return this.saveOrderDetails(orderResponse);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						return this.savePromoteData(orderResponse);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						const orderResObj = {
							...orderResponse,
							payment_status: 'complete',
							logUser: logUser
						};
						return this.savePayment(orderResObj);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						return this.saveVendorWallet(orderResponse);
					} else {
						return of(null);
					}
				})
			).subscribe((response) => {
				this.orderLoader = false;
				if (response) {
					this.commonService.removeCart();
					// console.log(response, ' - order details');
					this.router.navigate(['/dashboard/my-course']);
				}
			}, (error) => {
				this.orderLoader = false;
				// console.log(error, ' - order details error');
				this.router.navigate(['/dashboard/my-course']);
			});
		}
	}

  
  /**
	 * Function for order detail save
	 * @param orderResponse any
	 */
	private saveOrderDetails(orderResponse): Observable<any> {
		const itemArr = [
      { 
        order_id: orderResponse.id,
        vendor_id: this.user.id,
        couponable_id: null,
        couponable_type: null,
        productable_id: this.coursePromoteInfo.courseId ,
        productable_type: "course_promotions",
        unit_price: this.coursePromoteInfo.amount,
        discount_price: 0,
        tax_price: 0,
        quantity: 1,
        total_price: this.coursePromoteInfo.amount,
        product_currency: "USD",
        ordered_currency: "USD",
        conversion_rate: 0 
    },
    ];
		return this.httpService.setModule('orderDetails').create(itemArr);
  }
  /**
	 * Function to send wallet request
	 * @param orderResponse any
	 */
	private sendWalletRequest(orderResponse): Observable<any> {
		const paymentObj = {
			'order_id': orderResponse.id,
			'amount': this.getWalletPaybleAmount(),
			'wallet_id': this.wallet.id,
			'user_id':this.user.id,
			'user_type': 'vendor'
		};

		// paymentCyberSource
		return this.httpService.setModule('paymentWallet').create(paymentObj);
	}
	

	public savePromoteData(orderResponse): Observable<any> {
		let params = {
			course_id: this.coursePromoteInfo.courseId,
			user_id: this.user.id,
			order_id: orderResponse.id,
			start_on: this.datepipe.transform(this.coursePromoteInfo.started_on, 'yyyy-MM-dd'),
			end_on: this.datepipe.transform(this.coursePromoteInfo.ended_on, 'yyyy-MM-dd'),
			status: "active"
		};
		return this.httpService.setModule('coursePromotion').create(params);
	}

  /**
	 * Function to upbate payment and order status
	 * @param orderResponse any
	 */
	private savePayment(orderResponse): Observable<any> {

				const paramsObj = {
					payment_status: orderResponse.payment_status,
					order_status: 'complete',
					received_data: '',
					user_id: orderResponse.logUser.user.id,
					order_id: orderResponse.id,
					items: [
						{
							name: 'Promote Course', // Edit later
							quantity: 1,
							price: this.coursePromoteInfo.amount,
							currency: "USD",
							type: "course_promotions",
						}
					],
					shipping_price: 0.00,
					total: this.coursePromoteInfo.amount,
					discount: 0.00,
					order_date: moment((new Date()).toISOString()).format('DD-MM-YYYY'),
					customer_email: orderResponse.logUser.user.email,
					customer_phone: orderResponse.logUser.user.mobile_no
				};
			
				return this.httpService.setModule('payment').create(paramsObj);



	
	}
  private saveVendorWallet(orderResponse): Observable<any> {
		return this.httpService.setModule('createVendorWallet').findOne(orderResponse.id);
	}
	/**
	 * Get payble amount
	 */
	getPaybleAmount() {
		let amount = 0.00;
		if (this.coursePromoteInfo) {
			amount = this.coursePromoteInfo.amount;
			if (this.wallet) {
				if (this.isWalletChecked) {
					amount -= this.wallet.amount;
				}
			}
		}
		return amount;
	}

  /**
	 * Get payble amount
	 */
	getWalletPaybleAmount() {
		let amount = 0.00;
		if (this.coursePromoteInfo && this.wallet) {
			if (this.isWalletChecked) {
				if (parseFloat(this.coursePromoteInfo.amount) > parseFloat(this.wallet.amount)) {
					amount = this.wallet.amount;
				} else {
					amount =  parseFloat(this.coursePromoteInfo.amount);
				}
			}
		}
		return amount;
	}

	isShowWalletCheckbox(wallet) {
		let flag = false;
		if (wallet) {
			if ((wallet.amount !== 0) && (this.coursePromoteInfo.amount > 0)) {
				flag = true;
			}
		}

		return flag;
	}
  /**
	 * Event handler for on change event of wallet checkbox
	 * @param event MouseEvent
	 */
	onChangeWallet(event) {
		if (event) {
			this.isWalletChecked = event.target.checked;
		}
  }
  /**
	 * Event handler for change payment method
	 * @param methodCode string
	 */
	onChangeMethod(methodCode: string) {
		this.paymentMethods = this.paymentMethods.map(el => {
			el.checked = false;
			return el;
		});
		const idx = this.paymentMethods.findIndex((el) => (el.code === methodCode));
		this.paymentMethods[idx].checked = (this.paymentMethods[idx].checked) ? false : true;
	}

	/**
	 * Function to check payment method is selected or not
	 * @param methodCode string
	 */
	isSelectedMethod(methodCode: string) {
		const method = this.paymentMethods.find((el) => (el.code === methodCode));
		return method.checked;
	}

	copyToClipboard(text: string) {
		// console.log(elm.isRe);
		const selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = text;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
		// console.log(text);
	}
/**
	 * Custom validation for credit card no. check
	 * @param min number
	 * @param max number
	 */
	cardLength(min: number, max: number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			if (control.value !== undefined) {
				if (control.value !== null) {
					if ((control.value.toString().length < min) ||
						(control.value.toString().length > max)) {
						return { 'cardLength': true };
					} else {
						return null;
					}
				} else {
					return null;
				}
			}
			return null;
		};
  }
  
  /**
	 * Event handler for Cyber Source payment method
	 */
	orderCyberSourceMethod() {
		if (this.paypalFormObj.valid) {
			if (this.isWalletChecked && this.isShowCard()) {
				this.orderWalletCSProcess();
			} else {
				this.orderCSProcess();
			}

		} else {
			this.paypalFormError = this.validatorService.validationError(this.paypalFormObj, this._formErrorMessage);
		}
	}

  /**
	 * Complete order process with cyber source and wallet
	 */
	orderWalletCSProcess() {
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		const paramsOrder = {
			// ...this.cartObj,
			// payment_mode: 'WCS',
      // ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
      
      user_id:this.user.id,
      reseller_id:0,
      order_address_id: this.order_address_id,
      total_discount_price: 0,
      total_tax_price: 0,
      total_order_price: this.coursePromoteInfo.amount,
      payment_status:"pending",
      order_status:"pending",
      send_data:'',
      ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      payment_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      order_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      payment_mode: 'WCS',
		};
		// delete paramsOrder.id;
		// delete paramsOrder.items;

		this.httpService.getLoggedUser().pipe(
			mergeMap((user) => {
				if (user) {
					logUser = user;
					return this.httpService.setModule('orders').create(paramsOrder);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					orderResponse = response.data;
					return this.saveOrderDetails(orderResponse);
				} else {
					return of(null);
				}

			}),
			mergeMap((response) => {
				if (response) {
					return this.sendCyberSourceRequest(orderResponse);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					return this.sendWalletRequest(orderResponse);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					return this.savePromoteData(orderResponse);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					const orderResObj = {
						...orderResponse,
						payment_status: 'complete',
						logUser: logUser
					};

					return this.savePayment(orderResObj);
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			this.orderLoader = false;
			if (response) {
			//	this.commonService.setFlashMessage(response.data);
		
				// console.log(response, ' - order details');
			//	this.router.navigate(['/order-success']);
				this.toasterService.pop('success', "Promoted Successfully");
				this.router.navigate(['/dashboard/my-course']);
			}
		}, (error) => {
			this.orderLoader = false;
			// this.commonService.setFlashMessage(error.error);
			// console.log(error, ' - order details error');
			// this.router.navigate(['/order-failure']);
			// this.toasterService.pop('error', error.error);
			this.commonService.showErrors(error.error);
			this.router.navigate(['/dashboard/my-course']);

		});
	}

/**
	 * Function to send cyber source request
	 * @param orderResponse any
	 */
	private sendCyberSourceRequest(orderResponse): Observable<any> {
		const paymentObj = {
			'order_id': orderResponse.id,
			'items': [
        {
          id:this.coursePromoteInfo.courseId,
          price:this.coursePromoteInfo.amount
        }
      ],
			'net_amount': this.getPaybleAmount(),
			'billing_address': this.billing_address,
			'card': this.paypalFormObj.value
		};
		// paymentCyberSource
		return this.httpService.setModule('paymentCyberSource').create(paymentObj);
	}

  /**
	 * Complete order process with cyber source
	 */
	private orderCSProcess() {
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		const paramsOrder = {
			// ...this.cartObj,
			// payment_mode: 'CS',
      // ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
      
      user_id:this.user.id,
      reseller_id:0,
      order_address_id: this.order_address_id,
      total_discount_price: 0,
      total_tax_price: 0,
      total_order_price: this.coursePromoteInfo.amount,
      payment_status:"pending",
      order_status:"pending",
      send_data:'',
      ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      payment_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      order_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      payment_mode: 'CS',
		};
		// delete paramsOrder.id;
		// delete paramsOrder.items;

		let paymentResObj = null;
		this.httpService.getLoggedUser().pipe(
			mergeMap((user) => {
				if (user) {
					logUser = user;
					return this.httpService.setModule('orders').create(paramsOrder);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					orderResponse = response.data;
					return this.saveOrderDetails(orderResponse);
				} else {
					return of(null);
				}

			}),
			mergeMap((response) => {
				if (response) {
					return this.sendCyberSourceRequest(orderResponse);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					return this.savePromoteData(orderResponse);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					const orderResObj = {
						...orderResponse,
						payment_status: 'complete',
						logUser: logUser
					};

					return this.savePayment(orderResObj);
				} else {
					return of(null);
				}
			}),
			// mergeMap((response) => {
			// 	if (response) {
			// 		paymentResObj = response.data;
			// 		return this.saveVendorWallet(orderResponse);
			// 	} else {
			// 		return of(null);
			// 	}

			// })
		).subscribe((response) => {
			this.orderLoader = false;
			if (response) {
				// this.commonService.setFlashMessage(paymentResObj);
				// this.commonService.removeCart();
				// console.log(response, ' - order details');
				// this.router.navigate(['/order-success']);
				this.router.navigate(['dashboard/my-course']);
				this.toasterService.pop('success','Promoted Successfully');
			}
		}, (error) => {
			this.orderLoader = false;
			//this.commonService.setFlashMessage(error.error);
			// console.log(error, ' - order details error');
			//	this.router.navigate(['/order-failure']);
			this.router.navigate(['dashboard/my-course']);
			this.commonService.showErrors(error.error);
		});
  }
  

  /**
	 * Event handler for SLX payment method
	 */
	orderSLXMethod() {
		if (this.isWalletChecked && this.isShowCard()) {
			this.orderWalletSLXProcess();
		} else {
			this.orderSLXProcess();
		}
  }
  
  /**
	 * Complete order process with SLX transaction method
	 */
	private orderSLXProcess() {
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		const paramsOrder = {
			// ...this.cartObj,
			// payment_mode: 'SLX',
      // ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
      user_id:this.user.id,
      reseller_id:0,
      order_address_id: this.order_address_id,
      total_discount_price: 0,
      total_tax_price: 0,
      total_order_price: this.coursePromoteInfo.amount,
      payment_status:"pending",
      order_status:"pending",
      send_data:'',
      ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      payment_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      order_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      payment_mode: 'SLX',
		};
		// delete paramsOrder.id;
		// delete paramsOrder.items;

		let paymentResObj = null;
		this.httpService.getLoggedUser().pipe(
			mergeMap((user) => {
				if (user) {
					logUser = user;
					return this.httpService.setModule('orders').create(paramsOrder);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					orderResponse = response.data;
					return this.saveOrderDetails(orderResponse);
				} else {
					return of(null);
				}

			}),

			mergeMap((response) => {
				if (response) {
					// console.log(response, ' in generate slx address');
					const params = {
						order_id: orderResponse.id,
						value: this.getPaybleAmount()
					}
					return this.httpService.setModule('paymentSXL').create(params);
				} else {
					return of(null);
				}
			}),

			mergeMap((response) => {
				if (response) {
					// console.log(response, ' in open slx modal');
					const resObj = response.data || {};
					this.slxTokenResponse = {
						...resObj,
						user_id: logUser.user.id,
						order_id: orderResponse.id,
						order_amount: this.getPaybleAmount()
					};
					return this.openSLXModal();
				} else {
					return of(null);
				}
			}),

			mergeMap((response) => {
				if (response) {
					//	console.log(response, ' in habdel SLX check');
					return this.handlePerMinutesSLXCheckReq();
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					return this.savePromoteData(orderResponse);
				} else {
					return of(null);
				}
			}),

			mergeMap((response) => {
				if (response) {
					// console.log(response, ' in update payment');
					const orderResObj = {
						...orderResponse,
						payment_status: response.payment_status,
						logUser: logUser
					};

					if (response.payment_status === 'pending') {
						return of({
							data: {
								payment_status: 'pending',
								order_status: 'pending'
							}
						});
					} else {
						return this.savePayment(orderResObj);
					}
				} else {
					return of(null);
				}
			}),
			// mergeMap((response) => {
			// 	if (response) {
			// 		console.log(response, ' in save vendor wallet');
			// 		paymentResObj = response.data;
			// 		if (paymentResObj.payment_status === 'success') {
			// 			return this.saveVendorWallet(orderResponse);
			// 		} else {
			// 			return throwError({
			// 				error: {
			// 					status: 'error',
			// 					messageCode: 'payment-failed',
			// 					message: 'Due to Payment failed'
			// 				}
			// 			});
			// 		}
			// 	} else {
			// 		return of(null);
			// 	}

			// })
		).subscribe((response) => {
			this.orderLoader = false;
			if (response) {
				if (this.slxModalRef) {
					this.slxModalRef.close();
				}
				// this.commonService.setFlashMessage(paymentResObj);
				// this.commonService.removeCart();
				// console.log(response, ' - order details');
				// this.router.navigate(['/order-success']);

				this.router.navigate(['dashboard/my-course']);
				this.toasterService.pop('success', 'Promoted Successfully');
			
			}
		}, (error) => {
			// console.log(error, ' error');

			if (this.slxModalRef) {
				this.slxModalRef.close();
			}

			// if (error.error.messageCode) {
			// 	this.commonService.removeCart();
			// }
			this.orderLoader = false;
			// this.commonService.setFlashMessage(error.error);
			// console.log(error, ' - order details error');
			// this.router.navigate(['/order-failure']);
			this.router.navigate(['dashboard/my-course']);
			this.commonService.showErrors(error.error);
		});
	}



  /**
	 * Complete order process with cyber source and wallet
	 */
	orderWalletSLXProcess() {
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		const paramsOrder = {
			// ...this.cartObj,
			// payment_mode: 'WSLX',
      // ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
      user_id:this.user.id,
      reseller_id:0,
      order_address_id: this.order_address_id,
      total_discount_price: 0,
      total_tax_price: 0,
      total_order_price: this.coursePromoteInfo.amount,
      payment_status:"pending",
      order_status:"pending",
      send_data:'',
      ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      payment_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      order_status_update_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
      payment_mode: 'WSLX',
		};
		// delete paramsOrder.id;
		// delete paramsOrder.items;

		let paymentResObj = null;
		this.httpService.getLoggedUser().pipe(
			mergeMap((user) => {
				if (user) {
					logUser = user;
					return this.httpService.setModule('orders').create(paramsOrder);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					orderResponse = response.data;
					return this.saveOrderDetails(orderResponse);
				} else {
					return of(null);
				}

			}),
			
			mergeMap((response) => {
				if (response) {
					return this.sendWalletRequest(orderResponse);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					// console.log(response, ' in generate slx address');
					const params = {
						order_id: orderResponse.id,
						value: this.getPaybleAmount(),
					}
					return this.httpService.setModule('paymentSXL').create(params);
				} else {
					return of(null);
				}
			}),

			mergeMap((response) => {
				if (response) {
					// console.log(response, ' in open slx modal');
					const resObj = response.data || {};
					this.slxTokenResponse = {
						...resObj,
						user_id: logUser.user.id,
						order_id: orderResponse.id,
						order_amount: this.getPaybleAmount(),
					};
					return this.openSLXModal();
				} else {
					return of(null);
				}
			}),

			mergeMap((response) => {
				if (response) {
					// console.log(response, ' in habdel SLX check');
					return this.handlePerMinutesSLXCheckReq();
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					return this.savePromoteData(orderResponse);
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					// console.log(response, ' in update payment');
					const orderResObj = {
						...orderResponse,
						payment_status: response.payment_status,
						logUser: logUser
					};

					if (response.payment_status === 'pending') {
						return of({
							data: {
								payment_status: 'pending',
								order_status: 'pending'
							}
						});
					} else {
						return this.savePayment(orderResObj);
					}
				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					// console.log(response, ' in save vendor wallet');
					paymentResObj = response.data;
					if (paymentResObj.payment_status === 'complete') {
						return this.saveVendorWallet(orderResponse);
					} else {
						return throwError({
							error: {
								status: 'error',
								messageCode: 'payment-failed',
								message: 'Due to Payment failed'
							}
						})
					}
				} else {
					return of(null);
				}

			})
		).subscribe((response) => {
			this.orderLoader = false;
			if (response) {
				if (this.slxModalRef) {
					this.slxModalRef.close();
				}
				// this.commonService.setFlashMessage(response.data);
				// this.commonService.removeCart();
				// console.log(response, ' - order details');
				// this.router.navigate(['/order-success']);

				this.router.navigate(['dashboard/my-course']);
				this.toasterService.pop('success', 'Promoted Successfully');
			}
		}, (error) => {
			// console.log(error, ' error');

			if (this.slxModalRef) {
				this.slxModalRef.close();
			}

			// if (error.error.messageCode) {
			// 	this.commonService.removeCart();
			// }
			this.orderLoader = false;
		//	this.commonService.setFlashMessage(error.error);
			// console.log(error, ' - order details error');
			// this.router.navigate(['/order-failure']);
			this.router.navigate(['dashboard/my-course']);
			this.commonService.showErrors(error.error);
		});
  }
  

  openSLXModal(): Observable<any> {
		const curDtObj = new Date();
		this.slxTimeFinish = new Date((curDtObj.getTime() + (this.totalDuration * 60000)));

		this.slxInterval$ = interval(1000).pipe(
			mergeMap((x) => {
				const diff = Math.floor(this.slxTimeFinish.getTime() - new Date().getTime());
				return of({diffMs: diff, times: x});
			})
		);

		this.slxIntercalSubs = this.slxInterval$
			.subscribe((obj) => {
				// console.log(x, ' x');
				const minutes = Math.floor(obj.diffMs / 60000);
				const seconds = Math.floor((obj.diffMs / 1000) - (minutes * 60));
				this.slxTransactionInterval = minutes + ':' + ('0' + seconds).slice(-2);
				this.slxPerMinuteObj.currentDurationObj = obj;

				// Open Modal
				if (obj.times === 0) {
					this.slxModalRef = this.modalService.open(this.slxModal, { backdrop: 'static', backdropClass: 'lightBlueBackdrop', centered: true, size: 'lg', keyboard: false });
				}

				// Close modal automatic if 15 misutes over 
				if (obj.diffMs < 1) {
					this.closeSLXModal();
				}

			});

		const reqParamObj = {
			order_id: this.slxTokenResponse.order_id,
			user_id: this.slxTokenResponse.user_id,
			slx_address: this.slxTokenResponse.address
		}
		return this.httpService.setModule('orderSXLUpdate').create(reqParamObj);
	}

	closeSLXModal() {
		this.slxLoader = true;
		this.slxPerMinuteObj.seconds = 59;
		this.slxPerMinuteObj.secondsText = '59 Sec';
		this.slxTransactionInterval = '00:00';
		this.slxIntercalSubs.unsubscribe();
	}
  public handlePerMinutesSLXCheckReq(): Observable<any> {
		return this.perMinutesSLXCheckReq().pipe(
			mergeMap((data) => {
				// console.log(data);
				return of({
					payment_status: (data.status === '1') ? 'complete' : 'pending',
					status: (data.status === '1') ? 'success' : 'error',
					response: data
				});
			}),
			catchError((error) => {
				this.closeSLXModal();
				return of({
					payment_status: 'pending',
					status: 'error',
					response: error
				});
			})
		);
  }
  
  public perMinutesSLXCheckReq(): Observable<any> {
		const source = this.slxTokenCheckProcess();

		const exm = source.pipe(
			retryWhen(errors =>
				errors.pipe(
					//restart in 1 minutes
					delayWhen(val => timer(60 * 1000))
				)
			)
		)

		return exm;
  }
  public slxTokenCheckProcess(): Observable<any> {
		
		return this.httpService.setModule('paymentSXL').findOne(this.slxTokenResponse.address).pipe(
		//return this.httpService.setModule('paymentSXLCheck').findOne(this.slxTokenResponse.address).pipe(	
			mergeMap((response) => {
				const perMintSubs = interval(1000).subscribe((d) => {
					// Per minutes timer
					if (this.slxPerMinuteObj.seconds === 0) {
						this.slxPerMinuteObj.seconds = 59;
						this.slxPerMinuteObj.secondsText = '59 Sec';
						perMintSubs.unsubscribe();
					} else {
						this.slxPerMinuteObj.seconds -= 1;
						this.slxPerMinuteObj.secondsText = ('0' + this.slxPerMinuteObj.seconds).slice(-2) + ' Sec';
					}
				});
				

				if (response) {
					if (response.data.result.length > 0) {
						return of(response.data);
					} else {
						// console.log(this.slxPerMinuteObj, ' times');
						if (this.slxPerMinuteObj.currentDurationObj.diffMs < 1) {
							return of(response.data);
						} else {
							return throwError({
								error: {
									status: 'error',
									message: 'Payment not completed'
								}
							});	
						}
					}
				} else {
					return throwError({
						error: {
							status: 'error',
							message: 'No response found'
						}
					});
				}
			})
		);
	}

}

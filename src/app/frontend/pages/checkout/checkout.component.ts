import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { environment as env } from '../../../../environments/environment';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { of, throwError, Observable, interval, timer, Subscription } from 'rxjs';
import { mergeMap, retry, retryWhen, delayWhen, tap, catchError,delay, switchMap } from 'rxjs/operators';
import { SeoServiceService }  from '../../../services/seo-service.service';
import { EncrDecrService } from '../../../services/encr-decr.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StripeService } from 'ngx-stripe';
import { stat } from 'fs';


@Component({
	selector: 'app-checkout',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

	public stripePaymentFlag: string;
	public stripeSuccess: Boolean = false;
	public  stripeUsdComplete: Boolean = true;

	public cartObj: any = null;
	public orderLoader: Boolean = false;

	public paypalFormObj: FormGroup;
	public paypalFormError: any;

	public wallet: any = null;

	private env: any = env;

	public isWalletChecked: Boolean = false;

	public isWalletCheckedUsd: Boolean = false;
	public isWalletCheckedSxl: Boolean = false;

	public haveUsd: Boolean = false;
	public haveSxl: Boolean = false;
	public showUsdPayment: Boolean = false;
	public showSxlPayment: Boolean = false;
	public freeCartPay: Boolean = false;

	public proceedToPayment: Boolean = true;
	public saveOrderData: any = {
		user_id: null,
		reseller_id: null,
	order_address_id: null,
	total_discount_price: 0.00,
	total_order_price_usd: 0.00,
	total_order_price_sxl: 0.00,
	total_order_price: 0.00,
	items:[]
	};
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
		},
		card_type: {
			required: 'Please choose a card type'
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
	private totalDuration: number;
	public slxLoader: Boolean = false;
	public slxPerMinuteObj: any = {
		seconds: 59,
		secondsText: '59 Sec',
		currentDurationObj: { diffMs: 0, times: 0 }
	};
	public orderUsdResponseDetails:any;
	public todayUsdSxlConvertionRate;
	constructor(
		public router: Router,
		public httpService: HttpRequestService,
		public commonService: CommonService,
		public formBuilder: FormBuilder,
		private modalService: NgbModal,
		public validatorService: NgReactiveFormValidatorService,
		public SeoService:SeoServiceService,
		private EncrDecr: EncrDecrService,
		private http: HttpClient,
		private stripeService: StripeService,
		private route: ActivatedRoute
	) { 
		this.route.queryParams.subscribe(params => {
			let status = params['status'];
			console.log(status); // Print the parameter to the console. 
			this.stripePaymentFlag = status;

			if(this.stripePaymentFlag === 'usdslxsuccess') {
				console.log("in flag check");
				console.log(this.stripePaymentFlag);
				this.orderStripeUSDSLXSuccess();
			}

			if(this.stripePaymentFlag === 'usdsuccess') {
				console.log("in flag check");
				console.log(this.stripePaymentFlag);
				this.orderStripeUSDSuccess();
			}
		});
	}
	

	ngOnInit() {
		this.SeoService.getMetaInfo();
		this.paypalFormObj = this.formBuilder.group({
			card_type:['', Validators.required],
			card_no: [null, [Validators.required, this.cardLength(16, 16)]],
			exp_mo: ['', Validators.required],
			exp_yr: ['', Validators.required],
			cvn: [null, Validators.required],
			card_holder_name: [null, Validators.required]
		});

		for (let index = 0; index < 20; index++) {
			this.yearArr.push({ name: (2019 + index), value: (2019 + index) });
		}
		
		this.getCart();
		this.getWallet();
		this.getSlxUsdConvertionRate();
		
		// this.getPaymentDetails();

		// this.httpService.getLoggedUser().subscribe((data) => {
		// 	console.log(data);
		// });

		// const subscribe = this.testObs().subscribe((res) => {
		// 	console.log(res);
		// 	// subscribe.unsubscribe();
		// }, (err) => {
		// 	console.error(err, ' times');
		// });

		this.totalDuration = 15;
		this.slxPerMinuteObj.currentDurationObj.diffMs = (this.totalDuration * 60000);
		
		//console.log(JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).sxl_to_usd_rate);
	}



	orderStripeUSDSLXSuccess () {
		console.log("stripe success");
	
		let orderResponse = null;
		let logUser = null;
		
		this.orderLoader = true;
		this.stripeUsdComplete = false;
		const paramsOrder = {
			...this.cartObj,
			payment_mode: 'CS',
			ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
		};
		delete paramsOrder.id;
		delete paramsOrder.items;

		let paymentResObj = null;
		this.httpService.getLoggedUser().pipe(
			// mergeMap((user) => {
			// 	if (user) {
			// 		logUser = user;
			// 		return this.httpService.setModule('orders').create(paramsOrder);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),
			mergeMap((user) => {
				if (user) {
					logUser = user;
					return this.saveOrderDetails(logUser);
				} else {
					return of(null);
				}

			}),

			mergeMap((response) => {
				orderResponse =response.data;
				this.orderUsdResponseDetails = orderResponse;
				if (response) {
					const orderResObj = {
						order_id: orderResponse.id,
						payment_status: 'pending',
						logUser: logUser
					};

					
					this.savePaymentUsd(orderResObj);
					
					return this.updateOrderStatus(orderResponse,'complete');
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
		
				//console.log(response,'cs process response');
				// if(!this.haveSxl){
				// 	if (response) {
				// 		return this.updateOrderStatus(orderResponse,'complete');
				// 	} else {
					
				// 		return of(null);
				// 	}
				// } else {
				// 	return of(1);
				// }
				if (response.status == 'success') {
					if(!this.haveSxl){
					   
						   return this.updateOrderStatus(orderResponse,'complete');
					   } 
				    else {
				   	return of(1);
				   }
				   }else {
					   return this.updateOrderStatus(orderResponse,'failed');
					  // return of(null);
				   }
			}),
			

			// mergeMap((response) => {
			// 	if (response) {
			// 		const orderResObj = {
			// 			order_id:orderResponse.id,
			// 			payment_status: 'complete',
			// 			logUser: logUser
			// 		};

			// 		return this.savePaymentUsd(orderResObj);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),

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
				this.showUsdPayment = false;
				if (1) {
					this.showSxlPayment = true;
				} else {
					this.commonService.removeCart();
					this.router.navigate(['/order-success']);
				}
				// this.commonService.setFlashMessage(paymentResObj);
				// old price code
			//	this.commonService.removeCart();
				// console.log(response, ' - order details');
			//	this.router.navigate(['/order-success']);
			}
		}, (response) => {
			// this.orderLoader = false;
			// // this.updateOrderStatus(orderResponse,'failed');
			// this.commonService.setFlashMessage(error.error);
			// // console.log(error, ' - order details error');
			// this.router.navigate(['/order-failure']);

			this.orderLoader = false;
			if (response) {
				this.showUsdPayment = false;
				if (1) {
					this.showSxlPayment = true;
				} else {
					this.commonService.removeCart();
					this.router.navigate(['/order-success']);
				}
				// this.commonService.setFlashMessage(paymentResObj);
				// old price code
			//	this.commonService.removeCart();
				// console.log(response, ' - order details');
			//	this.router.navigate(['/order-success']);
			}
		});
	}



	orderStripeUSDSuccess () {
		console.log("stripe success");
	
		let orderResponse = null;
		let logUser = null;
		
		this.orderLoader = true;
		this.stripeUsdComplete = false;
		const paramsOrder = {
			...this.cartObj,
			payment_mode: 'CS',
			ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
		};
		delete paramsOrder.id;
		delete paramsOrder.items;

		let paymentResObj = null;
		this.httpService.getLoggedUser().pipe(
			// mergeMap((user) => {
			// 	if (user) {
			// 		logUser = user;
			// 		return this.httpService.setModule('orders').create(paramsOrder);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),
			mergeMap((user) => {
				if (user) {
					logUser = user;
					return this.saveOrderDetails(logUser);
				} else {
					return of(null);
				}

			}),

			mergeMap((response) => {
				orderResponse =response.data;
				this.orderUsdResponseDetails = orderResponse;
				if (response) {
					const orderResObj = {
						order_id: orderResponse.id,
						payment_status: 'pending',
						logUser: logUser
					};

					
					this.savePaymentUsd(orderResObj);
					
					return this.updateOrderStatus(orderResponse,'complete');
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
		
				//console.log(response,'cs process response');
				// if(!this.haveSxl){
				// 	if (response) {
				// 		return this.updateOrderStatus(orderResponse,'complete');
				// 	} else {
					
				// 		return of(null);
				// 	}
				// } else {
				// 	return of(1);
				// }
				if (response.status == 'success') {
					if(!this.haveSxl){
					   
						   return this.updateOrderStatus(orderResponse,'complete');
					   } 
				    else {
				   	return of(1);
				   }
				   }else {
					   return this.updateOrderStatus(orderResponse,'failed');
					  // return of(null);
				   }
			}),
			

			// mergeMap((response) => {
			// 	if (response) {
			// 		const orderResObj = {
			// 			order_id:orderResponse.id,
			// 			payment_status: 'complete',
			// 			logUser: logUser
			// 		};

			// 		return this.savePaymentUsd(orderResObj);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),

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
				this.showUsdPayment = false;
				if (1) {
					//this.showSxlPayment = true;
				} else {
					this.commonService.removeCart();
					this.router.navigate(['/order-success']);
				}
				// this.commonService.setFlashMessage(paymentResObj);
				// old price code
			//	this.commonService.removeCart();
				// console.log(response, ' - order details');
			//	this.router.navigate(['/order-success']);
			}
		}, (response) => {
			// this.orderLoader = false;
			// // this.updateOrderStatus(orderResponse,'failed');
			// this.commonService.setFlashMessage(error.error);
			// // console.log(error, ' - order details error');
			// this.router.navigate(['/order-failure']);

			this.orderLoader = false;
			if (response) {
				this.showUsdPayment = false;
				if (1) {
					//this.showSxlPayment = true;
					this.commonService.removeCart();
					this.router.navigate(['/order-success']);
				} else {
					this.commonService.removeCart();
					this.router.navigate(['/order-success']);
				}
				// this.commonService.setFlashMessage(paymentResObj);
				// old price code
			//	this.commonService.removeCart();
				// console.log(response, ' - order details');
			//	this.router.navigate(['/order-success']);
			}
		});
	}

	checkout() {
		
		console.log(this.cartObj.total_order_price.usd_price);


		let product = this.cartObj.items.map((el) => {
				let name = el.details.title;
				return name;
		});

		let type  = this.haveUsd && this.haveSxl ? "usdslx":"usd";
		
		console.log(product[0]);
		this.orderCSProcess();
		this.http.post('http://localhost:3000/api//payment/create-checkout-session', {total : this.cartObj.total_order_price.usd_price, product: product[0].toString(), type: type})
		  .pipe(
			switchMap(session => {
				let stripesession: any = {};
				stripesession = session;
			  return this.stripeService.redirectToCheckout({ sessionId: stripesession.id.toString() })
			})
		  )
		  .subscribe(result => {
			console.log(result);
			if (result.error) {
			  alert(result.error.message);
			}
		  });
		  
	  }

	public testObs() {
		let c = 0;
		// const source = this.httpService.setModule('utilityLocation').findOne('100');
		const source = of(c).pipe(
			mergeMap((d) => {
				c += 1;
				//console.log(c);
				// console.log('-----------');
				// console.log(d);
				if (c > 10) {
					return of({ status: 'success', value: d });
				} else {
					return throwError({ status: 'error', value: d });
				}
			})
		);

		const exm = source.pipe(
			retryWhen(errors =>
				errors.pipe(
					// log error message
					tap(val => {
						// c += 1;
						// console.log(val, ' err');
					}),
					// restart in 6 seconds
					delayWhen(val => timer(2 * 1000))
				)
			)
		);

		return exm;
		// const source = interval(10000);
		// let v = 0;
		// const example = source.pipe(
		// 	mergeMap(val => {
		// 		v += 1;
		// 		console.log(val, ' ss');
		// 		console.log(v, ' v');
		// 		//throw error for demonstration
		// 		// if (val === 0) {
		// 		// 	return throwError('Error!');
		// 		// }
		// 		if ( v === 3) {
		// 			return this.httpService.setModule('wallet').findOne('5', {search_by: 'user_id'});
		// 		} else {
		// 			return this.httpService.setModule('utilityLocation').findOne('100');
		// 		}
		// 	}),
		// 	//retry 2 times on error
		// 	retry(5)
		// );
		// return example;
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

	isShownOriginalAmount() {
		return (this.cartObj.original_order_price > this.cartObj.total_order_price);
	}

	getTotalDiscountPercentage() {
		let offPerc = 0;
		if (this.cartObj) {
			offPerc = (((this.cartObj.original_order_price - this.cartObj.total_order_price) / this.cartObj.original_order_price) * 100);
		}
		return offPerc;
	}

	getItemDiscountPrice(item) {
		let prc = 0.00;
		if (item) {
			prc = (item.details.price * item.quantity);
			if (item.discount) {
				let discountAmt = 0;
				if (item.discount.discount_mode === 'fixed') {
					discountAmt = item.discount.discount_value;
				} else if (item.discount.discount_mode === 'percentage') {
					discountAmt = ((item.discount.discount_value * prc) / 100);
				}
				prc -= discountAmt;
			}
		}
		return prc;
	}

	getItemDiscountAmount(item) {
		let discountAmt = 0;
		if (item) {
			const prc = (item.details.price * item.quantity);
			if (item.discount) {
				if (item.discount.discount_mode === 'fixed') {
					discountAmt = item.discount.discount_value;
				} else if (item.discount.discount_mode === 'percentage') {
					discountAmt = ((item.discount.discount_value * prc) / 100);
				}
			}
		}
		return discountAmt;
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
	 * Event handler for on change event of wallet checkbox for usd
	 * @param event MouseEvent
	 */
	onChangeWalletUsd(event) {
		if (event) {
			this.isWalletCheckedUsd = event.target.checked;
		}
	}

	/**
	 * Event handler for on change event of wallet checkbox for slx
	 * @param event MouseEvent
	 */
	onChangeWalletSxl(event) {
		if (event) {
			this.isWalletCheckedSxl = event.target.checked;
		}
	}

	// Old price code

	/**
	 * Get payble amount
	 */
	getPaybleAmount() {
		let amount = 0.00;
		if (this.cartObj) {
			amount = this.cartObj.total_order_price;
			if (this.wallet) {
				if (this.isWalletChecked) {
					amount -= this.wallet.amount;
				}
			}
		}
		return amount;
	}

	// New price code

	/**
	 * Get payble amount USD
	 */
	getPaybleAmountUsd() {
		let amount = 0.00;
		if (this.cartObj) {
			amount = this.cartObj.total_order_price.usd_price;
			if (this.wallet) {
				if (this.isWalletCheckedUsd) {
					amount -= this.wallet.amount;
				}
			}
		}
		return amount;
	}
	/**
	 * Get payble amount SXL
	 */
	getPaybleAmountSxl() {
		let amount = 0.00;
		if (this.cartObj) {
			amount = this.cartObj.total_order_price.sxl_price;
			if (this.wallet) {
				if (this.isWalletCheckedSxl) {
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
		if (this.cartObj && this.wallet) {
			if (this.isWalletChecked) {
				if (parseFloat(this.cartObj.total_order_price) > parseFloat(this.wallet.amount)) {
					amount = this.wallet.amount;
				} else {
					amount = parseFloat(this.cartObj.total_order_price);
				}
			}
		}
		return amount;
	}

	/**
	 * Get payble amount Usd
	 */
	getWalletPaybleAmountUsd() {
		let amount = 0.00;
		if (this.cartObj && this.wallet) {
			if (this.isWalletCheckedUsd) {
				if (parseFloat(this.cartObj.total_order_price.usd_price) > parseFloat(this.wallet.amount)) {
					amount = this.wallet.amount;
				} else {
					amount = parseFloat(this.cartObj.total_order_price.usd_price);
				}
			}
		}
		return amount;
	}

	/**
	 * Get payble amount Sxl
	 */
	getWalletPaybleAmountSxl() {
		let amount = 0.00;
		if (this.cartObj && this.wallet) {
			if (this.isWalletCheckedSxl) {
				let changeUsdAmount =this.cartObj.total_order_price.sxl_price * this.todayUsdSxlConvertionRate;
				// console.log(this.todayUsdSxlConvertionRate);
				// console.log(changeUsdAmount);
				if (parseFloat(changeUsdAmount.toString()) > parseFloat(this.wallet.amount)) {
					amount = this.wallet.amount;
				} else {
					amount = parseFloat(changeUsdAmount.toString());
				}
			}
		}
		return amount;
	}

	isShowWalletCheckbox(wallet) {
		let flag = false;
		if (wallet) {
			if ((wallet.amount !== 0) && (this.cartObj.total_order_price > 0)) {
				flag = true;
			}
		}

		return flag;
	}

	isShowWalletCheckboxUsd(wallet) {
		let flag = false;
		if (wallet) {
			if ((wallet.amount !== 0) && (this.cartObj.total_order_price.usd_price > 0)) {
				flag = true;
			}
		}

		return flag;
	}

	isShowWalletCheckboxSlx(wallet) {
		let flag = false;
		if (wallet) {
			if ((wallet.amount !== 0) && (this.cartObj.total_order_price.sxl_price > 0)) {
				flag = true;
			}
		}

		return flag;
	}

	/**
	 * Function to check credit card section need to show or not
	 */
	isShowCard() {
		let flag = true;
		if (this.wallet) {
			if (this.wallet.amount > 0) {
				if ((this.wallet.amount >= this.cartObj.total_order_price) && (this.cartObj.total_order_price > 0)) {
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
	 * Function to check credit card section need to show or not
	 * for usd 
	 */
	isShowCardUsd() {
		let flag = true;
		if (this.wallet) {
			if (this.wallet.amount > 0) {
				if ((this.wallet.amount >= this.cartObj.total_order_price.usd_price) && (this.cartObj.total_order_price.usd_price > 0)) {
					flag = (this.isWalletCheckedUsd) ? false : true;
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
	 * Function to check credit card section need to show or not
	 * for slx 
	 */
	isShowCardSxl() {
		let flag = true;
		if (this.wallet) {
			if (this.wallet.amount > 0) {
				if ((this.wallet.amount >= this.cartObj.total_order_price.sxl_price) && (this.cartObj.total_order_price.sxl_price > 0)) {
					flag = (this.isWalletCheckedSxl) ? false : true;
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
	 * Get cart object from localStorage
	 */
	getCart() {
		
		this.commonService.getCart().subscribe((data) => {
			if (data) {
				this.cartObj = data;
				// console.log(this.cartObj);
				if(this.cartObj.total_order_price.usd_price && this.cartObj.total_order_price.sxl_price) {
					this.haveUsd = true;
					this.haveSxl = true;
					this.showUsdPayment =true;
				} else if(this.cartObj.total_order_price.usd_price && !this.cartObj.total_order_price.sxl_price) {
					this.haveUsd = true;
					this.showUsdPayment =true;
				} else if(!this.cartObj.total_order_price.usd_price && this.cartObj.total_order_price.sxl_price) {
					this.haveSxl = true;
					this.showSxlPayment =true;
				} else if(!this.cartObj.total_order_price.usd_price && !this.cartObj.total_order_price.sxl_price) {
					this.freeCartPay = true;
				}

				let payment_types = this.cartObj.items.map((element) => {
					if(element.details.pricable.length>0) {
					return element.details.pricable[0].payment_type_id;
					} else {
						return 0;
					}
				});
				payment_types = payment_types.filter( this.onlyUnique).toString();
				// console.log(payment_types);
				let checkPaymentTypes = { 
					payment_type_id: payment_types 
				};
				this.httpService.setModule('payTypeCheck').create(checkPaymentTypes).subscribe((response) => {
					if (response) {
						// console.log(response);
						if (response.data.length > 0) {
							this.proceedToPayment = false;
						}
					}
				}, (error) => {
					this.commonService.showErrors(error);
				});


				if (!this.cartObj.order_address_id) {
					this.router.navigate(['/checkout-address']);
				}
			} else {
				this.router.navigate(['/']);
			}
		});
	}
	onlyUnique(value, index, self) { 
		return self.indexOf(value) === index;
	}
	/**
	 * Get image url from item object
	 * @param item any
	 */
	getImage(item) {
		let imgUrl = '';
		if (item) {
			if (item.type === 'course') {
				imgUrl = item.details.images.thumbnail || '';
			} else if (item.type === 'event') {
				if (item.details.images.length > 0) {
					imgUrl = item.details.images[0].thumbnail || '';
				}
			} else if (item.type === 'product') {
				if (item.details.images.length > 0) {
					imgUrl = item.details.images[0].thumbnail || '';
				}
			}

			if (imgUrl === '') {
				imgUrl = 'assets/images/noimg-222x150.jpg';
			}
		}
		return imgUrl;
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
	 * Event handler for SLX payment method
	 */
	orderSLXMethod() {
		if (this.isWalletCheckedSxl && this.isShowCardSxl()) {
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
		// const paramsOrder = {
		// 	...this.cartObj,
		// 	payment_mode: 'SLX',
		// 	ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
		// };
		// delete paramsOrder.id;
		// delete paramsOrder.items;

		let paymentResObj = null;
		this.httpService.getLoggedUser().pipe(
			// mergeMap((user) => {
			// 	if (user) {
			// 		logUser = user;
			// 		return this.httpService.setModule('orders').create(paramsOrder);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),
			
			mergeMap((user) => {
				if (user) {
					logUser = user;
					if(!this.haveUsd) {
						return this.saveOrderDetails(logUser);
					} else {
						return of(1);
					}
					
				} else {
					return of(null);
				}

			}),

			// mergeMap((response) => {
			// 	if(!this.haveUsd){
			// 		orderResponse =response.data;
			// 	} else {
			// 		orderResponse = this.orderUsdResponseDetails;
			// 	}
			
			// 	if (response) {
			// 		const orderResObj = {
			// 			order_id: orderResponse.id,
			// 			payment_status: 'pending',
			// 			logUser: logUser
			// 		};

			// 		return this.savePaymentSxl(orderResObj);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),

			mergeMap((response) => {
				if(!this.haveUsd){
					orderResponse =response.data;
				} else {
					orderResponse = this.orderUsdResponseDetails;
				}
				if (response) {
					// console.log(response, ' in generate slx address');
					const params = {
						order_id: orderResponse.id,
						value: this.getPaybleAmountSxl()
					};
					return this.httpService.setModule('paymentSXL').create(params);
				} else {
					return of(null);
				}
			}),

			mergeMap((response) => {
				if (response) {
					 // console.log(response, ' in open slx modal');
					const resObj = response.data || {};
					// resObj.address = '0x9afe43259cb6bc10d5378499f6313d490489ebf5';
					this.slxTokenResponse = {
						...resObj,
						user_id: logUser.user.id,
						order_id: orderResponse.id,
						order_amount: this.getPaybleAmountSxl()
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
					 // console.log(response, ' in update payment');
					const orderResObj = {
						...orderResponse,
						order_id: orderResponse.id,
						payment_status: response.payment_status,
						logUser: logUser
					};

					if (response.payment_status === 'pending') {
						// console.log('failed payment');
						return this.savePaymentSxl(orderResObj);
						// return of({
						// 	data: {
						// 		payment_status: 'pending',
						// 	//	order_status: 'pending'
						// 	}
						// });
					} else {
						return this.savePaymentSxl(orderResObj);
					}

				} else {
					return of(null);
				}
			}),
			mergeMap((response) => {
				if (response) {
					// console.log(response, ' After success');
					paymentResObj = response.data;
					if (paymentResObj.payment_status === 'complete') {
						// return this.saveVendorWallet(orderResponse);
						// return of(1);
						return this.updateOrderStatus(orderResponse,'complete');

					} else {
						// this.updateOrderStatus(orderResponse,'failed');
						return throwError({
							error: {
								status: 'error',
								messageCode: 'payment-failed',
								message: 'Due to Payment failed'
							}
						});
					}
				} else {
					// this.updateOrderStatus(orderResponse,'failed');
					return of(null);
				}

			}), delay(2000)
		).subscribe((response) => {
			//console.log(response,'subscribe');
			this.orderLoader = false;
			if (response) {
				//console.log(this.slxModalRef);
				if (this.slxModalRef) {
					this.slxModalRef.close();
				}
				// this.commonService.setFlashMessage(paymentResObj);
				this.showSxlPayment = false;
				 this.commonService.removeCart();
				 //console.log(response, ' - order details');
				 this.router.navigate(['/order-success']);
			}
		}, (response) => {
			// console.log(error, ' error');

			if (this.slxModalRef) {
				this.slxModalRef.close();
			}
			this.showSxlPayment = false;
			if (1) {

				if (response) {
					orderResponse =response.data;
					// console.log(response, ' in open slx modal');
				   const resObj = response.data || {};
				   // resObj.address = '0x9afe43259cb6bc10d5378499f6313d490489ebf5';
				   this.slxTokenResponse = {
					   ...resObj,
					   user_id: logUser.user.id,
					   order_id: '0x9afe43259cb6bc10d5378499f6313d490489ebf5',
					   order_amount: this.getPaybleAmountSxl()
				   };
				   return this.openSLXModal();
			   } else {
				   return of(null);
			   }
				//this.commonService.removeCart();
			}
			 this.orderLoader = false;
			//this.commonService.setFlashMessage(error.error);
			// console.log(error, ' - order details error');
			 this.router.navigate(['/order-success']);
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
			...this.cartObj,
			payment_mode: 'WSLX',
			ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
		};
		delete paramsOrder.id;
		delete paramsOrder.items;

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
					return this.saveOrderDetails(logUser);
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
						value: this.getPaybleAmount()
					};
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
					// console.log(response, ' in habdel SLX check');
					return this.handlePerMinutesSLXCheckReq();
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
						});
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
				this.commonService.setFlashMessage(response.data);
				this.commonService.removeCart();
				// console.log(response, ' - order details');
				this.router.navigate(['/order-success']);
			}
		}, (error) => {
			// console.log(error, ' error');

			if (this.slxModalRef) {
				this.slxModalRef.close();
			}

			if (error.error.messageCode) {
				this.commonService.removeCart();
			}
			this.orderLoader = false;
			this.commonService.setFlashMessage(error.error);
			// console.log(error, ' - order details error');
			this.router.navigate(['/order-failure']);
		});
	}

	/**
	 * Event handler for Cyber Source payment method
	 */
	orderCyberSourceMethod() {
		if (this.paypalFormObj.valid) {
			if (this.isWalletCheckedUsd && this.isShowCardUsd()) {
				this.orderWalletCSProcess();
			} else {
				this.orderCSProcess();
			}

		} else {
			this.paypalFormError = this.validatorService.validationError(this.paypalFormObj, this._formErrorMessage);
		}
	}

	/**
	 * Complete order process with cyber source
	 */
	private orderCSProcess() {
		//console.log('cc');
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		const paramsOrder = {
			...this.cartObj,
			payment_mode: 'CS',
			ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
		};
		delete paramsOrder.id;
		delete paramsOrder.items;

		let paymentResObj = null;
		this.httpService.getLoggedUser().pipe(
			// mergeMap((user) => {
			// 	if (user) {
			// 		logUser = user;
			// 		return this.httpService.setModule('orders').create(paramsOrder);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),
			mergeMap((user) => {
				if (user) {
					logUser = user;
					return this.saveOrderDetails(logUser);
				} else {
					return of(null);
				}

			}),

			mergeMap((response) => {
				orderResponse =response.data;
				this.orderUsdResponseDetails = orderResponse;
				if (response) {
					const orderResObj = {
						order_id: orderResponse.id,
						payment_status: 'pending',
						logUser: logUser
					};

					
					this.savePaymentUsd(orderResObj);
					
					return this.updateOrderStatus(orderResponse,'complete');
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
		
				//console.log(response,'cs process response');
				// if(!this.haveSxl){
				// 	if (response) {
				// 		return this.updateOrderStatus(orderResponse,'complete');
				// 	} else {
					
				// 		return of(null);
				// 	}
				// } else {
				// 	return of(1);
				// }
				if (response.status == 'success') {
					if(!this.haveSxl){
					   
						   return this.updateOrderStatus(orderResponse,'complete');
					   } 
				    else {
				   	return of(1);
				   }
				   }else {
					   return this.updateOrderStatus(orderResponse,'failed');
					  // return of(null);
				   }
			}),
			

			// mergeMap((response) => {
			// 	if (response) {
			// 		const orderResObj = {
			// 			order_id:orderResponse.id,
			// 			payment_status: 'complete',
			// 			logUser: logUser
			// 		};

			// 		return this.savePaymentUsd(orderResObj);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),

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
				this.showUsdPayment = false;
				if (this.haveSxl) {
					this.showSxlPayment = true;
				} else {
					this.commonService.removeCart();
					this.router.navigate(['/order-success']);
				}
				// this.commonService.setFlashMessage(paymentResObj);
				// old price code
			//	this.commonService.removeCart();
				// console.log(response, ' - order details');
			//	this.router.navigate(['/order-success']);
			}
		}, (error) => {
			this.orderLoader = false;
			// this.updateOrderStatus(orderResponse,'failed');
			//this.commonService.setFlashMessage(error.error);
			// console.log(error, ' - order details error');
			//this.router.navigate(['/order-failure']);
		});
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
				...this.cartObj,
				payment_mode: 'FREE',
				ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
			};
			delete paramsOrder.id;
			delete paramsOrder.items;
			this.httpService.getLoggedUser().pipe(
				// mergeMap((user) => {
				// 	if (user) {
				// 		logUser = user;
				// 		return this.httpService.setModule('orders').create(paramsOrder);
				// 	} else {
				// 		return of(null);
				// 	}
				// }),

				mergeMap((user) => {
					if (user) {
						logUser = user;
						return this.saveOrderDetails(logUser);
					} else {
						return of(null);
					}
	
				}),
	
				mergeMap((response) => {
					orderResponse =response.data;
					if (response) {
						const orderResObj = {
							order_id: orderResponse.id,
							payment_status: 'complete',
							logUser: logUser
						};
	
						return this.savePaymentFree(orderResObj);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						// return this.saveVendorWallet(orderResponse);
						return this.updateOrderStatus(orderResponse,'complete');
					} else {
						this.updateOrderStatus(orderResponse,'failed');
						return of(null);
					}
				})
			).subscribe((response) => {
				this.orderLoader = false;
				if (response) {
					this.commonService.removeCart();
					// console.log(response, ' - order details');
					this.router.navigate(['/order-success']);
				}
			}, (error) => {
				this.orderLoader = false;
				// console.log(error, ' - order details error');
				this.router.navigate(['/order-failure']);
			});
		}
	}

	/**
	 * Event handler for wallet order process Usd
	 * @param event MouseEvent
	 */
	orderWalletMethodUsd(event) {
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		if (event) {
			const paramsOrder = {
				...this.cartObj,
				payment_mode: 'W',
				ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
			};
			delete paramsOrder.id;
			delete paramsOrder.items;
			this.httpService.getLoggedUser().pipe(
				// mergeMap((user) => {
				// 	if (user) {
				// 		logUser = user;
				// 		return this.httpService.setModule('orders').create(paramsOrder);
				// 	} else {
				// 		return of(null);
				// 	}
				// }),
				// mergeMap((response) => {
				// 	if (response) {
				// 		orderResponse = response.data;
				// 		return this.saveOrderDetails(logUser);
				// 	} else {
				// 		return of(null);
				// 	}
				// }),
				mergeMap((user) => {
					if (user) {
						logUser = user;
						return this.saveOrderDetails(logUser);
					} else {
						return of(null);
					}
	
				}),

				mergeMap((response) => {
					orderResponse = response.data;
					this.orderUsdResponseDetails = orderResponse;
					if (response) {
						return this.sendWalletRequestUsd(orderResponse);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						const orderResObj = {
							//...orderResponse,
							order_id: orderResponse.id,
							payment_status: 'complete',
							logUser: logUser
						};

						return this.savePaymentWalletUsd(orderResObj);
					} else {
						return of(null);
					}
				}),

				mergeMap((response) => {
					//console.log(response,'cs process response');
					// if(!this.haveSxl){
					// 	if (response) {
					// 		return this.updateOrderStatus(orderResponse,'complete');
					// 	} else {
							
					// 		return of(null);
					// 	}
					// } else {
					// 	return of(1);
					// }
					if (response.status == 'success') {
						if(!this.haveSxl){
						   
							   return this.updateOrderStatus(orderResponse,'complete');
						   } 
					    else {
					   	return of(1);
					   }
					   }else {
						 return  this.updateOrderStatus(orderResponse,'failed');
						//   return of(null);
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
				this.getWallet();
				this.orderLoader = false;
				if (response) {
					this.showUsdPayment = false;
					if (this.haveSxl) {
						this.showSxlPayment = true;
					} else {
						this.commonService.removeCart();
						this.router.navigate(['/order-success']);
					}
				}
			}, (error) => {
				this.orderLoader = false;
				// this.updateOrderStatus(orderResponse,'failed');
				this.commonService.setFlashMessage(error.error);
				// console.log(error, ' - order details error');
				this.router.navigate(['/order-failure']);
			});
		}
	}


	/**
	 * Event handler for wallet order process Usd
	 * @param event MouseEvent
	 */
	orderWalletMethodSxl(event) {
		let logUser = null;
		let orderResponse = null;
		this.orderLoader = true;
		if (event) {
			const paramsOrder = {
				...this.cartObj,
				payment_mode: 'W',
				ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
			};
			delete paramsOrder.id;
			delete paramsOrder.items;
			this.httpService.getLoggedUser().pipe(
				mergeMap((user) => {
					if (user) {
						logUser = user;
						if(!this.haveUsd) {
							return this.saveOrderDetails(logUser);
						} else {
							return of(1);
						}
						
					} else {
						return of(null);
					}
	
				}),

				mergeMap((response) => {
				if(!this.haveUsd){
					orderResponse =response.data;
				} else {
					orderResponse = this.orderUsdResponseDetails;
				}

					if (response) {
						return this.sendWalletRequestSxl(orderResponse);
					} else {
						return of(null);
					}
				}),
				mergeMap((response) => {
					if (response) {
						const orderResObj = {
							//...orderResponse,
							order_id: orderResponse.id,
							payment_status: 'complete',
							logUser: logUser
						};
						return this.savePaymentWalletSxl(orderResObj);
					} else {
						const orderResObj = {
							//...orderResponse,
							order_id: orderResponse.id,
							payment_status: 'pending',
							logUser: logUser
						};
						return this.savePaymentWalletSxl(orderResObj);

						// return of(null);
					}
				}),

				mergeMap((response) => {
						if (response) {
							return this.updateOrderStatus(orderResponse,'complete');
						} else {
							return this.updateOrderStatus(orderResponse,'failed');
							// return of(null);
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
				this.getWallet();
				this.orderLoader = false;
					if (response) {
						//console.log(this.slxModalRef);
					if (this.slxModalRef) {
						this.slxModalRef.close();
					}
					// this.commonService.setFlashMessage(paymentResObj);
					this.showSxlPayment = false;
					this.commonService.removeCart();
					//console.log(response, ' - order details');
					this.router.navigate(['/order-success']);
				}
			}, (error) => {
				this.orderLoader = false;
				this.commonService.setFlashMessage(error.error);
				// console.log(error, ' - order details error');
				this.router.navigate(['/order-failure']);
			});
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
			...this.cartObj,
			payment_mode: 'WCS',
			ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
		};
		delete paramsOrder.id;
		delete paramsOrder.items;

		this.httpService.getLoggedUser().pipe(
			// mergeMap((user) => {
			// 	if (user) {
			// 		logUser = user;
			// 		return this.httpService.setModule('orders').create(paramsOrder);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),
			// mergeMap((response) => {
			// 	if (response) {
			// 		orderResponse = response.data;
			// 		return this.saveOrderDetails(logUser);
			// 	} else {
			// 		return of(null);
			// 	}

			// }),
			mergeMap((user) => {
				if (user) {
					logUser = user;
					return this.saveOrderDetails(logUser);
				} else {
					return of(null);
				}

			}),

			mergeMap((response) => {
				orderResponse =response.data;
				this.orderUsdResponseDetails = orderResponse;
				if (response) {
					const orderResObj = {
						order_id: orderResponse.id,
						payment_status: 'pending',
						logUser: logUser
					};

					return this.savePaymentUsdWalletPlusCs(orderResObj);
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

			// mergeMap((response) => {
			// 	if (response) {
			// 		return this.sendWalletRequest(orderResponse);
			// 	} else {
			// 		return of(null);
			// 	}
			// }),
			mergeMap((response) => {
				if (response) {
					return this.sendWalletRequestUsd(orderResponse);
				} else {
					return of(null);
				}
			}),

			// mergeMap((response) => {
			// 	if (response) {
			// 		const orderResObj = {
			// 			...orderResponse,
			// 			payment_status: 'complete',
			// 			logUser: logUser
			// 		};

			// 		return this.savePayment(orderResObj);
			// 	} else {
			// 		return of(null);
			// 	}
			// })

			mergeMap((response) => {
		
				//console.log(response,'cs process response');
				if (response.status == 'success') {
				 if(!this.haveSxl){
					
						return this.updateOrderStatus(orderResponse,'complete');
					} 
				 else {
					return of(1);
				}
				}else {
					return this.updateOrderStatus(orderResponse,'failed');
					// return of(null);
				}
			}),

		).subscribe((response) => {
			this.orderLoader = false;
			if (response) {
			this.showUsdPayment = false;
				if (this.haveSxl) {
					this.showSxlPayment = true;
				} else {
					this.commonService.removeCart();
					this.router.navigate(['/order-success']);
				}
			}
		}, (error) => {
			this.orderLoader = false;
			
			// this.paymentFailedInWCS(orderResponse, logUser);
			this.commonService.setFlashMessage(error.error);
			// console.log(error, ' - order details error');
			this.router.navigate(['/order-failure']);
		});
	}

	openSLXModal(): Observable<any> {
		const curDtObj = new Date();
		this.slxTimeFinish = new Date((curDtObj.getTime() + (this.totalDuration * 60000)));

		this.slxInterval$ = interval(1000).pipe(
			mergeMap((x) => {
				const diff = Math.floor(this.slxTimeFinish.getTime() - new Date().getTime());
				return of({ diffMs: diff, times: x });
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
					this.slxModalRef = this.modalService.open(this.slxModal,
						{ backdrop: 'static', backdropClass: 'lightBlueBackdrop', centered: true, size: 'lg', keyboard: false });
					//console.log(this.slxModalRef,'slx modal ref')	
				}

				// Close modal automatic if 15 misutes over
				if (obj.diffMs < 1) {
					this.closeSLXModal();
				}

			});

		const reqParamObj = {
			order_id: this.slxTokenResponse.order_id,
			user_id: this.slxTokenResponse.user_id,
			sxl_address: this.slxTokenResponse.address
		};
		return this.httpService.setModule('orderSXLUpdate').create(reqParamObj);
	}

	closeSLXModal() {
		this.slxLoader = true;
		this.slxPerMinuteObj.seconds = 59;
		this.slxPerMinuteObj.secondsText = '59 Sec';
		this.slxTransactionInterval = '00:00';
		this.slxIntercalSubs.unsubscribe();
	}

	public slxTokenCheckProcess(): Observable<any> {
		
		
		return this.httpService.setModule('paymentSXL').findOne(this.slxTokenResponse.address).pipe(
		//return this.httpService.setModule('paymentSXLCheck').findOne(this.slxTokenResponse.address).pipe(	
			mergeMap((response) => {
				// console.log('slxTokenCheckProcess');
				// this.httpService.setModule('paymentSXL');
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
						//console.log(this.slxPerMinuteObj, ' times');
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

	public perMinutesSLXCheckReq(): Observable<any> {
		const source = this.slxTokenCheckProcess();

		const exm = source.pipe(
			retryWhen(errors =>
				errors.pipe(
					// restart in 1 minutes

					// tap(val => {
					// 	//let http :HttpHeaders=this.httpService.httpOptions.headers;
					// 	let encKey=this.EncrDecr.set(env.encrDecrKey,'#SLM2019Matrix'+(new Date().getTime()+ 10000).toString());
					// 	console.log(encKey,'newEncKey');
					// 	this.httpService.httpOptions.headers.set('api_key',encKey);
					// 	this.httpService.httpOptions.headers.append('abc','22');
					// 	//this.httpService.httpOptions.headers =http;
					// 	console.log(this.httpService.httpOptions.headers);
					// }),
					delayWhen(val => timer(60 * 1000))
				)
			)
		);

		return exm;
	}

	public handlePerMinutesSLXCheckReq(): Observable<any> {
		return this.perMinutesSLXCheckReq().pipe(
			mergeMap((data) => {
				//console.log(data);
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

	// Old price code

	// /**
	//  * Function for order detail save
	//  * @param orderResponse any
	//  */
	// private saveOrderDetails(orderResponse): Observable<any> {
	// 	const itemArr = this.cartObj.items.map((el) => {
	// 		const elm = {
	// 			order_id: orderResponse.id,
	// 			reseller_id: el.reseller_id,
	// 			vendor_id: el.details.user.id,
	// 			couponable_id: (el.discount) ? el.discount.id : null,
	// 			couponable_type: (el.coupon) ? 'course_coupons' : null,
	// 			productable_id: el.details.id,
	// 			productable_type: (el.type === 'course') ? 'courses' : 'products',
	// 			unit_price: el.details.price,
	// 			discount_price: this.getItemDiscountAmount(el),
	// 			// order_date: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
	// 			tax_price: 0.00,
	// 			quantity: el.quantity,
	// 			total_price: this.getItemDiscountPrice(el),
	// 			product_currency: el.details.currency,
	// 			ordered_currency: el.details.currency,
	// 			conversion_rate: 0
	// 		};
	// 		return elm;
	// 	});
	// 	return this.httpService.setModule('orderDetails').create(itemArr);
	// }

	// New Price Code
	/**
	 * Function for order detail save
	 * @param orderResponse any
	 */
	private saveOrderDetails(logUser): Observable<any> {
		
		this.saveOrderData = {
			user_id: logUser.user.id,
			order_address_id: this.cartObj.order_address_id,
			total_discount_price: this.cartObj.total_discount_price.usd_price,
			total_order_price_usd: this.cartObj.total_order_price.usd_price,
			total_order_price_sxl: this.cartObj.total_order_price.sxl_price,
			total_order_price: this.cartObj.total_order_price.usd_price +   this.cartObj.total_order_price.sxl_price,
			items: [],
		};
		
		const itemArr = this.cartObj.items.map((el) => {
		
			const elm = {
				 payment_category_id: el.details.pricable.length > 0 ? el.details.pricable[0].payment_category_id : 1 ,

				//payment_category_id: 1,
				productable_id: el.details.id,
				productable_type: (el.type === 'course') ? 'courses' : 'products',
				vendor_id: el.details.user.id,
				reseller_id: el.reseller_id,
				couponable_id: (el.discount) ? el.discount.id : null,
				couponable_type: (el.coupon) ? 'course_coupons' : null,
				quantity: el.quantity,
				sub_total_usd:  el.details.pricable.length > 0 ? this.getSubtotalUsd(el): 0.00 ,                
				discount_usd: this.getItemDiscountAmount(el),
				total_usd:(el.details.pricable.length > 0 ? this.getTotalUsd(el) : 0.00) ,
				sub_total_sxl: el.details.pricable.length > 0 ? this.getSubtotalSxl(el)  : 0.00,
				discount_sxl: 0.00,
				total_sxl:  (el.details.pricable.length > 0 ? this.getTotalSxl(el) : 0.00),
				c_rate: (el.details.pricable.length > 0 && el.details.pricable[0].sxl_to_usd_rate) ? el.details.pricable[0].sxl_to_usd_rate : JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).sxl_to_usd_rate,
				pricable_id: el.details.pricable.length > 0 ? el.details.pricable[0].product_price_id: null,
				payment_type_id:  el.details.pricable.length > 0 ?el.details.pricable[0].payment_type.id : null,

			};
			return elm;
		});
	
		this.saveOrderData.items = itemArr;
		return this.httpService.setModule('orders').create(this.saveOrderData);
	}

	private saveVendorWallet(orderResponse): Observable<any> {
		return this.httpService.setModule('createVendorWallet').findOne(orderResponse.id);
	}

	/**
	 * Function to send cyber source request
	 * @param orderResponse any
	 */
	private sendCyberSourceRequest(orderResponse): Observable<any> {
		const paymentObj = {
			'order_id': orderResponse.id,
			'items': [],
			'net_amount': this.getPaybleAmountUsd(),
			'billing_address': this.cartObj.billing_address,
			'card': this.paypalFormObj.value
		};

		paymentObj.items = this.cartObj.items.map((el) => {
			const elm = {
				id: el.details.id,
				price:el.details.pricable.length>0 ? (el.quantity * el.details.pricable[0].usd_price): 0.00 ,
			};
			return elm;
		});
		console.log(JSON.stringify(paymentObj))
		// paymentCyberSource
		return this.httpService.setModule('paymentCyberSource').create(paymentObj);
	}

	/**
	 * Function to send wallet request
	 * @param orderResponse any
	 */
	private sendWalletRequest(orderResponse): Observable<any> {
		const paymentObj = {
			'order_id': orderResponse.id,
			'user_id': orderResponse.user_id,
			'user_type': 'customer',
			'amount': this.getWalletPaybleAmount(),
			'wallet_id': this.wallet.id
		};
		// paymentCyberSource
		return this.httpService.setModule('paymentWallet').create(paymentObj);
	}

	/**
	 * Function to send wallet request for usd
	 * @param orderResponse any
	 */
	private sendWalletRequestUsd(orderResponse): Observable<any> {
		const paymentObj = {
			'order_id': orderResponse.id,
			'user_id': orderResponse.user_id,
			'user_type': 'customer',
			'amount': this.getWalletPaybleAmountUsd(),
			'wallet_id': this.wallet.id
		};
		// paymentCyberSource
		return this.httpService.setModule('paymentWallet').create(paymentObj);
	}

	/**
	 * Function to send wallet request for sxl
	 * @param orderResponse any
	 */
	private sendWalletRequestSxl(orderResponse): Observable<any> {
		const paymentObj = {
			'order_id': orderResponse.id,
			'user_id': orderResponse.user_id,
			'user_type': 'customer',
			'amount': this.getWalletPaybleAmountSxl(),
			'wallet_id': this.wallet.id
		};
		//console.log(paymentObj,'sendWalletRequestSxl');
		// paymentCyberSource
		return this.httpService.setModule('paymentWallet').create(paymentObj);
	}
	// old price code

	/**
	 * Function to upbate payment and order status
	 * @param orderResponse any
	 */
	private savePayment(orderResponse) {
		//console.log(orderResponse,'order save');
		const paramsObj = {
			payment_status: orderResponse.payment_status,
			order_status: 'complete',
			received_data: '',
			user_id: orderResponse.logUser.user.id,
			order_id: orderResponse.id,
			items: [],
			shipping_price: 0.00,
			total: this.cartObj.total_order_price,
			discount: 0.00,
			customer_email: orderResponse.logUser.user.email,
			customer_phone: orderResponse.logUser.user.mobile_no
		};

		paramsObj.items = this.cartObj.items.map((el) => {
			const elm = {
				name: el.details.title,
				quantity: el.quantity,
				price: (el.quantity * el.details.price),
				currency: el.details.currency,
				type: (el.type === 'course') ? 'courses' : 'products',
			};
			return elm;
		});

		return this.httpService.setModule('payment').create(paramsObj);
	}

	// New price code
	/**
	 * Function to add/update payment usd 
	 * @param orderResObj any
	 */
	private savePaymentUsd(orderResObj) {
		const paramsObj = {
			order_id: orderResObj.order_id,
			price_type: 'USD',
			payment_mode: 'CS',
			payment_status: orderResObj.payment_status,
		//	send_data: '',
		//	received_data: '',
			amount: this.cartObj.total_order_price.usd_price
		};

		return this.httpService.setModule('payment').create(paramsObj);
	}

	

	/**
	 * Function to add/update payment usd 
	 * @param orderResObj any
	 */
	private savePaymentUsdWalletPlusCs(orderResObj) {
		const paramsObj = {
			order_id: orderResObj.order_id,
			price_type: 'USD',
			payment_mode: 'WCS',
			payment_status: orderResObj.payment_status,
		//	send_data: '',
		//	received_data: '',
			amount: this.cartObj.total_order_price.usd_price
		};

		return this.httpService.setModule('payment').create(paramsObj);
	}



	/**
	 * Function to add/update payment usd 
	 * @param orderResObj any
	 */
	private savePaymentSxl(orderResObj) {
		const paramsObj = {
			order_id: orderResObj.order_id,
			price_type: 'SXL',
			payment_mode: 'SXL',
			payment_status: orderResObj.payment_status,
		//	send_data: '',
		//	received_data: '',
			amount: this.cartObj.total_order_price.sxl_price
		};
		//console.log(paramsObj,'save payment sxl');
		return this.httpService.setModule('payment').create(paramsObj);
	}


	/**
	 * Function to add/update payment usd 
	 * @param orderResObj any
	 */
	private savePaymentFree(orderResObj) {
		const paramsObj = {
			order_id: orderResObj.order_id,
			price_type: 'FREE',
			payment_mode: 'FREE',
			payment_status: orderResObj.payment_status,
		//	send_data: '',
		//	received_data: '',
			amount: 0.00,
		};

		return this.httpService.setModule('payment').create(paramsObj);
	}

		// New price code
	/**
	 * Function to add/update payment usd 
	 * @param orderResObj any
	 */
	private savePaymentWalletUsd(orderResObj) {
		const paramsObj = {
			order_id: orderResObj.order_id,
			price_type: 'USD',
			payment_mode: 'W',
			payment_status: orderResObj.payment_status,
		//	send_data: '',
		//	received_data: '',
			amount: this.cartObj.total_order_price.usd_price
		};

		return this.httpService.setModule('payment').create(paramsObj);
	}

	

	/**
	 * Function to add/update payment sxl 
	 * @param orderResObj any
	 */
	private savePaymentWalletSxl(orderResObj) {
		const paramsObj = {
			order_id: orderResObj.order_id,
			price_type: 'USD',
			payment_mode: 'W',
			payment_status: orderResObj.payment_status,
		//	send_data: '',
		//	received_data: '',
			amount: this.cartObj.total_order_price.usd_price
		};

		return this.httpService.setModule('payment').create(paramsObj);
	}

	/**
	 * Function for update order status after completion 
	 * all transaction
	 */
	private updateOrderStatus(orderResponse,status) {
		const paramsObj= {
			id: orderResponse.id,
		//	type:'courses',
			status: status
		}
		return this.httpService.setModule('paymentUpdate').update(paramsObj);
	}
	

	private paymentFailedInWCS(orderResponse, logUser) {
		const paramsObj= {
			order_id: orderResponse.id,
			amount:this.getWalletPaybleAmountUsd(),
			wallet_id:this.wallet.id,
			user_id:logUser.user.id
		}
		return this.httpService.setModule('paymentFailedWcs').create(paramsObj);
	}

	public getSlxUsdConvertionRate (){
		this.httpService.get('utility/settings').subscribe((response) => {
			if (response['status'] === 'success') {

				this.todayUsdSxlConvertionRate = response['data'].sxl_to_usd_rate;
			}
		});
	}

	getDiscountAmount(item) {
		let discountAmt=0;
		if(item.type == 'course') {
			if(item.details.course_coupons.length>0) {
			
				discountAmt=item.details.course_coupons[0].discount_value;
				return discountAmt;
			} else {
				return discountAmt;
			}
		} else {
			return discountAmt;
		}

	
	}

	getSubtotalUsd (item) {
		if(item.type == 'course'){
	
			return item.details.pricable[0].usd_price*item.quantity - this.getItemDiscountAmount(item);
		} else {
			return item.details.pricable[0].usd_price*item.quantity; 
		}
	}

	getTotalUsd (item) {
		if(item.type == 'course'){
			// return item.details.pricable[0].usd_price*item.quantity - this.getItemDiscountAmount(item);
			return item.details.pricable[0].usd_price*item.quantity;
		} else {
			return item.details.pricable[0].usd_price*item.quantity; 
		}
	}

	getSubtotalSxl (item) {
		if(item.type == 'course'){
	
			return item.details.pricable[0].sxl_price*item.quantity;
		} else {
			return item.details.pricable[0].sxl_price*item.quantity; 
		}
	}

	getTotalSxl (item) {
		if(item.type == 'course'){
			return item.details.pricable[0].sxl_price*item.quantity;
		} else {
			return item.details.pricable[0].sxl_price*item.quantity; 
		}
	}
	
	// orderUsingPaypal(event) {
	// 	console.log(this.cartObj);

	// 	const itemList = this.cartObj.items.map((el) => {
	// 		const obj = {
	// 			'name': el.details.title,
	// 			'description': el.details.description,
	// 			'quantity': el.quantity,
	// 			'price': el.details.price.toFixed(2),
	// 			'tax': '0.00',
	// 			'sku': el.details.slug,
	// 			'currency': 'USD'
	// 		};
	// 		return obj;
	// 	});

	// 	const params = {
	// 		'intent': 'sale',
	// 		'payer': {
	// 			'payment_method': 'paypal'
	// 		},
	// 		'transactions': [
	// 			{
	// 				'amount': {
	// 					'total': this.cartObj.total_order_price.toFixed(2) || '0.00',
	// 					'currency': 'USD',
	// 					'details': {
	// 						'subtotal': this.cartObj.total_order_price.toFixed(2) || '0.00',
	// 						'tax': this.cartObj.total_tax_price.toFixed(2) || '0.00',
	// 						'shipping': '0.00',
	// 						'handling_fee': '0.00',
	// 						'shipping_discount': '0.00',
	// 						'insurance': '0.00'
	// 					}
	// 				},
	// 				'notify_url': this.env.api_url + '/payment/ipn',
	// 				'description': 'Successlife Order Payment',
	// 				'custom': '',
	// 				'invoice_number': this.env.orderIdPrefix,
	// 				'payment_options': {
	// 					'allowed_payment_method': 'INSTANT_FUNDING_SOURCE'
	// 				},
	// 				// 'soft_descriptor': 'ECHI5786786',
	// 				'item_list': {
	// 					'items': itemList,
	// 					// 'shipping_address': {
	// 					// 	'recipient_name': 'Brian Robinson',
	// 					// 	'line1': '4th Floor',
	// 					// 	'line2': 'Unit #34',
	// 					// 	'city': 'San Jose',
	// 					// 	'country_code': 'US',
	// 					// 	'postal_code': '95131',
	// 					// 	'phone': '011862212345678',
	// 					// 	'state': 'CA'
	// 					// }
	// 				}
	// 			}
	// 		],
	// 		'note_to_payer': 'Contact us for any questions on your order.',
	// 		'redirect_urls': {
	// 			'return_url': this.env.base_url + '/return-transaction',
	// 			'cancel_url': this.env.base_url + '/order-failure'
	// 		}
	// 	};

	// 	console.log(params);

	// 	let logUser = null;
	// 	let orderResponse = null;
	// 	this.orderLoader = true;
	// 	if (event) {
	// 		const paramsOrder = {
	// 			...this.cartObj,
	// 			ordered_on: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss')
	// 		};
	// 		delete paramsOrder.id;
	// 		delete paramsOrder.items;

	// 		this.httpService.getLoggedUser().pipe(
	// 			mergeMap((user) => {
	// 				if (user) {
	// 					logUser = user;
	// 					return this.httpService.setModule('orders').create(paramsOrder);
	// 				} else {
	// 					return of(null);
	// 				}
	// 			}),
	// 			mergeMap((response) => {
	// 				if (response) {
	// 					orderResponse = response.data;
	// 					const itemArr = this.cartObj.items.map((el) => {
	// 						const elm = {
	// 							order_id: response.data.id,
	// 							vendor_id: el.details.user.id,
	// 							couponable_id: null,
	// 							couponable_type: null,
	// 							productable_id: el.details.id,
	// 							productable_type: (el.type === 'course') ? 'courses' : 'products',
	// 							unit_price: el.details.price,
	// 							discount_price: 0.00,
	// 							order_date: moment((new Date()).toISOString()).format('YYYY-MM-DD hh:mm:ss'),
	// 							tax_price: 0.00,
	// 							quantity: el.quantity,
	// 							total_price: (el.quantity * el.details.price),
	// 							product_currency: el.details.currency,
	// 							ordered_currency: el.details.currency,
	// 							conversion_rate: 0
	// 						};
	// 						return elm;
	// 					});
	// 					return this.httpService.setModule('orderDetails').create(itemArr);
	// 				} else {
	// 					return of(null);
	// 				}

	// 			}),
	// 			mergeMap((response) => {
	// 				if (response) {

	// 					const paramsObj = {
	// 						payment_status: 'complete',
	// 						order_status: 'complete',
	// 						received_data: '',
	// 						user_id: logUser.user.id,
	// 						order_id: orderResponse.id,
	// 						items: [],
	// 						shipping_price: 0.00,
	// 						total: this.cartObj.total_order_price,
	// 						discount: 0.00,
	// 						customer_email: logUser.user.email,
	// 						customer_phone: logUser.user.mobile_no
	// 					};

	// 					paramsObj.items = this.cartObj.items.map((el) => {
	// 						const elm = {
	// 							name: el.details.title,
	// 							quantity: el.quantity,
	// 							price: (el.quantity * el.details.price),
	// 							currency: el.details.currency,
	// 							type: (el.type === 'course') ? 'courses' : 'products',
	// 						};
	// 						return elm;
	// 					});

	// 					return this.httpService.setModule('payment').create(paramsObj);

	// 				} else {
	// 					return of(null);
	// 				}
	// 			})
	// 		).subscribe((response) => {
	// 			this.orderLoader = false;
	// 			if (response) {
	// 				this.commonService.removeCart();
	// 				// console.log(response, ' - order details');
	// 				this.router.navigate(['/order-success']);
	// 			}
	// 		}, (error) => {
	// 			this.orderLoader = false;
	// 			// console.log(error, ' - order details error');
	// 			this.router.navigate(['/order-failure']);
	// 		});
	// 	}

	// 	// this.httpService.sendPaypalPayment(params).subscribe((data) => {
	// 	// 	if (data) {
	// 	// 		console.log(data);
	// 	// 		const redirectLinkObj = data.links.find((el) => {
	// 	// 			return (el.method === 'REDIRECT');
	// 	// 		});
	// 	// 		console.log(redirectLinkObj);
	// 	// 		if (redirectLinkObj) {
	// 	// 			window.location.href = redirectLinkObj.href;
	// 	// 		}
	// 	// 	}
	// 	// }, (error) => {
	// 	// 	if (error) {
	// 	// 		console.log(error);
	// 	// 		this.commonService.showMessage({ type: 'error', title: error.error.name, message: error.error.message});
	// 	// 	}
	// 	// });
	// }

	// getPaymentDetails() {
	// 	const paymentId = 'PAYID-LROCYQI2BB08868YJ708043H';
	// 	this.httpService.getPaypalPaymentDetails(paymentId).subscribe((data) => {
	// 		if (data) {
	// 			console.log(data);
	// 		}
	// 	}, (error) => {
	// 		if (error) {
	// 			console.log(error);
	// 			this.commonService.showMessage({ type: 'error', title: error.error.name, message: error.error.message });
	// 		}
	// 	});
	// }

}

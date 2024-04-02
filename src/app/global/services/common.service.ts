import { Injectable, ɵConsole } from '@angular/core';
import { ToasterService, BodyOutputType, Toast} from 'angular2-toaster';

import { HttpRequestService } from '../../services/http-request.service';

import * as CryptoJS from 'crypto-js';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { tap, mergeMap, map, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	private toasterService: ToasterService;
	private lsCartKey: String = 'cart-object';
	private salt: string = 'XxntRcd/8uisogEKikAS+LKvGPDmBloRZj08Ulum';

	private _cartData: BehaviorSubject<any> = new BehaviorSubject(null);
	public cartData$: Observable<any> = this._cartData.asObservable();

	private _messageData: any = null;

	private cartObj: any = {
		id: (new Date()).getTime(),
		user_id: null,
		order_address_id: null,
		billing_address: null,
		total_discount_price: 0.00,
		total_tax_price: 0.00,
		total_order_price: 0.00,
		original_order_price: 0.00,
		payment_mode: 'FREE',
		payment_status: 'pending',
		order_status: 'pending',
		send_data: '',
		ordered_on: null,
		itemStatement: 'No item in cart',
		items: []
	};

	constructor(
		toasterService: ToasterService,
		public httpService: HttpRequestService,
	) {
		this.toasterService = toasterService;
	}

	initCartObj() {
		this.cartObj = {
			id: (new Date()).getTime(),
			user_id: null,
			order_address_id: null,
			billing_address: null,
			total_discount_price: 0.00,
			total_tax_price: 0.00,
			total_order_price: 0.00,
			original_order_price: 0.00,
			payment_mode: '',
			payment_status: 'pending',
			order_status: 'pending',
			send_data: '',
			ordered_on: null,
			itemStatement: 'No item in cart',
			items: []
		};
		return this;
	}

	public generateSlug(str) {
		let slug = '';
		if (str) {
			slug = str.toString().toLowerCase()
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]+/g, '')
				.replace(/\-\-+/g, '-')
				.replace(/^-+/, '')
				.replace(/-+$/, '');
		}
		return slug;
	}

	public setFlashMessage(message) {
		this._messageData = message;
	}

	public getFlashMessage() {
		const msgdata = this._messageData;
		this._messageData = null;
		return msgdata;
	}

	public showErrors(error) {
		let errStr = '';
		if (error) {
			if (error.error.errors) {
				const keyArr = Object.keys(error.error.errors);
				let i = 0;
				Object.keys(error.error.errors).forEach((k) => {
					i++;
					errStr += error.error.errors[k].message || '';
					errStr += (i === keyArr.length) ? ',' : '';
				});
				// this.toasterService.pop('error', error.statusText, errStr);
				this.toasterService.pop('error', '', errStr);
			} else if (error.error.message) {
				this.toasterService.pop('error', '', error.error.message);
			}
		}
	}

	public showMessage(messageObj = {type: 'info', title: 'title', message: 'message'}) {
		if (messageObj.type) {
			switch (messageObj.type) {
				case 'info':
				case 'error':
				case 'success':
				case 'warning':
					const title = messageObj.title || '';
					const message = messageObj.message || '';

					const toast: Toast = {
						type: messageObj.type,
						title: title,
						body: message,
						bodyOutputType: BodyOutputType.TrustedHtml
					};

					this.toasterService.pop(toast);
					break;
				default:
					this.toasterService.pop('info', 'title', 'message');
					break;
			}
		}
	}

	public scrollToElement(id: string) {
		if (id) {
			// console.log(id);
			const el = document.getElementById(id);
			el.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'start'});
		}
	}

	setCart(item) {
		// const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(item), 'secret key 123');
		// const bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
		// const plaintext = bytes.toString(CryptoJS.enc.Utf8);
		// const obj = JSON.parse(plaintext);
		
		let logUser = null;
		return this.httpService.getLoggedUser().pipe(
			mergeMap((loggedUser) => {
				if (loggedUser) {
					if (loggedUser.roles.indexOf('customer') > -1) {
						logUser = loggedUser;

						if (Object.keys(logUser.user.profile).length > 0) {
							return this.getCart();
						} else {
							throw {
								status: 'error',
								statusText: 'Bad request',
								statusCode: 422,
								message: 'Please complete your profile before purchase'
							};
						}
					} else {
						throw {
							status: 'error',
							statusText: 'Bad request',
							statusCode: 422,
							message: 'Please login as customer to purchase this item'
						};
					}
				}
				throw {
					status: 'error',
					statusText: 'Unauthorized',
					statusCode: 401,
					message: 'Please login'
				};
			}),
			mergeMap((cartData) => {
				return this._setCartItem(logUser, cartData, item);
			}),
			catchError((error) => {
				throw error;
			})
		);
	}

	_setCartItem(logUser, cartData, item): Observable<any> {
		//console.log(cartData,'cartData');
		//console.log(item,'item')
		if (!cartData) {
			cartData = this.initCartObj().cartObj;
		}
		cartData.user_id = logUser.user.id;

		const foundItem = this._isExistsItem(cartData, item);
		if (foundItem) {
			if (item.type === 'course') {
				throw {
					status: 'error',
					statusText: 'Bad request',
					statusCode: 422,
					message: `This ${item.type} already exists in your cart`
				};
			} else if((item.type === 'event' && (item.mode === 'add') )){
			
				throw {
					status: 'error',
					statusText: 'Bad request',
					statusCode: 422,
					message: `This ${item.type} already exists in your cart`
		
				};
			} else {
				if (
					((item.mode === 'add') &&
					(parseInt(foundItem.details.pricable[0].quantity, 10) < (parseInt(foundItem.quantity, 10) + parseInt(item.quantity, 10))))
					||
					((item.mode === 'update') &&
					(parseInt(foundItem.details.pricable[0].quantity, 10) < parseInt(foundItem.quantity, 10) ))
				) {
					throw {
						status: 'error',
						statusText: 'Bad request',
						statusCode: 422,
						message: 'You have entered quantity more than stock'
					};
				}
				const idx = cartData.items.findIndex((el) => ((el.details.id === foundItem.details.id) && (el.type === foundItem.type)));


				if (item.mode === 'add') {
					cartData.items[idx].quantity += item.quantity;
				} else if (item.mode === 'update') {
					cartData.items[idx].quantity = item.quantity;
				}
				return this._prepareCartSummary(cartData);
			}
		}
		const items = cartData.items;
		cartData.items = [...items, item];
		return this._prepareCartSummary(cartData);
	}

	// Old price code

	// _prepareCartSummary(cartObj) {

	// 	const netTotalAmount = cartObj.items.reduce((acc, cur) => {
	// 		let prc = (cur.details.price * cur.quantity);
	// 		if (cur.discount) {
	// 			let discountAmt = 0;
	// 			if (cur.discount.discount_mode === 'fixed') {
	// 				discountAmt = cur.discount.discount_value;
	// 			} else if (cur.discount.discount_mode === 'percentage') {
	// 				discountAmt = ((cur.discount.discount_value * prc) / 100);
	// 			}
	// 			prc -= discountAmt;
	// 		}
	// 		return acc + prc;
	// 	}, 0);
	// 	const baseTotalAmount = cartObj.items.reduce((acc, cur) => {
	// 		const prc = (cur.details.price * cur.quantity);
	// 		return acc + prc;
	// 	}, 0);
	// 	const courses = cartObj.items.filter((elm) => {
	// 		return (elm.type === 'course');
	// 	});
	// 	const events = cartObj.items.filter((elm) => {
	// 		return (elm.type === 'event');
	// 	});
	// 	const products = cartObj.items.filter((elm) => {
	// 		return (elm.type === 'product');
	// 	});

	// 	// Prepare cart statement
	// 	let courseStmt = '';
	// 	let eventStmt = '';
	// 	let productStmt = '';
	// 	if (courses.length > 0) {
	// 		courseStmt = (courses.length === 1) ? (courses.length + ' course') : (courses.length + ' courses');
	// 	}
	// 	if (events.length > 0) {
	// 		eventStmt = (events.length === 1) ? (events.length + ' event') : (events.length + ' events');
	// 	}
	// 	if (products.length > 0) {
	// 		productStmt = (products.length === 1) ? (products.length + ' product') : (products.length + ' products');
	// 	}

	// 	if ((courseStmt !== '') && (eventStmt !== '') && (productStmt !== '')) {
	// 		cartObj.itemStatement = courseStmt + ', ' + eventStmt + ' and ' + productStmt;
	// 	} else {
	// 		if ((courseStmt !== '') && (eventStmt !== '') && (productStmt === '')) {
	// 			cartObj.itemStatement = courseStmt + ' and ' + eventStmt ;
	// 		} else if ((courseStmt !== '') && (eventStmt === '') && (productStmt !== '')) {
	// 			cartObj.itemStatement = courseStmt + ' and ' + productStmt ;
	// 		} else if ((courseStmt === '') && (eventStmt !== '') && (productStmt !== '')) {
	// 			cartObj.itemStatement = eventStmt + ' and ' + productStmt ;
	// 		} else if ((courseStmt === '') && (eventStmt === '') && (productStmt !== '')) {
	// 			cartObj.itemStatement =  productStmt ;
	// 		} else if ((courseStmt === '') && (eventStmt !== '') && (productStmt === '')) {
	// 			cartObj.itemStatement =  eventStmt ;
	// 		} else if ((courseStmt !== '') && (eventStmt === '') && (productStmt === '')) {
	// 			cartObj.itemStatement =  courseStmt ;
	// 		} else {
	// 			cartObj.itemStatement = 'No item found';
	// 		}
	// 	}
	// 	cartObj.itemStatement += ' in your cart';

	// 	cartObj.total_order_price = netTotalAmount;
	// 	cartObj.original_order_price = baseTotalAmount;
	// 	cartObj.total_discount_price = (baseTotalAmount - netTotalAmount);

	// 	this._cartData.next(cartObj);
	// 	return this._setLocalStorageByKey(this.lsCartKey, cartObj);
	// }

	// New price code 

	_prepareCartSummary(cartObj) {
		//console.log(cartObj,'cartObj on net total amount');
		const netTotalAmount = cartObj.items.reduce((acc, cur) => {
			//let prc = (cur.details.price * cur.quantity);

			  let prc = {
				usd_price: cur.details.price.usd_price * cur.quantity,
				sxl_price: cur.details.price.sxl_price * cur.quantity,
			  };
			  //console.log(acc,'acc');
	
			  if(acc != 0){
				acc.usd_price += prc.usd_price;
				acc.sxl_price += prc.sxl_price;

			  } else {  
				acc = prc;
			  }
			  //console.log(cur,'cur');
			  if (cur.discount) {
				let discountAmt = 0;
				//console.log(cur.discount,'cur.discount');
				if (cur.discount.discount_mode === 'fixed') {
					
					discountAmt = cur.discount.discount_value;
					//console.log(discountAmt,'discountAmt');
				} 
				// else if (cur.discount.discount_mode === 'percentage') {
				// 	discountAmt = ((cur.discount.discount_value * prc.usd_price) / 100);
				// }
				acc.usd_price = acc.usd_price - discountAmt;
			}
			return acc;
		}, 0);
		
		//console.log(netTotalAmount,'netTotalAmount');
		//console.log(cartObj,'cartobj on base total amount');
		const baseTotalAmount = cartObj.items.reduce((acc, cur) => {
			let prc = {
				usd_price: cur.details.price.usd_price * cur.quantity,
				sxl_price: cur.details.price.sxl_price * cur.quantity,
			  };
			 // console.log(acc,'acc');
	
			  if(acc != 0){
				acc.usd_price += prc.usd_price;
				acc.sxl_price += prc.sxl_price;

			  } else { 
				acc = prc;
			  }
			return acc;

		}, 0);
		//console.log(baseTotalAmount,'baseTotalAmount');

		const courses = cartObj.items.filter((elm) => {
			return (elm.type === 'course');
		});
		const events = cartObj.items.filter((elm) => {
			return (elm.type === 'event');
		});
		const products = cartObj.items.filter((elm) => {
			return (elm.type === 'product');
		});

		// Prepare cart statement
		let courseStmt = '';
		let eventStmt = '';
		let productStmt = '';
		if (courses.length > 0) {
			courseStmt = (courses.length === 1) ? (courses.length + ' course') : (courses.length + ' courses');
		}
		if (events.length > 0) {
			eventStmt = (events.length === 1) ? (events.length + ' event') : (events.length + ' events');
		}
		if (products.length > 0) {
			productStmt = (products.length === 1) ? (products.length + ' product') : (products.length + ' products');
		}

		if ((courseStmt !== '') && (eventStmt !== '') && (productStmt !== '')) {
			cartObj.itemStatement = courseStmt + ', ' + eventStmt + ' and ' + productStmt;
		} else {
			if ((courseStmt !== '') && (eventStmt !== '') && (productStmt === '')) {
				cartObj.itemStatement = courseStmt + ' and ' + eventStmt ;
			} else if ((courseStmt !== '') && (eventStmt === '') && (productStmt !== '')) {
				cartObj.itemStatement = courseStmt + ' and ' + productStmt ;
			} else if ((courseStmt === '') && (eventStmt !== '') && (productStmt !== '')) {
				cartObj.itemStatement = eventStmt + ' and ' + productStmt ;
			} else if ((courseStmt === '') && (eventStmt === '') && (productStmt !== '')) {
				cartObj.itemStatement =  productStmt ;
			} else if ((courseStmt === '') && (eventStmt !== '') && (productStmt === '')) {
				cartObj.itemStatement =  eventStmt ;
			} else if ((courseStmt !== '') && (eventStmt === '') && (productStmt === '')) {
				cartObj.itemStatement =  courseStmt ;
			} else {
				cartObj.itemStatement = 'No item found';
			}
		}
		cartObj.itemStatement += ' in your cart';

		cartObj.total_order_price = netTotalAmount;
		cartObj.original_order_price = baseTotalAmount;

		//cartObj.total_discount_price = (baseTotalAmount - netTotalAmount);
		cartObj.total_discount_price =  {
			usd_price: baseTotalAmount.usd_price - netTotalAmount.usd_price,
			sxl_price: baseTotalAmount.sxl_price - netTotalAmount.sxl_price,
		}

		//console.log(cartObj.total_discount_price,'total_discount_price');

		this._cartData.next(cartObj);
		return this._setLocalStorageByKey(this.lsCartKey, cartObj);
	}

	setDefaultAddress(address): Observable<any> {
		return this.getCart().pipe(
			mergeMap((cartObj) => {
				if (cartObj) {
					cartObj.order_address_id = address.id;
					cartObj.billing_address =  {
						...address,
						user: {
							first_name: address.user.profile.first_name || '',
							last_name: address.user.profile.last_name || '',
							email: address.user.email || '',
							mobile_no: address.user.mobile_no || ''
						}
					};
					return this._setLocalStorageByKey(this.lsCartKey, cartObj);
				} else {
					throw {
						status: 'error',
						statusText: 'Bad request',
						statusCode: 422,
						message: 'Failed to set default address'
					};
				}
			})
		);
	}

	getCart(): Observable<any> {
		return this._getLocalStorageByKey(this.lsCartKey).pipe(
			map((data) => {
				if (data) {
					const cartBytes  = CryptoJS.AES.decrypt(data, this.salt);
					const cartStr = cartBytes.toString(CryptoJS.enc.Utf8);
					const cartObj = JSON.parse(cartStr);
					return cartObj;
				}
				return data;
			})
		);
	}

	removeCart() {
		localStorage.removeItem('cart-object');
		this._cartData.next(null);
	}

	removeCartItem(item): Observable<any> {
		return this.getCart().pipe(
			mergeMap((cartObj) => {
				if (cartObj) {
					const idx = cartObj.items.findIndex((el) => ((el.type === item.type) && (el.details.id === item.details.id)));
					if (idx > -1) {
						cartObj.items.splice(idx, 1);
						if (cartObj.items.length === 0) {
							this.removeCart();
							return of(null);
						}
						return this._prepareCartSummary(cartObj);
					} else {
						throw {
							status: 'error',
							statusText: 'Bad request',
							statusCode: 422,
							message: 'Item doesn\'t exists'
						};
					}
				}
				throw {
					status: 'error',
					statusText: 'Bad request',
					statusCode: 422,
					message: 'Cart is empty'
				};
			})
		);
	}

	private _getLocalStorageByKey(key): Observable<any> {
		const encStr = localStorage.getItem(key);
		return of(encStr);
	}

	private _setLocalStorageByKey(key, value): Observable<any> {
		let valStr;
		if (typeof value === 'object') {
			valStr = CryptoJS.AES.encrypt(JSON.stringify(value), this.salt);
		}

		return of(localStorage.setItem(key, valStr)).pipe(
			map(() => {
				const elm = {};
				elm[key] = value;
				return elm[key] = value;
			})
		);
	}

	private _isExistsItem(cartObj, item) {
		return cartObj.items.find((el) => ((el.type === item.type) && (el.details.id === item.details.id)));
	}

	public setCoupon(cartObj, item): Observable<any> {
		if (cartObj && item) {
			const foundItemIdx = cartObj.items.findIndex((el) => ((el.type === item.type) && (el.details.id === item.details.id)));

			 //console.log(cartObj, ' cartObj');
			 //console.log(item, ' item');
			 //console.log(foundItemIdx, ' foundItemIdx');
			if (foundItemIdx > -1) {
				cartObj.items[foundItemIdx] = item;

				return this._prepareCartSummary(cartObj);
			} else {
				throw {
					status: 'error',
					statusText: 'Bad request',
					statusCode: 422,
					message: 'Item not found in your cart'
				};
			}
		} else {
			throw {
				status: 'error',
				statusText: 'Bad request',
				statusCode: 422,
				message: 'Cart is empty'
			};
		}
	}

	public timeConvert (time) {
		// Check correct time format and split into components
		time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
		// console.log(time);
		if (time.length > 1) { // If time format correct
		  time = time.slice (1);  // Remove full string match value
		  time.pop();
		  time[4] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
		  time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join (''); // return adjusted time or original string
	  }

}

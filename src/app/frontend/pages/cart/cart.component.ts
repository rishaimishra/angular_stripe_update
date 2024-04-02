import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LoginComponent } from '../../../frontend/pages/login/login.component';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { SeoServiceService }  from '../../../services/seo-service.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

	featuredCourse = {
		items: 5,
		dots: false,
		responsiveClass: true,
		nav: true,
		margin: 20,
		responsive: {
			0: { items: 1 },
			400: { items: 2, margin: 10 },
			1023: { items: 4, margin: 10 },
			1138: { items: 5 }
		}
	};

	public cartObj: any = null;
	public wishLists: Array<any> = [];
	public wishListLoader: Boolean = false;

	public couponFormObj: FormGroup;
	public couponFormError: any;

	private _formErrorMessage = {
		coupon_code: {
			required: 'Enter Coupon Code',
		},
		course_id: {
			required: 'No Course found',
		},
		user_id: {
			required: 'Please login',
		}
	};

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

	constructor(
		public router: Router,
		public modalService: NgbModal,
		public formBuilder: FormBuilder,
		public httpService: HttpRequestService,
		public commonService: CommonService,
		public validatorService: NgReactiveFormValidatorService,
		public SeoService:SeoServiceService,
		public ngxService: NgxUiLoaderService,
	) { }

	ngOnInit() {
		this.getCart();
		this.getWishLists();
		this.SeoService.getMetaInfo();
		this.couponFormObj = this.formBuilder.group({
			coupon_code: [null, Validators.required],
			course_id: [null, Validators.required],
			user_id: [null, Validators.required]
		});

		this.httpService.getUserObservable().subscribe((user) => {
			if (user) {
				this.couponFormObj.patchValue({
					user_id: user.user.id
				});
			}
		});
	}

	applyCoupon(item) {
		this.couponFormObj.patchValue({
			course_id: item.details.id
		});

		if (this.couponFormObj.valid) {
			const paramObj = this.couponFormObj.value;

			this.httpService.setModule('couponVerify').create(paramObj).pipe(
				mergeMap((res) => {
					if (res) {
						this.couponFormError = null;
						item.coupon = paramObj;
						item.discount = (Object.keys(res.data).length > 0) ? res.data : null;
						// this.cartObj = this.commonService.setCoupon(this.cartObj, item);
						return this.commonService.setCoupon(this.cartObj, item);
					}
					return of(null);
				})
			).subscribe((data) => {
				if (data) {
					this.cartObj = data;
				}
			}, (err) => {
				if (err) {
					this.commonService.showErrors(err);
				}
			});

		} else {
			this.couponFormError = this.validatorService.validationError(this.couponFormObj, this._formErrorMessage);
		}
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

	/**
	 * Get cart data from localstorage
	 */
	getCart() {
		this.commonService.getCart().subscribe((data) => {
			if (data) {
				 console.log(data);
				this.cartObj = data;
			}
		});
	}

	/**
	 * Get wishlist products, courses and event tickets
	 */
	getWishLists() {
		this.httpService.getUserObservable().pipe(
			mergeMap((userObj) => {
				if (userObj) {
					return this.httpService.setModule('wishlist').search({user_id: userObj.user.id});
				} else {
					return of (null);
				}
			})
		).subscribe((res) => {
			if (res) {
				this.wishLists = res.data;
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	/**
	 * Function to check item is added to wishlist or not
	 * @param item any
	 */
	isAddedWishList(item) {
		// console.log(item);
		let flag = false;
		if (item ) {
			const wishlistableType = item.type + 's';
			const idx = this.wishLists.findIndex((el) => {
				// console.log(item.details.id, this.wishLists, wishlistableType);
				return ((el.wishlistable_type === wishlistableType) && (parseInt(el.wishlistable_id, 10) === parseInt(item.details.id, 10)));
			});
			flag = (idx > -1) ? true : false;
		}
		return flag;
	}

	/**
	 * Event handler for add to wishlist an item
	 * @param item any
	 */
	addToWishList(item) {
		if ((item) && (!this.wishListLoader)) {
			this.wishListLoader = true;
			this.httpService.getUserObservable().pipe(
				mergeMap((user) => {
					if (user) {
						//const wishlistableType = item.type + 's';
						let wishlistableType = '';

						if( item.type=='event'){
							wishlistableType='products';
						} else {
							wishlistableType = item.type + 's';
						}
						//console.log(wishlistableType,'wishlistableType');
						const paramsObj = {
							user_id: user.user.id,
							wishlistable_type: wishlistableType,
							wishlistable_id: item.details.id
						};
						return this.httpService.setModule('wishlist').create(paramsObj);
					} else {
						return of(null);
					}
				})
			).subscribe((res) => {
				this.wishListLoader = false;
				if (res) {
					this.__deleteCartItem(item);
					this.wishLists = [...this.wishLists, ...res.data];
				}
				this.getWishListRecords();
			}, (error) => {
				this.wishListLoader = false;
				this.commonService.showErrors(error);
			});
		}
	}

	/**
	 * Event handler for remove an item from wishlist
	 * @param item any
	 */
	removeFromWishList(item) {
		if ((item) && (!this.wishListLoader)) {
			this.wishListLoader = true;
			const wishlistableType = item.type + 's';
			this.httpService.getUserObservable().pipe(
				mergeMap((user) => {
					if (user) {
						const wlItem = this.wishLists.find((el) => {
							return (parseInt(el.wishlistable_id, 10) === parseInt(item.details.id, 10));
						});
						if (wlItem) {
							return this.httpService.setModule('wishlist').deleteOne({id : wlItem.id});
						}
					} else {
						return of(null);
					}
					
				})
			).subscribe((res) => {
				this.wishListLoader = false;
				if (res) {
					const idx = this.wishLists.findIndex((el) => {
						this.getWishListRecords();
						return ((el.wishlistable_type === wishlistableType) && (parseInt(el.wishlistable_id, 10) === parseInt(item.details.id, 10)));
					});

					if (idx > -1) {
						this.wishLists.splice(idx, 1);
					}
				}

			}, (error) => {
				this.wishListLoader = false;
				this.commonService.showErrors(error);
			});
		}
	}

	getWishListRecords() {
		
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.wishListsearchParams.user_id = user.user.id;
					return this.httpService.setModule('wishlist').search(this.wishListsearchParams);
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
	/**
	 * Function to get image url for an item (eg. Course, Event Ticket, or Product)
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
	 * Event handler for remove an item from cart
	 * @param item any
	 */
	removeItem(item) {
		if (item) {
			if (confirm('Are you sure?')) {
				this.__deleteCartItem(item);
			}
		} else {
			this.commonService.showMessage({type: 'warning', title: '', message: 'Item doesn\'t exists'});
		}
	}

	/**
	 * Function to remove an item from cart
	 * @param item any
	 */
	__deleteCartItem(item) {
		this.commonService.removeCartItem(item).subscribe((data) => {
			this.cartObj = data;
			this.commonService.showMessage({type: 'success', title: '', message: 'Item removed from cart'});
		}, (error) => {
			this.commonService.showMessage({type: 'error', title: '', message: error.message});
		});
	}

	/**
	 * Event handler to decrease cart quantity for an item
	 * @param item any
	 */
	minusQuantity(cartQuantity, item) {
		if (parseInt(cartQuantity.value, 10) > 1) {
			cartQuantity.value = parseInt(cartQuantity.value, 10) - 1;

			const elm = {
				...item,
				quantity: cartQuantity.value,
				mode: 'update'
			};
			this.updateCart(elm);
		}
	}

	/**
	 * Event handler to increase cart quantity for an item
	 * @param item any
	 */
	plusQuantity(cartQuantity, item) {
	
		if (parseInt(cartQuantity.value, 10) < parseInt(item.details.pricable[0].quantity, 10)) {
			
			cartQuantity.value = parseInt(cartQuantity.value, 10) + 1;

			const elm = {
				...item,
				quantity: cartQuantity.value,
				mode: 'update'
			};
			this.updateCart(elm);
		}
	}

	/**
	 * Function to update cart
	 * @param item any
	 */
	updateCart(elm) {
		this.commonService.setCart(elm).subscribe((response) => {
			if (response) {
				this.cartObj = response;
			}
		}, (error) => {
			// console.log(error);
			if (error) {
				if (error.statusText === 'Unauthorized') {
					this.commonService.scrollToElement('mini-cart');
					const modalRef = this.modalService.open(LoginComponent);
					modalRef.result.then((result) => {
						this.ngxService.stop()
					}).catch((error) => {
						this.ngxService.stop()
						//console.log(error);
					});
				} else {
					this.commonService.showMessage({ type: 'warning', title: '', message: error.message });
				}
			}
		});
	}

	/**
	 * Event handler to redirect to checkout address or login popup
	 * @param item any
	 */
	redirectToCheckout() {
		this.httpService.getLoggedUser().subscribe((loggedUser) => {
			if (loggedUser) {
				if (loggedUser.roles.indexOf('customer') > -1) {
					this.router.navigate(['/checkout-address']);
				} else {
					this.commonService.showMessage({ type: 'warning', title: '', message: 'Please login as customer to purchase this item' });
				}
			} else {
				this.commonService.scrollToElement('mini-cart');
				this.modalService.open(LoginComponent);
			}
		});
	}

}

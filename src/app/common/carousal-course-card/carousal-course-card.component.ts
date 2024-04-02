import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { mergeMap } from 'rxjs/operators';
import { LoginComponent } from '../../frontend/pages/login/login.component';
import { CommonService } from '../../global/services/common.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from '../../services/http-request.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
	selector: 'app-carousal-course-card',
	templateUrl: './carousal-course-card.component.html',
	styleUrls: ['./carousal-course-card.component.scss'],
	providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class CarousalCourseCardComponent implements OnInit, OnChanges {

	@Input() data: any;
	public item: any;
	Math: any;

	public cartObj: any = null;
	public wishListLoader: Boolean = false;
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
	public userId= null;
	public wishLists: Array<any> = [];
	public coursePrice: any;

	constructor(
		config: NgbRatingConfig,
		public modalService: NgbModal,
		private commonService: CommonService,
		public http: HttpRequestService,
		public ngxService: NgxUiLoaderService,
		) {
		config.max = 5;
		config.readonly = true;
		this.Math = Math;
	}

	ngOnInit() {
		// console.log(this.data.images.id);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes) {
			if (changes.data) {
				this.item = changes.data.currentValue;
				// console.log(this.item);
				/*****************************
				 * New code for price start
				 *****************************/
				if(this.item.pricable.length>0) {
					this.coursePrice = this.item.pricable[0] ;
				} else {
					this.coursePrice = 0;
				}
				// console.log(this.coursePrice);
				/*****************************
				 * New code for price end
				 *****************************/
			}
		}
	}

	hasOffer() {
		let flag = false;
		if (this.item) {
			if (Object.keys(this.item.offer).length > 0) {
				flag = true;
			}
		}
		return flag;
	}

	getPrice() {
		let price = this.item.price;
		if (this.hasOffer()) {
			if (this.item.offer.discount_mode === 'fixed') {
				price = (this.item.price - this.item.offer.discount);
			} else {
				price = (this.item.price * (1 - (this.item.offer.discount / 100)));
			}
		}
		return price;
	}

	/**
	 * Function to check item is added to wishlist or not
	 * @param item any
	 */
	isAddedWishList(courseId) {
		this.wishLists=JSON.parse(localStorage.getItem('wishListRecords'));
		let flag = false;
		if (courseId && this.wishLists!=null) {
			const wishlistableType = 'courses';
			const idx = this.wishLists.findIndex((el) => {
				// console.log(item.details.id, this.wishLists, wishlistableType);
				return ((el.wishlistable_type === wishlistableType) && (parseInt(el.wishlistable_id, 10) === parseInt(courseId, 10)));
			});
			flag = (idx > -1) ? true : false;
		}
		return flag;
	}


	/**
	 * Event handler for add to wishlist an item
	 * @param item any
	 */
	addToWishList(courseId) {
		if ((courseId) && (!this.wishListLoader)) {
			this.wishListLoader = true;
			this.http.getUserObservable().pipe(
				mergeMap((user) => {
					if (user) {
						const wishlistableType = 'courses';

						const paramsObj = {
							user_id: user.user.id,
							wishlistable_type: wishlistableType,
							wishlistable_id: courseId
						};
						return this.http.setModule('wishlist').create(paramsObj);
					} else {
						return of(null);
					}
				})
			).subscribe((res) => {
				this.wishListLoader = false;
				if (res) {
					// this.__deleteCartItem(item);
				
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
	removeFromWishList(courseId) {
		if ((courseId) && (!this.wishListLoader)) {
			this.wishListLoader = true;
			const wishlistableType = 'courses';
			this.http.getUserObservable().pipe(
				mergeMap((user) => {
					if (user) {
						const wlItem = this.wishLists.find((el) => {
							return (parseInt(el.wishlistable_id, 10) === parseInt(courseId, 10));
						});
						if (wlItem) {
							return this.http.setModule('wishlist').deleteOne({id : wlItem.id});
						}
					} else {
						return of(null);
					}
					
				})
			).subscribe((res) => {
				this.wishListLoader = false;
				if (res) {
					
					this.getWishListRecords();
					
				}
			}, (error) => {
				this.wishListLoader = false;
				this.commonService.showErrors(error);
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
				this.wishListRecords = response['data'];
				localStorage.setItem('wishListRecords', JSON.stringify(this.wishListRecords));
				localStorage.setItem('wishListCount',this.wishListRecords.length);
				
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
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

	openModal() {
		const modalRef = this.modalService.open(LoginComponent);
		modalRef.result.then((result) => {
			this.ngxService.stop()
		}).catch((error) => {
			this.ngxService.stop()
			//console.log(error);
		});
	}


}

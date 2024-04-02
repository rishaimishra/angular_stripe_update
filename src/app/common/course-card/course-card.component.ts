import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { mergeMap } from 'rxjs/operators';
import { LoginComponent } from '../../frontend/pages/login/login.component';
import { CommonService } from '../../global/services/common.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from '../../services/http-request.service';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { environment as env } from '../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-course-card',
	templateUrl: './course-card.component.html',
	styleUrls: ['./course-card.component.scss'],
	providers: [NgbRatingConfig]
})
export class CourseCardComponent implements OnInit, OnChanges {

	@Input() itemDetails: any;
	@Input() viewClass: any;
	public item: any={};

	public noImage: any = env.noImage;

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
	public userId = null;
	public wishLists: Array<any> = [];

	public linkArr: Array<string> = [];
	// public coursePrice: any;
	constructor(
		config: NgbRatingConfig,
		public modalService: NgbModal,
		private commonService: CommonService,
		public http: HttpRequestService,
		public router: Router,
		public route: ActivatedRoute,
		public ngxService: NgxUiLoaderService,
	) {
		config.max = 5;
		config.readonly = true;
	}

	ngOnInit() {
	
		
	}

	ngOnChanges(changes: SimpleChanges) {
	
		if (changes) {
			if (changes.itemDetails) {
				this.item = changes.itemDetails.currentValue;
				//  console.log(this.item.pricable.length);
				// if(this.item.pricable.length) {
			
				// 	this.coursePrice = this.item.pricable[0] ;
				// } else {
				// 	this.coursePrice = 0;
				// }
				

				if (this.item) {
					this.linkArr = ['/course-details', this.item.slug];
					this.route.data.subscribe((routeData) => {
						if (routeData) {
							if ('listMode' in routeData) {
								const paramsObj = this.route.snapshot.params;
								if ('reseller' in paramsObj) {
									this.linkArr = ['/affiliate', paramsObj.reseller, 'course-details', this.item.slug];
								}
							}
						}
					});
				}
			}
			if (changes.viewClass) {
				this.viewClass = changes.viewClass.currentValue;
			}
		}
	}

	/**
	 * Get lecture count
	 * @param objectData any
	 */
	getLectureCount(objectData) {
		// console.log(objectData, ' objectData');
		let lectureCount: Number = 0;
		if (objectData) {
			objectData.forEach(function (element) {
				if (element.course_lectures.length > 0) {
					lectureCount = lectureCount + element.course_lectures.length;
				}
			});
			if (lectureCount === 1) {
				return lectureCount + ' lecture';
			} else {
				return lectureCount + ' lectures';
			}
		} else {
			return lectureCount + ' lecture';
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
		this.wishLists = JSON.parse(localStorage.getItem('wishListRecords'));
		let flag = false;
		if (courseId && this.wishLists != null) {
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
							return this.http.setModule('wishlist').deleteOne({ id: wlItem.id });
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
				localStorage.setItem('wishListCount', this.wishListRecords.length);

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
			this.commonService.showMessage({ type: 'success', title: '', message: 'Item removed from cart' });
		}, (error) => {
			this.commonService.showMessage({ type: 'error', title: '', message: error.message });
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

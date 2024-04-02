import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd as Event } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { environment } from '../../../../environments/environment';

import { LoginComponent } from '../../../frontend/pages/login/login.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-public-profile',
	templateUrl: './public-profile.component.html',
	styleUrls: ['./public-profile.component.scss'],
	providers: [NgbRatingConfig]
})
export class PublicProfileComponent implements OnInit {

	public profileSlug: any;
	public userDetail: any;
	public socialLinks: any;
	public foundData:boolean= true;
	Math: any;
	crouselConfig = {
		items: 5,
		dots: false,
		responsiveClass: true,
		nav: true,
		margin: 20,
		responsive:
		{
			0:		{ items: 1 },
			400: 	{ items: 2, margin: 10 },
			1023: 	{ items: 4, margin: 10 },
			1138: 	{ items: 5 }
		}
	};

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

	constructor(
		public router: Router,
		public route: ActivatedRoute,
		private httpService: HttpRequestService,
		config: NgbRatingConfig,
		private commonService: CommonService,
		private activatedRoute: ActivatedRoute,
		private ngxService: NgxUiLoaderService,
		public modalService: NgbModal,
	) {
		config.max = 5;
		config.readonly = true;
		this.Math=Math;
	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(routeParams => {
			this.profileSlug = routeParams.slug.split('-').pop(-1);
			this.httpService.getUserObservable().subscribe((user) => {
				if (user) {
					this.userId = user.user.id;
					
				}
			});
			this.getUserDetail();
			//this.ngxService.start();
		});
	}
	hasOffer(courseData) {
		let flag = false;
		if (courseData) {
			if (Object.keys(courseData.offer).length > 0) {
				flag = true;
			}
		}
		return flag;
	}

	getPrice(courseData) {
		let price = courseData.price;
		if (this.hasOffer(courseData)) {
			if (courseData.offer.discount_mode === 'fixed') {
				price = (courseData.price - courseData.offer.discount);
			} else {
				price = (courseData.price * (1 - (courseData.offer.discount / 100)));
			}
		}
		return price;
	}
	getUserDetail() {
		this.ngxService.start();
		const params = {
			profile: true,
			rating: true,
			course_count: true,
			review_count: true,
			courses: true,
			products: true,
			offer:true,
			whislist: true,
			user_id: this.userId,
			fetch_price:true
		};
		this.httpService.setModule('user').findOne(this.profileSlug, params).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				if (response.data) {
					
					this.userDetail = response.data;
					this.commonService.scrollToElement('record-set');
				}
			}
			
		}, (error) => {
			this.foundData= false;
			this.ngxService.stop();
			//this.router.navigate(['/404-not-found']);
			// this.commonService.showErrors(error);
		});
	}
	getUserName(detail) {
		let name = '';

		if (detail) {
			if (detail.profile !== undefined) {
				name += detail.profile.first_name || '';
				// name += (detail.profile.middle_name) ? ' ' : '';
				// name += detail.profile.middle_name || '';
				name += (detail.profile.last_name) ? ' ' : '';
				name += detail.profile.last_name || '';
			}
		}
		return name;
	}

	getUserHeadline(detail) {
		let headline = '';

		if (detail) {
			if (detail.profile !== undefined) {
				headline += (detail.profile.head_line) ? ' ' : '';
				headline += detail.profile.head_line || '';
			}
		}
		return 	headline;
	}

	getUserBio(detail) {
		let biography = '';

		if (detail) {
			if (detail.profile !== undefined) {
				biography += (detail.profile.biography) ? ' ' : '';
				biography += detail.profile.biography || '';
			}
		}
		return 	biography;
	}

	getCourseCount(detail) {
		let courseCount = '';
		if (detail) {
			courseCount += (detail.course_count) ? detail.course_count : 0;
		}
		return 	courseCount;
	}

	getUserID(id){
		return environment.vendorIdPrefix + id;
	}

	getReviewCount(detail) {
		let reviewCount = '';
		if (detail) {
			reviewCount += (detail.review_count) ? detail.review_count : 0;
		}
		return 	reviewCount;
	}

	/**
	 * Function to check item is added to wishlist or not
	 * @param item any
	 */
	isAddedWishList(courseId) {
		this.wishLists = JSON.parse(localStorage.getItem('wishListRecords'));
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
			this.httpService.getUserObservable().pipe(
				mergeMap((user) => {
					if (user) {
						const wishlistableType = 'courses';

						const paramsObj = {
							user_id: user.user.id,
							wishlistable_type: wishlistableType,
							wishlistable_id: courseId
						};
						return this.httpService.setModule('wishlist').create(paramsObj);
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
			this.httpService.getUserObservable().pipe(
				mergeMap((user) => {
					if (user) {
						const wlItem = this.wishLists.find((el) => {
							return (parseInt(el.wishlistable_id, 10) === parseInt(courseId, 10));
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
					
					this.getWishListRecords();
					
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

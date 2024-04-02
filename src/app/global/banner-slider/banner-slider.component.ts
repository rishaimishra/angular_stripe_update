import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd as Event } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from '../../services/http-request.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { LoginComponent } from '../../frontend/pages/login/login.component';
import { CommonService } from '../../global/services/common.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
	selector: 'app-banner-slider',
	templateUrl: './banner-slider.component.html',
	styleUrls: ['./banner-slider.component.scss'],
	providers: [NgbRatingConfig]
})
export class BannerSliderComponent implements OnInit {

	public records: Array<any> = [];
	public promotedCourses = [];
	public Math: any;
	topSlider = {
		items: 1,
		dots: true,
		nav: false,
		autoplay: true,
		loop: true,
		autoplayTimeout: environment.bannerSliderDurationSeconds,
		autoplayHoverPause: false,
		lazyLoad: true
	};
	public currentSlug: string;
	public featuredEvents: Array<any>= [];
	private pageDefaultdata: Array<any> = [
		{
			slug: 'courses',
			apiData: {
				page: 'course-listing',
				is_active: true
			},
			title: 'Courses',
			description: 'Etiam vehicula sapien ac aliquet porttitor. Donec eget arcu neque. Fusce sed nisl non..'
		},
		{
			slug: 'events',
			apiData: {
				page: 'event-listing',
				is_active: true
			},
			title: 'Events',
			description: 'Etiam vehicula sapien ac aliquet porttitor. Donec eget arcu neque. Fusce sed nisl non..'
		},
		{
			slug: 'products',
			apiData: {
				page: 'product-listing',
				is_active: true
			},
			title: 'Products',
			description: 'Etiam vehicula sapien ac aliquet porttitor. Donec eget arcu neque. Fusce sed nisl non..'
		}
	];
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
		public httpService: HttpRequestService,
		config: NgbRatingConfig,
		private datePipe: DatePipe,
		public modalService: NgbModal,
		private commonService: CommonService,
		public ngxService: NgxUiLoaderService,
	) {
		router.events.pipe(
			mergeMap((event) => {
				if (event instanceof Event) {
					const urlStr = event.url.replace(/^\/|\/$/g, '');
					const urlArr = urlStr.split('/');
					// console.log(urlArr.shift());
					const code = urlArr.shift();
					return of(code);
				} else {
					return of(null);
				}
			})
		).subscribe((data) => {
			if (data) {
				if(data=='live-events') {
					data = 'events';
				}
				this.getBannerBySlug(data);
			}
		});
		config.max = 5;
		config.readonly = true;
		this.Math = Math;
	}

	ngOnInit() {
		this.httpService.getUserObservable().subscribe((user) => {
			if (user) {
				this.userId = user.user.id;
				
			}
		});
		// this.getPromotedCourses();
		if(this.currentSlug=='events') {
			this.getFeaturedEvents();
		}
	}

	hasOffer(promotedCourse) {
		let flag = false;
		if (promotedCourse.course.offer) {
			if (Object.keys(promotedCourse.course.offer).length > 0) {
				flag = true;
			}
		}
		return flag;
	}

	getPrice(promotedCourse) {
		let price = promotedCourse.course.price;
		if (this.hasOffer(promotedCourse)) {
			if (promotedCourse.course.offer.discount_mode === 'fixed') {
				price = (promotedCourse.course.price - promotedCourse.course.offer.discount);
			} else {
				price = (promotedCourse.course.price * (1 - (promotedCourse.course.offer.discount / 100)));
			}
		}
		return price;
	}

	getBannerBySlug(slug: string) {
		if (slug) {
			const urlArr = slug.split('?');
			// console.log(urlArr);
			this.currentSlug = urlArr[0];
			const bannerObj = this.pageDefaultdata.find((el) => {
				return (el.slug === slug);
			});
			
			if (bannerObj) {
				this.httpService.setModule('pageSlider').search(bannerObj.apiData).subscribe((res) => {
					if (res) {
						this.records = res.data;
					}
				}, (err) => {
					// console.log(err, ' err');
				});
			}
		}
	}

	getPromotedCourses() {
		
		const params = {
			course:true,
			courseUser:true,
			user:true,
			date:this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
			active:true,
			offer:true,
			whislist: true,
			user_id: this.userId,
			is_delete:true,
			is_active:true
			
		};
		this.promotedCourses = [];
		this.httpService.get(`course-promotions`, params).subscribe((response) => {
			if (response['status'] === 'success') {
				if (response) {
					this.promotedCourses = response['data'];
					// console.log(this.promotedCourses);
				}
			}
		}, (error) => {
			// console.log(error);
		});
	}
	getSlug(userD) {
		let name = '';

		if (userD) {
			if (userD.user.profile.middle_name !== null && userD.user.profile.middle_name !== '') {
				name += userD.user.profile.first_name + '-' + userD.user.profile.middle_name + '-' + userD.user.profile.last_name + '-' + userD.user.id;
			} else {
				name += userD.user.profile.first_name + '-' + userD.user.profile.last_name + '-' + userD.user.id;
			}
			name = name.replace(/\s+/g, '-').toLowerCase();
		} else {
			name = '';
		}
		return name;
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

	public getFeaturedEvents() {
		const params = {
			pagination: true,
			limit: 10,
			is_publish: true,
			images: true,
			is_featured: 1,
			event: true,
			event_speaker:true,
			fetch_price: true,
			user: true,
			is_active:true,
			isApproved:true
		};
		this.httpService.get(`event`, params).subscribe((response) => {
			if (response) {
				if (response) {
					this.featuredEvents = response['data'];
					// console.log(this.featuredEvents,'featuredEvents');
				}
			}
		}, (error) => {
			// console.log(error);
		});
	}

}

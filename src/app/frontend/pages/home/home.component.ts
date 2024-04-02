import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { of } from 'rxjs';
import { LoginComponent } from '../../../frontend/pages/login/login.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { SeoServiceService }  from '../../../services/seo-service.service';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	providers: [NgbRatingConfig],
	
})
export class HomeComponent implements OnInit {
	public pageType = 'home';
	public slides: any = [];
	public topCategories: any = [];
	public testimonialListing: any = [];
	public productListing: any = [];
	public featuredEventListing: any = [];
	public upcomingEventListing: any = [];
	public featuredCourseCategory: any = [];
	public featuredCourses: any = [];
	public customerViewingCourses: any = [];
	public promotedCourses: any = [];
	public loader: Boolean = true;
	public upcommingEvents: any = [];
	public pastEvents: any = [];
	public brands: any = [];
	Math: any;
	topSlider = {
		items: 1,
		dots: true,
		nav: false,
		autoplay: true,
		loop: true,
		autoplayTimeout: 2000,
		autoplayHoverPause: true,
		lazyLoad: true
	};

	promotedCourseCarousel = {
		items: 5,
		dots: false,
		responsiveClass: true,
		nav: true, margin: 20,
		responsive: { 0: { items: 1 }, 400: { items: 2, margin: 10 }, 1023: { items: 4, margin: 10 }, 1138: { items: 5 } }
	};
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

	featuredEvents = {
		items: 4,
		dots: false,
		responsiveClass: true,
		nav: true, margin: 25,
		responsive: { 0: { items: 1 }, 400: { items: 2, margin: 10 }, 1023: { items: 3, margin: 10 }, 1138: { items: 4 } }
	};
	upcommingEventsCarus = {
		items: 4,
		dots: false,
		responsiveClass: true,
		nav: true, margin: 25,
		responsive: { 0: { items: 1 }, 400: { items: 2, margin: 10 }, 1023: { items: 3, margin: 10 }, 1138: { items: 4 } }
	};
	newProducts = {
		items: 4,
		dots: false,
		responsiveClass: true,
		nav: true, margin: 25,
		responsive: { 0: { items: 1 }, 400: { items: 2, margin: 10 }, 1023: { items: 3, margin: 10 }, 1138: { items: 4 } }
	};

	testimonial = {
		items: 3, dots: false,
		nav: true, margin: 30,
		responsive: { 0: { items: 1 }, 1024: { items: 2, margin: 10 }, 1138: { items: 3 } }
	};
	vendors = {
		items: 5,
		dots: false,
		nav: false, margin: 15,
		responsive: { 0: { items: 1 }, 768: { items: 2 }, 1024: { items: 3, margin: 10 }, 1138: { items: 5 } }
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
	public userId = null;
	public wishLists: Array<any> = [];

	constructor(
		private http: HttpRequestService,
		private ngxService: NgxUiLoaderService,
		config: NgbRatingConfig,
		private commonService: CommonService,
		public modalService: NgbModal,
		private datePipe: DatePipe,
		public SeoService:SeoServiceService
	) {
		config.max = 5;
		config.readonly = true;
		this.Math=Math;
		// bancor();
	
	}

	ngOnInit() {
		this.SeoService.getMetaInfo();
		this.getSlides(this.pageType);
		this.getCourseCategory();
		this.getFeaturedEvents();
		// this.getNewProducts();
		
		// this.getTopCategory();
		this.getTestimonial();
		this.getCustomerViewingCourses();
		// this.getPromotedCourses();
		this.getUpcommingEvents();
		this.getPastEvents();
		this.getBrands();
	}
	public getSlides(pageType) {
		this.ngxService.start();
		this.http.get(`page-slider?page=${pageType}&is_active=true`).subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {	
				this.slides = response['data'];
			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}
	public getTopCategory() {
		this.http.get(`category?parent_id=0&is_active=true`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.topCategories = response['data'];
			}
		}, (errors) => {
			// console.log(errors);
		});
	}
	public getTestimonial() {
		const params = {
			pagination: true,
			limit: 10,
			is_active: true
		};
		this.http.get(`testimonial`, params).subscribe((response) => {
			if (response) {
				if (response) {
					this.testimonialListing = response['data'];
				}
			}
		}, (error) => {
			// console.log(error);
		});
	}

	public getNewProducts() {
		const params = {
			pagination: true,
			limit: 10,
			is_publish: true,
			images: true,
			review_count: true
		};
		this.http.get(`product`, params).subscribe((response) => {
			if (response) {
				if (response) {
					this.productListing = response['data'];
				}
			}
		}, (error) => {
			// console.log(error);
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
			is_delete:true,
			is_active:true,
			date_filter:true,
			isApproved:true
		};
		this.http.get(`event`, params).subscribe((response) => {
			if (response) {
				if (response) {
					this.featuredEventListing = response['data'];
				}
			}
		}, (error) => {
			console.log(error);
		});
	}

	getUpcommingEvents() {
		let params= {
			pagination: true,
            limit: 10,
            is_publish: true,
            images: true,
			coming_soon: true,
			event: true,
			event_speaker:true,
			fetch_price: true,
			is_delete: true,
			is_active: true,
			date_filter:true,
			isApproved: true,
		};
		this.http.setModule('event').list(params).subscribe((response) => {
			if (response) {
				this.upcommingEvents = response.data;
				// console.log(this.upcommingEvents.length);
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	getPastEvents() {
		let params= {
			pagination: true,
            limit: 10,
            is_publish: true,
            images: true,
			event: true,
			event_speaker:true,
			fetch_price: true,
			is_delete: true,
			is_active: true,
			past_event:true,
			date_filter:true,
			isApproved: true,
		};
		this.http.setModule('event').list(params).subscribe((response) => {
			if (response) {
				this.pastEvents = response.data;
				 // console.log(this.pastEvents.length);
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	public getBrands() {
		let params= {
		};
		this.http.setModule('brands').list(params).subscribe((response) => {
			if (response) {
				this.brands = response.data;
				 // console.log(this.pastEvents.length);
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	public getCourseCategory() {
		const params = {
			is_active: true,
			featured_course_category: true,
		};
		this.http.get(`category`, params).subscribe((response) => {
			if (response) {
				if (response['status'] === 'success') {
					this.featuredCourseCategory = response['data'];
					if (response['data'].length > 0) {
						this.getFeatureCourses(response['data'][0].id);
					}
				}
			}
		}, (error) => {
			// console.log(error);
		});
	}

	getFeatureCourses(catId) {
		this.http.getUserObservable().subscribe((user) => {
			if (user) {
				this.userId = user.user.id;
			
			}
		});
		this.loader = true;
		const params = {
			pagination: true,
			limit: 10,
			is_publish: true,
			category: catId,
			is_featured: true,
			images: true,
			review_count: true,
			is_delete: true,
			is_active: true,
			offer: true,
			fetch_price: true
		};
		this.featuredCourses = [];
		this.http.get(`course?user=true&whislist=true&user_id=${this.userId}&isApproved=true`, params).subscribe((response) => {
			this.loader = false;
			if (response['status'] === 'success') {
				if (response) {
					this.featuredCourses = response['data'];
				}
			}
		}, (error) => {
			// console.log(error);
		});
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
			fetch_price: true,
		};
		this.promotedCourses = [];
		this.http.get(`course-promotions`, params).subscribe((response) => {
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
	getCustomerViewingCourses() {
		this.loader = true;
		const params = {
			course: true,
			images: true,
			review_count: true,
			created_by: true,
			group_by: true,
			is_delete:true,
			is_active: true
		};
		this.customerViewingCourses = [];
		this.http.get(`course-user`, params).subscribe((response) => {
			this.loader = false;
			if (response) {
				if (response) {
					this.customerViewingCourses = response['data'];
					// console.log(this.customerViewingCourses);
				}
			}
		}, (error) => {
			// console.log(error);
		});
	}

	/**
	 * Function to check item is added to wishlist or not
	 * @param item any
	 */
	isAddedWishList(courseId) {
		this.wishLists=JSON.parse(localStorage.getItem('wishListRecords'));
		let flag = false;
		if (courseId  && this.wishLists!=null) {
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

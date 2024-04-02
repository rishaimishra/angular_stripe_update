import { Component, OnInit } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { LoginComponent } from '../../../frontend/pages/login/login.component';

import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../../../global/services/common.service';
import { RegistrationComponent } from '../../../frontend/pages/registration/registration.component';
import { environment } from '../../../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';
@Component({
	selector: 'app-course-details',
	templateUrl: './course-details.component.html',
	styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {

	BASE_URL: string = environment.base_url;
	public showNoOfChapter: number = environment.numberOfChapterInCourseDetails;
	public courseData: any;
	public courseModules: any;
	public courseTargetAnswers: any;
	public otherCourses: any = [];
	public courseSlug: any;
	public showLessMoreButton = 'See more';
	public image: any = 'assets/images/event-banner.jpg';
	// public image: any = 'assets/images/noimg-1900x500.jpg';
	public show = false;
	public reletedCourses: any = [];

	public cartLoader: Boolean = false;

	public reviews: Array<any> = [];
	public loggedUser: any = null;
	public display = 'none';
	public copeidTooltip = 0;
	public Math: any;
	public resellerId: any = null;

	// public shareFacebookUrl="https://demomarketplace.successlife.com/course-details/test-c2";


	customerViewingCarousel = {
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

	public btnShowMoreFlag: Array<any> = [];
	public ratingShowMoreFlag: Array<any> = [];
	public hour: any;
	public min: any;
	public time: any;
	public shareUrl: any;

	public reviewSearchParams: any = {
		reviewable_id: null,
		reviewable_type: 'courses',
		pagination: true,
		user: true,
		profile: true,
		rating: true,
		order_by: '-id',
		limit: this.http.vendorPerPage,
		page: 1
	};

	public reviewPaginationObj: any;
	public reviewLoader: Boolean = false;
	public isShowAddReview: Boolean = false;

	private _detailSubject: BehaviorSubject<any> = new BehaviorSubject(null);
	public detailObservable$: Observable<any> = this._detailSubject.asObservable();

	public logUserCourse: any = null;
	public showMoreChapter: Boolean = false;
	public noOfChapter: number;


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
	public coursePrice: any;
	constructor(
		public http: HttpRequestService,
		public ngxService: NgxUiLoaderService,
		public modalService: NgbModal,
		config: NgbRatingConfig,
		private activatedRoute: ActivatedRoute,
		private commonService: CommonService,
		private router: Router,
		private meta:Meta,
    	private titleService: Title,
	) {
		config.max = 5;
		config.readonly = true;
		// this.courseSlug = this.activatedRoute.snapshot.url[1].path;
		this.Math = Math;

	}

	ngOnInit() {

		// this.activatedRoute.queryParams.subscribe(queryParams => {
		//   // do something with the query params
		// });

		this.activatedRoute.params.subscribe(routeParams => {
			// this.loadUserDetail(routeParams.id);
			this.courseSlug = routeParams.slug;

			if ('reseller' in routeParams) {
				const resellerStr = routeParams.reseller;
				const resellerArr = resellerStr.split('-');
				const rid = resellerArr.pop();
				if (!isNaN(rid)) {
					this.resellerId = rid;
				}
			}


			this.getCourseDetails();
		});

		this.getReviews();
		this.getUserCourse();


	}

	getCourseDetails() {
		this.ngxService.start();

		this.http.getUserObservable().subscribe((user) => {
			if (user) {
				this.loggedUser = user;
				this.userId = user.user.id;
			}
		});
		this.http.get(`course/${this.courseSlug}?course_modules=true&course_lectures=true&categories=true&user=true&course_coupons=true&offer=true&review_count=true&whislist=true&user_id=${this.userId}&fetch_price=true&isApproved=true`).subscribe((response) => {

			if (response['status'] === 'success') {
				window.scroll(0, 0);

				/**
				 * set meta info
				 */

				this.titleService.setTitle(response['data'].title);
				this.meta.addTag({ name: 'description', content: response['data'].meta_description });
				this.meta.updateTag({ name: 'description', content:  response['data'].meta_description });
				this.meta.addTag({ name: 'Keywords', content: response['data'].meta_keywords });
				this.meta.updateTag({ name: 'Keywords', content:  response['data'].meta_keywords });


				this.courseData = response['data'];
				this._detailSubject.next(response['data']);
				if (this.courseData.length === 0) {
					this.router.navigate(['/404-not-found']);
				}
				/*****************************
				 * New code for price start
				 *****************************/
					if(this.courseData.pricable.length>0) {
				
						this.coursePrice = this.courseData.pricable[0] ;
					} else {
						this.coursePrice = 0;
					}
					// console.log(this.coursePrice);
				/*****************************
				 * New code for price end
				 *****************************/

				this.courseModules = response['data']['course_modules'];
				this.noOfChapter = this.courseModules.length;
				if (this.courseData.images) {
					this.image = this.courseData.images.banner ? this.courseData.images.banner : 'assets/images/event-banner.jpg';

				} else {
					this.image = 'assets/images/event-banner.jpg';
				}

				this.time = this.courseData.duration;

				this.hour = parseInt(this.time, 10);

				this.min = Math.ceil(((this.time < 1.0) ? this.time : (this.time % Math.floor(this.time))) * 100);

				if (this.hour < 9) {
					this.hour = `0${this.hour}`;
				}

				if (this.min < 9) {
					this.min = `0${this.min}`;
				}


				this.getCouseTarget();
				this.getOtherCourseByVendor(this.courseData.created_by);
				this.getRelatedCourse(this.courseData.parent_category_id);
				this.ngxService.stop();
			}
		}, (errors) => {
			window.scroll(0, 0);
			this.ngxService.stop();
		});
	}

	hasOffer() {
		let flag = false;
		if (this.courseData) {
			if (Object.keys(this.courseData.offer).length > 0) {
				flag = true;
			}
		}
		return flag;
	}

	// Price Old Code

	// getPrice() {
	// 	let price = this.courseData.price;
	// 	if (this.hasOffer()) {
	// 		if (this.courseData.offer.discount_mode === 'fixed') {
	// 			price = (this.courseData.price - this.courseData.offer.discount);
	// 		} else {
	// 			price = (this.courseData.price * (1 - (this.courseData.offer.discount / 100)));
	// 		}
	// 	}
	// 	return price;
	// }

	// Price new code
	getPrice() {

		let price = {
			usd_price:0,
			sxl_price:0
		};
		if (this.courseData.pricable.length > 0) {
			price.usd_price = this.courseData.pricable[0].usd_price;
			price.sxl_price = this.courseData.pricable[0].sxl_price;
		}
		// if (this.hasOffer()) {
		// 	if (this.courseData.offer.discount_mode === 'fixed') {
		// 		price = (this.courseData.price - this.courseData.offer.discount);
		// 	} else {
		// 		price = (this.courseData.price * (1 - (this.courseData.offer.discount / 100)));
		// 	}
		// }
		return price;
	}


	getCouseTarget() {
		this.ngxService.start();
		this.http.get(`course-target?answer=true&course_id=${this.courseData.id}`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.ngxService.stop();
				this.courseTargetAnswers = response['data'];
			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}

	getRelatedCourse(parentCategory) {
		this.ngxService.start();

		this.http.get(`utility/course/related?categories=${parentCategory}&limit=7&is_publish=true&user=true&profile=true&is_delete=true&is_active=&offer=true&review_count=true&whislist=true&user_id=${this.userId}&fetch_price=true`).subscribe((response) => {

			if (response['status'] === 'success') {
				this.ngxService.stop();
				this.reletedCourses = response['data'];
				// console.log(this.reletedCourses);
				const currentElementIndex = this.reletedCourses.findIndex((element) => (element.slug === this.courseSlug));

				if (currentElementIndex > -1) {
					this.reletedCourses.splice(currentElementIndex, 1);
				}

				// console.log(this.reletedCourses.length);
			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}

	getOtherCourseByVendor(createdBy) {
		this.ngxService.start();

		this.http.get(`course?created_by=${createdBy}&images=true&is_publish=true&user=true&is_delete=true&is_active=true&offer=true&review_count=true&whislist=true&user_id=${this.userId}&fetch_price=true&isApproved=true`).subscribe((response) => {

			if (response['status'] === 'success') {
				this.ngxService.stop();
				this.otherCourses = response['data'];
				// console.log(this.otherCourses);
				const currentElementIndex = this.otherCourses.findIndex((element) => (element.slug === this.courseSlug));

				if (currentElementIndex > -1) {
					this.otherCourses.splice(currentElementIndex, 1);
				}
			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}


	toggle() {
		this.show = !this.show;

		// CHANGE THE NAME OF THE BUTTON.
		if (this.show) {
			this.showLessMoreButton = 'See less';
		} else {
			this.showLessMoreButton = 'See more';
		}
	}

	getUserCourse() {
		let userObj = null;
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					userObj = user;
					return this.detailObservable$;
				} else {
					return of(null);
				}
			}),
			mergeMap((details) => {
				if (details) {
					this.reviewSearchParams.reviewable_id = details.id;
					const paramsObj = {
						search_by: true,
						user_id: userObj.user.id,
						is_delete: true
					};
					return this.http.setModule('courseUser').findOne(details.id, paramsObj);
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				this.logUserCourse = null;
				if (Object.keys(response.data).length > 0) {
					if (
						(response.data.status === 'enrolled') ||
						(response.data.status === 'running') ||
						(response.data.status === 'completed')
					) {
						this.logUserCourse = response.data;
					}
				}
			}
		}, (error) => {
			this.reviewLoader = false;
			if (error) {
				this.commonService.showErrors(error);
			}
		});
	}

	getReviews() {
		let userObj = null;
		this.reviewLoader = true;
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				userObj = user;
				return this.detailObservable$;
			}),
			mergeMap((details) => {
				if (details) {
					this.reviewSearchParams.reviewable_id = details.id;
					return this.http.setModule('reviews').search(this.reviewSearchParams);
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			this.reviewLoader = false;
			if (response) {
				this.reviewPaginationObj = response.pagination;
				if (this.reviewPaginationObj.page === 1) {
					this.reviews = [];
				}
				this.reviews = [...this.reviews, ...response.data];

				if (userObj) {
					const roleIdx = userObj.roles.indexOf('customer');
					if (roleIdx > -1) {
						const idx = this.reviews.findIndex((el) => (parseInt(el.user_id, 10) === parseInt(userObj.user.id, 10)));
						this.isShowAddReview = (idx > -1) ? false : true;
					} else {
						this.isShowAddReview = false;
					}
				} else {
					this.isShowAddReview = false;
				}
			}
		}, (error) => {
			this.reviewLoader = false;
			this.commonService.showErrors(error);
		});
	}

	isShowFullReview(item) {
		let flag = false;

		if (item) {
			const idx = this.ratingShowMoreFlag.findIndex((el) => (parseInt(el.id, 10) === parseInt(item.id, 10)));

			if (idx > -1) {
				flag = (this.ratingShowMoreFlag[idx].isOpen) ? true : false;
			} else {
				flag = (item.review_note.length > 100) ? true : false;
			}

		}
		return flag;
	}

	onClickMoreReview(item) {
		if (item) {
			const elmIdx = this.ratingShowMoreFlag.findIndex((el) => (el.id === item.id));
			if (elmIdx < 0) {
				const elm = {
					id: item.id,
					isOpen: true
				};
				this.ratingShowMoreFlag.push(elm);
			} else {
				this.ratingShowMoreFlag[elmIdx].isOpen = (this.ratingShowMoreFlag[elmIdx].isOpen) ? false : true;
			}
		}
	}

	getRatingColor(rs, fill) {
		const styleObj = {
			color: '#d3d3d3' // default color
		};
		// if (rs && (fill === 100)) {
		// 	styleObj.color = rs.rating.color_code;
		// }

		if (fill === 100) {
			styleObj.color = '#f89828';
		}

		return styleObj;
	}

	isRatingEditable(rs) {
		let flag = false;
		this.http.getUserObservable().subscribe((user) => {
			if (user) {
				flag = (user.user.id === rs.user_id) ? true : false;
			}
		});
		return flag;
	}

	reviewPagination() {
		if (this.reviewPaginationObj) {
			this.reviewPaginationObj.page += 1;
			this.getReviews();
		}
	}

	isShowReviewPaginate() {
		let flag = false;
		if (this.reviewPaginationObj) {
			if (this.reviewPaginationObj.pageCount === 0) {
				flag = false;
			} else {
				flag = (this.reviewPaginationObj.page > this.reviewPaginationObj.pageCount) ? true : false;
			}
		}
		return flag;
	}

	addToCart(event) {
		this.cartLoader = true;
		const cartParams = {
			id: (new Date()).getTime(),
			// reseller_id: this.resellerId,
			type: 'course',
			mode: 'add',
			coupon: null,
			discount: null,
			quantity: 1,
			details: {
				...this.courseData,
				price: this.getPrice(),
				reseller_id: this.resellerId
			}
		};



		this.commonService.setCart(cartParams).subscribe((response) => {
			this.cartLoader = false;
			// console.log(response);
			this.commonService.showMessage({ type: 'success', title: '', message: 'Item added to  cart' });
			this.commonService.scrollToElement('mini-cart');
		}, (error) => {
			this.cartLoader = false;
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

	buyNow(event) {
		this.cartLoader = true;
		const cartParams = {
			id: (new Date()).getTime(),
			type: 'course',
			mode: 'add',
			coupon: null,
			discount: null,
			quantity: 1,
			details: {
				...this.courseData,
				price: this.getPrice()
			}
		};



		this.commonService.setCart(cartParams).subscribe((response) => {
			this.cartLoader = false;
			// console.log(response);
			this.commonService.scrollToElement('mini-cart');
			this.router.navigate(['/checkout-address']);
		}, (error) => {
			this.cartLoader = false;
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

	showMore(rowIdx, colIdx) {
		let flag = true;
		if (colIdx < 2) {
			flag = true;
		} else {
			const idx = this.btnShowMoreFlag.findIndex((el) => (el.id === rowIdx));
			if (idx < 0) {
				flag = false;
			} else {
				flag = this.btnShowMoreFlag[idx].isOpen;
			}
		}
		return flag;
	}

	onClickMore(idx) {
		const elmIdx = this.btnShowMoreFlag.findIndex((el) => (el.id === idx));
		if (elmIdx < 0) {
			const elm = {
				id: idx,
				isOpen: true
			};
			this.btnShowMoreFlag.push(elm);
		} else {
			this.btnShowMoreFlag[elmIdx].isOpen = (this.btnShowMoreFlag[elmIdx].isOpen) ? false : true;
		}
	}

	showStatus(index) {
		if (index < 5) {
			return true;

		} else {
			if (this.showMoreChapter) {
				return true;
			} else {
				return false;
			}
		}
	}
	onClickMoreChapters() {
		if (this.showMoreChapter) {
			this.showMoreChapter = false;
		} else {
			this.showMoreChapter = true;
		}
	}

	getSlug(userD) {
		let name = '';

		if (userD) {
			if (userD.user.profile.middle_name !== null && userD.user.profile.middle_name !== '') {
				name += userD.user.profile.first_name + '-' + userD.user.profile.last_name + '-' + userD.user.id;
			} else {
				name += userD.user.profile.first_name + '-' + userD.user.profile.last_name + '-' + userD.user.id;
			}
			name = name.replace(/\s+/g, '-').toLowerCase();
		} else {
			name = '';
		}
		return name;
	}


	registerFormModal() {
		const modalRef = this.modalService.open(RegistrationComponent);
		modalRef.componentInstance.role = 'customer';
		modalRef.result.then((result) => {
			// console.log(result);
			//this.router.navigate(['/consumer-registration-succcess']);
			if(result.provider=='normal'){
				this.router.navigate(['/consumer-registration-succcess']);
			} else {
				this.router.navigate(['/']);
			}

		}).catch((error) => {
			//  console.log(error);
		});
	}
	registerVendorFormModal() {
		const modalRef = this.modalService.open(RegistrationComponent);
		modalRef.componentInstance.role = 'vendor';
		modalRef.result.then((result) => {
			// console.log(result);

			// this.router.navigate(['/tutor-registration-succcess']);
			if(result.provider=='normal'){
				this.router.navigate(['/tutor-registration-succcess']);
			} else {
				this.router.navigate(['/']);
			}
		

		}).catch((error) => {
			//  console.log(error);
		});
	}


	shareModelOpen() {
		this.display = 'block';
		this.shareUrl = `${this.BASE_URL}${this.router.url}`;
	}
	shareModalClose() {
		this.display = 'none';
	}

	copyInputMessage(inputElement) {
		this.copeidTooltip = 1;

		inputElement.focus();
		inputElement.select();
		document.execCommand('copy');
		inputElement.setSelectionRange(0, 0);
		setTimeout(() => {
			this.copeidTooltip = 0;
		}, 2000);
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

import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { of } from 'rxjs';
import { LoginComponent } from '../../../frontend/pages/login/login.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { mergeMap } from 'rxjs/operators';
@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	providers: [NgbRatingConfig]
})
export class SearchComponent implements OnInit {

	public searchData: Array<any> = [];
	public totalDataCount: any;
	public searchKey: any;
	public currentPage: any;
	public totalPage: any = 1;
	public selectedCategory: Array<number> = [];
	public selectedStanderd: Array<number> = [];
	public selectedVendor: Array<number> = [];
	public selectedDuration: number = 0;
	public selectedRating: number = 0;
	public selectedPriceValue: number = 10000;
	public selectedprice: number = 1;
	public loader: Boolean = false;

	public urlCategoryParam: any = '';
	public urlStanderParam: any = '';
	public urlVendorParam: any = '';
	public urlDurationParam: number = 0;
	public duratin: any = '';
	public urlRatingParam: number = 0;
	public rating: any = "0:5";
	public urlPriceValueParam: number = 10000;
	public price: any;

	public selectedTopicCount = 0;
	public selectedLavelCount = 0;
	public selectedVendorCount = 0;

	public paramsSubscription;
	Math: any;
	// filter div show hide

	btnFilter: Boolean = false;
	// public loader: Boolean = true;

	public maxPrice=10000;
	public minPrice=0;

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
		private http: HttpRequestService,
		private activatedRoute: ActivatedRoute,
		private route: Router,
		private commonService: CommonService,
		config: NgbRatingConfig,
		public ngxService: NgxUiLoaderService,
		public modalService: NgbModal,
	) {
		this.Math = Math;
		config.max = 5;
		config.readonly = true;

	}

	ngOnInit() {

		const queryParams = this.activatedRoute.snapshot.queryParams;
		// console.log(queryParams);

		// this.currentPage=1;
		this.paramsSubscription = this.activatedRoute.queryParams.subscribe(queryParams => {
			this.searchKey = queryParams.string;
			this.currentPage = 1;
			this.getSearchData();

			// console.log(this.urlRatingParam);

		});

		//this.getSearchData();
		window.scrollTo(0, 0);
	}

	

	getPrice(data) {
		let price = data.price;
		if (data.discount!='null') {
			if (data.discount_mode === 'fixed') {
				price = (data.price - data.discount);
			} else {
				price = (data.price * (1 - (data.discount / 100)));
			}
		}
		return price;
	}


	filter_showhide(value) {
		this.btnFilter = value;
	}

	getSearchData() {


		// console.log(this.currentPage);
		// console.log(this.totalPage);

		// this.loader = true;

		this.activatedRoute.queryParams.subscribe(queryParams => {
			//  console.log(queryParams);
			// do something with the query params
			this.searchKey = queryParams.string;
			if (queryParams.category) {
				this.urlCategoryParam = queryParams.category;
				this.selectedCategory = queryParams.category.split(',').map(Number);
				this.selectedTopicCount = this.selectedCategory.length;
			} else {
				this.urlCategoryParam = '';
				this.selectedCategory = [];
				this.selectedTopicCount = 0;
			}


			if (queryParams.stander) {
				this.urlStanderParam = queryParams.stander;
				this.selectedStanderd = queryParams.stander.split(',').map(Number);
				this.selectedLavelCount = this.selectedStanderd.length;

			} else {
				this.urlStanderParam = '';
				this.selectedStanderd = [];
				this.selectedLavelCount = 0;
			}

			if (queryParams.user) {
				this.urlVendorParam = queryParams.user;
				this.selectedVendor = queryParams.user.split(',').map(Number);
				this.selectedVendorCount = this.selectedVendor.length;

			} else {
				this.urlVendorParam = '';
				this.selectedVendor = [];
				this.selectedVendorCount = 0;
			}


			if (queryParams.duration) {
				this.urlDurationParam = queryParams.duration;
				this.selectedDuration = queryParams.duration;
			} else {
				this.urlDurationParam = 0;
				this.selectedDuration = 0;
			}



			if (queryParams.rating) {
				this.urlRatingParam = queryParams.rating;
				this.selectedRating = queryParams.rating;
			} else {
				this.urlRatingParam = 0;
				this.selectedRating = 0;

			}


			// if (queryParams.price) {
			// 	this.urlPriceValueParam = queryParams.price;
			// 	this.selectedPriceValue = queryParams.price;
			// } else {
			// 	this.urlPriceValueParam = 10000;
			// 	this.selectedPriceValue = 10000;
			// }

			if (queryParams.maxPrice || queryParams.minPrice) {
					this.maxPrice = queryParams.maxPrice;
					this.minPrice = queryParams.minPrice;

					this.selectedPriceValue = queryParams.maxPrice;
			} else {
					this.maxPrice = 10000;
					this.minPrice = 0;
					
					this.selectedPriceValue = 10000;
			}



		});

		//    alert(this.currentPage);

		// if(this.currentPage<= this.totalPage || this.currentPage==1 ) {

		// console.log('s');

		if (this.urlDurationParam == 1) {
			this.duratin = '0:2';
		} else if (this.urlDurationParam == 2) {
			this.duratin = '2:6';
		} else if (this.urlDurationParam == 3) {
			this.duratin = '6:16';
		} else if (this.urlDurationParam == 4) {
			this.duratin = '6:100';
		} else {
			this.duratin = '0:1000';
		}

		if (this.urlRatingParam == 1) {
			this.rating = "1:5";
		} else if (this.urlRatingParam == 2) {
			this.rating = "2:5";
		} else if (this.urlRatingParam == 3) {
			this.rating = "3:5";
		} else if (this.urlRatingParam == 4) {
			this.rating = "4:5";
		} else if (this.urlRatingParam == 0) {
			this.rating = "0:5";
		}

		// if (this.urlPriceValueParam) {
		// 	this.price = `0:${this.urlPriceValueParam}`;

		// 	if (this.urlPriceValueParam > 0) {
		// 		this.selectedprice = 1;
		// 	} else {
		// 		this.selectedprice = 2;
		// 	}
		// }

		if (this.maxPrice || this.minPrice) {
			this.price = `${this.minPrice}:${this.maxPrice}`;

			if (this.minPrice == 0 && this.maxPrice>0) {
				this.selectedprice = 3;
			} else if(this.minPrice > 1 && this.maxPrice >0) {
				this.selectedprice = 1;
			} else if(this.minPrice == 0 && this.maxPrice == 0) {
				this.selectedprice = 2;
			}
		}

		//    alert('gg');
		this.ngxService.start();
		this.http.get(`utility/product/search?string=${this.searchKey}&pagination=true&page=${this.currentPage}&category=${this.urlCategoryParam}&stander=${this.urlStanderParam}&user=${this.urlVendorParam}&duration=${this.duratin}&rating=${this.rating}&price=${this.price}`).subscribe((response) => {
			// this.loader = false;
			// console.log(response);
			if (response['status'] === 'success') {

				if (this.currentPage == 1) {
					this.searchData = response['data'];
				} else {
					this.searchData = this.searchData.concat(response['data']);
				}
				//  console.log(this.searchData);
				this.totalDataCount = response['pagination'].rowCount;

				this.totalPage = response['pagination'].pageCount;
				this.ngxService.stop();

			}
		}, (error) => {
			//  this.loader = false;
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
		// } else {
		//  // this.loader = false;
		// }
	}
	onScroll() {


		// if(this.currentPage < this.totalPage) {
		//   this.currentPage+=1;
		//  console.log(this.currentPage);

		if (this.currentPage < this.totalPage) {
			this.currentPage += 1;
			this.getSearchData();
		}

		//  }
		//  this.getSearchData();
	}


	updateSelectedParam(value) {

		this.currentPage = 1;

		this.selectedCategory = value.selectedCategory;
		this.selectedStanderd = value.selectedStanderd;
		this.selectedVendor = value.selectedVendor;
		this.selectedDuration = value.selectedDuration;
		this.selectedRating = value.selectedRating;
		this.selectedPriceValue = value.selectedPriceValue;

		this.selectedprice = value.selectedprice;

		if(this.selectedprice == 1){
			this.maxPrice = this.selectedPriceValue;
			this.minPrice = 1;
		} else if (this.selectedprice == 2) {
			this.maxPrice =this.selectedPriceValue;
			this.minPrice = 0;
		} else if(this.selectedprice == 3) {
			this.maxPrice = this.selectedPriceValue;
			this.minPrice = 0;
			
		}

		if(this.selectedPriceValue==0){
			this.minPrice = 0;
		}

		// For Url change
		this.urlCategoryParam = this.selectedCategory.join();
		this.urlStanderParam = this.selectedStanderd.join();
		this.urlVendorParam = this.selectedVendor.join();
		this.urlDurationParam = this.selectedDuration;
		this.urlRatingParam = this.selectedRating;
		//this.urlPriceValueParam = this.selectedPriceValue;


		this.route.navigate(
			[],
			{
				relativeTo: this.activatedRoute,
				queryParams: {
					category: this.urlCategoryParam,
					stander: this.urlStanderParam,
					user: this.urlVendorParam,
					duration: this.urlDurationParam,
					rating: this.urlRatingParam,
					//price: this.urlPriceValueParam
					maxPrice: this.maxPrice,
					minPrice: this.minPrice
				},
				queryParamsHandling: "merge"
			});

		// call search function
		// this.getSearchData();
		//      setTimeout(()=>{    
		//       this.getSearchData() ;
		//  }, 30);
		// alert('hh');
	}

	getSlug(data) {
		let name = '';

		if (data) {
			name += data.user_full_name +'-' + data.user_id;
			name = name.replace(/\s+/g, '-').toLowerCase();
		} else {
			name = '';
		}
		return name.toLowerCase();
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

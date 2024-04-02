import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd as Event, ActivatedRoute } from '@angular/router';
// import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

import { mergeMap } from 'rxjs/operators';
import { of, BehaviorSubject, Subscription, Observable } from 'rxjs';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { FrontendListingService } from '../../../services/frontend-listing.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
	selector: 'app-search-list',
	templateUrl: './search-list.component.html',
	styleUrls: ['./search-list.component.scss']
})
export class SearchListComponent implements OnInit, AfterViewInit, OnDestroy {

	private listingSubscription: Subscription;
	public listingModule: string;
	public viewClass: string;
	public gridClass: string;

	public listingItems: Array<any> = [];
	public priceTypeArray: Array<any>  = ['sxl_price','-sxl_price','usd_price','-usd_price'];
	public searchParams: any = {
		pagination: true,
		review_count: true,
		limit: this.httpService.frontendPerPage,
		page: 1,
		// order_by: '-id',
		is_publish: true,
		isApproved: true,
		images: true,
		category: null,
		user: true,
		offer: true,
		reseller_id: null,
		is_delete: true,
		is_active: true,
		fetch_price: true
	};

	public paginationObj: any;
	public loader: Boolean = true;
	private _routeFetched: any;

	public sortModel: String = '';

	public cartObj: any = null;
	public wishListLoader: Boolean = false;
	public wishListsearchParams: any = {
		product_details: true,
		images: true,
		user_id: null,
		order_by: '-id',
		limit: 2,
		page: 1,

	};
	public wishListRecords: any = [];
	public wishListCounts: any = '';
	public userId = null;
	public wishLists: Array<any> = [];

	public fullColumnMode: Boolean = false;
	public selectedFilterElement: String ='All';


	constructor(
		public router: Router,
		public route: ActivatedRoute,
		public listingService: FrontendListingService,
		// private loaderService: NgxUiLoaderService,
		private httpService: HttpRequestService,
		private commonService: CommonService,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService
	) {
		this.httpService.getUserObservable().subscribe((user) => {
			if (user) {
				this.userId = user.user.id;

			}
		});
		// router.events.subscribe((event) => {
		// 	if (event instanceof Event) {
		// 		const urlStr = event.url.replace(/^\/|\/$/g, '');
		// 		const urlArr = urlStr.split('/');
		// 		const code = urlArr.shift();
		// 		this.listingModule = code;
		// 		console.log(urlArr, ' urlArr');

		// 		// ===============================================
		// 		if (code === 'courses') {
		// 			this.searchParams.course_modules = true;
		// 			this.searchParams.course_lectures = true;
		// 			this.searchParams.course_standers = true;
		// 			this.searchParams.whislist = true,
		// 			this.searchParams.user_id = this.userId;
		// 		}
		// 		// ===============================================
		// 		this.listingItems = [];
		// 		this.loader = true;
		// 		// this.loaderService.start();

		// 		this.listingService.setCategory(null);
		// 	}
		// });

		this.route.data.subscribe((data) => {
			if ('listType' in data) {
				// const urlStr = event.url.replace(/^\/|\/$/g, '');
				// const urlArr = urlStr.split('/');
				const code = data.listType;
				this.listingModule = data.listType;

				// ===============================================
				if (code === 'courses') {
					this.searchParams.course_modules = true;
					this.searchParams.course_lectures = true;
					this.searchParams.course_standers = true;
					this.searchParams.whislist = true;
					this.searchParams.user_id = this.userId;
					this.searchParams.order_by = '-id';
				}
				// ===============================================

				if (code === 'events') {
					this.searchParams.event_speaker = 'true';
					this.searchParams.date_filter = 'true';
				}

				this.listingItems = [];
				this.loader = true;
				// this.loaderService.start();

				this.listingService.setCategory(null);
			}

			if ('listMode' in data) {
				if (data.listMode === 'general') {
					this.fullColumnMode = false;
				} else if (data.listMode === 'reseller') {
					this.fullColumnMode = true;
				}
			}
		});

		// this.loaderService.stop();
	}

	ngOnInit() {
		let category = null;
		this.SeoService.getMetaInfo();
		this.viewClass = 'thumbnail';
		this.gridClass = 'col-xl-4 col-lg-6 col-md-4';

		this.route.queryParams.subscribe((response) => {
			// console.log(response,'query params');
			const page = response.country_id ? response.country_id : 0;
			this.searchParams.country_id = response.country_id;
			this.searchParams.speaker_id = response.speaker_id;
			this.searchParams.page =1;
			if(this.searchParams.country_id) {
				this.selectedFilterElement = localStorage.getItem('selectedCountryForList');
			}
			if(this.searchParams.speaker_id) {
				// console.log( localStorage.getItem('selectedSpeakerForList'),'ssnn');
				this.selectedFilterElement = localStorage.getItem('selectedSpeakerForList');
			}
			if(!response.country_id && !response.speaker_id) {
				this.selectedFilterElement = 'All';
			}
			this.getRecords();
			
		});
		
		
		// this.loaderService.stop();
		this.listingSubscription = this.listingService.categoryFilter$.pipe(
			mergeMap((categoryRes) => {
				category = categoryRes;
				// console.log(category, ' categ');
				// if(category) {
				// 	this.selectedFilterElement = category.name ? category.name : 'All';
				// }

				if (category) {
					// console.log(category);
					this._routeFetched = { status: 'active' };
					this.searchParams.page = 1;
					if (category.id) {
						this.searchParams.category = (category.id) ? category.id : '0';
						this.selectedFilterElement = category.name ? category.name : 'All';
					}
					if('category' in category) {
						this.searchParams.category = '0';

					}
				}

				return this.route.data;
			})
		).subscribe((routeData) => {
			if (routeData) {

				if (routeData.listMode === 'reseller' ) {
					const paramsObj = this.route.snapshot.params;
					if ('reseller' in paramsObj) {
						this._routeFetched = { status: 'active' };
						// console.log(this.route.snapshot.params);
						const resellerArr = paramsObj.reseller.split('-');
						if (resellerArr.length > 0) {
							const resellerId = resellerArr.pop();
							this.searchParams.reseller_id = resellerId;
						}
					}
				}

				this.getRecords();
			}
		});

	}

	ngAfterViewInit() {
	}

	ngOnDestroy() {
		// console.log('des');
		this.listingSubscription.unsubscribe();
	}

	getRecordPanelClass() {
		let classStr = 'col-xl-9 col-lg-8';
		if (this.fullColumnMode) {
			classStr = 'col-xl-12 col-lg-12';
		}
		return classStr;
	}

	onActiveState(): Observable<any> {
		return of(this._routeFetched);
	}

	getRecords() {
		this.ngxService.start();
		// this.route.
		this.onActiveState().pipe(
			mergeMap((event) => {
				// console.log(event, 'ss');
				if (event) {
					switch (this.listingModule) {
						case 'courses':
							// console.log(this.searchParams);
							return this.httpService.setModule('course').search(this.searchParams);
							break;
						case 'events':
							this.searchParams['event'] = true;
							return this.httpService.setModule('event').search(this.searchParams);
							break;
						case 'products':
							return this.httpService.setModule('product').search(this.searchParams);
							break;
						default:
							return of(null);
							break;
					}
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				this.loader = false;
				if (response.data) {
					if (this.searchParams.page === 1) {
						this.listingItems = [];
						// this.commonService.scrollToElement('record-set');
						window.scroll(0,0);
					}
					this.listingItems = this.listingItems.concat(response.data);
					this.paginationObj = response.pagination;
					// console.log(this.listingItems);
				}
			}
		}, (error) => {
			this.ngxService.stop();
			this.loader = false;
			this.commonService.showErrors(error);
		});
	}

	onScrollPagination() {
		if ((this.searchParams.limit * this.searchParams.page) < this.paginationObj.rowCount) {
			this.loader = true;
			this.searchParams.page += 1;
			this.getRecords();
			// console.log('scrolled!!');

		}
	}

	pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getRecords();
		}
	}

	onChangeView(view) {
		this.viewClass = view;
		if (view === 'listing') {
			this.gridClass = 'col-xl-12 col-lg-12 col-md-12';
		} else {
			this.gridClass = 'col-xl-4 col-lg-6 col-md-4';
		}
	}

	onChangeSort(event) {
		this.listingItems = [];
		this.loader = true;
		if (event) {
			// console.log(event, 'sort');
			this.searchParams.page = 1;

			if(event.target.value == 'only_sxl') {
				this.searchParams.only_sxl = true;
				this.searchParams.only_usd = false;
				this.searchParams.usd_sxl = false;
			} else if (event.target.value == 'only_usd') {
				this.searchParams.only_sxl =false;
				this.searchParams.only_usd =true;
				this.searchParams.usd_sxl =false;
			} else if (event.target.value == 'usd_sxl') {
				this.searchParams.only_sxl =false;
				this.searchParams.only_usd =false;
				this.searchParams.usd_sxl =true;
			} else {
				if(this.priceTypeArray.indexOf(event.target.value) > -1 ) {
					this.searchParams.price_filter = event.target.value || 'id';
					this.searchParams.order_by = '';
					this.searchParams.only_sxl =false;
					this.searchParams.only_usd =false;
					this.searchParams.usd_sxl =false;
				} else {
					this.searchParams.order_by = event.target.value || 'id';
					this.searchParams.price_filter = '';
					this.searchParams.only_sxl =false;
					this.searchParams.only_usd =false;
					this.searchParams.usd_sxl =false;
				}
			}

			this.getRecords();
		}
	}

	getGridImageSrc() {
		return (this.viewClass === 'listing') ? 'assets/images/event-view1.png' : 'assets/images/event-view1-active.png';
	}

	getListImageSrc() {
		return (this.viewClass === 'listing') ? 'assets/images/event-view2-active.png' : 'assets/images/event-view2.png';
	}

}

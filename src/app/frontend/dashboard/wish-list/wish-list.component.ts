import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
	selector: 'app-wish-list',
	templateUrl: './wish-list.component.html',
	styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {

	public records: Array<any> = [];

	public searchParams: any = {
		product_details: true,
		images: true,
		user_id: null,
		order_by: '-id',
		limit: this.httpService.vendorPerPage,
		page: 1,
		fetch_price: true
	};

	public wishAbleTypes: Array<any> = [
		{ type: 'courses', name: 'Course', url: '/course-details'},
		{ type: 'products', name: 'Product', url: '/product-details'},
		{ type: 'events', name: 'Event', url: '/event-details'}
	];

	public paginationObj: any;

	constructor(
		private commonService: CommonService,
		private httpService: HttpRequestService,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();	
		this.getWishlist();
	}

	getWishlist() {
		
		this.ngxService.start();
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.searchParams.user_id = user.user.id;
					return this.httpService.setModule('wishlist').search(this.searchParams);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				window.scroll(0,0);
				this.records = response.data;
				this.paginationObj = response.pagination;
			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}

	pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getWishlist();
		}
	}

	getWishableType(item) {
		let type = '';
		if (item) {
			const typeObj = this.wishAbleTypes.find((el) => {
				return (el.type === item.wishlistable_type);
			});

			if (typeObj) {
				type = typeObj.name;
			}
		}

		return type;
	}

	getWishableUrl(item) {
		let url = '/';
		if (item) {
			const typeObj = this.wishAbleTypes.find((el) => {
				return (el.type === item.wishlistable_type);
			});

			if (typeObj) {
				url = typeObj.url;
			}
		}

		return url;
	}

	getImage(item) {
		let imgUrl = '';
		if (item) {
			if (item.wishlistable_type === 'courses') {
				imgUrl = item.product_details.images.thumbnail || '';
			} else if (item.wishlistable_type === 'events') {
				if (item.product_details.images.length > 0) {
					imgUrl = item.product_details.images[0].thumbnail || '';
				}
			} else if (item.wishlistable_type === 'products') {
				if (item.product_details.images.length > 0) {
					imgUrl = item.product_details.images[0].thumbnail || '';
				}
			}

			if (imgUrl === '') {
				imgUrl = 'assets/images/noimg-222x150.jpg';
			}
		}
		return imgUrl;
	}

	removeFromWishList(item) {
		if (item) {
			if (confirm('Are you sure ?')) {
				this.httpService.getUserObservable().pipe(
					mergeMap((user) => {
						if (user) {
							return this.httpService.setModule('wishlist').deleteOne({id : item.id});
						} else {
							return of(null);
						}
					})
				).subscribe((res) => {
					if (res) {
						const idx = this.records.findIndex((el) => {
							return (parseInt(el.id, 10) === parseInt(item.id, 10));
						});

						if (idx > -1) {
							this.commonService.showMessage({type: 'success', title: '', message: 'Item removed from wishlist'});
							this.records.splice(idx, 1);
						}
					}
				}, (error) => {
					this.commonService.showErrors(error);
				});
			}
		}
	}

}

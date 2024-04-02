import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HttpRequestService } from '../../../../services/http-request.service';
import { CommonService } from '../../../../global/services/common.service';

import { environment as env } from '../../../../../environments/environment';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
	selector: 'app-courses-manage',
	templateUrl: './courses-manage.component.html',
	styleUrls: ['./courses-manage.component.scss'],
	providers: [NgbRatingConfig]
})
export class CoursesManageComponent implements OnInit {

	public noImage: any = env.noImage;

	public searchParams: any = {
		pagination: true,
		review_count: true,
		limit: this.httpService.frontendPerPage,
		page: 1,
		order_by: '-id',
		is_publish: true,
		images: true,
		category: null,
		user: true,
		offer: true,
		is_delete: true,
		is_active: true
	};

	public assignedRecords: Array<any> = [];
	public records: Array<any> = [];
	public paginationObj: any;

	public inputParams: any = {
		user_id: null,
		status: 'active',
		data: []
	};

	public assignedSearchParams: any = {
		pagination: true,
		order_by: '-id',
		courses: true,
		user_id: null,
		limit: 100,
		page: 1
	};

	public dataLoader: Boolean = false;

	constructor(
		config: NgbRatingConfig,
		public httpService: HttpRequestService,
		public commonService: CommonService,
		public router: Router,
		public route: ActivatedRoute,
		public SeoService:SeoServiceService
	) {
		config.max = 5;
		config.readonly = true;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.getSelectedCourses();
		this.SeoService.getMetaInfo();
	}

	getSelectedCourses() {
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.assignedSearchParams.user_id = user.user.id;
					return this.httpService.setModule('resellerProduct').search(this.assignedSearchParams);
				}
				return of(null);
			})
		).subscribe((response) => {
			if (response) {
				this.assignedRecords = response.data;
				this.getCourses();
			}
		}, (error) => {
			// console.log(error);
		});
	}

	getCourses() {
		let logUser = null;
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					logUser = user;
					this.searchParams.user_id = user.user.id;
					this.inputParams.user_id = user.user.id;
					return this.httpService.setModule('course').search(this.searchParams);
				}
				return of(null);
			})
		).subscribe((response) => {
			if (response) {
				this.paginationObj = response.pagination;
				if (this.paginationObj.page === 1) {
					this.records = [];
				}
				response.data.forEach((el) => {
					const idx = this.assignedRecords.findIndex((elm) => {
						return (elm.courses.id === el.id);
					});
					// console.log(idx);
					if (idx < 0) {
						this.records.push(el);
					}
				});
			}
		}, (error) => {
			// console.log(error);
		});
	}

	hasOffer(item) {
		let flag = false;
		if (item) {
			if (Object.keys(item.offer).length > 0) {
				flag = true;
			}
		}
		return flag;
	}

	getPrice(item) {
		let price = item.price;
		if (this.hasOffer(item)) {
			if (item.offer.discount_mode === 'fixed') {
				price = (item.price - item.offer.discount);
			} else {
				price = (item.price * (1 - (item.offer.discount / 100)));
			}
		}
		return price;
	}

	onChangeItem(event) {
		const idx = this.inputParams.data.findIndex((el) => {
			return (parseInt(el.product_id, 10) === parseInt(event.target.value, 10));
		});
		if (event.target.checked) {
			const params = {
				product_id : parseInt(event.target.value, 10),
				id: null
			};
			this.inputParams.data.push(params);
		} else {
			this.inputParams.data.splice(idx, 1);
		}
	}

	saveData() {
		this.dataLoader = true;
		if (this.inputParams.data.length > 0) {
			this.httpService.setModule('resellerProduct').create(this.inputParams).subscribe((data) => {
				this.dataLoader = false;
				this.commonService.showMessage({
					type: 'success',
					title: 'Voila',
					message: 'Items will be shown your course list after admin approval'
				});
				this.router.navigate(['/dashboard', 'reseller', 'courses']);
			}, (error) => {
				this.dataLoader = false;
				this.commonService.showErrors(error);
			});

		} else {
			this.dataLoader = false;
			this.commonService.showMessage({ type: 'warning', title: 'Warning!', message: 'Please select at least one item'});
		}
	}

}

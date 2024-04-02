import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HttpRequestService } from '../../../../services/http-request.service';
import { CommonService } from '../../../../global/services/common.service';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
	selector: 'app-courses',
	templateUrl: './courses.component.html',
	styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

	public loggedUser: any = null;
	public records: Array<any> = [];

	public statusArr: Array<any> = [
		{
			code: 'draft',
			name: 'Draft',
			cssClass: 'badge badge-warning'
		},
		{
			code: 'publish',
			name: 'Publish',
			cssClass: 'badge badge-success'
		},
		{
			code: 'unpublish',
			name: 'Unpublish',
			cssClass: 'badge badge-danger'
		}
	];

	public searchParams: any = {
		pagination: true,
		order_by: '-id',
		courses: true,
		reseller: true,
		user_id: null,
		review_count: true,
		created_by: true,
		limit: this.httpService.vendorPerPage,
		page: 1
	};

	public paginationObj: any;

	constructor(
		public httpService: HttpRequestService,
		public commonService: CommonService,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.getSelectedCourses();
		this.SeoService.getMetaInfo();
	}

	getSelectedCourses() {
		window.scroll(0,0);
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.loggedUser = user;
					this.searchParams.user_id = user.user.id;
					return this.httpService.setModule('resellerProduct').search(this.searchParams);
				}
				return of(null);
			})
		).subscribe((response) => {
			if (response) {
				this.records = response.data;
				this.paginationObj = response.pagination;
			}
		}, (error) => {
			// console.log(error);
		});
	}

	getResellerSlug(item) {
		let slug = '';
		if (item) {
			slug = item.reseller.profile.full_name.toLowerCase();
			slug = slug.replace(' ', '-');
			slug = slug + '-' + item.reseller.id;
		}
		return slug;
	}

	/**
	 * get image url
	 * @param item any
	 */
	getImage(item) {
		let imgUrl = '';
		if (item) {
			imgUrl = item.images.thumbnail || '';

			if (imgUrl === '') {
				imgUrl = 'assets/images/noimg-222x150.jpg';
			}
		}
		return imgUrl;
	}

	_statusSelection(record) {
		let selectedStatus = null;
		const item = record.courses;
		if (item) {
			selectedStatus = this.statusArr.find((el) => (el.code === item.status));
		}
		return selectedStatus;
	}

	getStatusTest(record: any) {
		let status = '';

		const selectedStatus = this._statusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.name;
		}
		return status;
	}

	getStatusClass(record: any) {
		let status = '';

		const selectedStatus = this._statusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.cssClass;
		}
		return status;
	}

	getDiscountedPrice(record) {
		let price = 0;
		const item = record.courses;
		if (item) {
			price = item.price;
			if (parseInt(item.discount, 10) > 0) {
				price = price - ((price * parseInt(item.discount, 10)) / 100);
			}
		}
		return price;
	}

	deleteRecord(id) {
		if (confirm('Are you sure?')) {
			const params = [
				{ id: id}
			];
			this.deleteRequest(params).subscribe((response) => {
				if (response) {
					const idx = this.records.findIndex((el) => {
						return (el.id === id);
					});
					if (idx > -1) {
						this.records.splice(idx, 1);
						this.commonService.showMessage({ type: 'success', title: '', message: 'Record deleted'});
					}
				}
			}, (error) => {
				if (error) {
					this.commonService.showErrors(error);
				}
			});
		}
	}

	deleteRequest(idArr) {
		return this.httpService.setModule('resellerProductDelete').create(idArr);
	}

}

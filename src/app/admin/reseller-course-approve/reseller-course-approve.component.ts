import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as moment from 'moment';

import { HttpRequestService } from '../../services/http-request.service';
import { CommonService } from '../../global/services/common.service';

@Component({
	selector: 'app-reseller-course-approve',
	templateUrl: './reseller-course-approve.component.html',
	styleUrls: ['./reseller-course-approve.component.scss']
})
export class ResellerCourseApproveComponent implements OnInit {

	public loggedUser: any = null;
	public records: Array<any> = [];

	public paymentStatusArr: Array<any> = [
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

	public approvalStatusArr: Array<any> = [
		{
			code: 'pending',
			is_delete: 0,
			is_approved: 0,
			name: 'Pending',
			cssClass: 'badge badge-warning'
		},
		{
			code: 'approved',
			is_delete: 0,
			is_approved: 1,
			name: 'Approved',
			cssClass: 'badge badge-success'
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

	public selectedRecordParams: any = {
		approved_by: null,
		approved_date: null,
		items: []
	};

	constructor(
		public httpService: HttpRequestService,
		public commonService: CommonService
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.getSelectedCourses();
	}

	getSelectedCourses() {
		window.scroll(0,0);
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.loggedUser = user;
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

	_approvalStatusSelection(record) {
		let selectedStatus = null;
		const item = record;
		if (item) {
			selectedStatus = this.approvalStatusArr.find((el) => (
				(parseInt(el.is_delete, 10) === parseInt(item.is_delete, 10))
				&&
				(parseInt(el.is_approved, 10) === parseInt(item.is_approved, 10))
			));
		}
		return selectedStatus;
	}

	getApprovalStatusTest(record: any) {
		let status = '';

		const selectedStatus = this._approvalStatusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.name;
		}
		return status;
	}

	getApprovalStatusClass(record: any) {
		let status = '';

		const selectedStatus = this._approvalStatusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.cssClass;
		}
		return status;
	}

	_productStatusSelection(record) {
		let selectedStatus = null;
		const item = record.courses;
		if (item) {
			selectedStatus = this.paymentStatusArr.find((el) => (el.code === item.status));
		}
		return selectedStatus;
	}

	getProductStatusTest(record: any) {
		let status = '';

		const selectedStatus = this._productStatusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.name;
		}
		return status;
	}

	getProductStatusClass(record: any) {
		let status = '';

		const selectedStatus = this._productStatusSelection(record);
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
				{ id: id }
			];
			this.deleteRequest(params).subscribe((response) => {
				if (response) {
					const idx = this.records.findIndex((el) => {
						return (el.id === id);
					});
					if (idx > -1) {
						this.records.splice(idx, 1);
						this.commonService.showMessage({ type: 'success', title: '', message: 'Record deleted' });
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

	isCheckedRec(record) {
		let flag = false;
		if (record) {

			const idx = this.selectedRecordParams.items.findIndex((el) => {
				return (parseInt(el.id, 10) === parseInt(record.id, 10));
			});

			flag = (idx > -1) ? true : false;

		}
		return flag;
	}

	onChangekRec(event, record) {
		if (event) {
			if (event.target.checked) {
				const param = {
					id: record.id,
					user_id: record.user_id,
					product_id: record.product_id
				};
				this.selectedRecordParams.items.push(param);
			} else {
				const idx = this.selectedRecordParams.items.findIndex((el) => {
					return (parseInt(el.id, 10) === parseInt(record.id, 10));
				});
				this.selectedRecordParams.items.splice(idx, 1);
			}
		}
	}

	onClickRec(event, record) {
		if (event) {
			const idx = this.selectedRecordParams.items.findIndex((el) => {
				return (parseInt(el.id, 10) === parseInt(record.id, 10));
			});


			if (idx > -1) {
				this.selectedRecordParams.items.splice(idx, 1);
			} else {
				const param = {
					id: record.id,
					user_id: record.user_id,
					product_id: record.product_id
				};
				this.selectedRecordParams.items.push(param);
			}
		}
	}

	isCheckedAllRec() {
		let flag = false;
		if (this.records.length > 0) {
			flag = (this.records.length === this.selectedRecordParams.items.length) ? true : false;
		}
		return flag;
	}

	onClickAllRec(event) {
		if (event) {
			if (event.target.checked) {
				this.selectedRecordParams.items = this.records.map((record) => {
					const param = {
						id: record.id,
						user_id: record.user_id,
						product_id: record.product_id
					};
					return param;
				});
			} else {
				this.selectedRecordParams.items = [];
			}
		}
	}

	onClickApprove(event) {
		if (this.selectedRecordParams.items.length === 0) {
			this.commonService.showMessage({ type: 'warning', title: '', message: 'Please select atleast one record' });
		} else {
			if (confirm('Are you sure?')) {
				this.httpService.getUserObservable().pipe(
					mergeMap((user) => {
						if (user) {
							this.selectedRecordParams.approved_by = parseInt(user.user.id, 10);
							const dtObj = new Date();
							this.selectedRecordParams.approved_date = moment(dtObj.toISOString()).format('YYYY-MM-DD');
							return this.httpService.setModule('resellerProductApproved').create(this.selectedRecordParams);
						}
						return of(null);
					})
				).subscribe((response) => {
					if (response) {
						this.selectedRecordParams = {
							approved_by: null,
							approved_date: null,
							items: []
						};
						this.getSelectedCourses();
					}
				}, (error) => {
					if (error) {
						this.selectedRecordParams = {
							approved_by: null,
							approved_date: null,
							items: []
						};
						this.commonService.showErrors(error);
					}
				});
			}
		}

	}

	onClickDisapprove(event) {
		if (this.selectedRecordParams.items.length === 0) {
			this.commonService.showMessage({ type: 'warning', title: '', message: 'Please select atleast one record' });
		} else {
			if (confirm('Are you sure?')) {
				const idArr = this.selectedRecordParams.items.map((el) => {
					const params = {
						id: el.id
					};
					return params;
				});
				this.httpService.setModule('resellerProductDelete').create(idArr)
					.subscribe((response) => {
						if (response) {
							this.selectedRecordParams = {
								approved_by: null,
								approved_date: null,
								items: []
							};
							this.getSelectedCourses();
						}
					}, (error) => {
						if (error) {
							this.selectedRecordParams = {
								approved_by: null,
								approved_date: null,
								items: []
							};
							this.commonService.showErrors(error);
						}
					});
			}
		}
	}

}

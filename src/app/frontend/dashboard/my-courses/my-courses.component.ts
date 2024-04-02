import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment as env } from '../../../../environments/environment';

import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
	selector: 'app-my-courses',
	templateUrl: './my-courses.component.html',
	styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {

	public records: Array<any> = [];
	public sendData: any = null;
	public loggedUser: any = null;

	public searchParams: any = {
		course: true,
		images: true,
		order: true,
		user_id: null,
		order_by: '-id',
		limit: this.httpService.vendorPerPage,
		page: 1,
		course_progress: true,
		group_by: true,
		is_delete: true,
		is_active: true
	};
	searchForm: FormGroup;
	public paginationObj: any;

	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		private httpService: HttpRequestService,
		config: NgbRatingConfig,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService
	) {
		config.max = 5;
		config.readonly = true;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.searchForm = this.fb.group({
			string: [''],
		});
		this.getCourses();
	}

	getCourses() {
		this.ngxService.start();
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.searchParams.user_id = user.user.id;
					return this.httpService.setModule('courseUser').search(this.searchParams);
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
	search() {

		const form_data = this.searchForm.value;
		this.searchParams.string = form_data['string'];
		this.getCourses();
	}

	pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getCourses();
		}
	}

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

	courseRefund(userCourseId, courseId, orderId) {
		// console.log(userCourseId);
		// console.log(courseId);
		// console.log(orderId);

		const sendData = {
			user_id: null,
			course_id: courseId,
			order_id: orderId
		};


		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					sendData.user_id = user.user.id;

					return this.httpService.get(`payment/refund/${userCourseId}`, sendData);
				}
			})
		).subscribe((response) => {
			if (response) {
				this.commonService.showMessage({ type: 'success', title: '', message: 'Your course has been canceled' });
				this.getCourses();
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});

	}

	isCancelShow(item) {
		let flag = false;
		if (item) {
			const itmDtObj = new Date(item.created_at);
			const curDtObj = new Date();
			const dtDur = Math.round(((itmDtObj.getTime() - curDtObj.getTime()) / (1000 * 24 * 60 * 60)));

			if ((item.user_course_progresses_id === null) && (env.courseRefundDuration > dtDur) && (item.status !== 'cancelled')) {
				flag = true;
			}
		}
		return flag;
	}

}

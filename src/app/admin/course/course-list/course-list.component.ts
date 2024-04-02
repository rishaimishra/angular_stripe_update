import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { bounceOutRight } from '../../../common/animation';
import { $ } from 'protractor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
	selector: 'app-course-list',
	templateUrl: './course-list.component.html',
	styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
	public error_messages: any = [];
	public user: any;
	public pagination: any = [];
	public limit: Number = 10;
	public vendors: Array<any> = [];
	public categories: Array<any> = [];
	public categoriesTree: Array<any> = [];
	public trashBtn = '<i class="fa fa-trash"></i>';
	public data: any = [];
	private toasterService: ToasterService;
	searchForm: FormGroup;
	public searchParams: any = {
		categories: true,
		user: true,
		is_delete: true,
		fetch_price:true
	};
	selectedPriceValue: number = 10000;
	
	public price: Array<any> = [
		{
			label: 'Paid',
			value: 'total_price'
		},
		{
			label: 'Free',
			value: 'free'
		},
		{
			label: 'All',
			value: '-id'
		},

	];
	public publishOptions: Array<any> = [
		{
			label: 'Yes',
			value: 'publish',
		},
		{
			label: 'No',
			value: 'draft',
		},

	];
	public featureOptions: Array<any> = [
		{
			label: 'Yes',
			value: '1',
		},
		{
			label: 'No',
			value: '0',
		},

	];

	public selectedprice: number = 3;

	public featureYes = '<i class="fa fa-check-circle" aria-hidden="true"></i>';
	public featureNo = '<i class="fa fa-circle-thin" aria-hidden="true"></i>';
	public notificationRecords: any= [];

	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		toasterService: ToasterService,
		protected http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
		private render: Renderer,
		private ngxService: NgxUiLoaderService,
		private myRoute: Router,
	) {
		this.toasterService = toasterService;
		this.searchForm = this.fb.group({
			string: [''],
			category: [],
			created_by: [],
			is_publish: [],
			is_featured: [],
			price_filter: []
		});
	}

	ngOnInit() {
		window.scroll(0,0);
		this.user = this.http.getUser();
		this.ngxService.start();

		this.activeRoute.queryParams.subscribe((response) => {
			const page = response.page ? response.page : 1;
			this.getCategories();
			this.getCourses();
			this.getVendors();
			this.ngxService.stop();
		},(errors) => {
			this.ngxService.stop();
			// this.commonService.showErrors(errors);
			});
		this.getNotificationRecords();
	}
	getNotificationRecords() {
   
		this.http.get(`utility/lastest-dashboard-notifications/${this.http.getUser().id}?profile=true&user=true&role=${this.http.getUserRole()[0]}`).subscribe((response) => {
		  if (response['status'] === 'success') {
			this.notificationRecords = response['data'];

			localStorage.setItem('notificationRecords', JSON.stringify(this.notificationRecords));
			localStorage.setItem('notificationCount',this.notificationRecords.length);
			//console.log(this.notificationRecords);
		   // console.log(JSON.parse(localStorage.getItem('notificationRecords')));
		  }
		}, (errors) => {
		//  this.commonService.showErrors(errors);
		});
	  }

	getVendors() {
		const params = {
			role: 'vendor',
			profile: true,
			is_active: 1,
		};
		this.http.setModule('user').search(params).subscribe((response) => {
			if (response) {
				if (response.data) {

					this.vendors = response.data.filter(el => {
						if (el.profile) {
							return (Object.keys(el.profile).length > 0);
						} else {
							return false;
						}
					});
				}
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	public getCategories() {
		this.http.get('category?parent=true&is_active=true&type=courses').subscribe((response) => {
			if (response['status'] === 'success') {
				const itemsDate = [];
				response['data'].forEach(item => {
					itemsDate.push(item);
				});
				this.categories = itemsDate;
			}
		});
	}
	groupValueFn = (_: string, children: any[]) => ({ name: children[0].parent.name, total: children.length });
	search() {

		const form_data = this.searchForm.value;
		// console.log(form_data);
		this.searchParams.string = form_data['string'];
		this.searchParams.category = form_data['category'];
		this.searchParams.created_by = form_data['created_by'];
		this.searchParams.is_publish = form_data['is_publish'];
		this.searchParams.is_featured = form_data['is_featured'];
		this.searchParams.price_filter = form_data['price_filter'];
		this.getCourses();
	}

	public getCourses() {
		this.ngxService.start();
		window.scroll(0,0);
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('course').search(this.searchParams);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				this.data = response['data'];

			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}

	public editCourse(course): void {
		localStorage.removeItem('courseEditId');
		localStorage.setItem('courseEditId', course.id.toString());
		this.myRoute.navigate(['/dashboard/course-edit']);
	}

	public changeStatus(statusType, courseId, index) {
		// console.log(statusType);
		this.ngxService.start();
		let status;
		if (statusType === 'draft') {
			status = 'publish';
		} else {
			status = 'draft';
		}
		const formdata = {
			status: status,
			course_id: courseId,
			user_id: this.user.id,
		};
		this.http.post(`utility/course/status`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {

				this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].status = updateData.status;

				this.data.find(function (element) {
					if (element.id === updateData.id) {

						element.status = updateData.status;
					}
				});

			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Unable to publish the course as it is not yet been completed by the vendor.');
		});
	}



	public changeApproveStatus( courseId, index) {
		// console.log(statusType);
		this.ngxService.start();
		
		const formdata = {
			type:"courses",
			id:courseId,
			approved_by:this.user.id
		};
		this.http.post(`utility/admin/approved`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {

				this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].status = updateData.status;

				this.data.find(function (element) {
					if (element.id === courseId) {
						element.status = 'publish';
						element.approved_status = 1;
					}
				});

			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Unable to publish the course.');
		});
	}

	public changeFeatureStaus(featureType, courseId, index) {
		// console.log(statusType);

		this.ngxService.start();
		let is_featured;
		if (featureType === 0) {
			is_featured = '1';
		} else {
			is_featured = '0';
		}
		const formdata = {
			is_featured: is_featured
		};
		this.http.put(`course/${courseId}`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {

				this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].is_featured = updateData.is_featured;

				this.data.find(function (element) {
					if (element.id === updateData.id) {

						element.is_featured = updateData.is_featured;
					}
				});

			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
		});
	}

	changePriceType() {
		if (this.selectedprice === 1) {
			this.searchParams.price = '1:10000';
			this.selectedPriceValue = 10000;
		} else if (this.selectedprice === 2) {
			this.searchParams.price = '0:0';
			this.selectedPriceValue = 0;
		} else if (this.selectedprice === 3) {
			this.searchParams.price = '0:10000';
			this.selectedPriceValue = 10000;
		}
		this.getCourses();
	}
	onChangePrice() {
		if (this.selectedPriceValue === 0) {
			this.selectedprice = 2;
		} else if (this.selectedPriceValue > 0) {
			this.selectedprice = 1;
		}
		this.searchParams.price = '1:' + this.selectedPriceValue;
		this.getCourses();
	}


	deleteCourse(course) {
		this.ngxService.start();
		const params = {
			course_id: course.id,
		};
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('courseUser').search(params);
				}
			})
		).subscribe((response) => {
			if (response['status'] === 'success') {
				if (response['data'].length > 0) {
					this.ngxService.stop();
					this.toasterService.pop('error', 'Course Already purches by some consumer');
				} else {
					//  if (confirm('Are you sure?')) {

					this.http.get(`utility/soft-delete/courses/${course.id}/admin/${this.user.id}`)
						.subscribe((response) => {

							if (response) {
								this.ngxService.stop();
								this.toasterService.pop('success', 'Course deleted');

								const idx = this.data.findIndex((el) => {
									return (el.id === course.id);
								});
								if (idx > -1) {
									this.data.splice(idx, 1);
								}
							}
						}, (error) => {
							this.ngxService.stop();
							this.toasterService.pop('error', 'Failed to delete course');
						});
				}
			}

		}, (error) => {
			this.commonService.showErrors(error);
			this.ngxService.stop();
		});
	}

	changeActiveStaus(isActiveStatus, courseId, index) {
		this.ngxService.start();
		let url3rdSegment;
		if (isActiveStatus === 0) {
			url3rdSegment = 'active';
		} else {
			url3rdSegment = 'in_active';
		}

		this.http.get(`utility/action/${url3rdSegment}/courses/${courseId}/admin/${this.user.id}`).subscribe((response) => {
			if (response['status'] === 'success') {

				this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].is_featured = updateData.is_featured;

				this.data.find(function (element) {
					if (element.id === courseId) {
						element.is_active = updateData.is_active;
					}
				});

			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Course already purches by someone');
		});
	}

	public goToTop() {
		window.scroll(0,0);
	}

}

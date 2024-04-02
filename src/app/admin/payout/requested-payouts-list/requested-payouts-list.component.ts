import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';
import { HttpRequestService } from '../../../services/http-request.service';
import { bounceOutRight } from '../../../common/animation';
import { $ } from 'protractor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import * as moment from 'moment';


@Component({
	selector: 'app-requested-payouts-list',
	templateUrl: './requested-payouts-list.component.html',
	styleUrls: ['./requested-payouts-list.component.scss']
})
export class RequestedPayoutsListComponent implements OnInit {

	public error_messages: any = [];
	public user: any;
	public limit: Number = 10;
	public data: any = [];
	private toasterService: ToasterService;
	public loggedUser: any = null;
	public records: any = [];
	public payoutRecordsParams: any = {
		user: true,
		product_details: true,
		wallet: true,
		pagination: true,
		limit: this.http.adminPerPage,
		// limit:200,
		page: 1,
	};

	public paginationObj: any;

	public selectedRecordsIdx: Array<any> = [];
	public availableRec: Array<any> = [];

	public formObj: FormGroup; 
	public formError: any = {};
	public notificationRecords: any= [];
	constructor(
		private commonService: CommonService,
		toasterService: ToasterService,
		protected http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
		private render: Renderer,
		private ngxService: NgxUiLoaderService,
		private myRoute: Router,
		public validatorService: NgReactiveFormValidatorService,
		public formBuilder: FormBuilder
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.user = this.http.getUser();
		

		this.activeRoute.queryParams.subscribe((response) => {
			const page = response.page ? response.page : 1;
			this.getPayoutRecords();
			
		});

		this.formObj = this.formBuilder.group({
			items: this.formBuilder.array([])
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
	getPayoutRecords() {
		window.scroll(0,0);
		this.ngxService.start();
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.loggedUser = user;
					return this.http.setModule('payoutTransactions').search(this.payoutRecordsParams);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {

				this.formObj.setControl('items', this.formBuilder.array([]));
				if (response.data.length > 0) {
					this.records = response.data;
					this.selectedRecordsIdx = [];

					const items = this.formObj.get('items') as FormArray;
					this.records.forEach((el) => {
						if (el.status !== 'complete') {
							this.availableRec.push(el);
						}
						const dtObj = new Date();
						const elm = {
							id: el.id,
							wallet_id: el.wallet_id,
							request_amount: el.request_amount,
							approved_by: this.loggedUser.user.id,
							approved_date: moment(dtObj.toISOString()).format('YYYY-MM-DD'),
							message: '',
							status: el.status
						};
						const fg = this.createNewItem();
						fg.patchValue(elm);
						items.push(fg);
					});
				}
				// console.log(this.records);
				this.paginationObj = response.pagination;
				// console.log( response.pagination.page);

			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}

	createNewItem() {
		return this.formBuilder.group({
			id: [null, Validators.required],
			wallet_id: [null, Validators.required],
			request_amount:  [null, Validators.required],
			approved_by:  [null, Validators.required],
			approved_date:  [null, Validators.required],
			// message:  [null, Validators.required],
			message:  new FormControl({ value: null, disabled: true}, Validators.required),
			status:  [null, Validators.required]
		});
	}

	pagination(event) {
		if (event) {
			this.payoutRecordsParams.page = event.page;
			this.getPayoutRecords();
		}
	}
	approvePayment(id, walletId, amount, ) {
		const formdata = {
			id: id,
			wallet_id: walletId,
			request_amount: amount,
			approved_by: this.http.getUser().id,
			approved_date: moment(new Date()).format('YYYY-MM-DD'),
			send_data: '',
			received_data: ''
		};
		// console.log(formdata);
		this.http.post(`utility/payout/approved`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {
				this.ngxService.stop();
				const updateData = response['data'];
				this.records.find(function (element) {
					if (element.id === id) {
						element.status = updateData.status;
					}
				});
				this.toasterService.pop('success', 'Payout approve successfully');
			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Unable to approve payment.');
		});
	}

	cancelPayment(id, userId, ) {
		const formdata = {
			status: 'cancel',
			approved_by: this.http.getUser().id,
			approved_date: moment(new Date()).format('YYYY-MM-DD'),
			user_id: userId,
			id: id
		};
		this.http.post(`utility/payout/cancel`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {
				this.ngxService.stop();
				const updateData = response['data'];
				this.records.find(function (element) {
					if (element.id === id) {
						element.status = updateData.status;
					}
				});
				this.toasterService.pop('success', 'Payout canceled successfully');
			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Unable to cancel payment.');
		});
	}

	onChangeRecordCB(event, i) {
		const items = this.formObj.get('items') as FormArray;
		// items[i].get('message').enable();
		// console.log(items.controls[i]);
		items.controls[i].get('message').enable();
		if (event.target.checked) {
			this.selectedRecordsIdx.push(i);
			items.controls[i].get('message').enable();
		} else {
			const idx = this.selectedRecordsIdx.findIndex((el) => (el === i));
			if (idx > -1) {
				this.selectedRecordsIdx.splice(idx, 1);
			}
			items.controls[i].get('message').disable();
		}
	}

	onChangeAllRecordCB(event) {
		const items = this.formObj.get('items') as FormArray;
		if (event) {
			this.records.forEach((el, k) => {
				if (el.status !== 'complete') {
					this.selectedRecordsIdx.push(k);
					items.controls[k].get('message').enable();
				}
			});
		} else {
			this.records.forEach((el, k) => {
				if (el.status !== 'complete') {
					items.controls[k].get('message').disable();
				}
			});
			this.selectedRecordsIdx = [];
		}
	}

	isSelectedCB(i) {
		let flag = false;
		const idx = this.selectedRecordsIdx.findIndex((el) => (el === i));
		if (idx > -1) {
			flag = true;
		}
		return flag;
	}

	saveSelectedPayments() {
		if (this.selectedRecordsIdx.length > 0) {
			if (this.formObj.valid) {
				const valueArr = this.formObj.value['items'];
				const selectedArr = valueArr.filter((el, k) => {
					const idx = this.selectedRecordsIdx.indexOf(k);
					return (idx > -1);
				});
				this.http.setModule('payoutApproved').create(selectedArr).subscribe((res) => {
					if (res) {
						this.getPayoutRecords();
					}
				}, (err) => {
					this.commonService.showErrors(err);
				});
			} else {
				this.formError = this.formError = this.validatorService.validationError(this.formObj, {});
				// console.log(this.formError);
			}
		} else {
			this.commonService.showMessage({ type: 'error', title: '', message: 'Please select a record' });
		}
	}

}

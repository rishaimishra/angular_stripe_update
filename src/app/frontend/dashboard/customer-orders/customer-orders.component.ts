import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import {ExcelService} from '../../../global/services/excel.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SeoServiceService }  from '../../../services/seo-service.service';

@Component({
	selector: 'app-customer-orders',
	templateUrl: './customer-orders.component.html',
	styleUrls: ['./customer-orders.component.scss']
})
export class CustomerOrdersComponent implements OnInit {

	public records: Array<any> = [];
	public exceldata: any = [];
	public searchParams: any = {
		user_id: null,
		pagination: true,
		order_by: '-id',
		limit: this.httpService.vendorPerPage,
		page: 1
	};

	public patmentStatus: any = {
		complete: ['complete', 'cancel', 'return'],
		pending: ['failed', 'pending']
	};

	public statusArr: Array<any> = [
		{
			code: 'complete',
			name: 'Complete',
			cssClass: 'badge badge-success'
		},
		{
			code: 'cancel',
			name: 'Cancel',
			cssClass: 'badge badge-danger'
		},
		{
			code: 'pending',
			name: 'Pending',
			cssClass: 'badge badge-primary'
		},
		{
			code: 'return',
			name: 'Return',
			cssClass: 'badge badge-warning'
		},
		{
			code: 'failed',
			name: 'Failed',
			cssClass: 'badge badge-danger'
		}
	];

	public paginationObj: any;

	constructor(
		private commonService: CommonService,
		private httpService: HttpRequestService,
		public datepipe: DatePipe,
		private excelService:ExcelService,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.getTransactions();
	}

	getTransactions() {
		window.scroll(0,0);
		this.ngxService.start();
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.searchParams.user_id = user.user.id;
					return this.httpService.setModule('orders').search(this.searchParams);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
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
			this.getTransactions();
		}
	}

	getNetPrice(item) {
		let price = 0.00;
		if (item) {
			price = (parseFloat(item.total_order_price) - parseFloat(item.total_discount_price));
		}
		return price;
	}

	_statusOrderSelection(record) {
		let selectedStatus = null;
		if (record) {
			selectedStatus = this.statusArr.find((el) => (el.code === record.order_status));
		}
		return selectedStatus;
	}

	_statusPaymentSelection(record) {
		let selectedStatus = null;
		if (record) {
			selectedStatus = this.statusArr.find((el) => (el.code === record.payment_status));
		}
		return selectedStatus;
	}

	getOrderStatusTest(record: any) {
		let status = '';

		const selectedStatus = this._statusOrderSelection(record);
		if (selectedStatus) {
			status = selectedStatus.name;
		}
		return status;
	}

	getOrderStatusClass(record: any) {
		let status = '';

		const selectedStatus = this._statusOrderSelection(record);
		if (selectedStatus) {
			status = selectedStatus.cssClass;
		}
		return status;
	}

	getPaymentStatusTest(record: any) {
		let status = '';

		const selectedStatus = this._statusPaymentSelection(record);
		if (selectedStatus) {
			status = selectedStatus.name;
		}
		return status;
	}

	getPaymentStatusClass(record: any) {
		let status = '';

		const selectedStatus = this._statusPaymentSelection(record);
		if (selectedStatus) {
			status = selectedStatus.cssClass;
		}
		return status;
	}
	// exportAsXLSX():void {
	// 	this.exceldata = this.records.map((element) => {
	// 		let orderInfo = {
	// 			orderId:'',
	// 			totalAmount:'',
	// 			discountAmount:'',
	// 			netAmount:'',
	// 			orderedOn:'',
	// 			paymentStatus:'',
	// 			orderStatus:'',
	// 		};
	// 		orderInfo.orderId = this.getUserID(element.id);
	// 		orderInfo.totalAmount = element.total_order_price;
	// 		orderInfo.discountAmount = element.total_discount_price;
	// 		orderInfo.netAmount = this.getNetPrice(element).toString();
	// 		orderInfo.orderedOn = this.datepipe.transform(element.ordered_on, 'yyyy-MM-dd');
	// 		orderInfo.paymentStatus = this.getPaymentStatusTest(element);
	// 		orderInfo.orderStatus = this.getOrderStatusTest(element);
	// 		return orderInfo;
	// 	  });
	// 	this.excelService.exportAsExcelFile(this.exceldata, 'orderInfo');
	// }
	getUserID(id){
		return environment.orderIdPrefix + id;
	}
}

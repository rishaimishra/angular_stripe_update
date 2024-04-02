import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
	selector: 'app-transaction-details',
	templateUrl: './transaction-details.component.html',
	styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {

	public orderDetails: any;

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

	constructor(
		public router: Router,
		public route: ActivatedRoute,
		public commonService: CommonService,
		public httpService: HttpRequestService,
		private ngxService: NgxUiLoaderService,
		private _location: Location,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.getOrderDetails();
	}

	backClicked() {
		this._location.back();
	}

	getOrderDetails() {
		window.scroll(0,0);
		this.ngxService.start();
		this.route.params.pipe(
			mergeMap((params) => {
				return this.httpService.setModule('orders').findOne(params.id);
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				if (Object.keys(response.data).length > 0) {
					this.orderDetails = response.data;
				}
				// console.log(response);
			}
		}, (error) => {
			this.ngxService.stop();
			if (error) {
				this.commonService.showErrors(error);
			}
		});
	}


	public patmentStatus: any = {
		complete: ['complete', 'cancel', 'return'],
		pending: ['failed', 'pending']
	};
	getOrderID(id){
		return environment.orderIdPrefix + id;
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
			//selectedStatus = this.statusArr.find((el) => (el.code === record.payment_status));
			if (this.patmentStatus.complete.indexOf(record.order_status) >= 0) {
				selectedStatus = this.statusArr.find((el) => (el.code === 'complete'));
			} else {
				selectedStatus = this.statusArr.find((el) => (el.code === 'pending'));
			}
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

	getPaymentStatusText(record: any) {
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

	/**
	 * Function to get image url for an item (eg. Course, Event Ticket, or Product)
	 * @param item any
	 */
	getImage(item) {
		let imgUrl = '';
		if (item) {
			if (item.productable_type === 'courses') {
				imgUrl = item.product_details.images.thumbnail || '';
			} else if (item.productable_type === 'products') {
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

	getCybersourcePaymentStatus(record: any) {
		let price: any = 'Pending';
		if (record.order_payments.length > 0) {
			record.order_payments.forEach(function (element) {
				if (element.price_type == 'UDS' && element.payment_status == 'complete') {
					price = 'Complete';
				}
			});
		} 
		// console.log(price)
		return false;
		return price;
		
	}

	getCybersourcePaymentStatusClass(record: any) {
		let price: any = 'badge badge-primary';
		if (record.order_payments.length > 0) {
			record.order_payments.forEach(function (element) {
				if (element.price_type == 'UDS' && element.payment_status == 'complete') {
					price = 'badge badge-success';
				}
			});
		}
		return price;
	}


}

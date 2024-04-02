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
  selector: 'app-vendors-order-details',
  templateUrl: './vendors-order-details.component.html',
  styleUrls: ['./vendors-order-details.component.scss']
})
export class VendorsOrderDetailsComponent implements OnInit {
	
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
	public orderId : any;
	public searchParams: any = {
		product_detail: true,
		order: true,
		vendor_id: null,
		id : null
	};

	public patmentStatus: any = {
		complete: ['complete', 'cancel', 'return'],
		pending: ['failed', 'pending']
	};

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
		this.orderId = this.route.snapshot.paramMap.get("id");
		// console.log(this.orderId);
		this.getOrderDetails();
	}

	backClicked() {
		this._location.back();
	}

	getOrderDetails() {
		this.ngxService.start();
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				this.searchParams.id = this.orderId;
				this.searchParams.vendor_id = user.user.id;
				let data = this.orderId + '?vendor_id=' + user.user.id;
				return this.httpService.setModule('orders').findOne(data);
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				if (Object.keys(response.data).length > 0) {
					this.orderDetails = response.data;
				}				
			}
		}, (error) => {
			this.ngxService.stop();
			if (error) {
				this.commonService.showErrors(error);
			}
		});
	}

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
			//console.log(record);
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

	getSXLPrice(record: any){
		let price:any = 0;
		if(record.order_details.length > 0)
		{
			record.order_details.forEach(function(element) {
				price = price + element.sub_total_sxl;
			});
		}
		return price;
	}

	getUSDPrice(record: any){
		let price:any = 0;		
		if(record.order_details.length > 0)
		{
			record.order_details.forEach(function(element) {
				price = price + element.total_usd;
			});
		}
		return price;
	}

	getDiscountPrice(record: any){
		let price:any = 0;
		if(record.order_details.length > 0)
		{
			record.order_details.forEach(function(element) {
				price = price + element.discount_usd;
			});
		}
		return price;
	}

}

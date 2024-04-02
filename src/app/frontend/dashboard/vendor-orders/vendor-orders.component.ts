import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import {ExcelService} from '../../../global/services/excel.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SeoServiceService }  from '../../../services/seo-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {  NgbDateStruct, NgbDateParserFormatter,NgbTimeStruct,NgbTimeAdapter,NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
@Component({
	selector: 'app-vendor-orders',
	templateUrl: './vendor-orders.component.html',
	styleUrls: ['./vendor-orders.component.scss'],
	
})
export class VendorOrdersComponent implements OnInit {

	public records: Array<any> = [];
	public exceldata: any = [];
	public searchParams: any = {
		// product_detail: true,
		// order: true,
		   vendor_id: null,
		// vendor_order_id: true,
		// order_by: '-id',
		// limit: this.httpService.vendorPerPage,
		// page: 1,
		// pagination:true,
		   type: 'vendor',
		 //  date_range:'7 Day',
		 start_date:moment().subtract(180, 'days').format('YYYY-MM-DD'),
		 end_date:moment().format('YYYY-MM-DD'),
	};
	
	public patmentStatus: any = {
		complete: ['complete', 'cancel', 'return'],
		pending: ['failed', 'pending']
	};
	public statusOptions: Array<any> = [
		{
			label: 'complete',
			value: 'complete',
		},
		{
			label: 'cancel',
			value: 'cancel',
		},
		{
			label: 'pending',
			value: 'pending',
		},
		{
			label: 'failed',
			value: 'failed',
		},

	];
	public rangeOptions: Array<any> = [
		{
		  label: '7 Days',
		  value: '7 Day',
		},
		{
		  label: '1 Month',
		  value: '1 Month',
		},
	  ];
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
	searchForm: FormGroup;
	public modifiedData = [];

	//minStartDate: NgbDateStruct =this.calender.getPrev(this.calender.getToday(),'d',180) ;
	minStartDate: NgbDateStruct =null ;
	maxStartDate: NgbDateStruct = this.calender.getToday();
	minEndDate: NgbDateStruct = this.calender.getPrev(this.calender.getToday(),'d',180) ;
	maxEndDate: NgbDateStruct =this.calender.getToday();
	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		private httpService: HttpRequestService,
		private excelService:ExcelService,
		public datepipe: DatePipe,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService,
		public ngDateFormatter: NgbDateParserFormatter,
		public calender: NgbCalendar
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.getTransactions();
		this.searchForm = this.fb.group({
			// date_range: ['7 Day'],
			start_date_show: [this.calender.getPrev(this.calender.getToday(), 'd', 180), Validators.required],
			start_date: [moment().subtract(180, 'days').format('YYYY-MM-DD'), Validators.required],
			end_date_show: [this.calender.getToday(), Validators.required],
			end_date: [moment().format('YYYY-MM-DD'), Validators.required],
		  });
	}

	getTransactions() {
	
		this.ngxService.start();
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.searchParams.vendor_id = user.user.id;
					return this.httpService.setModule('salesReport').search(this.searchParams);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			window.scroll(0,0);
			if (response) {
				//console.log(response.data);
				this.records = response.data;
				this.paginationObj = response.pagination;

				let modifiedArray = [];
				// let modifiedData = [];
				this.modifiedData =[];
				 let totalUsd = 0;
				 let totalSxl = 0;
				 let count = 0;
				 this.records.forEach((product)=>{
		
				  if(modifiedArray.some(el => el==product.order_id)){
					product.order_id = '';
					totalUsd = totalUsd+ parseInt(product.total_usd);
					totalSxl = totalSxl+ parseInt(product.total_sxl);
					this.modifiedData.push(product);
				  } else {
					if(count!=0){
					  let blankElement={id:0,total_usd:totalUsd, total_sxl:totalSxl };
					  this.modifiedData.push(blankElement);
					}
					modifiedArray.push(product.order_id);
					this.modifiedData.push(product);
					totalUsd=parseInt(product.total_usd);
					totalSxl=parseInt(product.total_sxl);
				  }
					count++;
				 });
				 let blankElement={id:0,total_usd:totalUsd, total_sxl:totalSxl }
				 this.modifiedData.push(blankElement);
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
			price = (parseFloat(item.order.total_order_price) - parseFloat(item.order.total_discount_price));
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
	exportAsXLSX():void {
		this.exceldata = this.modifiedData.map((element) => {
			let orderInfo = {
			  orderId: '',
			  purchesDate: '',
			  product:'',
			  eventDate: '',
			  quantity:'',
			  name: '',
			  customerEmailID: '',
			  mobile: '',
			  orderStatus: '',
			  paymentMethod: '',
			  discountAmount: '',
			  netAmount: '',
			  totalAmount: ''
	  
			};
			orderInfo.orderId = element.order_id? this.getOrderID(element.order_id) : '';
			orderInfo.purchesDate = element.created_at;
			orderInfo.product = element.productable_type=='courses' ? element.ctitle : element.ptitle;
			orderInfo.eventDate = element.event_date;
			orderInfo.quantity = element.quantity;
			orderInfo.name = element.user_name;
			orderInfo.customerEmailID = element.email;
			orderInfo.mobile = element.id!=0? `+${element.phone_code}-${element.mobile_no}` : '';
			orderInfo.orderStatus = element.order_status;
			orderInfo.paymentMethod = element.id!=0 ? element.payment_type : '';
			orderInfo.discountAmount =  element.id!=0 ? `${element.discount_usd} USD` : '';
			orderInfo.netAmount =  element.id!=0 ? `${element.sub_total_usd} USD + ${element.sub_total_sxl} SXL` :'';
			orderInfo.totalAmount =  `${element.total_usd} USD + ${element.total_sxl} SXL`;
			return orderInfo;
	  
		  });
		  this.excelService.exportAsExcelFile(this.exceldata, 'orderInfo');
	}
	getOrderID(id){
		return environment.orderIdPrefix + id;
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

	search() {
		const form_data = this.searchForm.value;
		this.searchParams.date_range = form_data['date_range'];
		// console.log(this.searchParams, 'Search Params');
		// console.log(form_data,'form data');
		this.getTransactions();
	}

	onStartDateSelection(date, dp) {
		//console.log(date,'Start Date Selection');
    this.minEndDate = date;
    this.maxEndDate = this.calender.getNext(date, 'd' , 180);
		const dateStr = this.ngDateFormatter.format(date);
     //console.log(dateStr);
    //this.calendar.getNext(NgbDate, 'd' , 180) ;
    

    const dtObj = new Date(dateStr);
    //console.log(dtObj);
		this.searchForm.patchValue({
			// start_date: dtObj.toISOString()
			start_date: moment(dtObj.toISOString()).format('YYYY-MM-DD')
	});
	this.searchForm.patchValue({
        end_date:'',
        end_date_show:''
      });
	this.searchParams.start_date = moment(dtObj.toISOString()).format('YYYY-MM-DD');
	this.searchParams.end_date = '';
		dp.close();
	}

	onEndDateSelection(date, dp) {
    // console.log('End Date Selection');
		// console.log(date);
    //this.maxStartDate = date;
    //this.minStartDate = this.calender.getPrev(date, 'd' , 180);


		const dateStr = this.ngDateFormatter.format(date);

		const dtObj = new Date(dateStr);
		this.searchForm.patchValue({
			// end_date: dtObj.toISOString()
			end_date: moment(dtObj.toISOString()).format('YYYY-MM-DD')
    });
    this.searchParams.end_date= moment(dtObj.toISOString()).format('YYYY-MM-DD');
		dp.close();
	}

	
}

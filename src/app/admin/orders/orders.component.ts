import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { HttpRequestService } from '../../services/http-request.service';
import { ExcelService } from '../../global/services/excel.service';
import { CommonService } from '../../global/services/common.service';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import {  NgbDateStruct, NgbDateParserFormatter,NgbTimeStruct,NgbTimeAdapter,NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { d } from '@angular/core/src/render3';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  // public firstTimeLoad = 1;
  public records: Array<any> = [];
  public exceldata: any = [];
  public searchParams: any = {
    // product_detail: true,
    // order: true,    
    // admin_order: true,
    // order_by: '-id',
    // limit: this.httpService.vendorPerPage,
    // page: 1,
    // pagination:true,
    //   date_range:'7 Day',
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

  //minStartDate: NgbDateStruct =this.calender.getPrev(this.calender.getToday(),'d',180) ;
  minStartDate: NgbDateStruct =null ;
	maxStartDate: NgbDateStruct = this.calender.getToday();
	minEndDate: NgbDateStruct = this.calender.getPrev(this.calender.getToday(),'d',180) ;
	maxEndDate: NgbDateStruct =this.calender.getToday();

  public paginationObj: any;
  searchForm: FormGroup;
  public modifiedData = [];
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private httpService: HttpRequestService,
    private excelService: ExcelService,
    public datepipe: DatePipe,
    private ngxService: NgxUiLoaderService,
    public ngDateFormatter: NgbDateParserFormatter,
    public calender: NgbCalendar,
    private toasterService: ToasterService
  ) { 

  
  }

  ngOnInit() {
    window.scroll(0, 0);
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
    window.scroll(0, 0);
    this.ngxService.start();
   // console.log(this.searchParams.start_date,'this.searchParams.start_date');
   // console.log(this.searchParams.end_date,'this.searchParams.end_date');
   
    // if(this.searchParams.start_date && this.searchParams.end_date){
    //   this.ngxService.stop();
    //     this.toasterService.pop('error','Both date must be selected.');
    // } else {
    this.httpService.getUserObservable().pipe(
      mergeMap((user) => {
        if (user) {
          //this.searchParams.vendor_id = user.user.id;
          // return this.httpService.setModule('orders').search(this.searchParams);
          return this.httpService.setModule('salesReport').search(this.searchParams);
        }
      })
    ).subscribe((response) => {
      this.ngxService.stop();
      if (response) {
        //  console.log(response.data);

        this.records = response.data;
        this.paginationObj = response.pagination;

        // let modifiedArray = [];
        // let modifyData = this.records.reduce(function (rv, x) {
        //   if (modifiedArray.length == 0) {
        //     modifiedArray[x.order_id] = [];
        //     modifiedArray[x.order_id].order_id = x.order_id;
        //     modifiedArray[x.order_id].elements.push(x);
        //     modifiedArray[x.order_id].sum = 0;
        //   } else {
        //     // console.log(Object.keys(a).some( key=> key == x.order_id));

        //     if (Object.keys(modifiedArray).some(key => key == x.order_id)) {
        //       modifiedArray[x.order_id].push(x);
        //     } else {
        //       modifiedArray[x.order_id] = [];
        //       modifiedArray[x.order_id].push(x);
        //     }
        //   }
        //   return modifiedArray;
        //   // (rv[x[x.order_id]] = rv[x[x.order_id]] || []).push(x);
        //   // return rv;
        // }, []);
        // console.log(modifyData, 'modifyData');

       

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
        // console.log(this.modifiedData, 'modifyData');

      }
    }, (error) => {
      this.ngxService.stop();
      this.commonService.showErrors(error);
    });
 // }
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
  exportAsXLSX(): void {
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
  getOrderID(id) {
    return environment.orderIdPrefix + id;
  }

  getSXLPrice(record: any) {
    let price: any = 0;
    if (record.order_details.length > 0) {
      record.order_details.forEach(function (element) {
        price = price + element.sub_total_sxl;
      });
    }
    return price;
  }

  getUSDPrice(record: any) {
    let price: any = 0;
    if (record.order_details.length > 0) {
      record.order_details.forEach(function (element) {
        price = price + element.total_usd;
      });
    }
    return price;
  }

  getDiscountPrice(record: any) {
    let price: any = 0;
    if (record.order_details.length > 0) {
      record.order_details.forEach(function (element) {
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
    // console.log(dateStr);
    //this.calendar.getNext(NgbDate, 'd' , 180) ;
    

    const dtObj = new Date(dateStr);
    //console.log(dtObj);
		this.searchForm.patchValue({
			// start_date: dtObj.toISOString()
      start_date: moment(dtObj.toISOString()).format('YYYY-MM-DD'),
    });
    // if(!this.firstTimeLoad){
      this.searchForm.patchValue({
        end_date:'',
        end_date_show:''
      });
      this.searchParams.start_date = moment(dtObj.toISOString()).format('YYYY-MM-DD');
      this.searchParams.end_date = '';
     // this.firstTimeLoad = 0;
    // }
   
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

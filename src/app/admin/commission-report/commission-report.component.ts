import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { HttpRequestService } from '../../services/http-request.service';
import {ExcelService} from '../../global/services/excel.service';
import { CommonService } from '../../global/services/common.service';
import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-commission-report',
  templateUrl: './commission-report.component.html',
  styleUrls: ['./commission-report.component.scss']
})
export class CommissionReportComponent implements OnInit {

  public records: Array<any> = [];
  public exceldata: any = [];
  public searchParams: any = {
    // pagination: true,
    // limit: this.httpService.adminPerPage,
    // page: 1
    search_date:moment().format("YYYY-MM"),
    vendor:true,
   
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
  public currentMonth:string ='05';
  public currentYear: any = 2019;
  public months: Array<any> = [
		{
			label: 'Jan',
			value: '01',
		},
		{
			label: 'Feb',
			value: '02',
    },
    {
			label: 'Mar',
			value: '03',
    },
    {
			label: 'Apr',
			value: '04',
    },
    {
			label: 'May',
			value: '05',
    },
    {
			label: 'June',
			value: '06',
    },
    {
			label: 'July',
			value: '07',
    },
    {
			label: 'Aug',
			value: '08',
    },
    {
			label: 'Sep',
			value: '09',
    },
    {
			label: 'Oct',
			value: '10',
    },
    {
			label: 'Nov',
			value: '11',
    },
    {
			label: 'Dec',
			value: '12',
		},

  ];
  public years: Array<any> =[
    {
			label: '2018',
			value: '2018',
    },
    {
			label: '2019',
			value: '2019',
    },
    {
			label: '2020',
			value: '2020',
    },
    {
			label: '2021',
			value: '2021',
		},
  ];
  public paginationObj: any;
  public userType: any;
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private httpService: HttpRequestService,
    private excelService: ExcelService,
    public datepipe: DatePipe,
    private ngxService: NgxUiLoaderService,
    protected activeRoute   : ActivatedRoute,
  ) {
    this.searchForm = this.fb.group({
			year: [ moment().format('YYYY')],
			month: [ moment().format('MM')],
		});
   }

  ngOnInit() {
    window.scroll(0,0);
    this.userType= this.activeRoute.snapshot.url[1].path;
    if(this.userType == 'tutor') {
      this.searchParams.vendor = true;
      this.searchParams.reseller = '';
    } else {
      this.searchParams.reseller = true;
      this.searchParams.vendor = '';
    }
    this.getCommissionReport();
  }
  search() {

		const form_data = this.searchForm.value;
		console.log(form_data);
		this.searchParams.search_date = form_data['year']+'-'+form_data['month'];
		this.getCommissionReport();
	}
  getCommissionReport() {
    window.scroll(0,0);
    this.ngxService.start();
    this.httpService.getUserObservable().pipe(
      mergeMap((user) => {
        if (user) {
          //this.searchParams.vendor_id = user.user.id;
          return this.httpService.setModule('commissionReport').search(this.searchParams);
        }
      })
    ).subscribe((response) => {
      this.ngxService.stop();
      if (response) {
        console.log(response.data);
        this.records = response.data;
        this.paginationObj = response.pagination;
      }
    }, (error) => {
      this.ngxService.stop();
      this.commonService.showErrors(error);
    });
  }
  getCommission(rs) {
    let commissionRate='';
    if(this.userType == 'tutor') {
     return  ((rs.total_usd * rs.vendor_commission_rate)/100 + ((rs.total_sxl * rs.sxl_to_usd_rate) * rs.vendor_commission_rate)/100) ;
    } else if(this.userType == 'reseller') {
      return  ((rs.total_usd * rs.reseller_commission_rate)/100 + ((rs.total_sxl * rs.sxl_to_usd_rate) * rs.reseller_commission_rate)/100) ;
    }
    
  }
  pagination(event) {
    if (event) {
      this.searchParams.page = event.page;
      this.getCommissionReport();
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
  exportTutorAsXLSX():void {
  	this.exceldata = this.records.map((element) => {
  		let orderInfo = {
  			tutorId:'',
  			tutorName:'',
  			month:'',
        NumberOfOrder:'',
        totalOrderPrice: '',
        commission: '',
  		};
  		orderInfo.tutorId = this.getVendorID(element.order_id);
  		orderInfo.tutorName = element.first_name + ' ' +element.last_name ;
  		orderInfo.month = element.month;
      orderInfo.NumberOfOrder = element.no_of_order;
      orderInfo.totalOrderPrice = element.total_order_price;
      orderInfo.commission = element.vendor_commission + 'USD';
  		return orderInfo;
  	  });
  	this.excelService.exportAsExcelFile(this.exceldata, 'orderInfo');
  }
  exportResellerAsXLSX():void {
    this.exceldata = this.records.map((element) => {
  		let orderInfo = {
  			resellerId:'',
  			resellerName:'',
        month:'',
        commissionRate:'',
        commission: '',
  		};
  		orderInfo.resellerId = this.getResellerID(element.order_id);
  		orderInfo.resellerName = element.first_name + ' ' +element.last_name ;
  		orderInfo.month = element.month;
      orderInfo.commissionRate = element.commission_amount_rate + '%';
      orderInfo.commission = ((element.commission_amount_rate * element.order_total_price)/100) + 'USD';
  		return orderInfo;
  	  });
  	this.excelService.exportAsExcelFile(this.exceldata, 'orderInfo');
  }
  getVendorID(id) {
    return environment.vendorIdPrefix + id;
  }
  getResellerID(id) {
    return environment.resellerIdPrefix + id;
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

  
}

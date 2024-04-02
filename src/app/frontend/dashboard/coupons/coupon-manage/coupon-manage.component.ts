import { Component, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar,NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from '../../../../services/http-request.service';
import { FormBuilder, Validators, FormGroup,FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { ToasterService } from 'angular2-toaster';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { environment as env } from '../../../../../environments/environment';
import { CommonService } from '../../../../global/services/common.service';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-coupon-manage',
  templateUrl: './coupon-manage.component.html',
  styleUrls: ['./coupon-manage.component.scss']
})
export class CouponManageComponent implements OnInit {
  hoveredDate: NgbDate;
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public couponAddForm: FormGroup;
  private toasterService: ToasterService;
  public user: any;
  public courseId: any;
  public coursePrice: any = 0;
  minStartDate: NgbDateStruct;
	maxStartDate: NgbDateStruct;
	minEndDate: NgbDateStruct;
  maxEndDate: NgbDateStruct;
  public courseUsdSxlRatio = env.courseUsdSxlRatio;
  
  constructor( toasterService: ToasterService,  private http: HttpRequestService, private fb: FormBuilder,public ngDateFormatter: NgbDateParserFormatter,
    private router: Router, private ngxService: NgxUiLoaderService,public datepipe: DatePipe,calendar: NgbCalendar, public commonService: CommonService, public SeoService:SeoServiceService, 	protected activeRoute   : ActivatedRoute,) {
      this.toasterService = toasterService;
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    this.minStartDate = calendar.getToday();
    this.minEndDate = calendar.getToday();
   }

   ngOnInit() {
    window.scrollTo(0, 0);
    this.SeoService.getMetaInfo();
    this.user = this.http.getUser();
    const route_params = this.activeRoute.snapshot.params;
    this.courseId = route_params.id;
    this.getCourseDetails();
    this.couponAddForm = this.fb.group({
      coupon_code: ['', Validators.required],
      discount_mode: ['fixed', Validators.required],
      discount_value: ['', Validators.required],
   //   max_discount: ['', Validators.required],
      use_per_user: ['', [Validators.required, Validators.min(1)]],
      max_use: ['', [Validators.required,Validators.min(1)]],
    }); 
  }
  getCourseDetails() {
    this.http.get(`course/${this.courseId}?fetch_price=true`).subscribe((response) => {
      if (response['status'] === 'success') {
        // console.log(response,'cp');
        this.coursePrice = response['data'].pricable[0].total_price;
      }
    }, (errors) => {
      // console.log(errors);
      this.commonService.showErrors(errors);
     });
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  


  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  
  checkDiscountValue(event: any) {
    //  console.log(this.couponAddForm.value.discount_mode);
      const pattern = /[0-9\+\-\ ]/;
  
      const inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode !== 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      } else {
        const val = this.couponAddForm.value.discount_value + event.key;
       // console.log(val);
        if (this.couponAddForm.value.discount_mode === 'fixed') {
          if (val > this.coursePrice * env.courseUsdSxlRatio) {
            event.preventDefault();
          }
        } else if (this.couponAddForm.value.discount_mode === 'percentage') {
          if (val > 100) {
            event.preventDefault();
          }
        }
      }
    }

    usePerCode (event: any) {
      // console.log(event.charCode);
      this.couponAddForm.get('max_use').setValue('');
      const pattern = /[0-9\+\-\ ]/;
      const inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode !== 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      } 
     
    }
    maxUseCheck (event: any) {
      const pattern = /[0-9\+\-\ ]/;
  
      const inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode !== 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      } else {
        const val = this.couponAddForm.value.max_use + event.key;
   
          if (val > parseInt(this.couponAddForm.value.use_per_user) ) {
         
            event.preventDefault();
          }
        
      }
    }

  

  addCoupon() {
   
    if (this.couponAddForm.valid) {
      window.scrollTo(0,0);
      let fromMonth;
      let fromDay;
      let toMonth;
      let toDay;
       this.ngxService.start();
      const form_data = this.couponAddForm.value;
      form_data['max_discount']=0;
      if(this.fromDate.month <10){
        fromMonth = `0${this.fromDate.month}`;
      } else {
        fromMonth = `${this.fromDate.month}`;
      }

      if(this.fromDate.day <10){
        fromDay =`0${this.fromDate.day}`;
      } else {
        fromDay =`${this.fromDate.day}`;
      }

      if(this.toDate.month <10){
        toMonth =`0${this.toDate.month}`;
      }else {
        toMonth =`${this.toDate.month}`;
      }
      if(this.toDate.day <10){
        toDay =`0${this.toDate.day}`;
      }else {
        toDay =`${this.toDate.day}`;
      }

      form_data['started_on'] = `${this.fromDate.year}-${fromMonth}-${fromDay}`;
      form_data['ended_on'] = `${this.toDate.year}-${toMonth}-${toDay}`;
      // form_data['started_on'] = "2019-01-19";
      // form_data['ended_on'] = "2019-02-19";
      form_data['created_by'] =  this.user.id;
      form_data['course_id'] =  this.courseId;
      form_data['coupon_code'] = form_data['coupon_code'].toUpperCase( );
      this.http.post(`course-coupon`, form_data).subscribe((response) => {
        this.ngxService.stop();
        if (response['status'] === 'success') {
         
          this.router.navigate([`/dashboard/coupons/${this.courseId}`]);
          this.toasterService.pop('success', 'Created successfully');
        }

      }, (errors) => {
        // console.log(errors);
       this.ngxService.stop();
       this.commonService.showErrors(errors);
      });
    }
  }

}

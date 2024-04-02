import { Component, OnInit } from '@angular/core';
import {NgbDate, NgbCalendar,NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from '../../../../services/http-request.service';
import { FormBuilder, Validators, FormGroup,FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { ToasterService } from 'angular2-toaster';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { environment as env } from '../../../../../environments/environment';
import { CommonService } from '../../../../global/services/common.service';
import { SeoServiceService }  from '../../../../services/seo-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CouponEditModalComponent } from '../../../../common/coupon-edit-modal/coupon-edit-modal.component';

@Component({
  selector: 'app-price-and-coupons',
  templateUrl: './price-and-coupons.component.html',
  styleUrls: ['./price-and-coupons.component.scss']
})
export class PriceAndCouponsComponent implements OnInit {
  hoveredDate: NgbDate;

  public fromDate: NgbDate;
  public toDate: NgbDate;
  public priceForm: FormGroup;
  public categoryPrice: FormArray;
  public couponAddForm: FormGroup;
  public discountForm: FormGroup;
  public data: any;
  public successMsg: any;
  public errorMsg: any;
  public messages: any;
  public coupons: any = [];
  public discounts: any =[];
  public createCoupon: any = 1;
  public couponMessages: any;
  public errorCouponMsg: any;
  public user: any;
  public coursePrice: any = 0;
  private toasterService: ToasterService;
  public discountPrice: any = 1;
  public discountType: any;
  public isAfter: boolean;
  public selectedDiscountType:string;
  public isFree: boolean = true;
  // public discountCalender:NgbCalendar;
  // public discountStart: NgbDate;
  // public discountEnd: NgbDate;

  minStartDate: NgbDateStruct;
	maxStartDate: NgbDateStruct;
	minEndDate: NgbDateStruct;
	maxEndDate: NgbDateStruct;

  constructor( toasterService: ToasterService,  private http: HttpRequestService, private fb: FormBuilder,public ngDateFormatter: NgbDateParserFormatter,
    private myRoute: Router, private ngxService: NgxUiLoaderService,public datepipe: DatePipe,calendar: NgbCalendar, public commonService: CommonService, public SeoService:SeoServiceService, 	private modalService: NgbModal,) {
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
    this.getCourseDetails();
    this.getCoupons();
  //  this.getDiscountDetails();
    this.getDiscounts();
   
    // Old Price Code
    // this.priceForm = this.fb.group({
    //   currency: [{value: 'USD', disabled: true}, [Validators.required]],
    //   price: ['', [Validators.required,Validators.max(10000),]]
    // });

    // New Price Code

    this.priceForm = this.fb.group({
      pricable_id: [localStorage.getItem('courseEditId')],
      pricable_type: ['courses'],
      payment_type_id: [env.courseDefaultPaymentTypeId],
      total_price:['', [Validators.required,Validators.max(10000),Validators.min(10)]],
      categoryPrice: this.fb.array([ this.createItem() ]),
    });

    this.couponAddForm = this.fb.group({
      coupon_code: ['', Validators.required],
      discount_mode: ['fixed', Validators.required],
      discount_value: ['', Validators.required],
   //   max_discount: ['', Validators.required],
      use_per_user: ['', [Validators.required, Validators.min(1)]],
      max_use: ['', [Validators.required, Validators.min(1)]],
    }); 

    this.discountForm = this.fb.group({
    
      discount_mode: ['', Validators.required],
      discount: ['', Validators.required],
      start_date: [null,],
			started_on: [null, Validators.required],
			end_date: [null, ],
      ended_on: [null, Validators.required],
      is_expired:[0]
    });

  }

  createItem(): FormGroup {
    return this.fb.group({
    	'product_price_id':null,
			'payment_category_id':env.courseDefaultPaymentCategoryId,
			'quantity':1,
			'sxl_price':null,
			'usd_price':null
    });
  }

  addItem(): void {
    this.categoryPrice = this.priceForm.get('categoryPrice') as FormArray;
    this.categoryPrice.push(this.createItem());
  }

  getCourseDetails() {
    this.http.get(`course/${ localStorage.getItem('courseEditId')}?fetch_price=true`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.data = response['data'];
        this.priceForm.patchValue(this.data);
       // this.coursePrice = this.data.price;

        if(this.data.pricable.length>0) {
          this.isFree = false;
          this.coursePrice = this.data.pricable[0].total_price ;
          // console.log(this.coursePrice);
          this.priceForm.patchValue({
            total_price: this.data.pricable[0].total_price,
           
          });
        } else {
          this.coursePrice = 0;
          this.priceForm.patchValue({
            total_price: 0,
          });
        }
        
       // console.log(this.data);
        
      }
    }, (errors) => {
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }

  getCheckBoxValue(event) {
      this.isFree = event.target.checked;
      if(this.isFree && this.data.pricable.length>0) {
          this.ngxService.start();
          this.http.delete(`utility/product-price-free/${this.data.pricable[0].id}`).subscribe((response) => {
            this.ngxService.stop();
            if (response['status'] === 'success') {
              this.toasterService.pop('success', 'Updated successfully');
              this.getCourseDetails();
            }
    
          }, (errors) => {
           // console.log(errors);
           this.ngxService.stop();
            // this.messages = errors;
            // this.successMsg = '';
            // this.errorMsg = true;
            this.toasterService.pop('error', 'Error', errors.message);
          });
      }
	}

  getDiscountDetails () {
    this.http.get(`product-offer/${ localStorage.getItem('courseEditId')}?offer_type=courses&course_id=${ localStorage.getItem('courseEditId')}`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.data = response['data'];
        this.discountType=this.data.discount_mode;
        // console.log(this.data);
        // const today: moment.Moment = moment();
        // console.log(today);
        const discountEndDate: moment.Moment=  moment(this.data.ended_on);
       // console.log(discountEndDate);

        var isAfter = moment().isAfter(discountEndDate);
       //console.log(isAfter);

        if (this.data.started_on) {
					this.data.start_date = this.ngDateFormatter.parse(this.data.started_on);
					this.data.started_on = this.data.started_on;
					this.minStartDate = this.data.start_date;
					this.minEndDate = this.data.start_date;
				}

				if (this.data.ended_on) {
					this.data.end_date = this.ngDateFormatter.parse(this.data.ended_on);
					this.data.ended_on = this.data.ended_on;
					this.maxStartDate = this.data.end_date;
				}
        
        this.discountForm.patchValue(this.data);
        
      }
    }, (errors) => {
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }
  getDiscounts() {
    this.ngxService.start();
    this.http.get(`product-offer?course_id=${ localStorage.getItem('courseEditId')}&offer_type='courses'`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.discounts = response['data'];
        this.ngxService.stop();
       //  console.log(this.coupons);
      }
    }, (errors) => {
      this.ngxService.stop();
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }
  getCoupons() {
    this.ngxService.start();
    this.http.get(`course-coupon?course_id=${ localStorage.getItem('courseEditId')}`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.coupons = response['data'];
        this.ngxService.stop();
       //  console.log(this.coupons);
      }
    }, (errors) => {
      this.ngxService.stop();
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }

  public removeCoupon(id, index) {
    alert('Are you sure?');
		this.http.delete(`course-coupon/${id}`).subscribe((response)=>{
			if(response['status'] === 'success'){
        this.coupons.splice(index, 1);
        this.toasterService.pop('success', 'Deleted successfully');
        window.scrollTo(0,0);
			}
		});
	}


  onStartDateSelection(date: NgbDateStruct, dp) {
		// console.log(date);
		this.minEndDate = date;
		const dateStr = this.ngDateFormatter.format(date);

		const dtObj = new Date(dateStr);
		this.discountForm.patchValue({
			started_on: dtObj.toISOString()
		});
		dp.close();
	}

	onEndDateSelection(date: NgbDateStruct, dp) {
		// console.log(date);
		this.maxStartDate = date;
		const dateStr = this.ngDateFormatter.format(date);

		const dtObj = new Date(dateStr);
		this.discountForm.patchValue({
			ended_on: dtObj.toISOString()
		});
		dp.close();
  }

  // Old Price Code

  // updatePrice() {
  //   window.scrollTo(0,0);
  //   if (this.priceForm.valid) {
     
  //      this.ngxService.start();
  //     const form_data = this.priceForm.value;
  //     this.http.put(`course/${localStorage.getItem('courseEditId')}`, form_data).subscribe((response) => {
  //       this.ngxService.stop();
  //       if (response['status'] === 'success') {
  //         // this.messages = response['status'];
  //         // this.successMsg = 'Updated successfully';
  //         // this.errorMsg = false;
  //         this.coursePrice = form_data['price'];
  //         this.toasterService.pop('success', 'Updated successfully');
  //       }

  //     }, (errors) => {
  //      // console.log(errors);
  //      this.ngxService.stop();
  //       // this.messages = errors;
  //       // this.successMsg = '';
  //       // this.errorMsg = true;
  //       this.toasterService.pop('error', 'Error', errors.message);
  //     });
  //   }
  // }

  // New Price Code

  updatePrice() {
      window.scrollTo(0,0);
      if (this.priceForm.valid) {
       
         this.ngxService.start();
        const form_data = this.priceForm.value;
        if(this.data.pricable.length>0) {
          form_data.categoryPrice[0].product_price_id = this.data.pricable[0].id;
        } else {
          form_data.categoryPrice[0].product_price_id = null;
        }

        this.http.post(`utility/product-prices`, form_data).subscribe((response) => {
          this.ngxService.stop();
          if (response['status'] === 'success') {
            // this.messages = response['status'];
            // this.successMsg = 'Updated successfully';
            // this.errorMsg = false;
            this.getCourseDetails();
            this.coursePrice = form_data['total_price'];
            this.toasterService.pop('success', 'Updated successfully');
          }
  
        }, (errors) => {
         // console.log(errors);
         this.ngxService.stop();
          // this.messages = errors;
          // this.successMsg = '';
          // this.errorMsg = true;
          this.toasterService.pop('error', 'Error', errors.message);
        });
      }
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

  // onDiscountDateSelection(date: NgbDate) {
  //   console.log('kk');
  //   if (!this.discountStart && !this.discountEnd) {
  //     this.discountStart = date;
  //   } else if (this.discountStart && !this.discountEnd && date.after(this.discountStart)) {
  //     this.discountEnd = date;
  //   } else {
  //     this.discountEnd = null;
  //     this.discountStart = date;
  //   }
  // }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  couponCreate() {
    this.createCoupon = 0;
  }
  removeCouponCreate () {
    this.createCoupon = 1;
  }

  createDiscount() {
    this.discountPrice = 0;
  }
  removeDiscount () {
    this.discountPrice = 1;
  }


  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  resetDiscountValue () {
   
    this.couponAddForm.value.discount_value = '';
    this.couponAddForm.get('discount_value').setValue('');
    
  }

  resetDiscountPriceOption (event) {
   
    // console.log(this.discountForm.value.discount_mode);
    // console.log(event);
    this.discountForm.value.discount_mode=event.target.value;
    this.discountForm.value.discount = '';
    this.discountForm.get('discount').setValue('');
    this.resetDiscountValue = this.discountForm.value.discount_mode;
  }

  checkIntInput (event) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    } 
    // console.log(event);
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

  checkDiscountPrice(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    } else {
      const val = this.discountForm.value.discount + event.key;
    
      if (this.discountForm.value.discount_mode === 'fixed') {
     
        if (val > this.coursePrice) {
       
          event.preventDefault();
        }
      } else if (this.discountForm.value.discount_mode === 'percentage') {
        if (val > 100) {
          event.preventDefault();
        }
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
      form_data['course_id'] =  localStorage.getItem('courseEditId');
      form_data['coupon_code'] = form_data['coupon_code'].toUpperCase( );
      this.http.post(`course-coupon`, form_data).subscribe((response) => {
        this.ngxService.stop();
        if (response['status'] === 'success') {
          this.createCoupon = 1;
         // this.errorCouponMsg = false;
          const coupon = response['data'];
          this.coupons.push(coupon);
          this.couponAddForm.reset();
          this.couponAddForm.setValue(
            {
              'coupon_code':'',
              'discount_mode':'fixed',
              'discount_value':'',
              'use_per_user': '',
              'max_use': '',
            }
            );
          this.toasterService.pop('success', 'Created successfully');
        }

      }, (errors) => {
       // console.log(errors);
       this.ngxService.stop();
        // this.couponMessages = errors;
        // this.successMsg = '';
        // this.errorCouponMsg = true;
       // this.toasterService.pop('error', 'Error', errors.error.message);
       this.commonService.showErrors(errors);
      });
    }
  }

  addDiscount () {
   
    if (this.discountForm.valid) {
      window.scrollTo(0,0);
      const form_data = this.discountForm.value;


      let fromMonth;
      let fromDay;
      let toMonth;
      let toDay;
      this.ngxService.start();
     
    

      form_data['offerable_type'] = 'courses';
      form_data['offerable_id'] = localStorage.getItem('courseEditId');
      form_data['is_expired'] =0;

      form_data['started_on'] =this.datepipe.transform(form_data['started_on'], 'yyyy-MM-dd');
      form_data['ended_on'] =this.datepipe.transform(form_data['ended_on'], 'yyyy-MM-dd');
     
      //console.log(form_data);
      this.http.post(`product-offer`, form_data).subscribe((response) => {
        this.ngxService.stop();
        if (response['status'] === 'success') {
          this.discountPrice = 1;
         // this.errorCouponMsg = false;
          const discount = response['data'];
          this.discounts.push(discount);
          this.toasterService.pop('success', 'Created successfully');
          this.discountForm.reset();
        }

      }, (errors) => {
        // console.log(errors);
           this.ngxService.stop();
        // this.couponMessages = errors;
        // this.successMsg = '';
        // this.errorCouponMsg = true;
        this.toasterService.pop('error', 'Error', errors.error.message);
      });
    }
  }

  public discountRemove(id, index) {
    alert('Are you sure?');
		this.http.delete(`product-offer/${id}`).subscribe((response)=>{
			if(response['status'] === 'success'){
        this.discounts.splice(index, 1);
        this.toasterService.pop('success', 'Deleted successfully');
        window.scrollTo(0,0);
			}
		});
	}


  changeEndDateModal(couponId , currentEnddate, startDate) {
    const modalRef = this.modalService.open(CouponEditModalComponent);
		modalRef.componentInstance.couponId = couponId;
		modalRef.componentInstance.currentEnddate = currentEnddate;
		modalRef.componentInstance.startDate = startDate;
		modalRef.result.then((result) => {
			//console.log(result);
			//  this.myRoute.navigate(['/dashboard', 'course-promote-checkout']);
			this.getCoupons();
		}).catch((error) => {
				 //  console.log(error);
		});
  }
}

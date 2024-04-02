import { Component, OnInit ,Input} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    FormBuilder,
    Validators,
    FormGroup } from '@angular/forms';
import { HttpRequestService } from './../../services/http-request.service';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from './../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; 
import { Router } from '@angular/router';
import {NgbDate, NgbCalendar,NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-coupon-edit-modal',
  templateUrl: './coupon-edit-modal.component.html',
  styleUrls: ['./coupon-edit-modal.component.scss']
})
export class CouponEditModalComponent implements OnInit {

  @Input() couponId:number;
  @Input() currentEnddate:string;
  @Input() startDate:  string;

  couponEditForm: FormGroup;
  public messages: any = [];
  private toasterService: ToasterService;
  
	minEndDate: NgbDateStruct;
  endDate:any = '';
  public payAmount:number = 0;
  public formatedCurrentEndDate:NgbDateStruct;
  public formatedStartDate:NgbDateStruct;
  public updatedEndDate: string;

  constructor(
    toasterService: ToasterService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
    private calendar: NgbCalendar,
    public ngDateFormatter: NgbDateParserFormatter,
    public datepipe: DatePipe
  ) { 
    this.toasterService = toasterService;
  }

  ngOnInit() {
    this.formatedCurrentEndDate = this.ngDateFormatter.parse(this.currentEnddate);
    this.formatedStartDate =  this.ngDateFormatter.parse(this.startDate);

    this.couponEditForm = this.fb.group({
      end_date: [this.formatedCurrentEndDate, ],
			ended_on: [null, Validators.required],
    });

    let today=this.calendar.getToday();
    
    let isoCurrentDate = this.ngDateFormatter.format(today);
    let isoFormatedCurrentEndDate = this.ngDateFormatter.format(this.formatedCurrentEndDate);
    let isoFormatedStartDate = this.ngDateFormatter.format(this.formatedStartDate);

    //console.log(isoCurrentDate,'isoCurrentDate');
    //console.log(isoFormatedCurrentEndDate,'isoFormatedCurrentEndDate');
    //console.log(isoFormatedStartDate,'isoFormatedStartDate');

    if(moment(isoCurrentDate).isAfter(moment(isoFormatedCurrentEndDate))) {
      this.minEndDate = today;
    } else {
      this.minEndDate = this.formatedStartDate;
    }
  }


	onEndDateSelection(date: NgbDateStruct, dp) {
		const dateStr = this.ngDateFormatter.format(date);
    this.endDate = dateStr;
    
		const dtObj = new Date(dateStr);
		this.couponEditForm.patchValue({
			ended_on: dtObj.toISOString().substring(0, 10)
		});
		dp.close();
  }

  update () {
    if( this.couponEditForm.valid) {
      let formData = this.couponEditForm.value;
      this.updatedEndDate = formData['ended_on'];
      this.http.put(`course-coupon/${this.couponId}`, formData).subscribe((response) => {
        this.ngxService.stop();
        if (response['status'] === 'success') {
          this.activeModal.close(this.updatedEndDate);
          this.toasterService.pop('success', 'Updated successfully');
        }

      }, (errors) => {
        //console.log(errors);
       this.ngxService.stop();
       this.commonService.showErrors(errors);
      });
     
    }
  }
}

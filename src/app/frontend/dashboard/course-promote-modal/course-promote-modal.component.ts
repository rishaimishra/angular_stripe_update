import { Component, OnInit ,Input} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    FormBuilder,
    Validators,
    FormGroup } from '@angular/forms';
    import { HttpRequestService } from '../../../services/http-request.service';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; 
import { Router } from '@angular/router';
import {NgbDate, NgbCalendar,NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-course-promote-modal',
  templateUrl: './course-promote-modal.component.html',
  styleUrls: ['./course-promote-modal.component.scss']
})
export class CoursePromoteModalComponent implements OnInit {
  @Input() courseId:number;

  promoteForm: FormGroup;
  public messages: any = [];
  private toasterService: ToasterService;
  minStartDate: NgbDateStruct = this.calendar.getToday();
	maxStartDate: NgbDateStruct;
	minEndDate: NgbDateStruct = this.calendar.getToday();
  maxEndDate: NgbDateStruct;
  startDate:any = '';
  endDate:any = '';
  public payAmount:number = 0;
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

    this.promoteForm = this.fb.group({
      amount: ['', Validators.required],
      start_date: [null,],
			started_on: [null, Validators.required],
			end_date: [null, ],
			ended_on: [null, Validators.required],
    });
  }
  onStartDateSelection(date: NgbDateStruct, dp) {
		// console.log(date);
		this.minEndDate = date;
		const dateStr = this.ngDateFormatter.format(date);
    this.startDate = dateStr;
   
    if(this.endDate!=''){
      this.calculatePayment();
    }
		const dtObj = new Date(dateStr);
		this.promoteForm.patchValue({
			started_on: dtObj.toISOString()
		});
		dp.close();
	}

	onEndDateSelection(date: NgbDateStruct, dp) {
		this.maxStartDate = date;
		const dateStr = this.ngDateFormatter.format(date);
    this.endDate = dateStr;
    this.calculatePayment();
    
		const dtObj = new Date(dateStr);
		this.promoteForm.patchValue({
			ended_on: dtObj.toISOString()
		});
		dp.close();
  }

  calculatePayment() {
    let duration =  moment.duration(moment(this.endDate).diff(moment(this.startDate))).asDays() +1;
   // console.log(duration);
    this.payAmount=1 * duration;
    this.promoteForm.patchValue({amount:this.payAmount});
  }
  
  payment () {
 
    if( this.promoteForm.valid) {
      let formData = this.promoteForm.value;
      formData['courseId'] = this.courseId;
      localStorage.setItem('promoteInfo', JSON.stringify(formData));
      this.activeModal.close();
     
    }
  }
}

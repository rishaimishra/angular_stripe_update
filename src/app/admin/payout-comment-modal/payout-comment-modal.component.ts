import { Component, OnInit ,Input} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    FormBuilder,
    Validators,
    FormGroup } from '@angular/forms';
    import { HttpRequestService } from '../../services/http-request.service';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; 
import { Router } from '@angular/router';
import {NgbDate, NgbCalendar,NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-payout-comment-modal',
  templateUrl: './payout-comment-modal.component.html',
  styleUrls: ['./payout-comment-modal.component.scss']
})
export class PayoutCommentModalComponent implements OnInit {
  @Input() userId:number;
  @Input() walletId:number;
  @Input() amount:number;
  @Input() id:number;

  payoutForm: FormGroup;
  public messages: any = [];
  private toasterService: ToasterService;
  
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

    this.payoutForm = this.fb.group({
      id: [this.id],
      amount: [this.amount],
      user_id: [this.userId],
			wallet_id: [this.walletId],
			comments: [null, Validators.required],
    });
  }
 
  
  submit () {
    if( this.payoutForm.valid) {
      this.http.setModule('payoutTransactions').update(this.payoutForm.value).subscribe((response) => {
        if (response) {
          this.toasterService.pop('success', 'Status updated');
          this.activeModal.close(response);
       
        }
      }, (error) => {
        this.commonService.showErrors(error);
        this.activeModal.close(error);
      });
     
    }
  }

}

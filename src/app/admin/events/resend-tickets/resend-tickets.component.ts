import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidator } from '../../../common/validator';
import { EncrDecrService } from '../../../services/encr-decr.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../global/services/common.service';
import { ToasterService } from 'angular2-toaster';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment as env } from '../../../../environments/environment';
@Component({
  selector: 'app-resend-tickets',
  templateUrl: './resend-tickets.component.html',
  styleUrls: ['./resend-tickets.component.scss']
})
export class ResendTicketsComponent implements OnInit {

  public events = [];
  public users = [];
  resendTicketForm: FormGroup;
  public orderId:any;
  public attendeeId:any;
  public eventIdPrefix= env.eventIdPrefix;
  constructor(
    private formBuilder: FormBuilder,
    protected http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
    public router: Router,
		private commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.getEvents();
    this.resendTicketForm = this.formBuilder.group({
      event_id:[null, Validators.required],
      user_id:[null, Validators.required],
      order_id:[null],
      attendee_id:[null]
    });
  }
  public getEvents() {
    this.ngxService.start();
		this.http.get('utility/event-ticket-resend-details?event=true').subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.events = response['data'].map((el)=>{
          el.eventName= `${el.title} (${this.eventIdPrefix}${el.event_id})`;
          return el;
        });
       // console.log(this.events);
				window.scroll(0,0);
			}
		}, (errors) => {
			this.ngxService.stop();
      		this.commonService.showErrors(errors);
		});
  } 

  public getUser(event) {
    //console.log(event);
    // this.orderId=event.order_id;
    // this.attendeeId=event.id;
    if(event) {
      this.ngxService.start();
      this.http.get(`utility/event-ticket-resend-details?user=true&event_id=${event.event_id}`).subscribe((response) => {
        this.ngxService.stop();
        if (response['status'] === 'success') {
          this.users = response['data'].map((el)=>{
            el.userSearchText=`${el.first_name} ${el.last_name}(${el.user_name})`; 
            return el;
          });
         // console.log(this.users);
          window.scroll(0,0);
        }
      }, (errors) => {
        this.ngxService.stop();
            this.commonService.showErrors(errors);
      });
    }
  }

 public getOtherInfo(event){
    this.orderId=event.order_id;
    this.attendeeId=event.id;
 }

  public resendTicket(){
    this.resendTicketForm.value.order_id = this.orderId;
    this.resendTicketForm.value.attendee_id = this.attendeeId;
    //console.log(this.resendTicketForm.value);
    this.ngxService.start();
    if(this.resendTicketForm.valid){
      this.http.post('utility/resend-event-ticket', this.resendTicketForm.value).subscribe((response) => {
        if (response['status'] === 'success') {
          this.ngxService.stop();
          this.toasterService.pop('success','Submited Successfully');
          this.resendTicketForm.reset();
        }
      }, (errors) => {
        this.ngxService.stop();
        //console.log(errors);
        this.commonService.showErrors(errors);
      });
    }
  }


  
}

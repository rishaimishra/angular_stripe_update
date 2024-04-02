/*****************************************************
* event-attendee-info             
* Class name : EventAttendeeInfoComponent
* Author :     
* Created Date : 10-07-19
* Functionality : Attendee details update                   
* Purpose : Attendee details update by admin
****************************************************/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidator } from '../../common/validator';
import { EncrDecrService } from '../../services/encr-decr.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../global/services/common.service';
import { ToasterService } from 'angular2-toaster';
import { environment as env } from '../../../environments/environment';
import { HttpRequestService } from './../../services/http-request.service';
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-attendee-info',
  templateUrl: './event-attendee-info.component.html',
  styleUrls: ['./event-attendee-info.component.scss']
})
export class EventAttendeeInfoComponent implements OnInit {

  attendeeForm: FormGroup; // attendee form variable
  items: FormArray; // all items form array          
  public countries: Array<any> = []; // all countries form array
  public attendeeInfo: Array<any> =[]; // all attendee info array
  public curEvent: any;  // use for current event info. store
  public updateAttendeeStatus: boolean = false;
  /****************************************************  
  * Function name : constructor
  * Author :    
  * Created Date : 10-07-19                                
  * Purpose :  called first time before the ngOnInit() for initialization.
  * @Params :                                        
  ****************************************************/ 

  constructor( 
    private formBuilder: FormBuilder,
    private EncrDecr: EncrDecrService,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
		private commonService: CommonService,
    private router: Router,
    private httpService: HttpRequestService,
    private _location: Location) { }
  /****************************************************  
  * Function name : ngOnInit
  * Author :    
  * Created Date : 10-07-19                                
  * Purpose :  Initialize the directive/component after Angular first displays the data-bound                     properties and sets the directive/component's input properties.
  * @Params : -                                        
  ****************************************************/ 
  ngOnInit() {
     console.log(localStorage.getItem('curEvent'));
    this.curEvent = JSON.parse(localStorage.getItem('curEvent'));

    this.getCountries();
    this.getInfo();
    this.attendeeForm = this.formBuilder.group({
      ticket_quantity:this.curEvent.ticket_quantity,
	    ticket_sent_date: moment().format('YYYY-MM-DD'),
	    order_id:this.curEvent.order_id,
	    user_id:this.curEvent.user_id,
	    event_id:this.curEvent.event_id,
	    attendee_id:'',
      items: this.formBuilder.array([])
    },{
        validator: [
                    CustomValidator.duplicateEmail,
                  //  CustomValidator.duplicateName
                  ], // your validation method
    });
  }

  /****************************************************  
  * Function name : backClicked
  * Author :    
  * Created Date : 13-07-19                                
  * Purpose :  redirect to previous page 
  * @Params : -                                        
  ****************************************************/ 

  backClicked() {
    this._location.back();
  }
  /****************************************************  
  * Function name : getInfo
  * Author :    
  * Created Date : 10-07-19                                
  * Purpose :  Get attendee info  
  * @Params : -                                        
  ****************************************************/  
  getInfo() {
    this.httpService.get(`attendee-info?event_id=${this.curEvent.event_id}&user_id=${this.curEvent.user_id}&order_id=${this.curEvent.order_id}`).subscribe((response) => {
		  if (response['status'] === 'success') {
			this.attendeeInfo = response['data'];
      // console.log(this.attendeeInfo);
      if(moment(this.curEvent.ticket_sale_close_date).diff(moment(),'days') >=0){
        this.updateAttendeeStatus = true;
    }
          let index:number;
          for ( index=1; index<=this.curEvent.ticket_quantity; index++ ){
            this.addItem(this.attendeeInfo[0].attendee_details[index-1]);
          }
		  }
		}, (errors) => {
		  this.commonService.showErrors(errors);
    });
  }

 /****************************************************  
  * Function name : getCountries
  * Author :    
  * Created Date : 10-07-19                                
  * Purpose :  get Countries list 
  * @Params :                                         
  ****************************************************/ 

  getCountries() {
		this.httpService.setModule('country').search({}).subscribe((response) => {
			if (response) {
				if (response.data) {
          this.countries = response['data'].map((i) => { 
						i.label = '+'+i.phone_code + '(' + i.code + ')';
						i.image = 'assets/flag_png/'+i.code.toLowerCase()+'.png';
						 return i; });
          
				}
			}
		}, (error) => {
		//	console.log(error);
		});
  }

   /****************************************************  
  * Function name : createItem
  * Author :    
  * Created Date : 10-07-19                                
  * Purpose :  Create new instance of item 
  * @Params :   info                                      
  ****************************************************/ 

  createItem(info): FormGroup {
    // console.log(info);
    return this.formBuilder.group({
      first_name: [info.first_name, Validators.required],
      last_name: [info.last_name, Validators.required],
      email: [info.email? info.email : null,[Validators.required, CustomValidator.email]],
      country_id:[info.country_id, Validators.required],
      phone_code:[parseInt(info.phone_code), Validators.required],
      phone_number:[info.phone_number, Validators.required],
      id:[info.id],
    });
  }

  /****************************************************  
  * Function name : addItem
  * Author :    
  * Created Date : 10-07-19                                
  * Purpose :  Add a new item in form 
  * @Params :   info                                      
  ****************************************************/

  addItem(info): void {
    this.items = this.attendeeForm.get('items') as FormArray;
    this.items.push(this.createItem(info));
  }

  /****************************************************  
  * Function name : keyPress
  * Author :    
  * Created Date : 11-07-19                                
  * Purpose :  allow only number value
  * @Params :   event                                      
  ****************************************************/

  keyPress(event: any) {
		const pattern = /[0-9\+\-\ ]/;

		let inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode !== 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		}
  }

  /****************************************************  
  * Function name : onCountrySelect
  * Author :    
  * Created Date : 11-07-19                                
  * Purpose : on country select auto select the phone code 
              of that country
  * @Params :   event ,arrayIndex                                     
  ****************************************************/

  onCountrySelect(event, arrayIndex) {
    let fromArrayControl =<FormArray> this.attendeeForm.controls[`items`];
    let fromElementControl = <FormGroup> fromArrayControl.controls[`${arrayIndex}`];
    // console.log(fromElementControl.get('phone_code'));
    fromElementControl.controls['phone_code'].setValue(event.phone_code);
    
  }

  /****************************************************  
  * Function name : saveInfo
  * Author :    
  * Created Date : 11-07-19                                
  * Purpose :  save sttendee info
  * @Params : -                                    
  ****************************************************/
  saveInfo() {
    if(this.attendeeForm.valid){
      this.attendeeForm.value.attendee_id= this.attendeeInfo[0].id;
      this.attendeeForm.value.is_admin = true;
      // this.attendeeForm.value.ticket_sent_date = '2019-07-25';
      // console.log(this.attendeeForm.value);
      this.httpService.post('attendee-details', this.attendeeForm.value).subscribe((response) => {
        if (response['status'] === 'success') {
         this.toasterService.pop('success','Submited Successfully');
        }
      }, (errors) => {
        //console.log(errors);
        this.commonService.showErrors(errors);
      });
    }
    
  }

}

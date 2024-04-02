
/*****************************************************
* event-attendee-info             
* Class name : EventAttendeeInfoComponent
* Author :  
* Created Date : 10-07-19
* Functionality : Attendee details update                   
* Purpose : Attendee details update 
****************************************************/


import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomValidator } from '../../../common/validator';
import { EncrDecrService } from '../../../services/encr-decr.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../global/services/common.service';
import { ToasterService } from 'angular2-toaster';
import { environment as env } from '../../../../environments/environment';
import { HttpRequestService } from './../../../services/http-request.service';
import * as moment from 'moment';
@Component({
  selector: 'app-event-attendee-info',
  templateUrl: './event-attendee-info.component.html',
  styleUrls: ['./event-attendee-info.component.scss']
})
export class EventAttendeeInfoComponent implements OnInit {
  attendeeForm: FormGroup; // attendee form variable
  items: FormArray; // all items form array
  ticketCategory: String; // story ticket category
  public countries: Array<any> = []; // all countries form array
  public dycryptedData:any; // store data taken from url and dycrypt it
  public attendeeInfo: Array<any> =[]; // all attendee info array
  public updateAttendeeStatus: boolean = false; //  use for check staus attendee                                                          details updated
  public ticket_quantity:any; // check ticket quantity

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
    ) { }

  /****************************************************  
  * Function name : ngOnInit
  * Author :    
  * Created Date : 10-07-19                                
  * Purpose :  Initialize the directive/component after Angular first displays the                   data-bound properties and sets the directive/component's input                        properties.
  * @Params : -                                        
  ****************************************************/  

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
		
      let dycrypted = JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(queryParams.token)));
      this.ticketCategory = dycrypted.ticket_category;
      // console.log(dycrypted,'dycrypted');
      // this.ticketSaleCloseDate = dycrypted.ticket_sale_close_date;
      //console.log(moment(dycrypted.ticket_sale_close_date).diff(moment(),'days'));
      if(moment(dycrypted.ticket_sale_close_date).diff(moment(),'days') >=0){
          this.updateAttendeeStatus = true;
      }

      this.dycryptedData = dycrypted;
      this.getCountries();
      this.getInfo();
    });
    

    this.attendeeForm = this.formBuilder.group({
      ticket_quantity:this.dycryptedData.ticket_quantity,
	    ticket_sent_date: moment().format('YYYY-MM-DD'),
	    order_id:this.dycryptedData.order_id,
	    user_id:this.dycryptedData.user_id,
	    event_id:this.dycryptedData.event_id,
	    attendee_id:'',
      items: this.formBuilder.array([])
    },{
        validator: [
                    CustomValidator.duplicateEmail,
                  //  CustomValidator.duplicateName
                  ], // your validation method
    });
    // let index:number;
    // for ( index=1; index<=this.dycryptedData.ticket_quantity; index++ ){
    //   this.addItem();
    // }
  }

  /****************************************************  
  * Function name : getInfo
  * Author :    
  * Created Date : 10-07-19                                
  * Purpose :  Get attendee info  
  * @Params : -                                        
  ****************************************************/  

  getInfo() {
    this.httpService.get(`attendee-info?event_id=${this.dycryptedData.event_id}&user_id=${this.dycryptedData.user_id}&order_id=${this.dycryptedData.order_id}`).subscribe((response) => {
		  if (response['status'] === 'success') {
        this.attendeeInfo = response['data'];
        // console.log(this.attendeeInfo);
        this.ticket_quantity = this.dycryptedData.ticket_quantity;
        let index:number;
        for ( index=1; index<=this.dycryptedData.ticket_quantity; index++ ){
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
  * Purpose :  on country select auto select the phone code 
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
  /****************************************************  
  * Function name : checkDisabled
  * Author :    
  * Created Date : 11-07-19                                
  * Purpose :  check current element index
  * @Params : i                                   
  ****************************************************/
  checkDisabled(i) {
    if(i==0) return true;
  }

}

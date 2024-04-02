/*****************************************************
* event-attendee            
* Class name : EventAttendeeComponent
* Author :     
* Created Date : 10-07-19
* Functionality : Event attendee list                  
* Purpose : Event attendee list
****************************************************/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { Router } from '@angular/router'
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment as env } from './../../../../environments/environment';
@Component({
  selector: 'app-event-attendee',
  templateUrl: './event-attendee.component.html',
  styleUrls: ['./event-attendee.component.scss']
})
export class EventAttendeeComponent implements OnInit {

  public error_messages: any = [];
	public success_messages: any = [];
	public users: any = [];
	public pagination: any = [];
	public limit: number = 15;
	public data: any = [];
	public queryParams: any = {};
	public notificationRecords: any= [];
	public env=env;
	/****************************************************  
	 * Function name : constructor
	 * Author :    
	 * Created Date : 10-07-19                                
	 * Purpose :  called first time before the ngOnInit() for initialization.
	 * @Params :                                        
	 ****************************************************/ 
	constructor(
		protected http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
    	public router: Router,
		private commonService: CommonService,
		private ngxService: NgxUiLoaderService,
	) { }
	/****************************************************  
	 * Function name : ngOnInit
	 * Author :    
	 * Created Date : 10-07-19                                
	 * Purpose :  Initialize the directive/component after Angular first displays the data-bound                     properties and sets the directive/component's input properties.
	 * @Params : -                                        
	 ****************************************************/
	ngOnInit() {
		window.scroll(0,0);
    	this.getNotificationRecords();
    	this.getAttendeeInfo();
  	}
	/****************************************************  
	 * Function name : getNotificationRecords
	 * Author :    
	 * Created Date : 10-07-19                                
	 * Purpose :  Get notification records  
	 * @Params : -                                        
	 ****************************************************/  
	getNotificationRecords() {
   
		this.http.get(`utility/lastest-dashboard-notifications/${this.http.getUser().id}?profile=true&user=true&role=${this.http.getUserRole()[0]}`).subscribe((response) => {
		  if (response['status'] === 'success') {
			this.notificationRecords = response['data'];

			localStorage.setItem('notificationRecords', JSON.stringify(this.notificationRecords));
			localStorage.setItem('notificationCount',this.notificationRecords.length);
			//console.log(this.notificationRecords);
		   // console.log(JSON.parse(localStorage.getItem('notificationRecords')));
		  }
		}, (errors) => {
		//  this.commonService.showErrors(errors);
		});
	  }
	/****************************************************  
	 * Function name : getAttendeeInfo
	 * Author :    
	 * Created Date : 10-07-19                                
	 * Purpose :  Get attendee info  
	 * @Params : page, limit                                         
	 ****************************************************/ 
	public getAttendeeInfo(page: number = 1, limit: number = 1) {
	
		this.ngxService.start();
		this.http.get('attendee-info').subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.data = response['data'];
				window.scroll(0,0);
			}
		}, (errors) => {
			this.ngxService.stop();
      		this.commonService.showErrors(errors);
		});
	}
	/****************************************************  
	 * Function name : eventAttendeeInfo
	 * Author :    
	 * Created Date : 10-07-19                                
	 * Purpose :  Redirect to specific attendee details page  
	 * @Params : item                                         
	 ****************************************************/ 
	public eventAttendeeInfo(item) {
		// console.log(item);
		 localStorage.setItem('curEvent',JSON.stringify({'event_id': item.event_id, 'order_id': item.order_id, 'user_id': item.user_id, 'ticket_quantity': item.attendee_details.length, 'payment_category': item.payment_category.title, 'ticket_sale_close_date':item.ticket_sent_date}));
		 this.router.navigate(['admin/event-attendee-info']);

	}

}

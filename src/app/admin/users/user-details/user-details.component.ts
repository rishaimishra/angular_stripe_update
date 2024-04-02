import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { $ } from 'protractor';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { environment } from '../../../../environments/environment';
@Component({
	selector: 'app-user-details',
	templateUrl: './user-details.component.html',	
	styleUrls: ['./user-details.component.css']
 
})
export class UserDetailsComponent implements OnInit {
	
	public pageTitle 			: '';
	public user_id				: number;	
	public userRole				: string;
	public userData				: any = [];
	public notificationRecords: any= [];
	public orders: any = [];
	constructor(
		protected http          : HttpRequestService,
		protected activeRoute   : ActivatedRoute,
		private render:Renderer	,
		private ngxService: NgxUiLoaderService,	
	){}

	ngOnInit() {
		window.scroll(0,0);
		let route_params = this.activeRoute.snapshot.params;
		this.user_id = route_params.id;
		this.userRole = route_params.userRole;
		this.getUserDetails();	
		this.getNotificationRecords();
	}
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
	public getUserDetails(){
		this.ngxService.start();
		let queryParams = {
			search_by     	:'user_id',
			user			: true,
			orders:false
		}
		if (this.userRole=='customer') {
			queryParams.orders=true;
		}
        this.http.get(`profile/${this.user_id}`,queryParams).subscribe((response)=>{
			// console.log(response);	
			this.ngxService.stop();	
            if(response['status'] == 'success'){               
				this.userData = response['data'];
				if (this.userRole=='customer') {
					if(this.userData.length > 0)
						this.orders = this.userData.user.order;	
				}			
            }
		}, (error) => {
			this.ngxService.stop();
		  })
	}

	getOrderID(id) {
		return environment.orderIdPrefix + id;
	  }
	
}
 
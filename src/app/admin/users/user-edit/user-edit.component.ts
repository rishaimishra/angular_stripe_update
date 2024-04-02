import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators , FormBuilder} from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import { UserCollection } from '../../../_collection/user.collection';
import { ProfileCollection } from '../../../_collection/profile.collection';
import { HttpRequestService } from '../../../services/http-request.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'] 
})
export class UserEditComponent implements OnInit {

	public error_messages 	: any = [];
	public user_id			: number;	
	public userData			: any = new UserCollection();
	public profileData		: any = new ProfileCollection();
	public userRole			: any = [];
	public notificationRecords: any= [];
  	constructor(
		protected http          : HttpRequestService,
		protected router        : Router,
		protected activeRoute   : ActivatedRoute,
		private ngxService: NgxUiLoaderService,	
	) {}

  	ngOnInit() {
		window.scroll(0,0);		
		this.getParames();	
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
	protected getParames = function(){
		let route_params = this.activeRoute.snapshot.params;
		this.user_id = route_params.id;		
		this.getUser();		
	}

	public getUser(){
		this.ngxService.start();
		this.http.get(`user/${this.user_id}`).subscribe((response)=>{
			this.ngxService.stop();			
			if(response['status'] === 'success'){
				this.userData = response['data'];
				this.userRole = response['data'].roles[0].name;
				this.getUserProfile();
			}			
		}, (error) => {
			this.ngxService.stop();
		  })
	}
	public getUserProfile(){
		let queryParams = {
			search_by     	:'user_id'
		}

		this.http.get(`profile/${this.user_id}`,queryParams).subscribe((response)=>{
			// console.log(response);			
			if(response['status'] === 'success'){
				this.profileData = response['data'];				
			}
			
		})
	}

	public updateUser(instance){		
		let form_data = instance.value;
		this.http.put(`user/${this.user_id}`,form_data).subscribe((response)=>{			
			if(response['status'] === 'success'){			
				this.updateProfile(instance);
			}
		},(errors)=>{
			this.error_messages = errors;
		});		
	}
	public updateProfile(instance){		
		let form_data = instance.value;
		form_data['user_id'] = this.user_id;
		form_data['social_links'] = '';
		form_data['country_id'] =1;
		form_data['state_id'] =101;
		form_data['city_id'] =351;		

		this.http.put(`profile/${this.user_id}?update_by=user_id`, form_data).subscribe((response) => {
			if(response['status'] === 'success'){
				this.router.navigate([`/admin/users/${this.userRole}`]);
			}
		},(errors)=>{
			this.error_messages = errors;
		});
	}
}

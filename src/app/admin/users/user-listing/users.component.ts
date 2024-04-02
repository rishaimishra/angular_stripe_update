import { Component, OnInit, Renderer  } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { ToasterService } from 'angular2-toaster';
import { bounceOutRight} from '../../../common/animation';
import { $ } from 'protractor';
import { environment } from '../../../../environments/environment';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',	
	styleUrls: ['./users.component.css'],
	animations: [bounceOutRight],
	
})
export class UserComponent implements OnInit {

	public error_messages 	: any = [];
	public success_messages : any = [];
	public data			: any = [];
    public pagination       : any = [];
	public limit            : number = 10;		
	public userIndicator 	: any = [];
	public user_id		: number = null;
	public pageTitle 		: ''; 
	public userType : string = '';
	public searchForm: FormGroup;
	public queryParams:any = {
		'profile': true,
	};
	public userRole: any;
	public notificationRecords: any= [];
	public kycStatusYes = '<i class="fa fa-unlock-alt" aria-hidden="true"></i>';
	public kycStatusNo = '<i class="fa fa-lock" aria-hidden="true"></i>';
	private toasterService: ToasterService;

	constructor(
		protected http          : HttpRequestService,
		protected activeRoute   : ActivatedRoute,
		private render:Renderer,
		protected router        : Router,
		private fb: FormBuilder,
		private commonService: CommonService,
		private ngxService: NgxUiLoaderService,
		toasterService: ToasterService,
	){
		this.toasterService = toasterService;
	} 


	ngOnInit() {
		window.scroll(0,0);
		this.searchForm = this.fb.group({
			string: [''],
		  });
		let userIndicator = this.activeRoute.snapshot.url[1].path;
		this.userType = userIndicator;
		this.userIndicator = userIndicator;
		this.getUser(userIndicator);
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

	public getUser(userIndicator){	
		window.scroll(0,0);	
    this.queryParams.role = userIndicator;
		this.ngxService.start();
		this.http.get('user',this.queryParams).subscribe(response =>{
			this.ngxService.stop();			
      if(response['status'] == 'success'){
				this.data      = response['data'];
				this.data.map((el) => {
					if(Object.keys(el.profile).length){
						el.user_name=el.profile.full_name;
					} else {
						el.user_name=el.user_name;
					}
					
				});		
				// console.log(this.data);		
				this.pageTitle =  userIndicator;  

				if(userIndicator == "vendor") {
					this.userRole= 'Tutor';
				} else if(userIndicator == "customer") {
					this.userRole= 'Consumer';
				} else {
					this.userRole= userIndicator;
				}
            }            
            
		}, (error) => {
			this.ngxService.stop();
		  })
	}

	public changeStatus(status,userid){
		this.success_messages = '';
		let data = {
            is_active     	:(status == 1 ) ? 0 : 1,
		}		
		
		this.user_id = userid;

		this.http.put(`user/${this.user_id}`,data).subscribe((response) => {
			if(response['status'] === 'success'){
				this.getUser(this.userIndicator);
				this.success_messages = 'You have successfully updated your user data!';
				this.toasterService.pop('success', 'Record updated successfully');
			}
		},(errors)=>{
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Try Sometime later');
		});
	}

	public changePassword(userId) {
		this.user_id = userId;
		this.router.navigate([`/admin/users/${this.user_id}/change-password`]);
	}

	getUserID(id , userType){ 
		if(userType == 'vendor') {
			return environment.vendorIdPrefix + id;
		} else if (userType == 'customer') {
			return environment.custmerIdPrefix + id;
		}  else if (userType == 'reseller') {
			return environment.resellerIdPrefix + id;
		}
		
	}
	search() {
		
		const form_data = this.searchForm.value;
		this.queryParams.string = form_data['string'];
		this.getUser(this.userIndicator);
	}


	public changeKYCStatus(currentValue, userId, index) {
		// console.log(statusType);
		
		// this.ngxService.start();
		let is_kyc;
		if (currentValue == 0) {
			is_kyc = '1';
		} else {
			is_kyc = '0';
		}
	//	console.log(currentValue,'before click');
		const formdata ={ 
			is_kyc: is_kyc,
			ids:[
				{
				id: userId,
				}
			]
};
		this.http.post(`utility/kyc-approved`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {

			//	this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].is_featured = updateData.is_featured;

				this.data.find(function (element) {
					if (element.id === userId) {
						// console.log(is_kyc,'after click');
						element.is_kyc = is_kyc;
					}
				});
				this.toasterService.pop('success', 'Record updated successfully');
			}
		}, (errors) => {
		//	this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Try Sometime later');
		});
	}
	public goToTop() {
		window.scroll(0,0);
	}
}

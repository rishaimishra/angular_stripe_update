import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
@Component({
	selector: 'app-dashboard-header',
	templateUrl: './dashboard-header.component.html',
	styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {
	public name: any = [];
	public userDetails: any = [];
	public nameExists: any = [];
	public notificationShowstatus: Boolean =false;
	public  dashboardShowstatus:Boolean =false;
	public userProfileImage: any = [];
	public userHeadLine: any = [];
	public userName: any = [];
	public notificationRecords: any = [];
	public notificationParams: any = {};
	public notificationCounts: any = '';


	public showHideDashboardStatus:any = window.innerWidth > 991 ? 1 : 0 ;
	constructor(
		private http: HttpRequestService,
		private commonService: CommonService,
	) { }

  ngOnInit() {
  
    localStorage.setItem('notificationRecords', null);
    this.userDetails = this.http.getUser();
  
    this.notificationParams = {
      profile:true,
      user:true,
      role:this.http.getUserRole()[0]
    }

		this.notificationParams = {
			profile: true,
			user: true,
			role: this.http.getUserRole()[0]
		}

		this.nameExists = (this.userDetails.profile.first_name === undefined) ? this.getUserName() : this.userDetails.profile.full_name;

		this.userProfileImage = (localStorage.getItem('profileImage') != null) ? localStorage.getItem('profileImage') : this.userDetails.avatar;

		this.userHeadLine = (localStorage.getItem('profileDetail') != null) ? JSON.parse(localStorage.getItem('profileDetail')).head_line : this.userDetails.profile.head_line;

    this.userName = (localStorage.getItem('profileDetail') != null) ? JSON.parse(localStorage.getItem('profileDetail')).first_name + ' ' + JSON.parse(localStorage.getItem('profileDetail')).last_name : this.nameExists;
    
    this.getNotificationRecords();
   
		localStorage.setItem('showHideDashboardStatus',this.showHideDashboardStatus);


	}

	getNotificationRecords() {
		this.http.get(`utility/lastest-dashboard-notifications/${this.userDetails.id}?profile=true&user=true&role=${this.http.getUserRole()[0]}`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.notificationRecords = response['data'];

			localStorage.setItem('notificationRecords', JSON.stringify(this.notificationRecords));
			localStorage.setItem('notificationCount',this.notificationRecords.length);
			// console.log(this.notificationRecords);
		  // console.log(JSON.parse(localStorage.getItem('notificationRecords')));
		  }
		}, (errors) => {
			this.commonService.showErrors(errors);
		});
	}

	get userFullName() {
		return localStorage.getItem('name');
	}

	get notificationCount() {

		this.notificationCounts = parseInt(localStorage.getItem('notificationCount'));
	
		return this.notificationCounts;
	}
	get notificationRecordInHeader() {

		this.notificationRecords = JSON.parse(localStorage.getItem('notificationRecords'));
		return this.notificationRecords;
	}

	logOut() {
		this.http.doLogout();
	}

	public getUserName() {
		const userName = localStorage.getItem('name').split('@');
		if (userName.length > 0) {
			return userName[0]
		}
		else {
			return userName;
		}
	}

	notificationClickEvent() {
		if(!this.notificationShowstatus && this.dashboardShowstatus) {
		  this.dashboardShowstatus = !this.dashboardShowstatus;
		}
			
			this.notificationShowstatus = !this.notificationShowstatus;
	}
	dashboardClickEvent() {
		if(!this.dashboardShowstatus && this.notificationShowstatus) {
		  this.notificationShowstatus = !this.notificationShowstatus;
		}
			this.dashboardShowstatus = !this.dashboardShowstatus;
			
	}


	showHideDashboard(){
		//alert("qq");
		if(this.showHideDashboardStatus ==0) {
			this.showHideDashboardStatus =1 ;
		} else {
			this.showHideDashboardStatus =0 ;
		};
		localStorage.setItem('showHideDashboardStatus',this.showHideDashboardStatus);

	}
}

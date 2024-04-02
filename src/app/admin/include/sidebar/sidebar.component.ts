import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HttpRequestService } from '../../../services/http-request.service';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../global/services/common.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit { 
  public notificationRecords: any= [];
  public userDetails; any = [];
  constructor(
    private modalService: NgbModal, 
    private http: HttpRequestService,
		private router: Router,
		private commonService: CommonService,
		protected activeRoute: ActivatedRoute,
		) { }
		public currentRoute : string ;

  ngOnInit() {

    localStorage.setItem('notificationRecords', null);
		this.userDetails = this.http.getUser();
		
  } 

  get showHideDashboardadmin() {
	return localStorage.getItem('showHideDashboardStatusadmin');
	}
  changeRoute(path) {
	if(window.innerWidth < 991) {
		// console.log(this.activeRoute);
		let showHideDashboardStatusadmin;
		if(localStorage.getItem('showHideDashboardStatusadmin') =='0') {
			showHideDashboardStatusadmin =1 ;
		} else {
			showHideDashboardStatusadmin =0 ;
		};
		localStorage.setItem('showHideDashboardStatusadmin',showHideDashboardStatusadmin);
	}
    this.getNotificationRecords();
	this.router.navigate([path]);
  }

  changeDashBoardStatus() {
	 if(window.innerWidth < 991) {
		let showHideDashboardStatusadmin;
			if(localStorage.getItem('showHideDashboardStatusadmin') =='0') {
				showHideDashboardStatusadmin =1 ;
			} else {
				showHideDashboardStatusadmin =0 ;
			};
			localStorage.setItem('showHideDashboardStatusadmin',showHideDashboardStatusadmin);
	}
  }

  getNotificationRecords() {
   
		this.http.get(`utility/lastest-dashboard-notifications/${this.userDetails.id}?profile=true&user=true&role=${this.http.getUserRole()[0]}`).subscribe((response) => {
		  if (response['status'] === 'success') {
			this.notificationRecords = response['data'];

			localStorage.setItem('notificationRecords', JSON.stringify(this.notificationRecords));
			localStorage.setItem('notificationCount',this.notificationRecords.length);
			//console.log(this.notificationRecords);
		   // console.log(JSON.parse(localStorage.getItem('notificationRecords')));
		  }
		}, (errors) => {
		  this.commonService.showErrors(errors);
		});
	  }

	
}
 
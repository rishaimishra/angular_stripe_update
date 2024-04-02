import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';
@Component({
  selector: 'app-admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  name: string;
  // userRole: string;
  public userDetails: any = [];
 // public notificationRecords: any = [];
  public notificationParams: any = {};
  public notificationCounts:any='';

  public notificationRecords: any = [];
  public notificationShowstatus: Boolean =false;
  public  dashboardShowstatus:Boolean =false;
  
  public showHideDashboardStatusadmin:any = window.innerWidth > 991 ? 1 : 0 ;

  constructor(
    private commonService: CommonService,
    private modalService: NgbModal, 
    private http: HttpRequestService
    ) { 
      localStorage.setItem('adminNotificationCount','');
    }

  ngOnInit() {
    localStorage.setItem('notificationRecords', null);
    this.name = localStorage.getItem('name');
    this.userDetails = this.http.getUser();
    this.notificationParams = {
      profile:true,
      user:true,
      role:this.http.getUserRole()[0]
    }
    this.getNotificationRecords();


    localStorage.setItem('showHideDashboardStatusadmin',this.showHideDashboardStatusadmin);
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

  get notificationCount() {
   
    this.notificationCounts=parseInt(localStorage.getItem('notificationCount'));
    return this.notificationCounts;
  }
  get notificationRecordInHeader() {
  
    this.notificationRecords=JSON.parse(localStorage.getItem('notificationRecords'));
   // console.log(this.notificationRecords);
    return this.notificationRecords;
  }

  logOut() {
    this.http.doLogout();
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
  
  showHideDashboardadmin(){
		//alert("qq");
		if(this.showHideDashboardStatusadmin ==0) {
			this.showHideDashboardStatusadmin =1 ;
		} else {
			this.showHideDashboardStatusadmin =0 ;
		};
		localStorage.setItem('showHideDashboardStatusadmin',this.showHideDashboardStatusadmin);

	}

}

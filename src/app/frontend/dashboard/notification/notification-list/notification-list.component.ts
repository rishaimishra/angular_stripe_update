import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpRequestService } from '../../../../services/http-request.service';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  public error_messages: any = [];
  public user: any;
  public pagination: any = [];
  public limit: Number = 10;
  public data: any = [];
  private toasterService: ToasterService;
  
  
  constructor(
    toasterService: ToasterService,
    protected http: HttpRequestService,
    protected activeRoute: ActivatedRoute,
    private render: Renderer,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
    public SeoService:SeoServiceService
  ) { 
    this.toasterService = toasterService;
  }

  ngOnInit() {
    window.scroll(0,0);
    this.SeoService.getMetaInfo();
    this.user = this.http.getUser();
    
    // console.log(this.http.getUser().profile);

    this.activeRoute.queryParams.subscribe((response) => {
    const page = response.page ? response.page : 1;
    if( Object.keys(this.http.getUser().profile).length != 0) {
      this.getNotifications(page);
      this.notifyViewUpdate();
    }
   
   
    });
  }

  public getNotifications(page: number= 1, limit: number = 1) {
    window.scroll(0,0);
    this.ngxService.start();
    this.http.get(`notification/list?role=${this.http.getUserRole()[0]}&userId=${this.user.id}`).subscribe((response) => {
      this.ngxService.stop();
      if (response['status'] === 'success') {
        this.data = response['data'];
        //console.log(this.data);
        let count = '0';
        localStorage.setItem('notificationCount', count);
        localStorage.setItem('notificationRecords', null);
      }
    }, (errors) => {
      this.ngxService.stop();
      this.error_messages = errors;
    });

    
    
  }
  
  public notifyViewUpdate() {

    this.http.get(`utility/notifiy-view-date/${this.user.id}`).subscribe((response) => {
      if (response['status'] === 'success') {
        
      }
    }, (errors) => {
      this.error_messages = errors;
    });
  }
  public goToTop() {
		window.scroll(0,0);
	}

}

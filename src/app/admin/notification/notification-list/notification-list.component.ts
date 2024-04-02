import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { bounceOutRight} from '../../../common/animation';
import { $ } from 'protractor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import * as moment from 'moment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  public error_messages: any = [];
  public user: any;
  public limit: Number = 10;
  public data: any = [];
  private toasterService: ToasterService;
  public records: any= [];
  public searchParams: any = {
   
    pagination:true,
    limit:this.http.adminPerPage,
    page:1,
    userId:this.http.getUser().id
  };
  public paginationObj: any;
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    toasterService: ToasterService,
    protected http: HttpRequestService,
    protected activeRoute: ActivatedRoute,
    private render: Renderer,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
  ) { 
    this.toasterService = toasterService;
  }

  ngOnInit() {
    window.scroll(0,0);
    this.user = this.http.getUser();
    this.ngxService.start();

    this.activeRoute.queryParams.subscribe((response) => {
    const page = response.page ? response.page : 1;
    this.getNotificationRecords();
    this.ngxService.stop();
    });
    this.notifyViewUpdate();
    this.searchForm = this.fb.group({
			string: [''],
		  }); 
  }

 

  getNotificationRecords() {
    window.scroll(0,0);
    this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('notifications').list(this.searchParams);
				}
			})
		).subscribe((response) => {
			if (response) {
		
			
					this.records = response.data;
     
        let count = '0';
        localStorage.setItem('notificationCount', count);
        localStorage.setItem('notificationRecords', null);
        // console.log(this.records);
        this.paginationObj = response.pagination;
        // console.log( response.pagination.page);
       

			}
		}, (error) => {
			this.commonService.showErrors(error);
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

	pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getNotificationRecords();
		}
  }


  deleteRecord(id) {
		if (id) {
			if (confirm('Are you sure?')) {
				this.http.put(`notification/delete/${id}`,{}).subscribe((response) => {
          if (response['status'] === 'success') {
            this.toasterService.pop('success', ' Notification deleted');

						const idx = this.records.findIndex((el) => {
							return (el.id === id);
						});
						if (idx > -1) {
							this.records.splice(idx, 1);
						}
          }
      
        }, (error) => {
          this.toasterService.pop('success', 'Failed to delete notification');
        });
			}
		} else {
			this.toasterService.pop('error', 'Details is not available');
		}
	}

  search() {	
    const form_data = this.searchForm.value;
    this.searchParams.page = 1;
		this.searchParams.string = form_data['string'];
		this.getNotificationRecords();
	}

}

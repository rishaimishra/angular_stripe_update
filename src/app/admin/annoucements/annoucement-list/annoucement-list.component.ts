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
  selector: 'app-annoucement-list',
  templateUrl: './annoucement-list.component.html',
  styleUrls: ['./annoucement-list.component.scss']
})
export class AnnoucementListComponent implements OnInit {
 
  public error_messages: any = [];
  public user: any;
  public notificationRecords: any= [];
  public limit: Number = 10;
  private toasterService: ToasterService;
  public records: any= [];
  public searchParams: any = {
   
    pagination: true,
    limit: this.http.adminPerPage,
    page: 1,
    user: true
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
    this.getNotificationRecords();

    this.activeRoute.queryParams.subscribe((response) => {
    const page = response.page ? response.page : 1;
    this.getAnnoucementsRecords();
    
    });
    this.searchForm = this.fb.group({
			string: [''],
		  });
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
		  this.commonService.showErrors(errors);
		});
	  }


  getAnnoucementsRecords() {
    window.scroll(0,0);
    this.ngxService.start();
    this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('announcements').list(this.searchParams);
				}
			})
		).subscribe((response) => {
      this.ngxService.stop();
			if (response) {
					this.records = response.data;
        // console.log(this.records);
        this.paginationObj = response.pagination;
       // console.log( response.pagination.page);

			}
		}, (error) => {
      this.ngxService.stop();
			this.commonService.showErrors(error);
		});
  }

	pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getAnnoucementsRecords();
		}
  }

  search() {
		
    const form_data = this.searchForm.value;
    this.searchParams.page = 1;
		this.searchParams.string = form_data['string'];
		this.getAnnoucementsRecords();
	}
  
}

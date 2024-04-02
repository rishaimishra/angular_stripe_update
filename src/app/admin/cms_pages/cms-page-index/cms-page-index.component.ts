import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { bounceOutRight } from '../../../common/animation';
import { $ } from 'protractor';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-cms-page-index',
	templateUrl: './cms-page-index.component.html',
	styleUrls: ['./cms-page-index.component.css'],
	animations: [bounceOutRight]
})
export class CmsPageIndexComponent implements OnInit {

	public error_messages: any = [];
	public success_messages: any = [];
	public users: any = [];
	public pagination: any = [];
	public limit: number = 15;
	public data: any = [];
	public queryParams: any = {};
	searchForm: FormGroup;
	public notificationRecords: any= [];
	constructor(
		protected http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
		private render: Renderer,
		private fb: FormBuilder,
		private commonService: CommonService,
		private ngxService: NgxUiLoaderService,
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.searchForm = this.fb.group({
			string: [''],
		  });
		this.activeRoute.queryParams.subscribe((response) => {
			let page = response.page ? response.page : 1;
			this.getPages(page);
			this.success_messages = '';
		});
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
	  
	search() {
		
		const form_data = this.searchForm.value;
		this.queryParams.string = form_data['string'];
		this.getPages();
	}

	public getPages(page: number = 1, limit: number = 1) {
	
		this.ngxService.start();
		this.http.get('cms-page',this.queryParams).subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.data = response['data'];
				window.scroll(0,0);
			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
		});
	}

	public removePages(page_id, index) {
		this.http.delete(`cms-page/${page_id}`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.data.splice(index, 1);
			}
		});
	}

	public goToTop() {
		window.scroll(0,0);
	}


}

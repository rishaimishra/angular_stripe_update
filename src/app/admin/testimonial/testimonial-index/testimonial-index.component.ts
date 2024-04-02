import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-testimonial-index',
	templateUrl: './testimonial-index.component.html',
	styleUrls: ['./testimonial-index.component.scss']
})
export class TestimonialIndexComponent implements OnInit {

	public testimonial: any = [];
	public pagination: any = [];
	public limit: number = 10;
	public error_messages  = '';
	public success_messages	= '';
	searchForm: FormGroup;
	public queryParams: any = {};
	public notificationRecords: any= [];
	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		protected http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
		private ngxService: NgxUiLoaderService,
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.searchForm = this.fb.group({
			string: [''],
		  });
		this.activeRoute.queryParams.subscribe((response) => {
			const page = response.page ? response.page : 1;
			this.getTestimonial(page);
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
	public getTestimonial(page: number = 1, limit: number = 1) {
		window.scroll(0,0);
		this.queryParams.pagination = true;
		this.queryParams.limit = this.limit;
		this.queryParams.page = page;
		this.ngxService.start();
		this.http.get('testimonial', this.queryParams).subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.testimonial = response['data'];
				this.pagination = response['pagination'];
			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		  });
	}

	public removeTestimonial(page_id, index) {
		this.http.delete(`testimonial/${page_id}`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.testimonial.splice(index, 1);
			}
		});
	}
	search() {
		
		const form_data = this.searchForm.value;
		this.queryParams.string = form_data['string'];
		this.getTestimonial();
	}
}

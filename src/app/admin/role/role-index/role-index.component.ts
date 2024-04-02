import { Component, OnInit } from '@angular/core';
import {HttpRequestService} from '../../../services/http-request.service';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  	selector: 'app-role-index',
  	templateUrl: './role-index.component.html',
  	styleUrls: ['./role-index.component.css']
})
export class RoleIndexComponent implements OnInit {

	public data : any = [];
	public success_messages : any = [];
	public error_messages : any = [];
	public searchParams: any = {};
	searchForm: FormGroup;
	public notificationRecords: any= [];

  	constructor(
		private fb: FormBuilder,
		private commonService: CommonService,
		protected http:HttpRequestService,
		private ngxService: NgxUiLoaderService,
	){
	
	}

  	ngOnInit() {
		window.scroll(0,0);
		this.searchForm = this.fb.group({
			string: [''],
		  });
		this.getRoles();
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
	  
	public getRoles(){
		// this.http.get('role').subscribe(response=>{
		// 	if(response['status'] === 'success'){
		// 		this.data = response['data']
		// 	}
		// })
		window.scroll(0,0);
		this.ngxService.start();
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('roles').search(this.searchParams);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				this.data = response['data'];
				
			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}

	public removeRole(role_id,index){
		this.http.delete(`role/${role_id}`).subscribe((response)=>{
			if(response['status'] === 'success'){
				this.data.splice(index,1);
				this.commonService.showMessage({ type: 'success', title: '', message: 'Deleted Successfully' });
			}
		})
	}

	search() {
		
		const form_data = this.searchForm.value;
		this.searchParams.string = form_data['string'];
		this.getRoles();
	}

	public goToTop() {
		window.scroll(0,0);
	}

}

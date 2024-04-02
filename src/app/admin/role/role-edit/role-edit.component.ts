import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleCollection } from '../../../_collection/role.collection';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  	selector: 'app-role-edit',
  	templateUrl: './role-edit.component.html',
  	styleUrls: ['./role-edit.component.css']
})
export class RoleEditComponent implements OnInit {

	public error_messages 	: any = [];
	public role_id			: number;
	public permissions 		: any = [];
	public input_permissions: any = [];
	public formData			: any = new RoleCollection();
	public notificationRecords: any= [];
  	constructor(
		protected http          : HttpRequestService,
		protected router        : Router,
		protected activeRoute   : ActivatedRoute,
		private ngxService: NgxUiLoaderService,
  	){}

  	ngOnInit() {
		window.scroll(0,0);
		this.getParames();
		this.getPermissions();
		this.getRole();
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
  	protected getParames = function(){
		let route_params = this.activeRoute.snapshot.params;
		this.role_id = route_params.id;
	}
	  
	public getRole(){
		this.ngxService.start();
		this.http.get(`role/${this.role_id}`).subscribe(response=>{
			this.ngxService.stop();
			if(response['status'] == 'success'){
				this.formData 			= response['data'];
				let permissions 		= response['data']['permissions']
				this.input_permissions 	= permissions.map(p => p.id);
			}
		}, (error) => {
			this.ngxService.stop();
			
		})
	}
 
	public getPermissions(){
		this.http.get('auth/module/permissions').subscribe(response=>{
			if(response['status'] == 'success'){
				this.permissions = response['data'];
			}
		})
	}

	public saveRole(instance){
		let form_data = instance.value;
		form_data['permissions'] = this.input_permissions;

		this.http.put(`role/${this.role_id}`,form_data).subscribe((response)=>{
			if(response['status'] == 'success'){
				this.router.navigate(['/admin/role']);
			}
		},(errors)=>{
			this.error_messages = errors;
		})
	}

	public changePermission(event){

		let element 	= event.target;
		let is_checked 	= element.checked;
		let value 		= element.value;

		if(is_checked){
			this.input_permissions.push(parseInt(value));
		}else{
			let index = this.input_permissions.indexOf(parseInt(value));
			if(index >= 0){
				this.input_permissions.splice(index,1);
			}
		}
	}
}

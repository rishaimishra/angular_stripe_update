import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { StringToSlug } from '../../../pipe/string-slug.pipe';
import { RoleCollection } from '../../../_collection/role.collection';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  	selector: 'app-role-create',
  	templateUrl: './role-create.component.html',
	styleUrls: ['./role-create.component.css'],
	providers: [ StringToSlug ]
})
export class RoleCreateComponent implements OnInit {

	public error_messages 		: any = [];
	public permissions 			: any = [];
	public input_permissions	: any = [];
	public formData				: any = new RoleCollection();
	public notificationRecords: any= [];
	constructor(
		protected http          : HttpRequestService,
		protected router        : Router,
		protected strToSlug   	: StringToSlug,
		private ngxService: NgxUiLoaderService,
	){}

  	ngOnInit() {
		window.scroll(0,0);
		this.getPermissions();
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
	public getPermissions(){
		this.ngxService.start();
		this.http.get('auth/module/permissions').subscribe(response=>{
			this.ngxService.stop();
			if(response['status'] == 'success'){
				this.permissions = response['data'];

				//console.log(this.permissions)
			}
		}, (error) => {
			this.ngxService.stop();
		
		})
	}

	public saveRole(instance){
		let form_data = instance.value;
		form_data['name'] 		 = this.strToSlug.transform(form_data.display_name);
		form_data['permissions'] = this.input_permissions;
		
		this.http.post('role',form_data).subscribe((response)=>{
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

import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl, Validators , FormBuilder} from '@angular/forms';
import { Router,ActivatedRoute} from '@angular/router';
import { UpdatePasswordCollection } from '../../../_collection/update_password.collection';
import { HttpRequestService } from '../../../services/http-request.service'
import { PasswordValidation } from '../../../common/password-validation';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

	public error_messages 	: any = [];
	public success_messages : any = [];
	public user_id			: number;		
	public updatePasswordForm			: any = new UpdatePasswordCollection();
	public form_data : any = [];
	public notificationRecords: any= [];
	  
  	constructor(
		protected http          : HttpRequestService,
		protected router        : Router,
		protected fb: FormBuilder,
		private ngxService: NgxUiLoaderService,
		
	) {
		
		  

	}

  	ngOnInit() {
		window.scroll(0,0);
		this.ngxService.start();
		this.ngxService.stop();
		this.getNotificationRecords();
		this.updatePasswordForm = this.fb.group({
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required],
			oldPassword : [''],
		  }, {
			validator: PasswordValidation.MatchPassword // your validation method
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
		//  this.commonService.showErrors(errors);
		});
		}
	
	public updateUserPasswordForm(instance){
		
		const form_data = instance.value;			
		form_data['old_password'] = instance.value['oldPassword'];	
		form_data['new_password'] = instance.value['password'];	
		form_data['user_name'] = this.http.getUser('email');		

		this.http.post(`password/reset/profile`,form_data).subscribe((response)=>{			
			if(response['status'] === 'success'){
				this.error_messages = '';
				this.success_messages = 'Successfully updated your password!';
				this.updatePasswordForm.reset();
			}
		},(errors)=>{
			this.success_messages = '';
			this.error_messages = errors;
		})
	}

}

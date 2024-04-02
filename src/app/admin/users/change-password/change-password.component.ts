import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangePasswordCollection } from '../../../_collection/change_password.collection';
import { HttpRequestService } from '../../../services/http-request.service'
import { PasswordValidation } from '../../../common/password-validation';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.css']
})

export class UserChangePasswordComponent implements OnInit {

    public error_messages 	: any = [];
    public success_messages : any = [];
    public user_id			: number;		
    public userName     : any = [];
    public updatePasswordForm			: any = new ChangePasswordCollection();
    public form_data : any = [];
    public notificationRecords: any= [];

    constructor(
          protected http          : HttpRequestService,
          protected router        : Router,
          protected fb: FormBuilder,
          protected activeRoute   : ActivatedRoute,
          private ngxService: NgxUiLoaderService,
    ){
        this.updatePasswordForm = fb.group({
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      }, {
        validator: PasswordValidation.MatchPassword // your validation method
      })
     
    }
    
    ngOnInit() {
      window.scroll(0,0);
      let route_params = this.activeRoute.snapshot.params;
      this.user_id = route_params.id;
      this.ngxService.start();
      this.http.get(`user/${this.user_id}`).subscribe((response) => {
        if(response['status'] === 'success'){
            this.userName = response['data'];
        }
      });
      this.ngxService.stop();
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

	public updateUserPasswordForm(instance) {

		const form_data = instance.value;
		form_data['user_name'] = this.userName.user_name;

		this.http.post(`password/reset/force`, form_data).subscribe((response) => {
			if (response['status'] === 'success') {
				this.error_messages = '';
				this.success_messages = `You've successfully changed your password`;
				this.updatePasswordForm.reset();
			}
		}, (errors) => {
			this.success_messages = '';
			this.error_messages = errors;
		})
	}

}

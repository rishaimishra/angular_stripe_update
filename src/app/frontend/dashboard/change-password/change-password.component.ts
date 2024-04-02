import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CustomValidators } from 'ng2-validation';
import { CustomValidator } from '../../../common/validator';
import { ToasterService } from 'angular2-toaster';
import { SeoServiceService }  from '../../../services/seo-service.service';


@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
	email: string;
	user: any;
	changePasswordForm: FormGroup;
	successMsg: any;
	errorMsg: any;
	messages: any;
	submitted: boolean;
	private toasterService: ToasterService;

	constructor(private http: HttpRequestService, 
		private fb: FormBuilder,
		private myRoute: Router, 
		private ngxService: NgxUiLoaderService, 
		toasterService: ToasterService,
		public SeoService:SeoServiceService
		) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scrollTo(0, 0);
		this.SeoService.getMetaInfo();
		this.submitted = false;
		this.user = this.http.getUser();
		this.successMsg = false;
		this.errorMsg = false;
		this.getUserInfo();

		this.changePasswordForm = this.fb.group({
			// user_name: ['', [Validators.required]],
			old_password: ['', [Validators.required]],
			new_password: ['', [Validators.required]],
			retype_password: [''],
		}, {
				validator: CustomValidator.MatchPassword // your validation method
			});
	}

  getUserInfo(){
    this.ngxService.start();
    //console.log(this.user.user_name);
    // this.changePasswordForm.get('user_name').setValue(this.user.user_name);
    this.email=this.user.user_name;
    this.ngxService.stop();
  }


	changePasswordSubmit() {
		window.scrollTo(0, 0);
		this.submitted = true;
		if (this.changePasswordForm.valid) {
			// console.log(this.registrationForm.value);
			const form_data = this.changePasswordForm.value;
			form_data['user_name'] = this.user.user_name;
			this.ngxService.start();
			// console.log(form_data);
			this.http.post(`password/reset/profile`, form_data).subscribe((response) => {
				this.ngxService.stop();
				if (response['status'] === 'success') {
					// this.messages = response['status'];
					// this.successMsg = 'Updated successfully';
					// this.errorMsg = false;
					// this.submitted = false;
					this.myRoute.navigate(['/dashboard']);
					this.toasterService.pop('success', 'Updated successfully');
					window.scroll(0, 0);
				}

      }, (errors) => {
        window.scrollTo(0,0);
        // console.log(errors);
       this.ngxService.stop();
        // this.messages = errors;
        // this.successMsg = '';
        // this.errorMsg = true;
        this.toasterService.pop('error', 'Error', errors.message);
      });
    } 
  }


}

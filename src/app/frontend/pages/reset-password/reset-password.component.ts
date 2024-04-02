import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { CustomValidator} from '../../../common/validator';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  title = 'Reset Password';

  public messages: any = [];
  resetPasswordForm: FormGroup;
  successMsg: any;
  errorMsg: any;
  token: string;
  constructor( private fb: FormBuilder,
    private myRoute: Router,
    private http: HttpRequestService,
    protected activeRoute: ActivatedRoute,
    private ngxService: NgxUiLoaderService ) {}

    ngOnInit() {
      
      this.resetPasswordForm = this.fb.group({
        // user_name: ['', [Validators.required, CustomValidator.email]],
        new_password: ['', Validators.required],
        retype_password: [''],
      }, {
        validator: CustomValidator.MatchPassword // your validation method
      });
    }


  resetPassword() {
    if (this.resetPasswordForm.valid) {
      // console.log(this.resetPasswordForm);
      this.ngxService.start();
      const form_data = this.resetPasswordForm.value;
      this.token = this.activeRoute.snapshot.paramMap.get('token');
      form_data['token'] = this.token;
      form_data['password'] =  form_data['new_password'];
      // console.log(form_data);
      this.http.post('password/reset', form_data).subscribe((response) => {
        this.ngxService.stop();
        if (response['status'] === 'success') {
          this.messages = response['status'];
          this.myRoute.navigate(['/reset-password-succcess']);
          this.successMsg = 'Reset successfully';
          this.errorMsg = false;
          this.resetPasswordForm.reset();
        }

      }, (errors) => {
       // console.log(errors);
       this.ngxService.stop();
        this.messages = errors;
        this.successMsg = '';
        this.errorMsg = true;
      });
    }
  }

}

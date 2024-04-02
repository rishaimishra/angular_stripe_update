import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { CustomValidator} from '../../../common/validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import {GlobalConstantService } from '../../..//services/global-constant.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  successMsg: any;
  errorMsg: any;
  public messages: any = [];
  forgotPasswordForm: FormGroup;
  constructor(private modalService: NgbModal, private fb: FormBuilder,
    private myRoute: Router, private http: HttpRequestService,protected activeRoute: ActivatedRoute, public activeModal: NgbActiveModal, private ngxService: NgxUiLoaderService,private constant: GlobalConstantService ) {}

    ngOnInit() {
      this.successMsg = false;
      this.errorMsg = false;
      this.forgotPasswordForm = this.fb.group({
        user_name: ['', [Validators.required, CustomValidator.email]],
    
      });
    }

  // open(content) {
  //    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {

  //   }, (reason) => {
  //   });
  // }
  closeModal() {
    this.activeModal.close('Modal Closed');
  }
  forgotPassword() {
   // console.log('check');

   
    if (this.forgotPasswordForm.valid ) {
      this.ngxService.start();
    // console.log(this.registrationForm.value);
      const form_data = this.forgotPasswordForm.value;
      form_data['email_link'] = this.constant.BASE_URL + '/reset/reset/reset-password/:token';
    //  console.log(form_data);
      this.http.post('password/reset/token', form_data).subscribe((response) => {
       
        this.ngxService.stop();
        if (response['status'] === 'success') {
          this.messages = response['status'];
          this.myRoute.navigate(['/']);
          this.successMsg = 'Please check registerd email';
          this.errorMsg = false;
          this.forgotPasswordForm.reset();
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

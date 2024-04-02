import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../../services/http-request.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CustomValidators } from 'ng2-validation';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../../global/services/common.service';
import { CustomValidator} from '../../../../common/validator';
import { environment } from '../../../../../environments/environment';
import { SeoServiceService }  from '../../../../services/seo-service.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent implements OnInit {
  successMsg: any;
  errorMsg: any;
  messages: any;
  data: any;
  BASE_URL: string = environment.base_url;
  public communicationForm: FormGroup;
  private toasterService: ToasterService;
  public checkFinish: boolean = false;
  public totalTargatedAnswer: number = 0;

  constructor(toasterService: ToasterService, private http: HttpRequestService, private fb: FormBuilder,private myRoute: Router, private ngxService: NgxUiLoaderService, private commonService: CommonService, public SeoService:SeoServiceService) {
      this.toasterService = toasterService;
     }

  ngOnInit() {

    window.scrollTo(0,0);
    this.SeoService.getMetaInfo();
    this.checkFinishStatus();
    this.getCommunication();
    this.communicationForm = this.fb.group({
      wellcome_template: ['', Validators.required],
      congrats_template: ['', Validators.required],
      course_id: ['']
    });
  }

  checkFinishStatus () {
    const formdata= {
      status: 'publish',
      course_id: localStorage.getItem('courseEditId'),
    };
    this.ngxService.start();
    this.http.post(`utility/course/status`, formdata).subscribe((response) => {
      if (response['status'] === 'success') {
        this.ngxService.stop();
        this.checkFinish=false;
        this.revertBackToPreviousStatus();
      }

      
      
    }, (errors) => {
      this.ngxService.stop();
     this.checkFinish=true;
    });
  }

  revertBackToPreviousStatus() {
    const formdata= {
      status: 'draft',
      course_id: localStorage.getItem('courseEditId'),
    };
    this.ngxService.start();
    this.http.post(`utility/course/status`, formdata).subscribe((response) => {
      if (response['status'] === 'success') {
        this.ngxService.stop();
        
      }
      
    }, (errors) => {
      this.ngxService.stop();
  
    });
  }

  getCommunication() {
    this.ngxService.start();
    this.http.get(`course-communication/${ localStorage.getItem('courseEditId')}?find_by=course_id`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.ngxService.stop();
        this.data = response['data'];
        this.communicationForm.patchValue(this.data);
        // console.log(this.details);
      }
    }, (errors) => {
      // console.log(errors);
      this.ngxService.stop();
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }
  updateCommunication() {
    if (this.communicationForm.valid) {
      // console.log(this.resetPasswordForm);
       this.ngxService.start();
      const form_data = this.communicationForm.value;
      form_data['course_id'] = localStorage.getItem('courseEditId');
      form_data['complete_template'] = 'Complete';
      this.http.post(`course-communication`, form_data).subscribe((response) => {
        window.scrollTo(0,0);
        this.ngxService.stop();
        if (response['status'] === 'success') {
          // this.messages = response['status'];
          // this.successMsg = 'Updated successfully';
          // this.errorMsg = false;

            this.http.get(`notification/admin/course/${localStorage.getItem('courseEditId')}?path=${this.BASE_URL}/`).subscribe((response) => {
              // console.log(this.BASE_URL);

            }, (errors) => {
            // console.log(errors);
            });


          this.toasterService.pop('success', 'Updated successfully');
          this.myRoute.navigate(['/dashboard/my-course']);
        }

      }, (errors) => {
       // console.log(errors);
       window.scrollTo(0,0);
        this.ngxService.stop();
        // this.messages = errors;
        // this.successMsg = '';
        // this.errorMsg = true;
       // this.toasterService.pop('error', 'Error', errors.message);
       this.commonService.showErrors(errors);
      });
    }
  }

}

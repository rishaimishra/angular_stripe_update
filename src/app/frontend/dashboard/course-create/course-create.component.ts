import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CustomValidators } from 'ng2-validation';
import { StringToSlug } from '../../../pipe/string-slug.pipe';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../global/services/common.service';
import { SeoServiceService }  from '../../../services/seo-service.service';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss'],
  providers: [ StringToSlug ]
})
export class CourseCreateComponent implements OnInit {
  public categoryList: any = [];
  public courseTimes: any = [];
  private toasterService: ToasterService;
  courseCreateFrom: FormGroup;
  successMsg: any;
  errorMsg: any;
  messages: any;
  user: any;
  public kycStatus:boolean;

  constructor(
    toasterService: ToasterService,
    private http: HttpRequestService,
    private fb: FormBuilder,
    private myRoute: Router,
    private ngxService: NgxUiLoaderService,
    private stringToSlug: StringToSlug,
    private commonService: CommonService,
    public SeoService:SeoServiceService) { 
      this.toasterService = toasterService;
    }

  ngOnInit() {
    window.scrollTo(0,0);
    this.SeoService.getMetaInfo();
    this.user = this.http.getUser();
    this.getCategories();
    this.getCourseTime();
    this.courseCreateFrom = this.fb.group({
       title: ['', [Validators.required]],
       categories: ['', [Validators.required]],
       course_time_id: ['', [Validators.required]],
      
     });
     if(this.http.getUserRole()[0]=='vendor' || this.http.getUserRole()[0]=='reseller') {
			this.kycStatus = this.http.checkKyc();
			// console.log(this.kycStatus);
		}
  }
  public getCategories() {
    this.ngxService.start();
    this.http.get('category?parent=true&is_active=true&type=courses').subscribe((response) => {
      // console.log(response);
      if (response['status'] === 'success') {
        this.categoryList = response['data'];
      }
    });
  }
  public getCourseTime() {
    this.http.get('course-time').subscribe((response) => {
      // console.log(response);
      this.ngxService.stop();
      if (response['status'] === 'success') {
        this.courseTimes = response['data'];
      }
    }, (error) => {
      this.commonService.showErrors(error);
      this.ngxService.stop();
		});
  }

  groupValueFn = (_: string, children: any[]) => ({ name: children[0].parent.name, total: children.length });
 

  courseCreate() {

    if (this.courseCreateFrom.valid  ) {
      // console.log(this.kycStatus);
     // if(this.kycStatus) {
        const form_data = this.courseCreateFrom.value;
        form_data['slug'] = this.stringToSlug.transform(form_data.title);
        form_data['created_by'] =this.user.id;
        form_data['created_for'] =this.user.id;
        form_data['price'] ='0.00';
        form_data['status'] ='draft';
        form_data['duration']=0.0;
        this.ngxService.start();
        // console.log(form_data);
        this.http.post(`course`, form_data).subscribe((response) => {
          this.ngxService.stop();
          if (response['status'] === 'success') {
            this.courseCreateFrom.reset();
           // this.messages = response['status'];
           // this.successMsg = 'Course Created successfully';
           this.toasterService.pop('success', 'Course Created successfully');
           // this.errorMsg = false;
            localStorage.removeItem('courseEditId');
            // console.log(response['data'].id);
            localStorage.setItem('courseEditId', response['data'].id.toString());
            this.myRoute.navigate(['/dashboard/course-edit']);
          }
  
        }, (errors) => {
          //console.log(errors);
         this.ngxService.stop();
         // this.messages = errors;
         // this.successMsg = '';
         // this.errorMsg = true;
      
         //this.toasterService.pop('error', 'Error', errors.error.message);
         this.commonService.showErrors(errors);
        });

      // } else {
      //   this.toasterService.pop('error', 'Please complete your KYC first.');

      // }
     
    }
  }

}

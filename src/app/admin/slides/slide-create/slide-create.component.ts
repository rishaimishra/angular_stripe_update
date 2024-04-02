import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StringToSlug } from '../../../pipe/string-slug.pipe';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomValidator} from '../../../common/validator';
import { NgxUiLoaderService } from 'ngx-ui-loader'; 
import { S3BucketService } from '../../../services/s3-bucket.service';
@Component({
  selector: 'app-slide-create',
  templateUrl: './slide-create.component.html',
  styleUrls: ['./slide-create.component.scss']
})
export class SlideCreateComponent implements OnInit {

  public messages: any = [];
  slideCreateForm: FormGroup;
  successMsg: any;
  errorMsg: any;
  token: string;
  public pages: any = [];
  public fileInstance: any  = null;
  public Editor = ClassicEditor;
  public thumbnail: any;
  public imageSrc: string;

  imageChangedEvent: any = '';
croppedImage: any = '';

public notificationRecords: any= [];
  constructor( private fb: FormBuilder,
    private myRoute: Router,
    private http: HttpRequestService,
    protected activeRoute: ActivatedRoute,
    private ngxService: NgxUiLoaderService,
    protected s3: S3BucketService ) {}
    ngOnInit() {
      window.scroll(0,0);
      this.getPage();
      this.slideCreateForm = this.fb.group({
        page: ['home', Validators.required],
        title: ['', Validators.required],
        content: ['', Validators.required],
        button_1_title: [''],
        button_2_title: [''],
        button_1_link: ['' ],
        button_2_link: [''],
        is_active:[1]
      });
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
    getPage() {
      this.ngxService.start();
      this.http.get(`utility/application/config?section=slider_page`).subscribe((response)=>{
        this.ngxService.stop();
                if (response['status'] === 'success') {
                  this.pages = response['data'];
                }
        },(errors)=>{
          this.ngxService.stop();
        });
    }

    public uploadFile (event){
     // this.fileInstance = event;
      this.imageChangedEvent = event;
      // console.log(event.target.files[0]);
      // if (event.target.files && event.target.files[0]) {
      //   const image = event.target.files[0];
      //   const reader = new FileReader();
      //   reader.onload = e => {
      //     this.imageSrc = reader.result;
      //   };
      //   reader.readAsDataURL(image);
      // }
    }
    imageCropped(event) {
     // console.log(event);
      this.croppedImage = event.base64;
     // console.log(this.croppedImage);
      this.fileInstance = event.file;
    //  console.log(this.fileInstance.type);
    }
    imageLoaded() {
       // show cropper
    }
    loadImageFailed() {
      // show message
      this.fileInstance = '';
      this.croppedImage = '';
    }
    public uploadToS3 () {
      this.ngxService.start();
      const file 		= this.fileInstance;
      this.s3.cropedImageUpload(file).send((err, data) => {
        if (err) {
         // console.log(err);
          this.ngxService.stop();
        } else {
         // console.log(data.Location);
          this.ngxService.stop();
          this.thumbnail = data.Location;
        }
      });
    }

    createSlide() {
     // console.log(this.thumbnail);
      if (this.slideCreateForm.valid) {
        // console.log(this.resetPasswordForm);
        this.ngxService.start();
        const form_data = this.slideCreateForm.value;
        form_data['thumbnail'] = this.thumbnail;
       // console.log(this.thumbnail);
       // console.log(form_data);
        this.http.post('page-slider', form_data).subscribe((response) => {
          this.ngxService.stop();
          if (response['status'] === 'success') {
            this.messages = response['status'];
            this.successMsg = 'Added successfully';
            this.errorMsg = false;
            this.slideCreateForm.reset();
            this.thumbnail = '';
            this.imageSrc = '';
            this.fileInstance = '';
            this.croppedImage = '';
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

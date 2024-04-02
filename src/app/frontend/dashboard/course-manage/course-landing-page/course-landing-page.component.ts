import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../../services/http-request.service';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CustomValidators } from 'ng2-validation';
import { S3BucketService } from '../../../../services/s3-bucket.service';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../../global/services/common.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { bool } from 'aws-sdk/clients/signer';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-course-landing-page',
  templateUrl: './course-landing-page.component.html',
  styleUrls: ['./course-landing-page.component.scss']
})
export class CourseLandingPageComponent implements OnInit {
  public fileInstance: any  = null;
  public thumbFileInstance: any  = null;
  public videoInstance: any  = null;
  public messages: any = [];
  public successMsg: any;
  public errorMsg: any;
  public details: any;
  public courseLandingPageForm: FormGroup;
  public course_stander: any;
  public parent_Category: any;
  public sub_Category: any;
  public thumbnail: any= '';
  public thumbnailImage: any = '';
  public imageSrc: string;
  public thumbImageSrc: string;
  imageChangedEvent: any = '';
  thumbImageChangedEvent: any = '';
  croppedImage: any = '';
  croppedThumbImage: any = '';
  public path: any;
  public user: any;
  public videoType = ['mp4', 'mkv', '3gp'];
  public imageType = ['png','jpeg','jpg','gif'];
  private toasterService: ToasterService;
  public oldImage:any;
  public oldVideo:any;
  public image_edited = 0;
  public video_edited = 0;

  public originalFile: any;
  public originalFileSrc: any;

  public time: any;
  public hour:any;
  public minute:any;
  public ctrl= new FormControl('');
  public oldTime:any;
  public finalHour:any;
  public finalMinute:any;

  public submited:boolean=false;
  public newImage:boolean = false;
  public newThumbImage: boolean = false;

  public newCourseImageFile: boolean = false;
  public newCourseThumbImageFile: boolean = false;
  public newPromotionalVideo: boolean = false;
  public Editor = ClassicEditor;
  constructor(
    toasterService: ToasterService,
    private http: HttpRequestService,
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    protected s3: S3BucketService,
    private commonService: CommonService,
    private myRoute: Router,
    public SeoService:SeoServiceService
  ) { 
    this.toasterService = toasterService;
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.SeoService.getMetaInfo();
    this.user = this.http.getUser();
    this.getStandard();
    this.parentCategory();
    this.getDetails();
  
    this.courseLandingPageForm = this.fb.group({
      title: ['', Validators.required],
      sub_title: ['',Validators.required],
      description: ['',Validators.required],
      parent_category_id: [''],
      child_category_id:[''],
      course_stander_id: [''],
      primary_thought:['',Validators.required],
      meta_description:['',Validators.maxLength(250)],
      meta_keywords: ['']
    });

  }

  public onReady( editor ) {
    editor.ui.view.element.childNodes[0].innerHTML='';
    // console.log(editor.ui.view.element.childNodes[0]);
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getDetails() {
    this.ngxService.start();
    this.http.get(`course/${ localStorage.getItem('courseEditId')}?categories=true`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.ngxService.stop();
        this.details = response['data'];
        // console.log(this.details,'Details');
        //this.sub_Category = this.subCategory(this.details.parent_category_id);
      
       if(this.details.categories.length > 0 ){
        this.sub_Category = this.subCategory(this.details.categories[0]);
       }  
        
        

        this.courseLandingPageForm.patchValue(this.details);
        // console.log(this.details);
            this.imageSrc = this.details.images.original;
            this.thumbImageSrc = this.details.images.thumbnail;
            this.thumbnail = this.details.images.original;
            this.croppedImage = this.details.images.banner;
            this.croppedThumbImage = this.details.images.thumbnail;
            this.thumbnailImage = this.details.images.thumbnail;
            this.path = this.details.promotional_video;

            this.oldImage = this.details.images.original;
            this.oldVideo = this.details.promotional_video;

            this.originalFileSrc=this.details.images.original;

              /****Time section****/
              this.time=  this.details.duration;

              this.hour=parseInt(this.time);
  
              this.minute=Math.ceil(((this.time < 1.0) ? this.time : (this.time % Math.floor(this.time))) * 100)
  
            //  console.log(this.hour);
            //  console.log(this.minute);
  
              if(this.time>0)
              {
                this.oldTime={hour:this.hour, minute: this.minute};
  
              } else {
                this.oldTime={hour:0, minute: 0};
              }
              this.ctrl = new FormControl(this.oldTime, (control: FormControl) => {
                
                const value = control.value;
                // console.log(value);
                if (!value) {
                  return null;
                }
                if ((value.hour==0 && value.minute==0) || !value) {
                  return {required: true};
                }

                return null;
              });
            

      }
    }, (errors) => {
      this.ngxService.stop();
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }

  getStandard() {
    this.http.get(`course-stander`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.course_stander = response['data'];
       // console.log(this.courseLandingPageForm.get('course_stander_id').value);


        if(this.courseLandingPageForm.get('course_stander_id').value=='') {
         // console.log('j');
          this.courseLandingPageForm.controls['course_stander_id'].setValue( this.course_stander[0].id);
          
        }

      }
    }, (errors) => {
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }

  parentCategory() {
    this.http.get(`category?parent_id=0&is_active=true&type=courses`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.parent_Category = response['data'];
      }
    }, (errors) => {
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }
  subCategory(event) {
    this.courseLandingPageForm.patchValue({
			child_category_id: null,
		});
		this.sub_Category = [];
  
    
    this.http.get(`category?parent_id=${event.id}&is_active=true&type=courses`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.sub_Category = response['data'];
      //  console.log(this.sub_Category);
      }
    }, (errors) => {
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }

 
  subCategoryChange(parentId) {

    this.http.get(`category?parent_id=${parentId}&is_active=true&type=courses`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.sub_Category = response['data'];
        // if(this.sub_Category.length>0) {
        //   this.courseLandingPageForm.controls['child_category_id'].setValue( this.sub_Category[0].id);
          
        // } else {
        //   this.courseLandingPageForm.controls['child_category_id'].setValue('');
        // }

      }
    }, (errors) => {
      // console.log(errors);
       this.messages = errors;
       this.successMsg = '';
       this.errorMsg = true;
     });
  }


  public uploadFile (event) {
    


    const fileName = event.target.files[0];
    const fileExt = fileName.name.split('.').slice(-1)[0];
 //  console.log(fileName);
 //  console.log(fileExt);

      if (this.imageType.indexOf(fileExt) !== -1) {
        this.imageChangedEvent = event;
        this.imageSrc = event;
        this.originalFile = event;
        this.newImage=true;
        this.newCourseImageFile = true;
      } else {
        alert('Only png,jpeg,jpg,gif format are supported');
      }
  }

  imageCropped(event) {
     this.croppedImage = event.base64;
     this.fileInstance = event.file;
     this.imageSrc = event.base64;
     // console.log(this.fileInstance,'cover');
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
  // console.log(file, 'upload cover');
    this.s3.cropedImageUpload(file).send((err, data) => {
      if (err) {
        this.ngxService.stop();
      //  console.log(err);
      } else {
        this.ngxService.stop();
        // console.log(data.Location,'uploaded cover');
        this.thumbnail = data.Location;
        this.image_edited = 1;
        this.newCourseImageFile = false;
      }
    });


    const original = this.originalFile.target.files[0];
    // console.log(file);
    this.ngxService.start();
     this.s3.fileUpload(original).send((err, data) => {
       if (err) {
         this.ngxService.stop();
       //  console.log('err');
       
       } else {
       //  console.log(data.Location);
         this.ngxService.stop();
         this.originalFileSrc = data.Location;
         
       }
     });

     this.newImage=false;
  }














  

  // Code for Thumb image start
  public uploadThumbFile (event) {
    


    const fileName = event.target.files[0];
    const fileExt = fileName.name.split('.').slice(-1)[0];
 //  console.log(fileName);
 //  console.log(fileExt);

      if (this.imageType.indexOf(fileExt) !== -1) {
        this.thumbImageChangedEvent = event;
        this.thumbImageSrc = event;
        this.originalFile = event;
        this.newThumbImage=true;
        this.newCourseThumbImageFile = true;
      } else {
        alert('Only mp4, mkv, 3gp format are supported');
      }
  }

  thumbImageCropped(event) {
     this.croppedThumbImage = event.base64;
     this.thumbFileInstance = event.file;
     this.thumbImageSrc = event.base64;
     // console.log(this.thumbFileInstance,'thumb');
   }
   thumbImageLoaded() {
      // show cropper
   }
   loadThumbImageFailed() {
     // show message
     this.thumbFileInstance = '';
     this.croppedThumbImage = '';
   }

  public uploadToS3Thumb () {
    this.ngxService.start();


  const file 		= this.thumbFileInstance;
  // console.log(file, 'upload Thumb');
    this.s3.cropedImageUpload(file).send((err, data) => {
      if (err) {
        this.ngxService.stop();
      //  console.log(err);
      } else {
        this.ngxService.stop();
       // console.log(data.Location);
       // console.log(data.Location,'uploaded thumb');
        this.thumbnailImage = data.Location;
        this.image_edited = 1;
        this.newCourseThumbImageFile = false;
      }
    });


     this.newThumbImage=false;
  }
  // Code for Thumb image End

  uploadVideo(event) {
    const fileName = event.target.files[0];
    const fileExt = fileName.name.split('.').slice(-1)[0];
 //  console.log(fileName);
 //  console.log(fileExt);

      if (this.videoType.indexOf(fileExt) !== -1) {
        this.videoInstance = event;
        this.newPromotionalVideo=true;
      } else {
        alert('Only mp4, mkv, 3gp format are supported');
      }
	//	this.videoInstance = event;
  }

  public uploadToS3Video () {

    

    const file = this.videoInstance.target.files[0];
    // console.log(file);
   this.ngxService.start();
    this.s3.fileUpload(file).send((err, data) => {
      if (err) {
        this.ngxService.stop();
      //  console.log('err');
      
      } else {
      //  console.log(data.Location);
        this.ngxService.stop();
        this.path = data.Location;
        this.video_edited = 1;
        this.newPromotionalVideo = false;
      }
    });
  }

  updateLandingPage() {

    this.submited=true;

    // console.log(this.courseLandingPageForm.value.parent_category_id);
    if(!this.originalFileSrc) {
      this.toasterService.pop('error', 'Error', ' Course Image is required');
    } else if(!this.path) {
      this.toasterService.pop('error', 'Error','  Promotional Video  is required');
    } else if(!this.thumbnailImage) {
      this.toasterService.pop('error', 'Error','  Thumb Image  is required');
    } else if(!parseInt(this.courseLandingPageForm.value.parent_category_id)) {
      this.toasterService.pop('error', 'Error','  Category  is required');
    } else {
        if (this.courseLandingPageForm.valid && this.ctrl.valid) {
          // console.log(this.resetPasswordForm);
          this.ngxService.start();
        
          const form_data = this.courseLandingPageForm.value;
          form_data['banner'] = this.thumbnail;
          form_data['original'] =   this.originalFileSrc;
          form_data['thumbnail'] = this.thumbnailImage;
          form_data['promotional_video'] = this.path;
          form_data['created_by'] = this.user.id;
          form_data['created_for'] = this.user.id;
          form_data['course_time_id'] = this.details.course_time_id;
          form_data['locale'] = 'en';

          // time
          if(this.ctrl.value.hour>9)
          {
            this.finalHour=this.ctrl.value.hour;
          } else {
            this.finalHour =`0${this.ctrl.value.hour}`;
        }

        if(this.ctrl.value.minute>9)
          {
            this.finalMinute=this.ctrl.value.minute;
          } else {
            this.finalMinute =`0${this.ctrl.value.minute}`;
        }


        const duration=`${this.finalHour}.${this.finalMinute}`;
        form_data['duration'] = duration;
         // console.log(form_data['duration']);

          if(form_data.child_category_id)
          {
            form_data['categories'] = [parseInt(form_data.parent_category_id), parseInt(form_data.child_category_id) ];
          } else {
            form_data['categories'] = [parseInt(form_data.parent_category_id) ];
          }
        //  console.log(form_data);
          this.http.put(`course/${ localStorage.getItem('courseEditId')}`, form_data).subscribe((response) => {
            this.ngxService.stop();
            if (response['status'] === 'success') {
              window.scrollTo(0,0);
              // this.messages = response['status'];
              // this.successMsg = 'Updated successfully';
              // this.errorMsg = false;
              this.toasterService.pop('success', 'Updated successfully');
              this.imageSrc ='';

                    if( this.image_edited) {
                      this.http.get(`utility/s3/file-remove?key=${this.oldImage}`).subscribe((imageResponse) => {
                        if (imageResponse['status'] === 'success') {
                        //  console.log('old image remove successfully');
                        }
                      }, (errors) => {
                        // console.log(errors);
                        
                      });
                  }
                  if(this.video_edited) {
                    this.http.get(`utility/s3/file-remove?key=${this.oldVideo}`).subscribe((videoResponse) => {
                      if (videoResponse['status'] === 'success') {
                      //  console.log('old video remove successfully');
                      }
                    }, (errors) => {
                      // console.log(errors);
                      
                    });
                  }
                  this.myRoute.navigate(['/dashboard/course-edit/price-and-coupons']);
                  
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


}

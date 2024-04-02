import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpRequestService } from '../../../../services/http-request.service';
import { S3BucketService } from '../../../../services/s3-bucket.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../../global/services/common.service';
import { CourseService } from '../../../../global/services/course.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  _ref: any;
  data: any;
  course_module_id: any;
  chapterSectionCount:any;

  public sectionCreateFrom: FormGroup;
  public sectionUpdateFrom: FormGroup;
  public fileInstance: any  = null;
  public resourceInstance: any  = null;
  public path: any;
  public successMsg: any;
  public errorMsg: any;
  public messages: any;
  public editClick: any;
  public resource: any;
  public lectureType: any;
  public errorResource: any;
  public errorLecture: any;
  private toasterService: ToasterService;
  public oldResource:any;
  public oldVideo:any;
  public resource_edited = 0;
  public video_edited = 0;
  public videoType = ['mp4', 'mkv', '3gp', 'mov'];
  public pdfType = ['pdf'];
  public resourceType = ['zip', 'rar'];
  public newUplodedLecture:boolean = false;
  public newUplodedResource:boolean = false;
  public uplodedFileType:any='';
  public newLectureSelectFile:boolean = false;
  public newResourceSelectFile:boolean = false;
  private objCount: number = 0;
  public time: any;
  public hour:any;
  public minute:any;
  public ctrl= new FormControl('');
  public oldTime:any;
  public finalHour:any;
  public finalMinute:any;
  public finalSecond:any;
  public submited:boolean=false;
  public Editor = ClassicEditor;

  constructor(
    toasterService: ToasterService,
    private http: HttpRequestService,
    private fb: FormBuilder,
    protected s3: S3BucketService,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    public courseService: CourseService,
  ) {
    this.toasterService = toasterService;
    this.courseService.objectCount$.subscribe((count) => {
      if (count > -1) {
        this.objCount = count;
      }
    });
  }

  ngOnInit() {
    // window.scrollTo(0,0);

    if(this.data!=0)
    {
        let times = this.data.duration.split(':');
     // console.log(parseInt(times[2]));

      this.oldTime={hour:times[0]? parseInt(times[0]):0 , minute: times[1]? parseInt(times[1]):0 , second: times[3]? parseInt(times[3]):0};
     // console.log(this.oldTime);


      this.ctrl = new FormControl(this.oldTime, (control: FormControl) => {

        const value = control.value;
        if (!value) {
          return null;
        }
        if ((value.hour==0 && value.minute==0 && value.second==0 ) || !value) {
          return {required: true};
        }
        // const pattern = /[0-9\+\-\ ]/;

        // if(!pattern.test(value.hour)){
        //   value.hour=0;
        // }

        return null;
      });



        this.path = this.data.lecture_link;
        this.resource = this.data.resources;

        if(this.path) {
          this.newUplodedLecture=true;
        }

        if(this.resource) {
          this.newUplodedResource=true;
        }


        this.oldResource =  this.data.resources;
        this.oldVideo = this.data.lecture_link;

        this.sectionUpdateFrom = this.fb.group({
          title: [this.data.title, [Validators.required]],
          description: [this.data.description, [Validators.required]],
          lecture_mode: [this.data.lecture_mode, [Validators.required]],
          course_module_id: [this.course_module_id],
        });
        this.lectureType = this.data.lecture_mode;
        this.uplodedFileType=this.data.lecture_mode;

    } else {
      this.sectionCreateFrom = this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        lecture_mode: ['video', [Validators.required]],
        course_module_id: [this.course_module_id],
      });
      this.lectureType = 'video';


      this.oldTime={hour:0, minute: 0, second: 0 };
      this.ctrl = new FormControl(this.oldTime, (control: FormControl) => {

        const value = control.value;
        if (!value) {
          return null;
        }
        if ((value.hour==0 && value.minute==0 && value.second==0 ) || !value) {
          return {required: true};
        }
        // const pattern = /[0-9\+\-\ ]/;

        // if(!pattern.test(value.hour)){
        //   value.hour=0;
        // }


        return null;
      });
     }
  }
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  removeObject(){
    this.objCount -= 1;
    this.courseService.setObjectCount(this.objCount);
    this._ref.destroy();
  }
  public onReady( editor ) {
    editor.ui.view.element.childNodes[0].innerHTML='';
    // console.log(editor.ui.view.element.childNodes[0]);
  }
  setLectureType(type) {
    this.lectureType = type;
    this.fileInstance = '';
    this.path='';
    this.newLectureSelectFile = false;
  }
   uploadFile(event) {

     const fileName = event.target.files[0];
     const fileExt = fileName.name.split('.').slice(-1)[0];
  //  console.log(fileName);
  //  console.log(fileExt);
    if(this.lectureType === 'video') {

      if (this.videoType.indexOf(fileExt) !== -1) {
        this.fileInstance = event;
        this.newUplodedLecture=false;
        this.newLectureSelectFile= true;
      } else {
        alert('Only mp4, mkv, 3gp format are supported');
      }

    } else if (this.lectureType === 'pdf') {
      if (this.pdfType.indexOf(fileExt) !== -1) {

        this.fileInstance = event;
        this.newUplodedLecture=false;
        this.newLectureSelectFile= true;
      } else {
        alert('Only pdf format are supported');
      }
    }

  // this.fileInstance = event;

  }

  uploadResourceFile(event) {
    const fileName = event.target.files[0];
    const fileExt = fileName.name.split('.').slice(-1)[0];
 //  console.log(fileName);
 //  console.log(fileExt);

      if (this.resourceType.indexOf(fileExt) !== -1) {
        this.resourceInstance = event;
        this.newUplodedResource=false;
        this.newResourceSelectFile = true;
      } else {
        alert('Only zip,rar format are supported');
      }

  // this.resourceInstance = event;

  }
  public uploadToS3 () {
    const file = this.fileInstance.target.files[0];

    this.ngxService.start();
    this.s3.fileUpload(file).send((err, data) => {
      if (err) {
        this.ngxService.stop();
       // console.log(err);

      } else {
        this.video_edited = 1;
        this.ngxService.stop();
       // console.log(data.Location);
        this.path = data.Location;
        this.uplodedFileType=this.lectureType;
        this.newLectureSelectFile= false;
        this.newUplodedLecture=true;
      }
    });


    // console.log(this.lectureType);
  }

  public uploadResourceToS3 () {
    const file = this.resourceInstance.target.files[0];
   // console.log(file);
    this.ngxService.start();
    this.s3.fileUpload(file).send((err, data) => {
      if (err) {
        this.ngxService.stop();
        // console.log(err);

      } else {
        this.resource_edited = 1;
        this.ngxService.stop();
      //  console.log(data.Location);
        this.resource = data.Location;
        this.newResourceSelectFile=false;
        this.newUplodedResource=true;
      }
    });


  }

  save(){
    this.submited=true;


    if(this.sectionCreateFrom.value['lecture_mode'] == 'video' && !this.ctrl.valid){
      this.toasterService.pop('error', 'Error', 'Duration is required');
    }
    else {


        if (this.sectionCreateFrom.valid  ) {

            const form_data = this.sectionCreateFrom.value;
            form_data['lecture_link']=this.path;
            form_data['order_by']=1;
            form_data['resources']=this.resource;
          //  this.ngxService.start();
          //  console.log(form_data);


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

            if(this.ctrl.value.second>9)
            {
                this.finalSecond=this.ctrl.value.second;
            } else {
                this.finalSecond =`0${this.ctrl.value.second}`;
            }

            const duration=`${this.finalHour}:${this.finalMinute}:${this.finalSecond}`;
            form_data['duration'] = duration;

            this.http.post(`course-lecture`, form_data).subscribe((response) => {
            //  this.ngxService.stop();
              if (response['status'] === 'success') {
                // this.courseCreateFrom.reset();
                // this.messages = response['status'];
                // this.successMsg = 'Course Created successfully';
                // this.errorMsg = false;
                this.toasterService.pop('success', 'Section Created successfully');
                // window.location.reload();
                // window.scrollTo(0,0);
                this.commonService.scrollToElement(`section_${this.chapterSectionCount}`);
                // console.log(response['data']);
                this.data = response['data'];
                this.sectionUpdateFrom = this.fb.group({
                  title: [this.data.title, [Validators.required]],
                  description: [this.data.description, [Validators.required]],
                  lecture_mode: [this.data.lecture_mode, [Validators.required]],
                  course_module_id: [this.course_module_id],
                });
                this.lectureType = this.data.lecture_mode;
                this.path = this.data.lecture_link;
                this.resource = this.data.resources;

                this.objCount -= 1;
                this.courseService.setObjectCount(this.objCount);
              }

            }, (errors) => {
              // console.log(errors);
              // this.ngxService.stop();
              // this.messages = errors;
              // this.successMsg = '';
              // this.errorMsg = true;
              // this.toasterService.pop('error', 'Error', 'Please upload lecture file');
                this.commonService.showErrors(errors);
             // window.scrollTo(0,0);
              //this.commonService.scrollToElement(`section_${this.chapterSectionCount}`);
            });
          }
    }
  }

  editSection() {
    this.editClick=1;
    this.objCount += 1;
    this.courseService.setObjectCount(this.objCount);
  }
  editSectionRemove() {
    this.objCount -= 1;
    this.courseService.setObjectCount(this.objCount);
    this.editClick=0;
  }

  update() {
    this.submited=true;
    if(this.sectionUpdateFrom.value['lecture_mode'] == 'video' && !this.ctrl.valid){
      this.toasterService.pop('error', 'Error', 'Duration is required');
    }
    else {

        if (this.sectionUpdateFrom.valid  ) {
          // console.log(this.registrationForm.value);


            const form_data = this.sectionUpdateFrom.value;
            form_data['lecture_link']=this.path;
            form_data['order_by']=1;
            form_data['resources']=this.resource;
          //  this.ngxService.start();

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

            if(this.ctrl.value.second>9)
            {
                this.finalSecond=this.ctrl.value.second;
            } else {
                this.finalSecond =`0${this.ctrl.value.second}`;
            }

            const duration=`${this.finalHour}:${this.finalMinute}:${this.finalSecond}`;
            form_data['duration'] = duration;


            // console.log(form_data);
            // console.log(this.data);
            this.http.put(`/course-lecture/${this.data.id}`, form_data).subscribe((response) => {
            //  this.ngxService.stop();
              if (response['status'] === 'success') {
                    if( this.resource_edited) {
                      this.http.get(`utility/s3/file-remove?key=${this.oldResource}`).subscribe((resourceResponse) => {
                        if (resourceResponse['status'] === 'success') {
                         // console.log('old resource remove successfully');
                        }
                      }, (errors) => {
                        // console.log(errors);

                      });
                  }
                  if(this.video_edited) {
                    this.http.get(`utility/s3/file-remove?key=${this.oldVideo}`).subscribe((videoResponse) => {
                      if (videoResponse['status'] === 'success') {
                     //   console.log('old lecture remove successfully');
                      }
                    }, (errors) => {
                      // console.log(errors);

                    });

                  }
                  // this.courseCreateFrom.reset();
                  // this.messages = response['status'];
                  // this.successMsg = 'Course Created successfully';
                  // this.errorMsg = false;
                  this.toasterService.pop('success', 'Section Updated successfully');
                  // window.location.reload();
                  const id=this.data.id;
                  this.data = response['data'];
                  this.data.id=id;
                  //  console.log(this.data);
                  this.editSectionRemove();
                  // window.scrollTo(0,0);
                  this.commonService.scrollToElement(`section_${this.chapterSectionCount}`);
                  //this.commonService.scrollToElement('record-set');
                  this.objCount -= 1;
                  this.courseService.setObjectCount(this.objCount);

              }

            }, (errors) => {
               // console.log(errors);
                // this.ngxService.stop();
                // this.messages = errors;
                // this.successMsg = '';
                // this.errorMsg = true;
                // this.toasterService.pop('error', 'Error', 'Please upload lecture file');
                this.commonService.showErrors(errors);
                //  window.scrollTo(0,0);
                //this.commonService.scrollToElement(`section_${this.chapterSectionCount}`);
            });
          }
    }
  }

  deleteSection() {
    this.http.delete(`course-lecture/${this.data.id}`).subscribe((response)=>{
			if(response['status'] == 'success'){
        this.toasterService.pop('success', 'Section Deleted successfully');
      //  window.location.reload();
        window.scrollTo(0,0);
         this._ref.destroy();
			}
		})
  }


}

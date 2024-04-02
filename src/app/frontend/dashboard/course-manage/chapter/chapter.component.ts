  import { Component, OnInit,
    ViewChild,
    ComponentFactoryResolver,
    ViewContainerRef  } from '@angular/core';
  import { SectionComponent } from '../section/section.component';
  import { FormBuilder, Validators, FormGroup } from '@angular/forms';
  import { HttpRequestService } from '../../../../services/http-request.service';
  import { ToasterService } from 'angular2-toaster';
  import { CourseService } from '../../../../global/services/course.service';
  import { CommonService } from '../../../../global/services/common.service';
  import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit {
  @ViewChild('section', { read: ViewContainerRef }) container: ViewContainerRef;
  chapterCount:any;
  _ref:any; 
  data:any;
  public course_lecture: any;
  public editClick: any;
  public chapterCreateFrom: FormGroup;
  public chapterUpdateFrom: FormGroup;
  public successMsg: any;
  public errorMsg: any;
  public messages: any;
  public course_id: number;
  private toasterService: ToasterService;
  private objCount: number = 0;
  public sectionCount:any = 0;
  public Editor = ClassicEditor;

  constructor(
    toasterService: ToasterService,
    private _cfr: ComponentFactoryResolver,
    private http: HttpRequestService,
    public courseService: CourseService,
    private commonService: CommonService,
    private fb: FormBuilder,
  ) {
    this.toasterService = toasterService;

    this.courseService.objectCount$.subscribe((count) => {
      if (count > -1) {
        this.objCount = count;
      }
    });
   }

  ngOnInit() {
    // console.log(this.data);
    //window.scrollTo(0,0);
    if(this.data!=0)
    {
      this.chapterUpdateFrom = this.fb.group({
        title: [this.data.title, [Validators.required]],
        description: [this.data.description, [Validators.required]],
        course_id: [this.course_id],
      });

      this.course_lecture = this.data.course_lectures;
        this.course_lecture.forEach( (value) => {
         // console.log(value);
        this.addSection(value);
      });
    } else {
      this.chapterCreateFrom = this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        course_id: [this.course_id],
      });
      
    }
  }

  public onReady( editor ) {
    editor.ui.view.element.childNodes[0].innerHTML='';
    // console.log(editor.ui.view.element.childNodes[0]);
  }
  removeObject(){
   // console.log(this.objCount, ' sd');
    this.objCount -= 1;
    this.courseService.setObjectCount(this.objCount);

    this._ref.destroy();
  }   
  

  addSection(data){    
    const comp = this._cfr.resolveComponentFactory(SectionComponent);
    const sectionComponent = this.container.createComponent(comp);
    sectionComponent.instance._ref = sectionComponent;
    sectionComponent.instance.data = data;
    sectionComponent.instance.course_module_id = this.data.id;
    sectionComponent.instance.chapterSectionCount = this.chapterCount.toString() + this.sectionCount.toString();
    if (data === 0) {
      this.objCount += 1;
      this.courseService.setObjectCount(this.objCount); 
    }
    this.sectionCount++;
  }

  editChapter() {
    this.editClick=1;
    this.objCount += 1;
    this.courseService.setObjectCount(this.objCount); 
  }
  editChapterRemove() {
    this.objCount -= 1;
    this.courseService.setObjectCount(this.objCount);
    this.editClick=0;
  }
  save(){
    if (this.chapterCreateFrom.valid  ) {
      // console.log(this.registrationForm.value);
        const form_data = this.chapterCreateFrom.value;
        
          //  this.ngxService.start();
          // console.log(form_data);
          this.http.post(`course-module`, form_data).subscribe((response) => {
          //  this.ngxService.stop();
          if (response['status'] === 'success') {
            // this.courseCreateFrom.reset();
            // this.messages = response['status'];
            // this.successMsg = 'Course Created successfully';
            // this.errorMsg = false;
           // window.scrollTo(0,0);
            this.commonService.scrollToElement(`chapter_${this.chapterCount}`);
            this.toasterService.pop('success', 'Course Created successfully');
           //  window.location.reload();
           // console.log(response['data']);


            this.data=response['data'];
            
            this.chapterUpdateFrom = this.fb.group({
              title: [this.data.title, [Validators.required]],
              description: [this.data.description, [Validators.required]],
              course_id: [this.course_id],
            });
           
        //  console.log(this.editClick);
        this.objCount -= 1;
        this.courseService.setObjectCount(this.objCount);

          }
  
        }, (errors) => {
         // console.log(errors);
        // this.ngxService.stop();
          // this.messages = errors;
          // this.successMsg = '';
          // this.errorMsg = true;
          // window.scrollTo(0,0);
          this.commonService.scrollToElement(`chapter_${this.chapterCount}`);
          if(errors.lecture_link.message) {
          this.toasterService.pop('error', 'Error', errors.lecture_link.message);
          } 

        });
      }
  }

  update() {
    if (this.chapterUpdateFrom.valid  ) {
      // console.log(this.registrationForm.value);
        const form_data = this.chapterUpdateFrom.value;
        
      //  this.ngxService.start();
        // console.log(form_data);
        this.http.put(`course-module/${this.data.id}`, form_data).subscribe((response) => {
        //  this.ngxService.stop();
          if (response['status'] === 'success') {
            // this.courseCreateFrom.reset();
            // this.messages = response['status'];
            // this.successMsg = 'Course Created successfully';
            // this.errorMsg = false;
           // window.scrollTo(0,0);
           this.commonService.scrollToElement(`chapter_${this.chapterCount}`);
            this.toasterService.pop('success', 'Course Updated successfully');
          //  window.location.reload();
           const id=this.data.id;
            this.data = response['data'];
            this.data.id=id;
            this.editChapterRemove();
            this.objCount -= 1;
            this.courseService.setObjectCount(this.objCount);
          }
  
        }, (errors) => {
         // console.log(errors);
        // this.ngxService.stop();
          // this.messages = errors;
          // this.successMsg = '';
          // this.errorMsg = true;
         // window.scrollTo(0,0);
         this.commonService.scrollToElement(`chapter_${this.chapterCount}`);
          this.toasterService.pop('error', 'Error', errors.message);
        });
      }
  }

  deleteChapter() {
    this.http.delete(`course-module/${this.data.id}`).subscribe((response)=>{
			if(response['status'] == 'success'){
      //  window.location.reload();
        window.scrollTo(0,0);
        this.toasterService.pop('success', 'Course Deleted successfully');
        this._ref.destroy();
			}
		})
  }

}

import { Component,
   OnInit,
   ViewChild,
   ElementRef,
   Renderer2 ,
   Inject,
   Injectable,
   ComponentFactoryResolver,
   ViewContainerRef
  } from '@angular/core';
import { HttpRequestService } from '../../../../services/http-request.service';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CustomValidators } from 'ng2-validation';
import * as $ from 'jquery';
import { DOCUMENT } from '@angular/platform-browser';
import { ChapterComponent } from '../chapter/chapter.component';
import { CourseService } from '../../../../global/services/course.service';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss']
})
export class CurriculumComponent implements OnInit {

  @ViewChild('chapter', { read: ViewContainerRef }) container: ViewContainerRef;

  public isNextVisible: Boolean = true;
  private objCount: number = 0;
  public chapterCount: number = 1;
  courseData: any;
  courseDataModule: any;
 // primaryValueOfChapter = 0;
  course_id: number;
  constructor(
    private http: HttpRequestService,
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private _cfr: ComponentFactoryResolver,
    public courseService: CourseService,
    public route: Router,
    public SeoService:SeoServiceService
  ) {
    this.courseService.objectCount$.subscribe((count) => {
      if (count > -1) {
        this.objCount = count;
        this.isNextVisible = (count === 0) ? true : false;
      }
    });
  }

  ngOnInit() {
    this.SeoService.getMetaInfo();
    this.getCariculamData();
    window.scrollTo(0,0);
  
  }

  getCariculamData() {
    this.ngxService.start();
    this.http.get(`course/${ localStorage.getItem('courseEditId')}?course_modules=true&course_lectures=true`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.ngxService.stop();
      //  console.log(response);
        this.courseData = response['data'];
        this.course_id=this.courseData.id;
        this.courseDataModule = this.courseData.course_modules;
        this.courseDataModule.forEach( (value) => {
         
        this.addChapter(value);
          
      });
      }
    }, (errors) => {
      // console.log(errors);
      this.ngxService.stop();
      
     });
  }

  addChapter(data){
    const comp = this._cfr.resolveComponentFactory(ChapterComponent);
    const chapterComponent = this.container.createComponent(comp);
    chapterComponent.instance._ref = chapterComponent;
    chapterComponent.instance.data = data;
    chapterComponent.instance.course_id = this.course_id;
    chapterComponent.instance.chapterCount = this.chapterCount;
    if (data === 0) {
      this.objCount += 1;
      this.courseService.setObjectCount(this.objCount); 
    } 
    this.chapterCount++;
  }
  saveNext() {
    if(this.isNextVisible){
      this.route.navigate(['/dashboard/course-edit/course-landing-page']);
    } else {
      return false;
    }
  }
}

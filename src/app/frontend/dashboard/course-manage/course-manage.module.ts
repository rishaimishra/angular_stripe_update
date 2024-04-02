import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDirective } from '../../../directive/directive';
import { CustomPipes } from '../../../pipe/pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from '../../../common/shared.module';
import { GlobalModule } from '../../../global/global.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CourseManageRoutingModule } from './course-manage-routing.module';


import { CourseManageLeftPanelComponent } from './course-manage-left-panel/course-manage-left-panel.component';
import { TargetYourStudentsComponent } from './target-your-students/target-your-students.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { CourseLandingPageComponent } from './course-landing-page/course-landing-page.component';
import { PriceAndCouponsComponent } from './price-and-coupons/price-and-coupons.component';
import { CommunicationComponent } from './communication/communication.component';
import { CourseManageComponent } from './course-manage.component';
import { ChapterComponent } from './chapter/chapter.component';
import { SectionComponent } from './section/section.component';
import { CouponEditModalComponent } from './../../../common/coupon-edit-modal/coupon-edit-modal.component';
import { DatePipe } from '@angular/common';
@NgModule({
  imports: [
    CommonModule,
    CourseManageRoutingModule,
    SharedModule,
    GlobalModule,
    ImageCropperModule,
    ReactiveFormsModule,
    CustomDirective,
    CustomPipes,
    NgbModule,
    NgSelectModule,
    CKEditorModule
  
  ],
  declarations: [
    CourseManageLeftPanelComponent,
    TargetYourStudentsComponent,
    CurriculumComponent,
    CourseLandingPageComponent,
    PriceAndCouponsComponent,
    CommunicationComponent,
    CourseManageComponent,
    ChapterComponent,
    SectionComponent
  ],
  entryComponents: [
    ChapterComponent,
    SectionComponent,
    CouponEditModalComponent
  ],
  providers: [DatePipe]
})
export class CourseManageModule { }

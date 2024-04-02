import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TargetYourStudentsComponent } from './target-your-students/target-your-students.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { CourseLandingPageComponent } from './course-landing-page/course-landing-page.component';
import { PriceAndCouponsComponent } from './price-and-coupons/price-and-coupons.component';
import { CommunicationComponent } from './communication/communication.component';
import { CourseManageComponent } from './course-manage.component';

const routes: Routes = [
  {
    path: '',
    component: CourseManageComponent,
    children: [ {
      path: '',
     // component: TargetYourStudentsComponent
     redirectTo: 'target-your-students',
    },
    {
      path: 'target-your-students',
      component: TargetYourStudentsComponent
    },
    {
      path: 'curriculum',
      component: CurriculumComponent
    },
    {
      path: 'course-landing-page',
      component: CourseLandingPageComponent
    },
    {
      path: 'price-and-coupons',
      component: PriceAndCouponsComponent
    },
    {
      path: 'communication',
      component: CommunicationComponent
    },
  ],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseManageRoutingModule { }

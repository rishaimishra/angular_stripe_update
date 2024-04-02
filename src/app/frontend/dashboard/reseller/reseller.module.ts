import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GlobalModule } from '../../../global/global.module';

import { ResellerRoutingModule } from './reseller-routing.module';
import { CoursesManageComponent } from './courses-manage/courses-manage.component';
import { CoursesComponent } from './courses/courses.component';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		GlobalModule,
		ResellerRoutingModule
	],
	declarations: [CoursesManageComponent, CoursesComponent]
})
export class ResellerModule { }

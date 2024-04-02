import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleGuard } from '../../../services/role-guard.service';
import { CoursesManageComponent } from './courses-manage/courses-manage.component';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
	{
		path: '',
		canActivate: [RoleGuard],
		data: { role: 'customer|vendor|reseller|admin' },
		children: [
			{ path: 'courses', component: CoursesComponent },
			{ path: 'courses-manage', component: CoursesManageComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ResellerRoutingModule { }

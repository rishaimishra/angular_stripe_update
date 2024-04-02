import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialIndexComponent } from './tutorial-index/tutorial-index.component';
import { TutorialLectureComponent } from './tutorial-lecture/tutorial-lecture.component';
import { TutorResponseComponent} from './tutor-response/tutor-response.component';

import { RoleGuard } from '../../services/role-guard.service';
import { CourseResolver } from '../../services/course-resolver.service';

const routes: Routes = [
	{
		path: ':slug',
		canActivate: [RoleGuard],
		data: { role: 'customer|admin' },
		component: TutorialIndexComponent,
		resolve: {
			slug: CourseResolver
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TutorialRoutingModule { }

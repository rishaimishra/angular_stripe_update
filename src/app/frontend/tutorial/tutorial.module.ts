import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpModule } from '@angular/http';
import { MomentModule } from 'ngx-moment';

import { CourseResolver } from '../../services/course-resolver.service';
import { QadataService } from '../../services/qadata.service';
import { CustomPipes } from '../../pipe/pipe';
import { ShareButtonModule } from '@ngx-share/button';

import { TutorialRoutingModule } from './tutorial-routing.module';
import { TutorialIndexComponent } from './tutorial-index/tutorial-index.component';
import { OverviewComponent } from './overview/overview.component';
import { CourseContentComponent } from './course-content/course-content.component';
import { QuestionAnswerComponent } from './question-answer/question-answer.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { TutorialLectureComponent } from './tutorial-lecture/tutorial-lecture.component';
import { TutorResponseComponent } from './tutor-response/tutor-response.component';

@NgModule({
  	imports: [
		CommonModule,
		NgbModule,
		TutorialRoutingModule,
		HttpModule,
		MomentModule,
		CustomPipes,
		ShareButtonModule
  	],
  	declarations: [
		TutorialIndexComponent,
		OverviewComponent,
		CourseContentComponent,
		QuestionAnswerComponent,
		BookmarkComponent,
		AnnouncementsComponent,
		TutorialLectureComponent,
		TutorResponseComponent
	],
	providers: [
		CourseResolver,
		QadataService
	]
})
export class TutorialModule { }

import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-course-content',
	templateUrl: './course-content.component.html',
	styleUrls: ['./course-content.component.scss']
})
export class CourseContentComponent implements OnInit {
	@Input() courseDetail: any;
	activeIds: string[] = [];
	cliclableTab: string;
  	constructor() { }

	ngOnInit() {
		this.activeIds 		= ['panel-0'];
		this.cliclableTab 	= 'c';
	}

	openCurrent() {
		this.activeIds = ['panel-0'];
		this.cliclableTab 	= 'c';
	}

	openResourses() {
		this.activeIds = [];
		this.activeIds = [];
		this.courseDetail.course_modules.forEach((element, index) => {
			if (element.resources) {
				this.activeIds.push('panel-' + index);
			}
		});
		this.cliclableTab 	= 'r';
	}

	openAll() {
		this.activeIds = [];
		this.courseDetail.course_modules.forEach((element, index) => {
			this.activeIds.push('panel-' + index);
		});
		this.cliclableTab 	= 'a';
	}
}

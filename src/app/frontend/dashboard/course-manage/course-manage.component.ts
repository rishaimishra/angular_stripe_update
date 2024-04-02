import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-course-manage',
	templateUrl: './course-manage.component.html',
	styleUrls: ['./course-manage.component.scss']
})
export class CourseManageComponent implements OnInit {

	constructor() {
		if (document.getElementById('dynamicStyle')) {
			document.getElementById('dynamicStyle').remove();
		}
	}

	ngOnInit() {
	}

}

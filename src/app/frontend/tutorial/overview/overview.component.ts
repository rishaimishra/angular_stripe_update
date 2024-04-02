import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';

@Component({
	selector: 'app-overview',
	templateUrl: './overview.component.html',
	styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnChanges {
	@Input() courseDetail: any;
	@Output() browseqa_output = new EventEmitter<string>();
	courseId: Number;
	public questions: any = [];
	featureSide = { items: 1, dots: false, nav: true, margin: 0 };
	// see more area
	seeMoreArea: Boolean = false;
	public user: any = [];
	constructor(
		private http: HttpRequestService,
	) { }

	ngOnChanges() {
		this.courseId = this.courseDetail.id;
		this.user = this.http.getUser();
		this.getQuestion();
	}

	ngOnInit() {
		// this.getQuestion();
		// console.log(this.courseDetail);
	}

	public getQuestion() {
		this.http.get(`course-discussion?user=${this.user.id}&course_id=${this.courseId}`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.questions = response['data'];
			}
		}, (errors) => {
		});
	}

	seeMore() {
		// console.log(this.courseDetail);
		this.seeMoreArea = true;
	}

	seeLess() {
		this.seeMoreArea = false;
	}

	getUserName(user) {
		let name = '';

		if (user) {
			name += user.profile.first_name || '';
			name += (user.profile.middle_name) ? ' ' : '';
			name += user.profile.middle_name || '';
			name += (user.profile.last_name) ? ' ' : '';
			name += user.profile.last_name || '';
		}
		return name;
	}
	getSlug(user) {
		let name = '';

		if (user) {
			if (user.profile.middle_name !== null) {
				name += user.profile.first_name + '-' + user.profile.middle_name  + '-' + user.profile.last_name + '-' + user.id;
			} else {
				name += user.profile.first_name + '-' + user.profile.last_name + '-' + user.id;
			}
			name = name.replace(/\s+/g, '-').toLowerCase();
		} else {
			name = '';
		}
		return name.toLowerCase();
	}

	browseqa(id) {

		this.browseqa_output.emit(id);
	}
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { StringToSlug } from '../../../pipe/string-slug.pipe';

import { QadataService } from '../../../services/qadata.service';
import { from } from 'rxjs';

@Component({
	selector: 'app-question-answer',
	templateUrl: './question-answer.component.html',
	styleUrls: ['./question-answer.component.scss'],
	providers: [ StringToSlug ]
})
export class QuestionAnswerComponent implements OnInit {
	@Input() courseDetail: any;
	courseId: Number;

	@Output()
	notify = new EventEmitter();

	public questions: any = [];
	public order_by: any = '-id';
	public listQuestionAnswer = true;
	public addQuestionAnswer  = false;
	public buttonActive		= 0;
	public user: any = [];
	public error_message: any = [];
	public loader = false;
	public message: string;

	public responseCourse: any = [];
  	constructor(
		private http: HttpRequestService,
		private stringToSlug: StringToSlug,
		public qaservice: QadataService
	) { }

  	ngOnInit() {
		this.qaservice.currentMessage.subscribe((res: any) => {
		});
		this.courseId = this.courseDetail.id;
		this.user = this.http.getUser();
		this.getQuestion();
  	}

	public getQuestion() {
		this.http.get(`course-discussion?
				user_id=${this.user.id}
				&course_id=${this.courseId}
				&order_by=${this.order_by}
				&response_count=true`
		).subscribe((response) => {
			if (response['status'] === 'success') {
				// console.log(response['data']);
				this.questions = response['data'];
			}
		}, (errors) => {
			this.error_message = errors.error.message;
		});
	}

	onChangeSort(event) {
		this.order_by =  event.target.value || 'id';
		this.getQuestion();
	}


	askQuestion() {
		this.listQuestionAnswer = false;
		this.addQuestionAnswer  = true;
	}
	cancelQuestionAnswer() {
		this.listQuestionAnswer = true;
		this.addQuestionAnswer  = false;
	}
	onDescriptionKeyUp(event: any) {
		const data = event.target.value;
		if (data) {
			this.buttonActive = 1;
		} else {
			this.buttonActive = 0;
		}
	}

	addNewQuestionAnswer(title: string, description: string) {

		const formValue = {
			title : title,
			description : description,
			user_id: this.user.id,
			course_id: this.courseId,
			slug : this.stringToSlug.transform(title)
		};
		this.http.post(`course-discussion`, formValue).subscribe((response) => {
			if (response) {
				if (response['status'] === 'success') {

					this.listQuestionAnswer = true;
					this.addQuestionAnswer  = false;
					this.getQuestion();

				} else {
					this.error_message = 'Internal Server Error!.';
				}
			}
		}, (errors) => {
			this.error_message = errors.error.errors.title.message;
		});
	}
	search(event: any) {
		const data = event.target.value;
		this.loader = true;
		this.http.get(`course-discussion?
						string=${data}
						&user_id=${this.user.id}
						&course_id=${this.courseId}
						&order_by=${this.order_by}
						&response_count=true`
		).subscribe((response) => {
			this.loader = false;
			if (response) {
				if (response['status'] === 'success') {

					this.listQuestionAnswer = true;
					this.addQuestionAnswer  = false;
					this.questions = response['data'];

				} else {
					this.error_message = 'Internal Server Error!.';
				}
			}
		}, (error) => {
			this.error_message = error.error.message;
		});
	}

	onClickQuestion(question) {
		this.notify.emit(question);
		this.responseCourse = question;
	}

	receiveMessage() {
	}
}



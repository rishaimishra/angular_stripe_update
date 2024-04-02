import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { HttpRequestService } from '../../../services/http-request.service';
import { QadataService } from '../../../services/qadata.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'app-tutor-response',
	templateUrl: './tutor-response.component.html',
	styleUrls: ['./tutor-response.component.scss'],

})
export class TutorResponseComponent implements OnInit, OnChanges {

	@ViewChild('responseInput') responseInput: ElementRef;

	@Input()
	question: any;
	@Output() quEvent = new EventEmitter();
	public user: any = [];
	public error_message: any = null;
	public order_by: any = '-id';
	public courseDiscussionId: any = null;
	public responseDataObj: any = null;
	public buttonActive		= 0;
	public tabs; any = [];
	public message: String;

	constructor(
		private http: HttpRequestService,
		private activatedRoute: ActivatedRoute,
		private myRoute: Router,
		public qaservice: QadataService
	) {

	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes) {
			this.question = changes.question.currentValue;
			this.courseDiscussionId = this.question.id;
		}
	}

	ngOnInit() {
		this.user = this.http.getUser();
		this.getAllResponse();
	}
	responseInputKeyUp(event: any) {
		const data = event.target.value;
		if (data) {
			this.buttonActive = 1;
		} else {
			this.buttonActive = 0;
		}
	}

	public getAllResponse() {
		this.http.get(`course-discussion-response?
			user_id=${this.user.id}
			&course_discussions_id=${this.courseDiscussionId}
			&order_by=${this.order_by}`
		)
		.subscribe((response) => {
			if (response['status'] === 'success') {
				this.responseDataObj = response['data'];
			}
		}, (errors) => {
			this.error_message = 'Internal Server Error!.';
		});
	}

	answerResponse(data: any, question: any) {

		const formValue = {
			comments : data,
			course_discussions_id : question.id,
			user_id: this.user.id
		};
		this.http.post(`course-discussion-response`, formValue).subscribe((response) => {
			if (response) {
				if (response['status'] === 'success') {
					this.responseInput.nativeElement.value = '';
					this.getAllResponse();
				} else {
					this.error_message = 'Internal Server Error!.';
				}
			}
		}, (error) => {
			this.error_message = 'Internal Server Error!.';
		});
	}
	backToAllQuestion() {
		this.quEvent.emit(this.message);
		this.qaservice.getQuestions('get all question');
	}
}

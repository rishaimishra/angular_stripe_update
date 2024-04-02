import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../global/services/common.service';
import { Meta, Title } from '@angular/platform-browser';
declare var videojs: any;

@Component({
	selector: 'app-tutorial-index',
	templateUrl: './tutorial-index.component.html',
	styleUrls: ['./tutorial-index.component.scss'],
	providers: [NgbRatingConfig]
})
export class TutorialIndexComponent implements OnInit, AfterViewInit {
	private videoJSplayer: any;
	featureSide = { items: 1, dots: false, nav: true, margin: 0 };
	// see more area
	seeMoreArea: Boolean = false;
	public error_message: any = [];
	public activeTab: any = {
		name: 'Overview',
		code: 'overview'
	};
	public data: any = [];
	public slug: any;
	public totalLecture: any;
	public currentVideo: any;
	public isQaSec: Boolean = false;
	public duration: any;
	public questionData: any = null;
	BASE_URL: string = environment.base_url;
	public shareUrl: any;
	public display = 'none';
	public copeidTooltip = 0;
	public user: any = [];
	public user_course_id: Number;
	public completedLecture: any;
	public courseProgress: any;
	math: Math = Math;
	public isCompleteCourse: string;
	public continueLectureId: any;
	public resetButton: Boolean = true;
	public isCertified: Boolean = false;
	public certificateLink: string;
	public hasMyReview: Boolean = false;
	public reviewId: number ;

	public tabs: Array<any> = [
		{ name: 'Overview', code: 'overview', tabId: 'ngb-tab-0'},
		{ name: 'Course Content', code: 'course-content', tabId: 'ngb-tab-1'},
		{ name: 'Q&A', code: 'question-answer', tabId: 'ngb-tab-2'},
		// { name: 'Bookmark', code: 'bookmark', tabId: 'ngb-tab-3'},
		{ name: 'Announcements', code: 'annoucements', tabId: 'ngb-tab-3'}
	];

	constructor(
		private http: HttpRequestService,
		public ngxService: NgxUiLoaderService,
		private activatedRoute: ActivatedRoute,
		private myRoute: Router,
		config: NgbRatingConfig,
		private commonService: CommonService,
		private meta:Meta,
    	private titleService: Title,
	) {
		config.max = 5;
		config.readonly = true;
	}

	ngOnInit() {


		this.currentVideo = 'http://vjs.zencdn.net/v/oceans.mp4';
		this.activatedRoute.params.subscribe(routeParams => {
			this.slug = routeParams.slug;
			this.user = this.http.getUser();
			this.getCourse();
		});
	}

	ngAfterViewInit(): void {
		// console.log(this.courseData);
		this.initVideoJs(this.currentVideo);
	}

	initVideoJs(src) {
		var myPlayer = videojs('video_player', {
			'autoplay': false
		});
		myPlayer.src(src);
		this.duration = myPlayer.duration();
		myPlayer.load();
	}

	public getCourse() {
		this.ngxService.start();
		this.http.get(`course/${this.slug}
			?course_lectures=true
			&course_modules=true
			&categories=true
			&user=true
			&user_id=${this.user.id}
			&course_standard=true
			&announcements=true
			&user_course=true
			&course_progress=true
			&review=true
			&customer_count=true
			&isApproved=true`)
		.subscribe((response) => {
			if (response['status'] === 'success') {


				/**
				 * set meta info
				 */

				this.titleService.setTitle(response['data'].title);
				this.meta.addTag({ name: 'description', content: response['data'].meta_description });
				this.meta.updateTag({ name: 'description', content:  response['data'].meta_description });
				this.meta.addTag({ name: 'Keywords', content: response['data'].meta_keywords });
				this.meta.updateTag({ name: 'Keywords', content:  response['data'].meta_keywords });

				
				if (response['data']) {
					this.data = response['data'];
					
					if(this.data.reviews.length> 0) {
						this.hasMyReview = true;
						this.reviewId = this.data.reviews[0].id;
					} else {
						this.hasMyReview = false;
					}
					this.commonService.scrollToElement('mini-cart');
					this.initVideoJs(this.data.promotional_video);
					this.fetchUserCourseDetails(response['data']);
					this.fetchInCompleteLecture(this.data.id);
				} else {
					this.myRoute.navigate(['/404-not-found']);
				}
				this.ngxService.stop();
			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}

	fetchUserCourseDetails(data) {
		this.http.get(`course-user/${data.id}
			?search_by=true
			&user_id=${this.user.id}`)
		.subscribe((response) => {
			if (response['status'] === 'success') {
				if (response['data']) {
					if (response['data'].status === 'cancelled') {
						this.myRoute.navigate(['/course-details/' + this.slug]);
					}
					this.totalLecture 		= response['data'].total_lecture;
					this.completedLecture 	= response['data'].completed_lecture ? response['data'].completed_lecture : 0;
					this.isCompleteCourse 	= response['data'].status;
					this.courseProgress 	= (this.completedLecture / this.totalLecture)*100;
					this.courseProgress 	= this.courseProgress ? this.courseProgress : 0;
					this.user_course_id 	= response['data'].id;
					this.isCertified 		= response['data'].is_certificate_issued === 1 ? true : false;
					this.certificateLink 	= response['data'].certificate_link;
					switch (response['data'].status) {
						case 'enrolled':
							this.updateStatus(response['data'], 'running');
							break;
						case 'running':
							this.updateStatus(response['data'], 'running');
							break;
						default:
							// console.log('complated but nothing happend');
					}
				} else {
					this.myRoute.navigate(['/404-not-found']);
				}
			}
		}, (errors) => {
			this.myRoute.navigate(['/404-not-found']);
		});
	}

	updateStatus(data, status) {
		const formValue = {
			course_id				:	data.course_id,
			status					:	status,
			completed_lecture		:	this.completedLecture,
			is_archived				:	0,
			is_certificate_issued	:	'',
			certificate_link		:	'',
			certificate_issued_on	:	''
		};
		this.http.post(`utility/course-user/status/${data.id}`, formValue).subscribe((response) => {
			if (response) {
				if (response['status'] === 'success') {

				} else {
					this.error_message = 'Internal Server Error!.';
				}
			}
		}, (error) => {
			this.error_message = 'Internal Server Error!.';
		});
	}

	fetchInCompleteLecture(course_id) {
		this.http.get(`course-progress
			?course_id=${course_id}
			&user_id=${this.user.id}
			&is_complete=0`)
		.subscribe((response) => {
			if (response['status'] === 'success') {
				if (response['data'].length) {
					this.continueLectureId = response['data'][0].course_lecture_id;
				} else {
					this.continueLectureId = this.data.course_modules[0].course_lectures[0].id;
				}
			}
		}, (errors) => {
			this.continueLectureId = this.data.course_modules[0].course_lectures[0].id;
		});
	}

	isActiveTab(tab) {
		let flag = false;
		if (tab) {
			if ((tab === 'tutor-response') && (this.isQaSec)) {
				flag = true;
			} else {
				flag = ((tab === this.activeTab.code) && (!this.isQaSec)) ? true : false;
			}
		}
		return flag;
	}

	seeMore() {
		this.seeMoreArea = true;
	}

	onChangeTab(event) {
		if (event) {
			// console.log(event,'event');
			const tab = this.tabs.find((el) => (el.tabId === event.nextId));
			if (tab) {
				this.activeTab = tab;
				this.isQaSec = false;
			}
		}
	}

	onNotifyQuestion(event) {
		this.isQaSec = true;
		this.questionData = event;
	}

	quEvent() {
		this.activeTab = {
			name: 'Q&A',
			code: 'question-answer'
		};
		this.isQaSec = false;
	}

	shareModelOpen() {
		this.display = 'block';
		this.shareUrl = `${this.BASE_URL}${this.myRoute.url}`;
	}
	shareModalClose() {
		this.display = 'none';
	}

	copyInputMessage(inputElement) {
		this.copeidTooltip = 1;

		inputElement.focus();
		inputElement.select();
		document.execCommand('copy');
		inputElement.setSelectionRange(0, 0);
	}

	browseqa_output_parent(e) {
		const qatab = document.getElementById('ngb-tab-' + e);
		qatab.click();
	}

	reset() {
		const formValue = {
			user_id				:	this.user.id,
			course_id			:	this.data.id,
			user_course_id		:	this.user_course_id
		};
		// console.log(formValue);
		this.http.post(`utility/course-progress-reset`, formValue).subscribe((response) => {
			if (response) {
				if (response['status'] === 'success') {
					this.completedLecture 	= 0;
					this.courseProgress 	= 0;
					this.resetButton 		= false;
				} else {
					this.error_message = 'Internal Server Error!.';
				}
			}
		}, (error) => {
			this.error_message = 'Internal Server Error!.';
		});
	}
}

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var videojs: any;

@Component({
	selector: 'app-lecture',
	templateUrl: './lecture.component.html',
	styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit, AfterViewInit, OnDestroy {
	private videoJSplayer: any;
	public videos: any;
	public searchText: any;
	public currentVideo: any;
	public whereYouAt: any;
	public duration: any;
	showNav: Boolean = false;
	public courseSlug: any;
	public lectureSlug: any;
	public courseData: any = [];
	public activeIds: any = [];
	public activeLecture: any = [];
	public lectureId: Number;
	public lectureMode: String;
	public pdfSrc: String;
	public loader = false;
	public error_message: any = [];
	public user: any = [];
	public user_course_id: Number;
	public course_module_id: Number;
	// public searchText: String;
	public totalLecture: Number;
	public completedLecture: Number = 0;
	public isVideoAvail: Boolean = false;
	public isPdfAvail: Boolean = false;
	public videoLoaded: Number;
	public videoLoad: Number;
	public count: Number;
	public currentParent: number;
	public currentChild: number;
	public arrayIndexes: any = [];
	public currentIndex: number;
	public showNext: Boolean = true;
	public flag: Boolean = true;
	public next: any = null;
	public detailsData: any = null;
	public lectureName: any = null;
	public showLectureName: Boolean = false;
	public showCompletedLayout: Boolean = false;
	public currentTime: any = null;
	public globalTimeStore: any = null;
	public globalTimeOut: Boolean = true;
	public myPlayer;
	public lec;

	constructor(
		private http: HttpRequestService,
		public ngxService: NgxUiLoaderService,
		private activatedRoute: ActivatedRoute,
		private myRoute: Router,
	) {
		// this.currentVideo = 'http://vjs.zencdn.net/v/oceans.mp4';
		this.activatedRoute.params.subscribe(routeParams => {
			this.courseSlug = routeParams.courseSlug;
			this.lectureId = routeParams.lectureSlug;
			this.user = this.http.getUser();
			this.ngxService.start();
			// this.getCourse();
		});
		this.pdfSrc = '';
		this.videoLoad = 5;
	}

	ngOnInit() {
		this.getCourse();
	}
	ngAfterViewInit(): void {
	}

	initVideoJs(src, id = null) {
		var options = {};
		var mythis = this;
		mythis.lec = document.getElementById('lecture_' + id);

		if (this.myPlayer == undefined) {
			this.myPlayer = videojs('video_player', options, function onPlayerReady() {
				// =============================================
				this.src(src);
				this.currentTime(mythis.videoLoaded);
				mythis.globalTimeOut = false;
				mythis.callClearInterval();
				// =============================================
				this.on('pause', () => {
					mythis.globalTimeOut = false;
					mythis.callClearInterval();
				});
				// =============================================
				// this.on('waiting', () => {
				// 	mythis.globalTimeOut = false;
				// 	mythis.callClearInterval();
				// });
				// =============================================
				this.on('play', () => {
					mythis.globalTimeOut = true;
					mythis.callSetInterval(this);
				});
				// =============================================
				this.on('ended', () => {
					if (this.duration() == this.currentTime()) {
						mythis.createProgress(1, mythis.secondsToHms(this.duration().toFixed(0)));
						// mythis.nextlitab(mythis.currentIndex + 1 );
						mythis.chapterTransacton(mythis.currentIndex);
						mythis.lec.innerHTML = '<button><i class="fa fa-check-circle" aria-hidden="true"></i></button>';
					}
				});
				// =============================================
			});
		} else {
			mythis.globalTimeOut = false;
			mythis.callClearInterval();
			this.myPlayer.pause();
			this.myPlayer.src(src);
			this.myPlayer.load();
			this.myPlayer.currentTime(this.videoLoaded);
			this.myPlayer.play();
		}
		this.ngxService.stop();
	}

	chapterTransacton(currentIndex) {
		this.showNav = false;
		const getNextIndex = currentIndex + 1;
		if (this.arrayIndexes.length !== getNextIndex ) {
			// this.showCompletedLayout = false;
			const curId = this.arrayIndexes[getNextIndex].split('-');
			this.currentParent = curId[0];
			this.currentChild = curId[1];
			this.currentIndex = this.arrayIndexes.indexOf(this.currentParent + '-' + this.currentChild);
			this.detailsData = this.courseData.course_modules[this.currentParent].course_lectures[this.currentChild];

			if (this.detailsData.lecture_mode === 'video') {
				this.showLectureName = true;
				this.lectureName = this.detailsData.title;
				setTimeout(() => {
					this.nextVideoClick(this.currentIndex);
				}, 1000);
			} else {
				setTimeout(() => {
					this.nextVideoClick(this.currentIndex);
				}, 1000);
			}

		} else {
			this.showCompletedLayout = true;
			this.showNext = false;
		}
	}

	nextVideoClick(videoIndex) {
		this.showCompletedLayout = false;
		this.nextlitab(videoIndex);
		this.showLectureName = false;
	}

	cancelVideo() {
		this.showLectureName = false;
	}

	callSetInterval(vThis) {
		this.globalTimeStore = setInterval(() => {
			if (this.globalTimeOut === true) {
				this.currentTime = vThis.currentTime();
				this.createProgress(0, this.secondsToHms(this.currentTime.toFixed(0)));
			}
		}, 30000);
	}

	callClearInterval() {
		clearInterval(this.globalTimeStore);
		this.globalTimeOut = false;
	}

	nextlitab(i) {
		this.next = i;
		if (this.arrayIndexes.length !== this.next) {
			const curId = this.arrayIndexes[this.next].split('-');
			this.currentParent = curId[0];
			this.currentChild = curId[1];
			this.currentIndex = this.arrayIndexes.indexOf(this.currentParent + '-' + this.currentChild);
			this.activeIds.push('panel-' + this.courseData.course_modules[this.currentParent].id);
			this.showNext = true;
			this.clickVideo(this.courseData.course_modules[this.currentParent].course_lectures[this.currentChild]);
		} else {
			this.showNext = false;
		}
	}

	setVideo(lecture, readTime) {
		this.lectureId = lecture.id;
		this.lectureMode = lecture.lecture_mode;
		this.course_module_id = lecture.course_module_id;
		this.currentParent = lecture.parent_index;
		this.currentChild = lecture.child_index;
		this.currentIndex = this.arrayIndexes.indexOf(this.currentParent + '-' + this.currentChild);
		this.createProgress(0, readTime);
		if (lecture.lecture_mode === 'video') {
			this.isVideoAvail = true;
			let pdfid = document.getElementById('pdf_viewer');
			pdfid.style.setProperty('display', 'none', 'important');
			let videoid = document.getElementById('video_player');
			videoid.style.setProperty('display', 'block');
			this.currentVideo = lecture.lecture_link;
			this.initVideoJs(lecture.lecture_link, lecture.id);
		} else {
			let videoid = document.getElementById('video_player');
			videoid.style.setProperty('display', 'none', 'important');
			let pdfid = document.getElementById('pdf_viewer');
			pdfid.style.setProperty('display', 'block');
			this.pdfSrc = lecture.lecture_link;
		}
	}

	getCourse() {
		const paramsObj = {
			course_lectures: true,
			course_modules: true,
			categories: true,
			user: this.user.id,
			course_standard: true,
			announcements: true,
			course_progress: true,
			isApproved: true,
		};
		this.http.setModule('course').findOne(this.courseSlug, paramsObj)
			.subscribe((response) => {
				if (response.status === 'success') {

					if (response.data) {
						this.courseData = response.data;
						this.courseData.course_modules.forEach((element, index) => {
							element.course_lectures.forEach((value, key) => {
								value.parent_index = index;
								value.child_index = key;
								value.is_complete = Object.keys(value.user_course_progresses).length === 0 ? 0 : value.user_course_progresses.is_complete;
								this.arrayIndexes.push(index + '-' + key);
								if (value.id == this.lectureId) {
									this.activeIds.push('panel-' + value.course_module_id);
									this.course_module_id = value.course_module_id;
									this.getReadTime(value);
									this.currentParent = value.parent_index;
									this.currentChild = value.child_index;
								}
							});
						});
						this.currentIndex = this.arrayIndexes.indexOf(this.currentParent + '-' + this.currentChild);
						this.fetchUserCourseDetails(this.courseData);

					} else {
						this.myRoute.navigate(['/404-not-found']);
					}
				}
			}, (errors) => {
				this.myRoute.navigate(['/404-not-found']);
			});
	}

	clickVideo(lecture) {
		// this.myRoute.navigate(['/tutorial/' + this.courseSlug + '/' + lecture.id]);
		this.myRoute.navigate(['/tutorial/' + this.courseSlug + '/' + lecture.id]).then(()=>{
			// do whatever you need after navigation succeeds
			this.getReadTime(lecture);
		});
	}

	getReadTime(lecture) {
		this.http.get(`course-progress
			?course_id=${this.courseData.id}
			&course_lecture_id=${lecture.id}
			&user_id=${this.user.id}`)
			.subscribe((response) => {
				if (response['status'] === 'success') {
					if (response['data'].length > 0 && response['data'][0].read_time !== '0:00') {
						if (response['data'][0].is_complete === 1) {
							this.videoLoaded = 0;
							this.setVideo(lecture, '0:00');
						} else {
							this.videoLoaded = this.hmsToSecondsOnly(response['data'][0].read_time);
							this.setVideo(lecture, response['data'][0].read_time);
						}
					} else {
						this.videoLoaded = 0;
						this.setVideo(lecture, '0:00');
					}
				}
			}, (errors) => {
				this.videoLoaded = 0;
				this.setVideo(lecture, '0:00');
			});
	}

	fetchUserCourseDetails(data) {
		this.http.get(`course-user/${data.id}
			?search_by=true
			&user_id=${this.user.id}`)
			.subscribe((response) => {
				if (response['status'] === 'success') {
					this.totalLecture = response['data'].total_lecture;
					this.completedLecture = response['data'].completed_lecture;
					if (response['data']) {
						this.user_course_id = response['data'].id;
						switch (response['data'].status) {
							case 'enrolled':
								this.updateStatus(this.user_course_id, data.id, 'enrolled');
								break;
							case 'running':
								this.updateStatus(this.user_course_id, data.id, 'running');
								break;
							default:
						}
					} else {
						this.dashboard();
					}
				}
			}, (errors) => {
				this.dashboard();
			});
	}

	updateStatus(user_course_id, course_id, status) {
		const formValue = {
			course_id: course_id,
			status: status,
			completed_lecture: this.completedLecture,
			is_archived: 0,
			is_certificate_issued: '',
			certificate_link: '',
			certificate_issued_on: ''
		};
		this.http.post(`utility/course-user/status/${user_course_id}`, formValue).subscribe((response) => {
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

	createProgress(isComplete, duration) {
		if (isComplete === 0) {
			isComplete = (this.lectureMode === 'pdf') ? 1 : 0;
		}
		this.http.get(`course-progress
			?course_id=${this.courseData.id}
			&course_lecture_id=${this.lectureId}
			&user_id=${this.user.id}`)
			.subscribe((res) => {
				if (res['status'] === 'success') {
					if (res['data'].length > 0) {
						if (res['data'][0].is_complete === 0) {
							const formValue = {
								user_id: this.user.id,
								course_id: this.courseData.id,
								user_course_id: this.user_course_id,
								course_module_id: this.course_module_id,
								course_lecture_id: this.lectureId,
								is_complete: isComplete,
								read_time: duration
							};
							this.http.put(`course-progress/${res['data'][0].id}`, formValue).subscribe((response) => {
								if (response) {
									if (response['status'] === 'success') {
										if (isComplete === 1) {
											this.completedLecture = +this.completedLecture + 1;
											if (this.completedLecture === this.totalLecture) {
												this.updateStatus(this.user_course_id, this.courseData.id, 'completed');
											} else {
												this.updateStatus(this.user_course_id, this.courseData.id, 'running');
											}
										}
									} else {
										this.error_message = 'Internal Server Error!.';
									}
								}
							}, (error) => {
								this.error_message = 'Internal Server Error!.';
							});
						}
					} else {
						const formValue = {
							user_id: this.user.id,
							course_id: this.courseData.id,
							user_course_id: this.user_course_id,
							course_module_id: this.course_module_id,
							course_lecture_id: this.lectureId,
							is_complete: isComplete,
							read_time: duration
						};
						this.http.post(`course-progress`, formValue).subscribe((response) => {
							if (response) {
								if (response['status'] === 'success') {
									if (isComplete === 1) {
										this.completedLecture = +this.completedLecture + 1;
										// this.completedLecture = res['data'][0].completed_lecture + 1;
										if (this.completedLecture === this.totalLecture) {
											this.updateStatus(this.user_course_id, this.courseData.id, 'completed');
										} else {
											this.updateStatus(this.user_course_id, this.courseData.id, 'running');
										}
									}
								} else {
									this.error_message = 'Internal Server Error!.';
								}
							}
						}, (error) => {
							this.error_message = 'Internal Server Error!.';
						});
					}
				}
			}, (errors) => {
				this.dashboard();
			});
	}

	dashboard() {
		this.myRoute.navigate(['/tutorial/' + this.courseSlug]).then(() => window.location.reload());
		
	}

	navBtn() {
		this.showNav = true;
	}
	cnacelBtn() {
		this.showNav = false;
	}

	search(event: any) {
		const data = event.target.value;
		this.loader = true;
		this.http.get(`course-discussion?string=${data}`).subscribe((response) => {
			this.loader = false;
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

	secondsToHms(d) {
		d = Number(d);
		// let h = Math.floor(d / 3600);
		const m = Math.floor(d % 3600 / 60);
		const s = Math.floor(d % 3600 % 60);
		// return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
		return ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
	}

	hmsToSecondsOnly(str) {
		const p = str.split(':');
		let s = 0;
		let m = 1;
		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}
		return s;
	}

	ngOnDestroy() {
		// this.videoJSplayer.dispose();
	}
}

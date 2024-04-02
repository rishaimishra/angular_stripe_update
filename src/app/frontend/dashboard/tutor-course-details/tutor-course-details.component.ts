import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TutorQuestionAnswerReplyModalComponent } from '../tutor-question-answer-reply-modal/tutor-question-answer-reply-modal.component';

import { IssueCertificateCompletionModalComponent } from '../issue-certificate-completion-modal/issue-certificate-completion-modal.component';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-tutor-course-details',
  templateUrl: './tutor-course-details.component.html',
  styleUrls: ['./tutor-course-details.component.scss']
})
export class TutorCourseDetailsComponent implements OnInit {
	private toasterService: ToasterService;
  public courseSlug: number;
  public dashboardData: any;
  public courseData: any;
  public userDetails; any = [];
  public notificationRecords: any= [];

  constructor(
    private myRoute: Router,
		toasterService: ToasterService,
		private commonService: CommonService,
    private httpService: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    public SeoService:SeoServiceService
  ) {
    this.toasterService = toasterService;
   }

  ngOnInit() {
    window.scroll(0,0);
    this.SeoService.getMetaInfo();
    this.courseSlug = this.activatedRoute.snapshot.params['slug'];
    this.userDetails = this.httpService.getUser();
    this.getCourseDetails();
    this.getNotificationRecords();
  }
  getNotificationRecords() {
    // console.log('aa');
		this.httpService.get(`utility/lastest-dashboard-notifications/${this.userDetails.id}?profile=true&user=true&role=${this.httpService.getUserRole()[0]}`).subscribe((response) => {
		  if (response['status'] === 'success') {
			this.notificationRecords = response['data'];

			localStorage.setItem('notificationRecords', JSON.stringify(this.notificationRecords));
			localStorage.setItem('notificationCount',this.notificationRecords.length);
			// console.log(this.notificationRecords);
		  // console.log(JSON.parse(localStorage.getItem('notificationRecords')));
		  }
		}, (errors) => {
		  this.commonService.showErrors(errors);
		});
	  }

  getCourseDetails() {
		// this.ngxService.start();

		this.httpService.get(`course/${this.courseSlug}?course_modules=true&course_lectures=true&categories=true&user=true`).subscribe((response) => {
			if (response['status'] === 'success') {
        this.courseData = response['data'];
      //  console.log(this.courseData);
				this.getCourseDashboardData();
		//		this.ngxService.stop();
			}
		}, (errors) => {
			window.scroll(0, 0);
		//	this.ngxService.stop();
		});
	}

  public getCourseDashboardData() {
    window.scrollTo(0,0);
    this.ngxService.start();
	

		this.httpService.get(`dashboard/${this.courseData.id}?search_by=vendor_course`).subscribe((response) => {
			
			this.ngxService.stop();
      if (response['status'] === 'success') {
        this.dashboardData =  response['data'];
       // console.log( this.dashboardData.order_list);
      }
    }, (error) => {
      // console.log(error);
      this.ngxService.stop();
		});
  }

  replyModal(questionId, questionData) {


    this.httpService.get(`course-discussion-response?course_discussions_id=${questionId}&order_by=-id`).subscribe((response) => {
			
			this.ngxService.stop();
      if (response['status'] === 'success') {
      // console.log( response['data']);
       

        const modalRef = this.modalService.open(TutorQuestionAnswerReplyModalComponent);
        modalRef.componentInstance.questionId = questionId;
        modalRef.componentInstance.questionData = questionData;
        modalRef.componentInstance.discussiondata = response['data'];
        // modalRef.componentInstance.walletBalance = this.walletData.amount;
        modalRef.result.then((result) => {
        

            }).catch((error) => {
              //  console.log(error);
            });
        }
    }, (error) => {
      // console.log(error);
      this.ngxService.stop();
    });
    
  }

  certificateModal(enrolStudentId) {
   
        const modalRef = this.modalService.open(IssueCertificateCompletionModalComponent);
        modalRef.componentInstance.enrolStudentId = enrolStudentId;
        modalRef.result.then((result) => {
          this.getCourseDashboardData();
        }).catch((error) => {
              //  console.log(error);
        });
  }

}

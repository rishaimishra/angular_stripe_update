import { Component, OnInit ,Input} from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
    FormBuilder,
    Validators,
    FormGroup } from '@angular/forms';
import { HttpRequestService } from '../../../services/http-request.service';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutor-question-answer-reply-modal',
  templateUrl: './tutor-question-answer-reply-modal.component.html',
  styleUrls: ['./tutor-question-answer-reply-modal.component.scss']
})
export class TutorQuestionAnswerReplyModalComponent implements OnInit {

  
  @Input() questionId: any;
  @Input() questionData:any;
  @Input() discussiondata:any;

  replyForm: FormGroup;
  public messages: any = [];
  private toasterService: ToasterService;
  constructor(
    toasterService: ToasterService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private http: HttpRequestService,
    private commonService: CommonService,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
  ) { 
    this.toasterService = toasterService;
  }

  ngOnInit() {
    // console.log(this.discussiondata);
    this.replyForm = this.fb.group({
      comments: ['', [Validators.required]],
      user_id:[this.http.getUser().id,],
      course_discussions_id:[this.questionId]
    });
  }

  replyAnswer() {

    if (this.replyForm.valid  ) {
    // console.log(this.registrationForm.value);
      const form_data = this.replyForm.value;
     
      //this.ngxService.start();
  
      this.http.post(`course-discussion-response`, form_data).subscribe((response) => {
      //  this.ngxService.stop();
        if (response['status'] === 'success') {
         this.toasterService.pop('success', 'Replied successfully');
         // this.errorMsg = false;
         this.activeModal.close();
        //  this.myRoute.navigate(['dashboard/my-wallet']);

        }
      }, (errors) => {
       //console.log(errors);
       // this.ngxService.stop();
       // this.messages = errors;
       // this.successMsg = '';
       // this.errorMsg = true;
    
       //this.toasterService.pop('error', 'Error', errors.error.message);
       this.commonService.showErrors(errors);
      });
    }
  }

  

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup,AbstractControl } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { ToasterService } from 'angular2-toaster';
import { S3BucketService } from '../../../services/s3-bucket.service';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-ticket-reply',
  templateUrl: './ticket-reply.component.html',
  styleUrls: ['./ticket-reply.component.scss']
})
export class TicketReplyComponent implements OnInit {
 
  public ticketId = '';
  public replyForm: FormGroup;
  public ticketDetails: any;
  public conversations: Array<any> = [];
  public selector: string = '.main-panel';
  public curUser= this.httpService.getUser();
  public Editor = ClassicEditor;
  public replies: Array<any>=[];
  public conversationFetchParams: any = {
    ticketId:'',
    page: 0,
    
  };
  public conversationFetchStatus: boolean = true;
  public ckConfig = {
      toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
      heading: {
          options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
          ]
      }
  } ;

  public fileInstance: any  = null;
  public resource: any;
  public fileType = ['mp4', 'mkv', '3gp', 'pdf','csv','xlsx','zip', 'rar','docx','ppt'];
  public replyShowStatus : boolean = true;

  constructor(
    private toasterService: ToasterService,
    public router: Router,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private httpService: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    protected s3: S3BucketService,
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    if (this.route.snapshot.params['id']) {
			this.ticketId = this.route.snapshot.params['id'];
    } 
    this.replyForm = this.fb.group({
      id: this.ticketId,
      description:['', [ Validators.required]],
    });
    this.ngxService.start();
    this.getDetails();
  }

   

  getDetails() {
   // this.replies = this.replies.concat(this.response.data);

    this.ngxService.start();

    this.httpService.getUserObservable().pipe(
      mergeMap((user) => {
        if (user) {
          //this.searchParams.vendor_id = user.user.id;
          // return this.httpService.setModule('orders').search(this.searchParams);
          return this.httpService.setModule('supportTicket').findOne(this.ticketId);
        }
      })
    ).subscribe((response) => {
      //this.ngxService.stop();
      if (response) {
        if (Object.keys(response.data).length > 0) {
          this.ticketDetails = response.data;
          //this.conversations = response.data.conversations;
          // if(this.conversations.length < 10) {
          //   this.conversationFetchStatus = false;
          // }
          // console.log(this.ticketDetails);

           this.getConversation();

         
        }
      }
    }, (error) => {
      this.ngxService.stop();
      if (error) {
        this.commonService.showErrors(error);
      }
    });
  }

  onScroll() {
    
    if(this.conversationFetchStatus){
      
      this.getConversation();
    }
  }
  getConversation () {
    this.ngxService.start();

    this.httpService.getUserObservable().pipe(
      mergeMap((user) => {
        if (user) {
          this.conversationFetchParams.ticketId = this.ticketId;
          this.conversationFetchParams.page += 1;
          return this.httpService.setModule('supportTicketConversation').search(this.conversationFetchParams);
        }
      })
    ).subscribe((response) => {
      this.ngxService.stop();
      if (response) {
         
         if(response.data.length < 30){
           this.conversationFetchStatus = false;
         }

        this.conversations = this.conversations.concat(response.data);
      }
    }, (error) => {
      this.ngxService.stop();
      this.commonService.showErrors(error);
    });
  }

  getCkeditorText () {
    console.log(this.replyForm.value.description);
    console.log(this.replyForm.value.description.replace(/<[^>]*>/gi, '').replace(/&nbsp;/g, '').length);
  }

  uploadAttachmentFile(event) {
    const fileName = event.target.files[0];
    const fileExt = fileName.name.split('.').slice(-1)[0];

    if (this.fileType.indexOf(fileExt) !== -1) {
    this.fileInstance = event;
    // this.fileInstance = event;
    } else {
      alert('Only docx, pdf,csv,xlsx,zip, rar,mp4, mkv, 3gp,ppt format are supported');
    }
  }

  public uploadToS3 () {
    const file = this.fileInstance.target.files[0];
    console.log(file);
    if(file.size < 15000000) {
      this.ngxService.start();
      this.s3.fileUpload(file).send((err, data) => {
        if (err) {
          this.ngxService.stop();
          // console.log(err);
        
        } else {
  
          this.ngxService.stop();
        //  console.log(data.Location);
          this.resource = data.Location;
        }
      });
    } else {
      this.fileInstance = '';
      this.toasterService.pop('error','file size less than 15 mb');
    }
    
  }


  replySubmit() {
    let formData = this.replyForm.value;
    // console.log(this.replyForm.valid);
    // console.log(formData);
    if(this.replyForm.value.description.replace(/<[^>]*>/gi, '').replace(/&nbsp;/g, '').length) {
        this.ngxService.start();
        formData['attachments']=this.resource;
        this.httpService.setModule('ticketReply').update(formData).subscribe((response) => {
          if (response) {
            this.conversations.push(response['data']);
            this.replyForm.reset();
            this.replyForm.controls['id'].setValue(this.ticketId);
            this.resource = '';
            this.fileInstance = '';
            this.toasterService.pop('success', 'Replied successfully');
            this.ngxService.stop();
          
          }
        }, (error) => {
          this.ngxService.stop();
          this.commonService.showErrors(error);
        });
    } else {
      this.toasterService.pop('error', 'Please fill all required filed');
    }
  }

  replyShow() {
    console.log('q');
    this.replyShowStatus = !this.replyShowStatus;   
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpRequestService } from '../../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../../global/services/common.service';


import { RequestOptions, ResponseContentType } from '@angular/http';

@Component({
  selector: 'app-ticket-reply-modal',
  templateUrl: './ticket-reply-modal.component.html',
  styleUrls: ['./ticket-reply-modal.component.scss']
})
export class TicketReplyModalComponent implements OnInit {
 
  public ticketId = '';
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
  
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private httpService: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
   
  ) { }

  ngOnInit() {
    window.scroll(0, 0);
    if (this.route.snapshot.params['id']) {
			this.ticketId = this.route.snapshot.params['id'];
    } 
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
     // this.ngxService.stop();
      if (response) {
        if (Object.keys(response.data).length > 0) {
          this.ticketDetails = response.data;
          // this.conversations = response.data.conversations;
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
          // return this.httpService.setModule('orders').search(this.searchParams);
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

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { HttpRequestService } from '../../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../../global/services/common.service';
import { ToasterService } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { S3BucketService } from '../../../../services/s3-bucket.service';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.scss']
})
export class TicketCreateComponent implements OnInit {

  public showStatus: boolean = false;
  public createTicketForm: FormGroup;
  public Editor = ClassicEditor;
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
  public subjects: Array<any> =[
    {
      label:'Payment issues',
      value:'Payment issues'
    },
    {
      label:'Event ticket email not received',
      value:'Event ticket email not received'
    },
    {
      label:'SXL issues',
      value:'SXL issues'
    },
    {
      label:'Payout issues',
      value:'Payout issues'
    },
    {
      label:'Tutor commission issues etc',
      value:'Tutor commission issues etc'
    },
    {
      label:'Others',
      value:'Others'
    },

  ];

  public statusList: Array<any> =[
      {
        label:'Open',
        value:'2'
      },
      {
        label:'Pending',
        value:'3'
      },
      {
        label:'Resolved',
        value:'4'
      },
      {
        label:'Closed',
        value:'5'
      },
      {
        label: 'Waiting on Customer',
        value: '6'
      },
      {
        label: 'Waiting on Third Party',
        value: '7'
      }
    
  ];

  public priorities: Array<any> =[
    {
      label:'Low',
      value:'1'
    },
    {
      label:'Medium',
      value:'2'
    },
    {
      label:'High',
      value:'3'
    },
    {
      label:'Urgent',
      value:'4'
    },
  
];
public fileInstance: any  = null;
public resource: any;
public fileType = ['mp4', 'mkv', '3gp', 'pdf','csv','xlsx','zip', 'rar','docx','ppt'];

  constructor(
    private toasterService: ToasterService,
    private fb: FormBuilder,
    private httpService: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    public router: Router,
    protected s3: S3BucketService,
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.ngxService.start();
    this.ngxService.stop();
    this.createTicketForm = this.fb.group({
      subject: ['', [Validators.required]],
      other: [''],
      email:[this.httpService.getUser().email],
      status:['2', [Validators.required]],
      priority:['1', [Validators.required]],
      description:['', [Validators.required]],
      attachment:['', ],
		});
  }
  onChangeSubject(subjectValue) {
    if(subjectValue == 'Others') {
      this.showStatus = true;
    } else {
      this.showStatus = false;
    }
     


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

  ticketSubmit() {
 
  
      if(this.createTicketForm.valid && this.createTicketForm.value.description.replace(/<[^>]*>/gi, '').replace(/&nbsp;/g, '').length) {

           console.log(this.createTicketForm.value);

          this.ngxService.start();
          let formData = this.createTicketForm.value;
          // if(formData.subject == 'Others') {
          //   formData.subject = formData.other; 
          // }
          // delete formData.other;
          formData['attachments']=this.resource;
          console.log(formData);
          this.httpService.setModule('supportTicket').create(formData).subscribe((response) => {
            this.ngxService.stop();
            if (response) {
            
              this.toasterService.pop('success', 'Ticket Created');
              this.router.navigate(['/dashboard', 'support-ticket']);
            }
          }, (error) => {
            this.ngxService.stop();
            this.commonService.showErrors(error);
          });
      } else {
        this.toasterService.pop('error', 'Please fill all required filed');
      }
    } 
   

}

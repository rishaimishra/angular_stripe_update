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
import { S3BucketService } from '../../../services/s3-bucket.service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-issue-certificate-completion-modal',
  templateUrl: './issue-certificate-completion-modal.component.html',
  styleUrls: ['./issue-certificate-completion-modal.component.scss'],
  providers: [DatePipe]
})
export class IssueCertificateCompletionModalComponent implements OnInit {
  @Input() enrolStudentId: any;

  public certificateInstance: any  = null;
  public certificateFileType = ['pdf', 'doc'];
  public certificate: any;
  public newResourceSelectFile:boolean = false;
  public newUplodedResource:boolean = false;
  certificateIssueForm: FormGroup;
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
    protected s3: S3BucketService,
    public datepipe: DatePipe
  ) { 
    this.toasterService = toasterService;
  }

  ngOnInit() {
    window.scroll(0,0);
    let latest_date =this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.certificateIssueForm = this.fb.group({
      is_certificate_issued: ['1'],
      certificate_link:[''],
      certificate_issued_on:[latest_date]
    });
  }

  uploadResourceFile(event) {
    const fileName = event.target.files[0];
    const fileExt = fileName.name.split('.').slice(-1)[0];
 

      if (this.certificateFileType.indexOf(fileExt) !== -1) {
        this.certificateInstance = event;
        this.newResourceSelectFile = true;
        this.newUplodedResource=false;
      } else {
        alert('Only pdf, doc format are supported');
      }
  }

  public uploadResourceToS3 () {
    const file = this.certificateInstance.target.files[0];
   // console.log(file);
    this.ngxService.start();
    this.s3.fileUpload(file).send((err, data) => {
      if (err) {
        this.ngxService.stop();
       // console.log(err);
      
      } else {
      
        this.ngxService.stop();
      //  console.log(data.Location);
        this.certificate = data.Location;
        this.newResourceSelectFile=false;
        this.newUplodedResource=true;
      }
    });
  }

  uploadCertificate() {
    if(this.certificate) {
      const form_data = this.certificateIssueForm.value;
      form_data['certificate_link']= this.certificate;
      // console.log(form_data);
      this.http.post(`utility/course/upload/certificate/${this.enrolStudentId}`, form_data).subscribe((response) => {
        //  this.ngxService.stop();
          if (response['status'] === 'success') {
           this.toasterService.pop('success', 'Certificate uploded successfully');
           // this.errorMsg = false;
           this.activeModal.close();
          //  this.myRoute.navigate(['dashboard/my-wallet']);
  
          }
        }, (errors) => {
         this.commonService.showErrors(errors);
        });
    }
   
  }

}

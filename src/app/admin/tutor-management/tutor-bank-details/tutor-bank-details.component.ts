import { Component, OnInit } from '@angular/core';
import {HttpRequestService} from '../../../services/http-request.service';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import {ExcelService} from '../../../global/services/excel.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-tutor-bank-details',
  templateUrl: './tutor-bank-details.component.html',
  styleUrls: ['./tutor-bank-details.component.scss']
})
export class TutorBankDetailsComponent implements OnInit {
  public data : any = [];
	public success_messages : any = [];
	public error_messages : any = [];
	public searchParams: any = {};
  searchForm: FormGroup;
  public exceldata: any = [];
  public notificationRecords: any= [];
  constructor(
    private fb: FormBuilder,
		private commonService: CommonService,
    protected http:HttpRequestService,
    private excelService:ExcelService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.searchForm = this.fb.group({
			string: [''],
		  });
    this.getBankDetails();
    this.getNotificationRecords();
  }
  getNotificationRecords() {
   
		this.http.get(`utility/lastest-dashboard-notifications/${this.http.getUser().id}?profile=true&user=true&role=${this.http.getUserRole()[0]}`).subscribe((response) => {
		  if (response['status'] === 'success') {
		  this.notificationRecords = response['data'];
	  
		  localStorage.setItem('notificationRecords', JSON.stringify(this.notificationRecords));
		  localStorage.setItem('notificationCount',this.notificationRecords.length);
		  //console.log(this.notificationRecords);
		   // console.log(JSON.parse(localStorage.getItem('notificationRecords')));
		  }
		}, (errors) => {
		//  this.commonService.showErrors(errors);
		});
		}
  public getBankDetails(){
    window.scroll(0,0);
    this.ngxService.start();
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('bankDetails').search(this.searchParams);
				}
			})
		).subscribe((response) => {
      this.ngxService.stop();
			if (response) {
				this.data = response['data'];
				this.exceldata = this.data.map((element) => {
          let bankInfo = {
            tutorId:'',
            tutorName : '',
            userEmail: '',
            bankName: '',
            branchName: '',
            branchAddress: '',
            branchCode: '',
            branchAccountNo: '',
            accountHolderName: '',
            branchAccountType: '',
            wireTransferCode: '',
          };
          bankInfo.tutorId = this.getUserID(element.user.id);
          bankInfo.tutorName = element.user.profile.full_name;
          bankInfo.userEmail = element.user.email;
          bankInfo.bankName = element.bank_name;
          bankInfo.branchName = element.branch_name;
          bankInfo.branchAddress = element.branch_address;
          bankInfo.branchCode = element.branch_code;
          bankInfo.branchAccountNo = element.account_no;
          bankInfo.accountHolderName = element.account_holder_name;
          bankInfo.branchAccountType = element.account_type;
          bankInfo.wireTransferCode = element.wire_transfer_code;
          return bankInfo;
        });
			}
		}, (error) => {
      this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}
  search() {
		
		const form_data = this.searchForm.value;
		this.searchParams.string = form_data['string'];
		this.getBankDetails();
  }
  
  exportAsXLSX():void {
   // console.log(this.exceldata);
    this.excelService.exportAsExcelFile(this.exceldata, 'bank-details');
  }

  getUserID(id){
		return environment.vendorIdPrefix + id;
	}
	public goToTop() {
		window.scroll(0,0);
	}
}

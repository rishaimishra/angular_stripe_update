import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PayoutCommentModalComponent } from '../../payout-comment-modal/payout-comment-modal.component';
@Component({
  selector: 'app-payout-list',
  templateUrl: './payout-list.component.html',
  styleUrls: ['./payout-list.component.scss']
})
export class PayoutListComponent implements OnInit {

  public error_messages: any = [];
  public user: any;
  public notificationRecords: any= [];
  public limit: Number = 10;
  private toasterService: ToasterService;
  public records: any= [];
  public searchParams: any = {
   
    pagination: true,
    limit: this.http.adminPerPage,
    page: 1,
    wallet: true
  };
  public paginationObj: any;
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    toasterService: ToasterService,
    protected http: HttpRequestService,
    protected activeRoute: ActivatedRoute,
    private render: Renderer,
    private ngxService: NgxUiLoaderService,
    private myRoute: Router,
    private modalService: NgbModal,
  ) { 
    this.toasterService = toasterService;
  }

  ngOnInit() {
    window.scroll(0,0);
    this.getNotificationRecords();

    this.activeRoute.queryParams.subscribe((response) => {
    const page = response.page ? response.page : 1;
    this.getPayoutRecords();
    
    });
    this.searchForm = this.fb.group({
			string: [''],
		  });
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
		  this.commonService.showErrors(errors);
		});
	  }


    getPayoutRecords() {
      window.scroll(0,0);
    this.ngxService.start();
    this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('payoutTransactions').list(this.searchParams);
				}
			})
		).subscribe((response) => {
      this.ngxService.stop();
			if (response) {
					this.records = response.data;
        // console.log(this.records);
        this.paginationObj = response.pagination;
       // console.log( response.pagination.page);

			}
		}, (error) => {
      this.ngxService.stop();
			this.commonService.showErrors(error);
		});
  }

	pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getPayoutRecords();
		}
  }
  payoutCommentModal(userId, walletId, amount, id) {
    const modalRef = this.modalService.open(PayoutCommentModalComponent);
    modalRef.componentInstance.userId = userId;
    modalRef.componentInstance.walletId = walletId;
    modalRef.componentInstance.amount = amount;
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      // console.log(result,'result');
      if(result.status == 'success') {
        this.records.find(function(element) {
          if(element.id==id) {
            element.status=result.data.status;
          }
        });
      }
		}).catch((error) => {
		  // console.log(error,'error');
		});
  }
  search() {
		
    const form_data = this.searchForm.value;
    this.searchParams.page = 1;
		this.searchParams.string = form_data['string'];
		this.getPayoutRecords();
	}
  
}

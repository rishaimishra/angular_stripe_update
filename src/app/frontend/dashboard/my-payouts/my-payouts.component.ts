import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';

import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PayoutComponent } from '../payout/payout.component';
import { ActivatedRoute, Router} from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
  selector: 'app-my-payouts',
  templateUrl: './my-payouts.component.html',
  styleUrls: ['./my-payouts.component.scss']
})
export class MyPayoutsComponent implements OnInit {

  public records: Array<any> = [];
	public data: any;
  public walletId: number;
  public walletData: any;
	public walletSearchParams: any = {
		user_id: this.httpService.getUser().id,
  };
  public payoutRecordsParams: any = {};

	public paginationObj: any;
  public anyPayoutPending: boolean ;

	constructor(
		private commonService: CommonService,
		private httpService: HttpRequestService,
    private modalService: NgbModal,
		private activeRoute: ActivatedRoute,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
    this.getWalletRecords();
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
    this.activeRoute.queryParams.subscribe((response) => {
      const page = response.page ? response.page : 1;
      if(page>1){
        this.getPayoutRecords();
      }
		
		//	this.ngxService.stop();
			});
	}

	getWalletRecords() {
		this.ngxService.start();
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.httpService.setModule('wallet').search(this.walletSearchParams);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				this.walletData = response.data[0];
				if(response.data.length>0){
					this.walletId=response.data[0].id;
        }
        
        this.payoutRecordsParams ={
          user_id:this.httpService.getUser().id,
          wallet_id:this.walletId,
          user:true,
          wallet:true,
          pagination:true,
					limit:this.httpService.vendorPerPage,
				//	limit:200,
          page:1,
        }; 
        this.getPayoutRecords();
			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
  }
  
  getPayoutRecords() {
		window.scroll(0,0);
		if(this.walletId) {
			this.ngxService.start();
			this.httpService.getUserObservable().pipe(
				mergeMap((user) => {
					if (user) {
						return this.httpService.setModule('payoutTransactions').search(this.payoutRecordsParams);
					}
				})
			).subscribe((response) => {
				this.ngxService.stop();
				if (response) {
					this.data = response.data;
					if(response.data.length>0){
						this.records = response.data;
					}
					// console.log(this.records);
					this.paginationObj = response.pagination;
				// console.log( response.pagination.page);
					if(response.pagination.page==1){
						this.anyPayoutPending=this.data.some((element) => element.status== 'pending') ;
						//console.log( this.anyPayoutPending);
					}
				}
			}, (error) => {
				this.ngxService.stop();
				this.commonService.showErrors(error);
			});
		}
  }

	pagination(event) {
		if (event) {
			this.payoutRecordsParams.page = event.page;
			this.getPayoutRecords();
		}
	}

	payOutModal () {

		const modalRef = this.modalService.open(PayoutComponent);
    modalRef.componentInstance.walletId = this.walletId;
    modalRef.componentInstance.walletBalance = this.walletData.amount;
		modalRef.result.then((result) => {
	
			this.getPayoutRecords();

		}).catch((error) => {
			//  console.log(error);
		});
	}

}

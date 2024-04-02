import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WalletDetailsComponent } from '../wallet-details/wallet-details.component';
import { PayoutComponent } from '../payout/payout.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {ExcelService} from '../../../global/services/excel.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
	selector: 'app-my-wallet',
	templateUrl: './my-wallet.component.html',
	styleUrls: ['./my-wallet.component.scss']
})
export class MyWalletComponent implements OnInit {

	public records: Array<any> = [];
	public data: any;
	public walletId: number;
	public exceldata: any = [];
	public searchParams: any = {
		pagination: true,
		limit: this.httpService.vendorPerPage,
		// limit:200,
		page: 1,
		user_id: this.httpService.getUser().id,
		user: true,
		wallet_transaction: true,
	};
	public walletTransactionSearchParam: any;

	public paginationObj: any;

	constructor(
		private commonService: CommonService,
		private httpService: HttpRequestService,
		private modalService: NgbModal,
		private activeRoute: ActivatedRoute,
		private ngxService: NgxUiLoaderService,
		public datepipe: DatePipe,
		private excelService:ExcelService,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.activeRoute.queryParams.subscribe((response) => {
			const page = response.page ? response.page : 1;
			this.getWalletRecords();
			// this.ngxService.stop();
		});
		this.getWalletRecords();
	}

	getWalletRecords() {
		this.ngxService.start();
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.httpService.setModule('wallet').search(this.searchParams);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			if (response) {
				this.data = response.data[0];
				if (response.data.length > 0) {
					// this.records = response.data[0].wallet_transactions;
					this.walletId = response.data[0].id;

					this.walletTransactionSearchParam = {
						pagination: true,
						limit: this.httpService.vendorPerPage,
						// limit: 2,
						page: 1,
						wallet: true,
						product_detail: true,
						product_detail_user: true,
						status: 'complete',
						wallet_id: this.walletId
					};
					this.getTransactionRecords();

				}
				// console.log(this.records);

			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}

	getTransactionRecords() {
		window.scroll(0,0);
		this.ngxService.start();
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.httpService.setModule('walletTransactions').search(this.walletTransactionSearchParam);
				}
			})
		).subscribe((response) => {
			this.ngxService.stop();
			this.records = response.data;
			this.paginationObj = response.pagination;
			this.exceldata = this.records.map((element) => {
				let walletInfo = {
					particulars:'',
					transactionableType:'',
					amount:'',
					type:'',
					status:'',
					date:'',
				};
				walletInfo.particulars = element.description;
				walletInfo.transactionableType = element.transactionable_type;
				walletInfo.amount = element.amount;
				walletInfo.type = element.type;
				walletInfo.status = element.status;
				walletInfo.date = this.datepipe.transform(element.created_at, 'yyyy-MM-dd');
				
				return walletInfo;
			  });
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}

	pagination(event) {
		if (event) {
			this.walletTransactionSearchParam.page = event.page;
			this.getTransactionRecords();
		}
	}

	transactionDetaisModal(transId) {
		const modalRef = this.modalService.open(WalletDetailsComponent);
		modalRef.componentInstance.transactionDetails = this.records.find((element) => element.id === transId);
	}

	get checkVendor(): any {
		if (localStorage.getItem('userRole') === 'vendor') {
			return true;
		} else {
			return false;
		}
	}

	payOutModal() {

		const modalRef = this.modalService.open(PayoutComponent);
		modalRef.componentInstance.walletId = this.walletId;

	}
	exportAsXLSX():void {
		// console.log(this.exceldata);
		this.excelService.exportAsExcelFile(this.exceldata, 'walletInfo');
	}
}

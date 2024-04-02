import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { HttpRequestService } from '../../../../services/http-request.service';
import { CommonService } from '../../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-bank-details-index',
  templateUrl: './bank-details-index.component.html',
  styleUrls: ['./bank-details-index.component.scss']
})
export class BankDetailsIndexComponent implements OnInit, AfterViewInit {
  private toasterService: ToasterService;
  public records: Array<any> = [];
  
  public searchParams: any = {
		pagination: true,
		limit: this.httpService.vendorPerPage,
    page: 1,
    user_id: this.httpService.getUser().id,
	};

  public paginationObj: any;
  
  constructor(
    toasterService: ToasterService,
		private commonService: CommonService,
    private httpService: HttpRequestService,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService
  ) { 
    this.toasterService = toasterService;
  }

  ngOnInit() {
	
		this.SeoService.getMetaInfo();
		this.getBankDetails();
	}

	ngAfterViewInit() {
  }
  
  public getBankDetails() {
    window.scrollTo(0,0);
    this.ngxService.start();
		this.httpService.setModule('bankDetails').search(this.searchParams).subscribe((response) => {
			if (response) {
				window.scroll(0,0);
				this.records = response.data;
				this.paginationObj = response.pagination;
			
      }
      this.ngxService.stop();
		}, (error) => {
      // console.log(error);
      this.ngxService.stop();
		});
  }
  pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getBankDetails();
		}
  }
  
  deleteRecord(id) {
		if (id) {
			if (confirm('Are you sure?')) {
				this.httpService.setModule('bankDetails').deleteOne({id: id}).subscribe((response) => {
					if (response) {
						this.toasterService.pop('success', 'Bank Details deleted');

						const idx = this.records.findIndex((el) => {
							return (el.id === id);
						});
						if (idx > -1) {
							this.records.splice(idx, 1);
						}
					}
				}, (error) => {
					this.toasterService.pop('success', 'Failed to delete product');
				});
			}
		} else {
			this.toasterService.pop('error', 'Details is not available');
		}
	}

}

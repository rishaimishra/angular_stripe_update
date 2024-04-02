import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-payment-category-list',
  templateUrl: './payment-category-list.component.html',
  styleUrls: ['./payment-category-list.component.scss']
})
export class PaymentCategoryListComponent implements OnInit {

  public error_messages: any = [];
  public user: any;
  public limit: Number = 10;
  public data: any = [];
  private toasterService: ToasterService;
  public records: any = [];
  public formObj: any = {};
  public searchParams: any = {
   
    pagination:true,
    limit:this.http.adminPerPage,
    page:1,
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
  ) { 
    this.toasterService = toasterService;
    this.formObj={
      id:'',
      is_active:'',
    }
  }
  public notificationRecords: any= [];
  ngOnInit() {
		window.scroll(0,0);
    this.user = this.http.getUser();
 
    this.getNotificationRecords();
    this.activeRoute.queryParams.subscribe((response) => {
    const page = response.page ? response.page : 1;
    this.getPaymentCategoryRecords();
   
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
		//  this.commonService.showErrors(errors);
		});
	  }

    getPaymentCategoryRecords() {
			window.scroll(0,0);
    this.ngxService.start();
    this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					return this.http.setModule('paymentCategory').list(this.searchParams);
				}
			})
		).subscribe((response) => {
      this.ngxService.stop();
			if (response) {
				this.records = response.data;
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
			this.getPaymentCategoryRecords();
		}
  }
	editTeam(paymentCategory): void {
    this.myRoute.navigate([`admin/payment-category/edit/${paymentCategory.id}`]);
  }

  changeActiveStaus(isActiveStatus, id, index) {
		this.ngxService.start();
    
    if (isActiveStatus === 0) {
      this.formObj.id = id;
      this.formObj.is_active = 1;
		} else {
      this.formObj.id = id;
      this.formObj.is_active = 0;
		}
    this.http.setModule('paymentCategory').update(this.formObj).subscribe((response) => {
			if (response['status'] === 'success') {

				this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].is_featured = updateData.is_featured;

				this.records.find(function (element) {
					if (element.id === id) {
						element.is_active = updateData.is_active;
					}
				});

			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.commonService.showErrors(errors);
		});
	}

  deleteRecord(id) {
		if (id) {
		
				this.http.setModule('paymentCategory').deleteOne({id: id}).subscribe((response) => {
					if (response) {
						this.toasterService.pop('success', 'Payment category deleted');

						const idx = this.records.findIndex((el) => {
							return (el.id === id);
						});
						if (idx > -1) {
							this.records.splice(idx, 1);
						}
					}
				}, (error) => {
					this.toasterService.pop('error', 'Failed to delete payment category');
				});
			
		} else {
			this.toasterService.pop('error', 'Payment category is not available');
		}
	}

  search() {	
    const form_data = this.searchForm.value;
    this.searchParams.page = 1;
		this.searchParams.string = form_data['string'];
		this.getPaymentCategoryRecords();
	}


}

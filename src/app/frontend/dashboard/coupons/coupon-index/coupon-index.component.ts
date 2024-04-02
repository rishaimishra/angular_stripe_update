import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpRequestService } from '../../../../services/http-request.service';
import { CommonService } from '../../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { SeoServiceService }  from '../../../../services/seo-service.service';
import { CouponEditModalComponent } from '../../../../common/coupon-edit-modal/coupon-edit-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-coupon-index',
  templateUrl: './coupon-index.component.html',
  styleUrls: ['./coupon-index.component.scss']
})
export class CouponIndexComponent implements OnInit {
  public user: any;
	public error_messages 	: any = [];
	public data 			: any = [];
	public success_messages	: any = [];
	public queryParams: any = {
		limit: this.http.vendorPerPage,
    page: 1,
    pagination: true,
	};
	searchForm: FormGroup;
	private toasterService: ToasterService;
  public notificationRecords: any= [];
  public courseId: any;
	public paginationObj: any;


  	constructor(
		protected http          : HttpRequestService,
		protected activeRoute   : ActivatedRoute,
		private render:Renderer,
		private fb: FormBuilder,
		private commonService: CommonService,
		private ngxService: NgxUiLoaderService,
		toasterService: ToasterService,
		public SeoService:SeoServiceService,
		private modalService: NgbModal,
	){
		this.toasterService = toasterService;
	}

  	ngOnInit() {
			window.scroll(0,0);
			this.SeoService.getMetaInfo();
			this.user = this.http.getUser();
			this.searchForm = this.fb.group({
				string: [''],
				});
			this.getCoupons();	
			this.getNotificationRecords();
			const dtObj = new Date();
	
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

	public getCoupons(){ 
	
    this.ngxService.start(); 
    const route_params = this.activeRoute.snapshot.params;
    this.courseId = route_params.id;
	  this.queryParams.course_id = this.courseId;
		this.http.get('course-coupon', this.queryParams).subscribe((response)=>{
			 // console.log(response);
			this.ngxService.stop();
			if(response['status'] === 'success'){
				this.data = response['data'];	
				window.scroll(0,0);			
			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		  })
	}
	public removeCategory(category_id,index){
		this.http.delete(`category/${category_id}`).subscribe((response)=>{
			if(response['status'] == 'success'){
				this.getCoupons();
				this.paginationObj = response['pagination'];
			}
		})
	}	

	pagination(event) {
    if (event) {
      this.queryParams.page = event.page;
      this.getCoupons();
    }
  }
	search() {
		
		const form_data = this.searchForm.value;
		this.queryParams.string = form_data['string'];
		this.getCoupons();
	}
  public removeCoupon(id, index) {
    alert('Are you sure?');
		this.http.delete(`course-coupon/${id}`).subscribe((response)=>{
			if(response['status'] === 'success'){
			//  this.data.splice(index, 1);
			this.getCoupons();
        this.toasterService.pop('success', 'Deleted successfully');
        window.scrollTo(0,0);
			}
		});
	}

	changeEndDateModal(couponId , currentEnddate, startDate) {
    const modalRef = this.modalService.open(CouponEditModalComponent);
		modalRef.componentInstance.couponId = couponId;
		modalRef.componentInstance.currentEnddate = currentEnddate;
		modalRef.componentInstance.startDate = startDate;
		modalRef.result.then((result) => {
		//	console.log(result);
			//  this.myRoute.navigate(['/dashboard', 'course-promote-checkout']);
			this.getCoupons();
		}).catch((error) => {
				 //  console.log(error);
		});
  }

}

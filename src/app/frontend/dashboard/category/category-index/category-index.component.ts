import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpRequestService } from '../../../../services/http-request.service';
import { bounceOutRight} from '../../../../common/animation';
import { $ } from 'protractor';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { SeoServiceService }  from '../../../../services/seo-service.service';
import { EncrDecrService } from '../../../../services/encr-decr.service';
import { environment as env } from '../../../../../environments/environment';


@Component({
  selector: 'app-category-index',
  templateUrl: './category-index.component.html',
  styleUrls: ['./category-index.component.scss']
})
export class CategoryIndexComponent implements OnInit {
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
	public categoryType:string;
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
		private EncrDecr: EncrDecrService
	){
		this.toasterService = toasterService;
		this.categoryType= this.activeRoute.snapshot.url[0].path;
	}

  	ngOnInit() {
			window.scroll(0,0);
			this.SeoService.getMetaInfo();
			this.user = this.http.getUser();
			this.searchForm = this.fb.group({
				string: [''],
				});
			this.getCategories();	
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

	public getCategories(){ 
	
		this.ngxService.start(); 
		this.queryParams.parent = true;
		this.queryParams.type = this.categoryType;     
		this.http.get('category', this.queryParams).subscribe((response)=>{
			// console.log(response);
			this.ngxService.stop();
			if(response['status'] === 'success'){
				this.data = response['data'];	
				this.paginationObj = response['pagination'];
				window.scroll(0,0);			
			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		  })
	}

	pagination(event) {
    if (event) {
      this.queryParams.page = event.page;
      this.getCategories();
    }
  }

	public removeCategory(category_id,index){
		this.http.delete(`category/${category_id}`).subscribe((response)=>{
			if(response['status'] == 'success'){
				this.toasterService.pop('success', 'Category deleted successfully');
				this.getCategories();
			}
		})
	}	
	search() {
		
		const form_data = this.searchForm.value;
		this.queryParams.string = form_data['string'];
		this.getCategories();
	}

	changeActiveStaus(isActiveStatus, categoryId, index) {
		this.ngxService.start();
    let url3rdSegment;
    if (isActiveStatus == 0) {
		url3rdSegment = 'active';
    } else {
		url3rdSegment = 'in_active';
    }
		// this.http.get(`course?category=${categoryId}`).subscribe((response) => {
		// 	if (response['status'] === 'success') {
		// 		if (response['data'].length > 0) {
		// 			this.ngxService.stop();
		// 			this.toasterService.pop('error', 'Category Already use in  some course');
		// 		} else {
					this.http.get(`utility/action/${url3rdSegment}/categories/${categoryId}/admin/${this.user.id}`).subscribe((response) => {
						if (response['status'] === 'success') {
						
							this.ngxService.stop();
						const updateData = response['data'];
						// this.data[index].is_featured = updateData.is_featured;

								this.data.find(function(element) {
									if(element.id == categoryId) {
										element.is_active=updateData.is_active;
									}
								});

						}
					}, (errors) => {
						this.ngxService.stop();
						this.error_messages = errors;
						this.commonService.showErrors(errors);
					});

		// 		}

		// 	}
		// }, (errors) => {
		// 	this.ngxService.stop();
		// 	this.error_messages = errors;
		// });
		
						
	}
	setCurrentCategory(categoryId){
		localStorage.setItem('currentCategory', this.EncrDecr.set(env.encrDecrKey,JSON.stringify(categoryId)));
	}
}

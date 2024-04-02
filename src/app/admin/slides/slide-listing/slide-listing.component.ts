import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { bounceOutRight} from '../../../common/animation';
import { $ } from 'protractor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-slide-listing',
  templateUrl: './slide-listing.component.html',
  styleUrls: ['./slide-listing.component.scss']
})
export class SlideListingComponent implements OnInit {

  public error_messages 	: any = [];
	public users			: any = [];
  public pagination       : any = [];
	public limit            : number = 15;	
	public data 			: any = [];
	public pages: any = [];
  public pageType = 'home';
	public searchParams: any = {};
	searchForm: FormGroup;
	public notificationRecords: any= [];
  	constructor(
		protected http          : HttpRequestService,
		protected activeRoute   : ActivatedRoute,
		private render:Renderer,
		private ngxService: NgxUiLoaderService,
		private myRoute: Router,
		private fb: FormBuilder,
		private commonService: CommonService,
	){}

  	ngOnInit() {
			window.scroll(0,0);
			this.ngxService.start();
		this.getPage();
		this.activeRoute.queryParams.subscribe((response)=>{
            let page = response.page ? response.page : 1;
			this.getSlides(this.pageType);
		  this.ngxService.stop();
		});
		this.searchForm = this.fb.group({
			string: [''],
		  });
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
	getPage() {
		this.http.get(`utility/application/config?section=slider_page`).subscribe((response)=>{
							if (response['status'] === 'success') {
								this.pages = response['data'];
							}
			});
	}
	public getSlides(pageType, page : number=1, limit: number =1){
		window.scroll(0,0);
		this.searchParams.page = pageType;
		this.pageType = pageType;
		this.ngxService.start();
		this.http.get('page-slider',this.searchParams).subscribe((response)=>{	
			this.ngxService.stop();
			if(response['status'] == 'success'){
				this.data= response['data'];
			}
		},(errors)=>{
			this.ngxService.stop();
			this.error_messages = errors;
		})
	}

	public removePages(page_id,index){
		this.http.delete(`cms-page/${page_id}`).subscribe((response)=>{
			if(response['status'] == 'success'){
				this.data.splice(index,1);
				this.commonService.showMessage({ type: 'success', title: '', message: 'Record deleted' });
			}
		})
	}

	editSlide(slide): void {
    localStorage.removeItem('editSlideId');
    localStorage.setItem('editSlideId', slide.id.toString());
    this.myRoute.navigate(['admin/slides/edit']);
  }

	public removeSlides(slide_id,index){
		this.http.delete(`page-slider/${slide_id}`).subscribe((response)=>{
			if(response['status'] == 'success'){
				this.data.splice(index,1);
				this.commonService.showMessage({ type: 'success', title: '', message: 'Record deleted' });
			}
		})
	}

	search() {
		
		const form_data = this.searchForm.value;
		this.searchParams.string = form_data['string'];
		this.getSlides(this.pageType);
	}
	public goToTop() {
		window.scroll(0,0);
	}
}

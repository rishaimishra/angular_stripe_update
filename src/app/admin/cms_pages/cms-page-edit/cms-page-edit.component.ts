import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { CmsPageCollection } from '../../../_collection/cms_pages.collection';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StringToSlug } from '../../../pipe/string-slug.pipe';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-cms-page-edit',
	templateUrl: './cms-page-edit.component.html',
	styleUrls: ['./cms-page-edit.component.css'],
	providers: [ StringToSlug ]
})

export class CmsPageEditComponent implements OnInit {

	public error_messages 		: any = [];
	public page_id				: number;	
	public postForm				: any;
	public formData				: any = new CmsPageCollection();	
	public newSlug					: any = [];

	
	public Editor = ClassicEditor;
	public notificationRecords: any= [];

  	constructor(
		protected http          : HttpRequestService,
		protected router        : Router,
		protected activeRoute   : ActivatedRoute,
		private stringToSlug	: StringToSlug,
		private ngxService: NgxUiLoaderService,
	){}

  	ngOnInit() {
			window.scroll(0,0);
			this.getParames();
			this.getNotificationRecords();
		}	

	protected getParames (){
		let route_params = this.activeRoute.snapshot.params;
		this.page_id = route_params.id;
		this.getPage();
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
		
	public getPage(){
		this.ngxService.start();
		this.http.get(`cms-page/${this.page_id}`).subscribe((response)=>{
			this.ngxService.stop();
            if(response['status'] == 'success'){               
				this.formData = response['data'];				
            }
		}, (errors) => {
			this.ngxService.stop();
		})
	}

	public saveCmsPage(instance){
		let form_data 	           = instance.value;
		let newSlug = this.stringToSlug.transform(form_data.name);

		if(newSlug !== form_data['old_slug']){
			form_data['slug'] = newSlug;
		}		
		
		this.http.put(`cms-page/${this.page_id}`,form_data).subscribe((response)=>{            
			if(response['status'] === 'success'){
			this.router.navigate(['/admin/pages']);
			}
		},(errors)=>{
			this.error_messages = errors;
		})
	}
}

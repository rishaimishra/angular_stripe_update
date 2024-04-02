import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { CmsPageCollection } from '../../../_collection/cms_pages.collection';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StringToSlug } from '../../../pipe/string-slug.pipe';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-cms-page-create',
	templateUrl: './cms-page-create.component.html',
	styleUrls: ['./cms-page-create.component.css'],
	providers: [StringToSlug]
})
export class CmsPageCreateComponent implements OnInit {

	public error_messages: any = [];
	public formData: any = new CmsPageCollection();
	public Editor = ClassicEditor;
	public notificationRecords: any= [];
	constructor(
		protected http: HttpRequestService,
		protected router: Router,
		private stringToSlug: StringToSlug,
		private ngxService: NgxUiLoaderService,
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.ngxService.start();
		this.ngxService.stop();
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
	public saveCmsPage(instance) {
		let form_data = instance.value;
		form_data['slug'] = this.stringToSlug.transform(form_data.name);
		this.http.post('cms-page', form_data).subscribe((response) => {
			if (response['status'] == 'success') {
				this.router.navigate(['/admin/pages']);
			}
		}, (errors) => {
			this.error_messages = errors;
		})

	}
}

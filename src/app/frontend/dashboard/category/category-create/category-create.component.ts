import { Component, OnInit, NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../../../services/http-request.service';
import { CategoryCollection } from '../../../../_collection/category.collection';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { StringToSlug } from '../../../../pipe/string-slug.pipe';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {
  public error_messages: any = [];
	public formData: any = new CategoryCollection();
	public items: any = [];
	public grpCityArr: any = [];

	public categories: any = [];
	public user: any;
	public notificationRecords: any= [];
	public categoryType:string;

	constructor(
		protected http: HttpRequestService,
		protected router: Router,
		//private stringToSlug: StringToSlug,
		private ngxService: NgxUiLoaderService,
		protected activeRoute   : ActivatedRoute,
		public SeoService:SeoServiceService
	) {
		this.categoryType= this.activeRoute.snapshot.url[0].path;
	 }

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.user = this.http.getUser();
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

	public getCategories() {
		this.ngxService.start(); 
		this.http.get(`category?parent_id=0&is_active=true&type=${this.categoryType}`).subscribe((response) => {
			this.ngxService.stop(); 
			if (response['status'] === 'success') {
				const itemsDate = [{'id': 0, 'name': '-- Select Category --' }];
				response['data'].forEach(item => {
					itemsDate.push(item);
				});
				this.categories = itemsDate;
			}
		}, (error) => {
			this.ngxService.stop();
		  });
	}

	public saveCategory(instance) {
		const formData = instance.value;
		formData['parent_id'] = (formData['parent_id'] === null) ? 0 : formData['parent_id'];
	//	formData['slug'] = this.stringToSlug.transform(formData.name);
		formData['type'] = this.categoryType;
		formData['created_by'] = this.user.id;
		this.http.post('category', formData).subscribe((response) => {
			if (response['status'] === 'success') {
				this.router.navigate([`/dashboard/${this.categoryType}/category`]);
			}
		}, (errors) => {
			this.error_messages = errors;
		});
	}

	groupValueFn = (_: string, children: any[]) => ({ name: children[0].parent.name, total: children.length });
}

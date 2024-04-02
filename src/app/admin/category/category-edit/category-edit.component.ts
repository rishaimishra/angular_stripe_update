import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { CategoryCollection } from '../../../_collection/category.collection';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StringToSlug } from '../../../pipe/string-slug.pipe';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-category-edit',
	templateUrl: './category-edit.component.html',
	styleUrls: ['./category-edit.component.css'],
	providers: [StringToSlug]
})

export class CategoryEditComponent implements OnInit {

	public error_messages: any = [];
	public category_id: number;
	public categories: any = [];
	public formData: any = new CategoryCollection();
	public newSlug: any = [];
	public user: any;
	public notificationRecords: any= [];
	public categoryType:string;


	constructor(
		protected http: HttpRequestService,
		protected router: Router,
		protected activeRoute: ActivatedRoute,
		private stringToSlug: StringToSlug,
		private ngxService: NgxUiLoaderService,
	) {
		this.categoryType= this.activeRoute.snapshot.url[0].path;
	 }

	ngOnInit() {
		window.scroll(0,0);
		this.user = this.http.getUser();
		this.getCategories();
		this.getParames();
		this.getCategory();
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

	public getParames = function () {
		const route_params = this.activeRoute.snapshot.params;
		this.category_id = route_params.id;
	};

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


	public getCategory() {
		this.http.get(`category/${this.category_id}`).subscribe(response => {
			if (response['status'] === 'success') {
				this.formData = response['data'];
			}
		});
	}

	public saveCategory(instance) {
		const form_data = instance.value;
		const newSlug = this.stringToSlug.transform(form_data.name);
		if (newSlug !== form_data['old_slug']) {
			form_data['slug'] = newSlug;
		}
		form_data['created_by'] = this.user.id;
		form_data['type'] = this.categoryType;
		this.http.put(`category/${this.category_id}`, form_data).subscribe((response) => {
			if (response['status'] === 'success') {
				this.router.navigate([`/admin/${this.categoryType}/category`]);
			}
		}, (errors) => {
			this.error_messages = errors;
		});
	}

	groupValueFn = (_: string, children: any[]) => ({ name: children[0].parent.name, total: children.length });

}

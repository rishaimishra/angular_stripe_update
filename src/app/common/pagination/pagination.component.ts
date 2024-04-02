import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../services/http-request.service';

@Component({
	selector: 'post-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

	@Input() pagination: any

	public base_path: string = null;

	constructor(
		protected http: HttpRequestService,
		protected router: Router,
		protected activeRoute: ActivatedRoute,
	) { }


	ngOnInit() {
		this.base_path = this.router.url.split('?')[0];
	}

	public getCurrentPage() {
		let current_page = this.activeRoute.snapshot.queryParamMap.get('page');
		return current_page ? current_page : 1;
	}

	public pageChange(page) {
		this.router.navigate([this.base_path], { queryParams: { page: page } });
	}

	public nextPage() {
		let page = this.getCurrentPage();
		let nextPage = +page + 1;
		this.router.navigate([this.base_path], { queryParams: { page: nextPage } });
	}

	public previousPage() {
		let page = this.getCurrentPage();
		let previousPage = +page - 1;
		this.router.navigate([this.base_path], { queryParams: { page: previousPage } });
	}
}

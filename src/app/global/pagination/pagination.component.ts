import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html',
	styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges, AfterViewInit {

	@Input() pagination: any;
	@Output() prevPageEvent = new EventEmitter<any>();
	@Output() nextPageEvent = new EventEmitter<any>();
	@Output() listPageEvent = new EventEmitter<any>();

	public currentPage: number;
	public totalPage: number;

	public firstPaginationArr: Array<any> = [];
	public lastPaginationArr: Array<any> = [];

	public base_path: string = null;

	constructor(
	) { }


	ngOnInit() {
		// this.base_path = this.router.url.split('?')[0];
	}

	ngOnChanges(changes: SimpleChanges) {
		if ('pagination' in changes) {
			this.currentPage = changes.pagination.currentValue.page;
			this.totalPage = changes.pagination.currentValue.pageCount;
			this.generatePaginationList();
		}
	}

	ngAfterViewInit() {}

	generatePaginationList() {
		this.firstPaginationArr = [];
		this.lastPaginationArr = [];
		if (this.totalPage > 3) {
			
			for (let index = this.currentPage; index < (this.currentPage + 2) && index <= this.totalPage-2 ; index++) {
				const element = {
					page: index,
					value: index
				};
				this.firstPaginationArr.push(element);
			}

			for (let index = (this.totalPage - 1); index <= this.totalPage; index++) {
				const element = {
					page: index,
					value: index
				};
				this.lastPaginationArr.push(element);
			}
		} else {
			for (let index = 1; index <= this.totalPage; index++) {
				const element = {
					page: index,
					value: index
				};
				this.firstPaginationArr.push(element);
			}
		}
	}

	// public getCurrentPage() {
	// 	let current_page = this.activeRoute.snapshot.queryParamMap.get('page');
	// 	return current_page ? current_page : 1;
	// }

	// public pageChange(page) {
	// 	this.router.navigate([this.base_path], { queryParams: { page: page } });
	// }

	// public nextPage() {
	// 	let page = this.getCurrentPage();
	// 	let nextPage = +page + 1;
	// 	this.router.navigate([this.base_path], { queryParams: { page: nextPage } });
	// }

	// public previousPage() {
	// 	let page = this.getCurrentPage();
	// 	let previousPage = +page - 1;
	// 	this.router.navigate([this.base_path], { queryParams: { page: previousPage } });
	// }

	previousPage(event) {
		this.currentPage -= 1;
		const pageObj = {
			event: event,
			page: this.currentPage
		};
		this.prevPageEvent.emit(pageObj);
	}

	nextPage(event) {
		this.currentPage += 1;
		const pageObj = {
			event: event,
			page: this.currentPage
		};
		this.nextPageEvent.emit(pageObj);
	}

	listPage(event, page) {
		this.currentPage = page.value;
		const pageObj = {
			event: event,
			page: this.currentPage
		};
		this.listPageEvent.emit(pageObj);
	}

	getPreviousDisableClass() {
		let cssClass = '';
		if (this.currentPage === 1) {
			cssClass = 'disabled';
		}
		return cssClass;
	}

	getNextDisableClass() {
		let cssClass = '';
		if (this.currentPage === this.totalPage) {
			cssClass = 'disabled';
		}
		return cssClass;
	}

	getActiveClass(value) {
		let cssClass = '';
		if (this.currentPage === value) {
			cssClass = 'active';
		}
		return cssClass;
	}

}

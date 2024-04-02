import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { HttpRequestService } from '../../../../services/http-request.service';
import { CommonService } from '../../../../global/services/common.service';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
	selector: 'app-product-index',
	templateUrl: './product-index.component.html',
	styleUrls: ['./product-index.component.css']
})
export class ProductIndexComponent implements OnInit, AfterViewInit {

	private toasterService: ToasterService;
	public records: Array<any> = [];
	public statusArr: Array<any> = [
		{
			code: 'draft',
			name: 'Draft',
			cssClass: 'badge badge-warning'
		},
		{
			code: 'publish',
			name: 'Publish',
			cssClass: 'badge badge-success'
		},
		{
			code: 'unpublish',
			name: 'Unpublish',
			cssClass: 'badge badge-danger'
		}
	];

	public searchParams: any = {
		fetch_price: true,
		pagination: true,
		order_by: '-id',
		limit: this.httpService.vendorPerPage,
		page: 1
	};

	public paginationObj: any;

	constructor(
		toasterService: ToasterService,
		private commonService: CommonService,
		private httpService: HttpRequestService,
		public SeoService:SeoServiceService
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.getProducts();
	}

	ngAfterViewInit() {
	}

	public getProducts() {
		this.httpService.setModule('product').search(this.searchParams).subscribe((response) => {
			if (response) {
				this.records = response.data;
				this.paginationObj = response.pagination;
			}
		}, (error) => {
			// console.log(error);
		});
	}

	_statusSelection(record) {
		let selectedStatus = null;
		if (record) {
			selectedStatus = this.statusArr.find((el) => (el.code === record.status));
		}
		return selectedStatus;
	}

	getStatusTest(record: any) {
		let status = '';

		const selectedStatus = this._statusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.name;
		}
		return status;
	}

	setProductStatus(record: any) {
		let status: string;
		if (record) {
			if (record.status == 'draft') {
				status = 'publish';
			} else {
				status = 'draft';
			}
			let statusData: any = {
				id: record.id,
				status: status,
				type:'products'
			};
			if (confirm('Are you sure want to change product status?')) {
				this.httpService.post(`utility/product/status`, statusData).subscribe((response) => {
					if (response) {

						this.toasterService.pop('success', 'Successfully change the status.');
						this.getProducts();
					}
					// console.log(response);
				}, (error) => {
					this.commonService.showErrors(error);
				});

			}
		}
	}

	getStatusClass(record: any) {
		let status = '';

		const selectedStatus = this._statusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.cssClass;
		}
		return status;
	}

	pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getProducts();
		}
	}

	getDiscountedPrice(record) {
		let price = 0;
		if (record) {
			price = record.price;
			if (parseInt(record.discount, 10) > 0) {
				price = price - ((price * parseInt(record.discount, 10)) / 100);
			}
		}
		return price;
	}

	deleteRecord(id) {
		if (id) {
			if (confirm('Are you sure?')) {
				this.httpService.setModule('product').deleteOne({id: id}).subscribe((response) => {
					if (response) {
						this.toasterService.pop('success', 'Product deleted');

						const idx = this.records.findIndex((el) => {
							return (el.id === id);
						});
						if (idx > -1) {
							this.records.splice(idx, 1);
						}
					}
				}, (error) => {
					this.toasterService.pop('success', 'Fai;ed to delete product');
				});
			}
		} else {
			this.toasterService.pop('error', 'Product is not available');
		}
	}

}

import { Component, OnInit, Renderer  } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { bounceOutRight} from '../../../common/animation';
import { $ } from 'protractor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

	public error_messages: any = [];
	public user: any;
	public pagination: any = [];
	public limit: Number = 10;
	public data: any = [];
	private toasterService: ToasterService;

	public featureYes = '<i class="fa fa-check-circle" aria-hidden="true"></i>';
	public featureNo = '<i class="fa fa-circle-thin" aria-hidden="true"></i>';

  	constructor(
		toasterService: ToasterService,
		protected http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
		private render: Renderer,
		private ngxService: NgxUiLoaderService,
		private myRoute: Router,
	) { 
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.user = this.http.getUser();
		this.ngxService.start();

		this.activeRoute.queryParams.subscribe((response) => {
			const page = response.page ? response.page : 1;
			this.getProducts(page);
			this.ngxService.stop();
		});
	}

	public getProducts(page: number= 1, limit: number = 1) {
		window.scroll(0,0);
		this.http.get(`product?categories=1&user=1`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.data = response['data'];
			}
		}, (errors) => {
			this.error_messages = errors;
		});
	}

	public editProduct(product): void {
		localStorage.removeItem('productEditId');
		localStorage.setItem('productEditId', product.id.toString());
		this.myRoute.navigate(['/dashboard/product-edit']);
	}

	public changeStatus(statusType, productId, index) {
		// console.log(statusType);
		this.ngxService.start();
		let status;
		if (statusType == 'draft') {
			status = 'publish';
		} else {
			status = 'draft';
		}
		const formdata= {
			id: productId,
			status: status
		};
		this.http.post(`utility/product/status`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {
				// console.log('h');
				this.ngxService.stop();
				const updateData = response['data'];
				this.data[index].status = updateData.status;
			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Unable to publish the product as it is not yet been completed by the vendor.');
		});
	}

	public changeFeatureStatus(featureType, productId, index) {
		// console.log(statusType);

		this.ngxService.start();
		let is_featured;
		if (featureType == 0) {
			is_featured = '1';
		} else {
			is_featured = '0';
		}
		const formdata = {
			id: productId,
			is_featured: is_featured
		};
		this.http.post(`utility/product/status/featured`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {
				// console.log('h');
				this.ngxService.stop();
				const updateData = response['data'];
				this.data[index].is_featured = updateData.is_featured;
			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
		});
	}

	public goToTop() {
		window.scroll(0,0);
	}


}

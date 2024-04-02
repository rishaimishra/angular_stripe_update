import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RegistrationComponent } from '../registration/registration.component';
import { HttpRequestService } from '../../../services/http-request.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
	selector: 'app-vendor',
	templateUrl: './vendor.component.html',
	styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

	constructor(private modalService: NgbModal,
		public http: HttpRequestService,
		private myRoute: Router,
		private ngxService: NgxUiLoaderService
	) { }
	public pageType = 'vendor-register';
	public banner: any = [];
	
	title: any;
	content: any;

	ngOnInit() {
		this.getSlides(this.pageType);
		this.getData();
	}
	public getSlides(pageType) {
		this.ngxService.start();
		this.http.get(`page-slider?page=${pageType}&is_active=true`).subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {

				this.banner = response['data'];
			}
		}, (errors) => {
			this.ngxService.stop();
			// console.log(errors);
		});
	}

	getData() {
		this.http.get('cms-page/vendor').subscribe((response) => {
			if (response['status'] === 'success') {
			
				this.title = response['data'].title;
				this.content = response['data'].content;
			}
		});
	}

	registerFormModal() {
		const ngbModalOptions: NgbModalOptions = {
			backdrop: 'static',
			keyboard: false
		};

		const modalRef = this.modalService.open(RegistrationComponent, ngbModalOptions);
		modalRef.componentInstance.role = 'vendor';
		modalRef.result.then((result) => {
			// this.myRoute.navigate(['/tutor-registration-succcess']);
			if(result.provider=='normal'){
				this.myRoute.navigate(['/tutor-registration-succcess']);
			} else {
				this.myRoute.navigate(['/']);
			}
		}).catch((error) => {
			// console.log(error);
		});
	}

}

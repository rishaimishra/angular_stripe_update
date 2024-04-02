import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { LoginComponent } from '../../../frontend/pages/login/login.component';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonService } from '../../../global/services/common.service';

@Component({
	selector: 'app-shop-details',
	templateUrl: './shop-details.component.html',
	styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit {

	public productSlug: any;
	public productData: any;
	public i = 0;
	public otherProducts: any;

	public cartForm: FormGroup;
	public productPrice: any;
	public resellerId: any = null;

	constructor(
		public http: HttpRequestService,
		public ngxService: NgxUiLoaderService,
		public config: NgbRatingConfig,
		private activatedRoute: ActivatedRoute,
		private commonService: CommonService,
		private formBuilder: FormBuilder,
		private validatorService: NgReactiveFormValidatorService,
		private modalService: NgbModal,
		private myRoute: Router,
	) {
		config.max = 5;
		config.readonly = true;
	}


	// featureSide = { items: 1, dots: false, nav: true, margin: 0 };
	public images = [];
	galleryOptions: NgxGalleryOptions[] = [];
	galleryImages: NgxGalleryImage[] = [];

	ngOnInit(): void {
		this.cartForm = this.formBuilder.group({
			quantity: [1, [Validators.required, Validators.min(1)]]
		});

		// this.activatedRoute.params.subscribe(routeParams => {
		// 	// this.loadUserDetail(routeParams.id);
		// 	console.log(routeParams.slug);
		// 	this.productSlug = routeParams.slug;
		// 	this.getProductDetails();


		// });

		this.activatedRoute.params.subscribe(routeParams => {
			// this.loadUserDetail(routeParams.id);
			this.productSlug = routeParams.slug;

			if ('reseller' in routeParams) {
				const resellerStr = routeParams.reseller;
				const resellerArr = resellerStr.split('-');
				const rid = resellerArr.pop();
				if (!isNaN(rid)) {
					this.resellerId = rid;
				}
			}


			this.getProductDetails();
		});

		this.galleryOptions = [
			{
				width: '100%',
				height: '460px',
				thumbnailsColumns: 4,
				imageAnimation: NgxGalleryAnimation.Slide
			},
			// max-width 800
			{
				breakpoint: 800,
				width: '100%',
				height: '400px',
				imagePercent: 80,
				thumbnailsPercent: 20,
				thumbnailsMargin: 10,
				thumbnailMargin: 10
			},
			// max-width 400
			{
				breakpoint: 400,

			}
		];



	}

	getProductDetails() {
		this.ngxService.start();
		this.http.get(`product/${this.productSlug}?images=true&user=true&categories=true&offers=true&user=true&profile=true&fetch_price=true`).subscribe((response) => {
			window.scroll(0, 0);
			if (response['status'] === 'success') {

				this.productData = response['data'];
				if(this.productData.length==0){
					this.myRoute.navigate(['/404-not-found'],);
				}

				/*****************************
				 * New code for price start
				 *****************************/
					if(this.productData.pricable.length>0) {
					
						this.productPrice = this.productData.pricable[0] ;
					} else {
						this.productPrice = 0;
					}
					// console.log(this.coursePrice);
				/*****************************
				 * New code for price end
				 *****************************/

				this.ngxService.stop();
				// console.log(this.productData);
				this.getOtherProductsByVendor(this.productData.user_id);
				const gallaryImage = {
					small: 'assets/images/noimg-125x105.jpg',
					medium: 'assets/images/noimg-530x345.jpg',
					big: 'assets/images/noimg-530x345.jpg'
				};
				if (this.productData.images.length > 0) {

					this.galleryImages = this.productData.images.map((value) => {

						const imgObj = {
							small: value.thumbnail,
							medium: value.banner,
							big: value.original,
						};
						return imgObj;

					});
				}

			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}

	getOtherProductsByVendor(createdBy) {
		this.ngxService.start();
		this.http.get(`product?user_id=${createdBy}&images=true&limit=3&pagination=true&is_publish=true&fetch_price=true`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.ngxService.stop();
				this.otherProducts = response['data'];
				// console.log(response['data']);
			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}

	minusQuantity(event) {
		if (event && (this.cartForm.value['quantity'] > 1)) {
			this.cartForm.patchValue({
				quantity: (this.cartForm.value['quantity'] - 1)
			});
		}
	}

	plusQuantity(event) {
		if (event && (this.cartForm.value['quantity'] < this.productPrice.quantity)) {
			this.cartForm.patchValue({
				quantity: (this.cartForm.value['quantity'] + 1)
			});
		}
	}

	saveToCart() {
		if (this.cartForm.valid) {
			const formVal = this.cartForm.value;
			if (formVal.quantity <= this.productPrice.quantity) {
				this.addToCart();
			} else {
				this.commonService.showMessage({ type: 'warning', title: '', message: 'You have entered quantity more than stock' });
			}
		} else {
			const errorStr = this.validatorService.getErrorList(this.cartForm, {});
			this.commonService.showMessage({ type: 'warning', title: '', message: errorStr });
		}
	}

	addToCart() {
		const formVal = this.cartForm.value;
		const cartParams = {
			id: (new Date()).getTime(),
			type: 'product',
			mode: 'add',
			coupon: null,
			discount: null,
			quantity: formVal.quantity,
			details:  {
				...this.productData,
				price: this.getPrice(),
				reseller_id: this.resellerId
			}
		};


		this.commonService.setCart(cartParams).subscribe((response) => {
			this.commonService.showMessage({ type: 'success', title: '', message: 'Item added to  cart' });
			this.commonService.scrollToElement('mini-cart');
		}, (error) => {
			if (error) {
				if (error.statusText === 'Unauthorized') {
					this.commonService.scrollToElement('mini-cart');
					const modalRef = this.modalService.open(LoginComponent);
					modalRef.result.then((result) => {
						this.ngxService.stop()
					}).catch((error) => {
						this.ngxService.stop()
						//console.log(error);
					});
				} else {
					this.commonService.showMessage({ type: 'warning', title: '', message: error.message });
				}
			}
		});
	}



	// Price new code
	getPrice() {

		let price = {
			usd_price:0,
			sxl_price:0
		};
		if (this.productData.pricable.length > 0) {
			price.usd_price = this.productData.pricable[0].usd_price;
			price.sxl_price = this.productData.pricable[0].sxl_price;
		}
		// if (this.hasOffer()) {
		// 	if (this.courseData.offer.discount_mode === 'fixed') {
		// 		price = (this.courseData.price - this.courseData.offer.discount);
		// 	} else {
		// 		price = (this.courseData.price * (1 - (this.courseData.offer.discount / 100)));
		// 	}
		// }
		return price;
	}
}

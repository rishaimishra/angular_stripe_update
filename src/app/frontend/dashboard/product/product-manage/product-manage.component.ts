import { Component, OnInit, AfterViewInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { CommonService } from '../../../../global/services/common.service';
import { HttpRequestService } from '../../../../services/http-request.service';
import { S3BucketService } from '../../../../services/s3-bucket.service';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
	selector: 'app-product-manage',
	templateUrl: './product-manage.component.html',
	styleUrls: ['./product-manage.component.scss']
})
export class ProductManageComponent implements OnInit, AfterViewInit {

	public loggedUser: any;
	public isCompletedProfile: Boolean = false;
	public formObj: FormGroup;
	public priceFormObj: FormGroup;
	public isCreateMode: boolean;
	public id: string;
	private toasterService: ToasterService;

	public productDetails: any = null;

	private _formErrorMessage = {
		user_id: {
			required: 'User is required',
		},
		title: {
			required: 'Title is required',
		},
		slug: {
			required: 'Slug is required',
		},
		description: {
			required: 'Description is required',
		},
		short_description: {
			required: 'Short Description is required',
		},
		quantity: {
			required: 'Quantity is required',
		},
		discount: {
			required: 'Discount is required',
		},
		price: {
			required: 'Price is required',
		},
		product_type: {
			required: 'Product Type is required',
		},
		currency: {
			required: 'Currency is required',
		},
		status: {
			required: 'Status is required',
		},
		images_field_count: {
			required: 'Please upload one image',
		},
		categories: {
			required: 'Categories are required',
		}
	};

	public formError: any = {};
	public formErrorMsg: string;

	public paymentFormError: any = {};
	public paymentFormErrorMsg: string;

	public categories: Array<any> = [];
	public categoriesTree: Array<any> = [];
	public productUploadFileArr: Array<any> = [];
	public productUploadUrlArr: Array<any> = [];
	public productUploadedUrlArr: Array<any> = [];

	public isUploadedAll: Boolean = false;

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

	public paymentTypeArr: Array<any> = [
		{ id: 1, name: 'USD' },
		{ id: 2, name: 'SXL' },
		{ id: 3, name: 'USDSXL' },
		{ id: 4, name: 'FREE' },
	];

	public formLoading: Boolean = false;
	public pricingFormLoading: Boolean = false;
	public isSelectedUSD: Boolean = true;
	public isSelectedSXL: Boolean = true;
	public paymentTypes: Array<any> = [];

	constructor(
		toasterService: ToasterService,
		private httpService: HttpRequestService,
		private s3Service: S3BucketService,
		private commonService: CommonService,
		public formBuilder: FormBuilder,
		public router: Router,
		public route: ActivatedRoute,
		public validatorService: NgReactiveFormValidatorService,
		public SeoService:SeoServiceService
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		if (this.route.snapshot.params['id']) {
			this.id = this.route.snapshot.params['id'];
			this.isCreateMode = false;
		} else {
			this.isCreateMode = true;
		}


		this.formObj = this.formBuilder.group({
			id: [null],
			user_id: [null, Validators.required],
			title: [null, Validators.required],
			slug: [null, Validators.required],
			description: [null, Validators.required],
			short_description: [null, Validators.required],
			// quantity: [null, [Validators.required, Validators.min(1)]],
			// discount: [null, [Validators.required, Validators.max(100)]],
			// price: [null, Validators.required],
			product_type: [null, Validators.required],
			currency: [null, Validators.required],
			status: ['draft', Validators.required],
			categories: [null, Validators.required],
			images_field_count: [null],
			images: this.formBuilder.array([])
		});


		this.priceFormObj = this.formBuilder.group({
			pricable_id: [null, Validators.required],
			pricable_type: ['products', Validators.required],
			payment_type_id: ['', Validators.required],
			total_price: [null],
			categoryPrice: this.formBuilder.array([
				this.formBuilder.group({
					product_price_id: [null],
					payment_category_id: [1, Validators.required],
					quantity: [null, [Validators.required, Validators.min(1)]],
					sxl_price: [{ value: null, disabled: this.isSelectedSXL }, Validators.required],
					usd_price: [{ value: null, disabled: this.isSelectedUSD }, Validators.required]
				})
			])
		});

		this.httpService.getUserObservable().subscribe((user) => {
			if (user) {
				// console.log(user);
				this.loggedUser = user;
				if (Object.keys(user.user.profile).length > 0) {
					this.isCompletedProfile = true;
				}
				this.formObj.patchValue({
					user_id: user.user.id,
					product_type: 'product',
					currency: 'USD'
				});
			}
		});

		this.getPaymentTypes();

		if (!this.isCreateMode) {
			this.setFormData();
		}

		if (this.isCreateMode) {
			this.statusArr.pop();
		}


	}

	ngAfterViewInit() {
		this.getCategories();
	}

	getPaymentTypes() {
		this.httpService.setModule('paymentType').list({}).subscribe((response) => {
			if (response) {
				this.paymentTypes = response.data;
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	setFormData() {
		this.route.params.pipe(
			mergeMap((params) => {
				if (params) {
					const bindModel = {
						images: true,
						categories: true,
						fetch_price: true
					};
					return this.httpService.setModule('product').findOne(params.id, bindModel);
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				this.productDetails = response.data;
				const data = Object.assign({}, response.data);
				data.images_field_count = data.images.length || 0;
				data.categories = response.data.categories.map(el => el.id);
				// console.log(data);
				// console.log(response);
				this.formObj.patchValue(data);
				this.productUploadedUrlArr = response.data.images;

				const itemArr = this.formObj.get('images') as FormArray;
				response.data.images.forEach((item) => {
					itemArr.push(this.createNewImageItem(item));
				});


				// Set Value for price

				if (this.productDetails.pricable.length > 0) {

					const paymentObj = {
						pricable_id: this.productDetails.id,
						pricable_type: 'products',
						payment_type_id: this.productDetails.pricable[0].payment_type.id,
						total_price: this.productDetails.pricable[0].total_price
					};

					this.priceFormObj.patchValue(paymentObj);
					const paymentCategoryArr = this.priceFormObj.get('categoryPrice') as FormArray;

					const selectedPaymentType = this.paymentTypeArr.find((el) => {
						return (parseInt(this.productDetails.pricable[0].payment_type.id, 10) === el.id);
					});

					if (selectedPaymentType.name === 'SXL') {
						this.isSelectedSXL = false;
					}

					if (selectedPaymentType.name === 'USD') {
						this.isSelectedUSD = false;
					}

					if (selectedPaymentType.name === 'USDSXL') {
						this.isSelectedUSD = false;
						this.isSelectedSXL = false;
					}

					paymentCategoryArr.controls.forEach((el) => {
						if (!this.isSelectedSXL) {
							el.get('sxl_price').enable();
						}
						if (!this.isSelectedUSD) {
							el.get('usd_price').enable();
						}


						el.patchValue({
							product_price_id: this.productDetails.pricable[0].product_price_id,
							payment_category_id: this.productDetails.pricable[0].payment_category.id,
							quantity: this.productDetails.pricable[0].quantity,
							sxl_price: this.productDetails.pricable[0].sxl_price,
							usd_price: this.productDetails.pricable[0].usd_price
						});
					});
				}

			}
		}, (error) => {
			// console.log(error);
		});
	}

	getSpan(item) {
		return {
			'margin-left': (item.label * 20) + 'px'
		};
	}

	getCategories() {
		const params = {
			tree: true,
			is_active: true
		};
		this.httpService.setModule('category').search(params).subscribe((response) => {
			if (response) {
				this.prepareCategoryArr(response.data);
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	isStatusChecked(code) {
		let flag = false;
		const selectedStatus = this.formObj.controls['status'].value;
		if (selectedStatus === code) {
			flag = true;
		}
		return flag;
	}

	changeStatus(code) {
		if (code) {
			this.formObj.patchValue({
				status: code
			});
		}
	}

	prepareCategoryArr(categories, label = 0) {
		const arr = [];
		categories.forEach((el) => {
			el.label = label;
			this.categoriesTree.push(el);
			if (el.children) {
				this.prepareCategoryArr(el.children, (label + 1));
			}
		});
	}

	onSelectProductFiles(event) { // called each time file input changes
		if (event.target.files && event.target.files[0]) {
			this.isUploadedAll = true;
			Object.keys(event.target.files).forEach((k) => {
				const reader = new FileReader();

				reader.readAsDataURL(event.target.files[k]); // read file as data url

				reader.onload = () => { // called once readAsDataURL is completed
					// this.url = event.target.result;
					this.productUploadFileArr.push(event.target.files[k]);

					const item = {
						url: reader.result,
						uploaded: false,
						uploading: false,
						uploadingPer: 0,
						uploadingPercentage: '0%',
						error: ''
					};
					this.productUploadUrlArr.push(item);
				};
			});
		}
	}

	createNewImageItem(item): FormGroup {
		const fg = this.formBuilder.group({
			id: new FormControl(0),
			imagable_type: new FormControl(null, Validators.required),
			original: new FormControl(null, Validators.required),
		});
		fg.patchValue(item);
		return fg;
	}

	uploadProductImages(event) {
		if (event) {
			this.formObj.patchValue({
				images_field_count: (this.productUploadUrlArr.length + this.productUploadedUrlArr.length)
			});
			this.isUploadedAll = false;
			this.productUploadFileArr.forEach((file, k) => {
				if (!this.productUploadUrlArr[k].uploaded) {
					this.productUploadUrlArr[k].uploading = true;
					const prgPer = setInterval(() => {
						if (this.productUploadUrlArr[k].uploadingPer < 90) {
							this.productUploadUrlArr[k].uploadingPer += 9;
							this.productUploadUrlArr[k].uploadingPercentage = this.productUploadUrlArr[k].uploadingPer + '%';
						}
					}, 30);
					this.s3Service.uploadS3(file).subscribe((response) => {
						if (response) {
							const item = {
								imagable_type: 'product',
								original: response.Location
							};

							const itemArr = this.formObj.get('images') as FormArray;
							itemArr.push(this.createNewImageItem(item));
							// this.productUploadedUrlArr();

							this.productUploadUrlArr[k].url = response.Location;
							this.productUploadUrlArr[k].uploaded = true;
							this.productUploadUrlArr[k].uploading = false;
						}
					}, (error) => {
						this.productUploadUrlArr[k].uploading = false;
						this.productUploadUrlArr[k].error = 'Failed to upload image in S3';
						console.error(error);
					});
				}
			});
		}
	}

	deleteUploadedImage(imgRec) {
		if (imgRec) {
			if (confirm('Are you sure?')) {
				const idx = this.productUploadedUrlArr.findIndex((el) => {
					return (el.id === imgRec.id);
				});
				if (idx > -1) {
					this.productUploadedUrlArr.splice(idx, 1);
				}

				// Form image remove
				const itemArr = this.formObj.get('images') as FormArray;
				itemArr.removeAt(idx);

				const params = {
					id: this.id,
					image: true,
					image_id: imgRec.id
				};

				this.httpService.setModule('product').deleteOne(params).subscribe((response) => {
					if (response) {
						this.toasterService.pop('success', 'Image deleted');
					}
				}, (error) => {
					this.commonService.showErrors(error);
				});
			}
		}
	}

	saveForm() {
		this.formLoading = true;
		this.formObj.value.status = 'draft';		 
		if (this.isCreateMode) {
			this.formObj.patchValue({
				slug: this.commonService.generateSlug(this.formObj.value['title'])
			});
		}

		if (this.formObj.valid) {
			if (this.isCreateMode) {
				this.createProduct();
			} else {
				this.updateProduct();
			}
		} else {
			this.formLoading = false;
			this.formError = this.validatorService.validationError(this.formObj, this._formErrorMessage);
			this.toasterService.pop('error', 'Error', 'Please fill all required fields');
			console.error(this.formError);
		}
	}

	createProduct() {
		this.httpService.setModule('product').create(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Product saved');
				this.router.navigate(['/dashboard', 'product', 'edit', response.data.id]);
			}
		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
	}

	updateProduct() {
		const params = this.formObj.value;
		delete params.slug;
		this.httpService.setModule('product').update(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Product updated');
				this.router.navigate(['/dashboard', 'product']);
			}
		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
	}

	onChangePaymentType(event) {
		if (event.target.value !== '') {
			const selectedType = this.paymentTypeArr.find((el) => {
				return (parseInt(event.target.value, 10) === el.id);
			});

			const fArr = this.priceFormObj.controls['categoryPrice'] as FormArray;
			if (selectedType) {
				if (selectedType.name === 'USD') {
					this.isSelectedUSD = false;
					this.isSelectedSXL = true;
					fArr.controls[0].get('usd_price').enable();
					fArr.controls[0].get('sxl_price').disable();
				} else if (selectedType.name === 'SXL') {
					this.isSelectedUSD = true;
					this.isSelectedSXL = false;

					fArr.controls[0].get('usd_price').disable();
					fArr.controls[0].get('sxl_price').enable();
				} else if (selectedType.name === 'USDSXL') {
					this.isSelectedSXL = false;
					this.isSelectedUSD = false;

					fArr.controls[0].get('usd_price').enable();
					fArr.controls[0].get('sxl_price').enable();
				} else if (selectedType.name === 'FREE') {
					this.isSelectedSXL = true;
					this.isSelectedUSD = true;

					fArr.controls[0].get('usd_price').disable();
					fArr.controls[0].get('sxl_price').disable();
				}
			}
		} else {
			this.isSelectedSXL = true;
			this.isSelectedUSD = true;
		}
	}

	savePriceForm() {
		// console.log(this.priceFormObj.value);

		this.pricingFormLoading = true;
		// console.log(this.formObj.value);
		// if (this.isCreateMode) {
		// 	this.formObj.patchValue({
		// 		slug: this.commonService.generateSlug(this.formObj.value['title'])
		// 	});
		// }

		this.priceFormObj.patchValue({
			pricable_id: this.productDetails.id
		});

		const paramValue = this.priceFormObj.value;
		if ((!this.isSelectedSXL) && (!this.isSelectedUSD)) {
			this.priceFormObj.patchValue({
				total_price: null
			});
		} else if ((!this.isSelectedUSD)) {
			this.priceFormObj.patchValue({
				total_price: paramValue.categoryPrice[0].usd_price
			});
		} else if ((!this.isSelectedSXL)) {
			this.priceFormObj.patchValue({
				total_price: paramValue.categoryPrice[0].sxl_price
			});
		} else if ((this.isSelectedSXL) && (this.isSelectedUSD)) {
			this.priceFormObj.patchValue({
				total_price: '0.00'
			});
		}


		if (this.priceFormObj.valid) {
			const params = this.priceFormObj.value;
			if ((!this.isSelectedUSD) && this.isSelectedSXL) {
				params['categoryPrice'][0]['sxl_price'] = '0.00';
			}
			if ((!this.isSelectedSXL) && this.isSelectedUSD) {
				params['categoryPrice'][0]['usd_price'] = '0.00';
			}
			if ((this.isSelectedSXL) && (this.isSelectedUSD)) {
				params['categoryPrice'][0]['usd_price'] = '0.00';
				params['categoryPrice'][0]['sxl_price'] = '0.00';
			}

			this.httpService.setModule('productPrice').create(params).subscribe((response) => {
				if (response) {
					this.setFormData();
					this.pricingFormLoading = false;
					this.toasterService.pop('success', 'Product updated');
					// this.router.navigate(['/dashboard', 'product']);
				}
			}, (error) => {
				this.pricingFormLoading = false;
				this.formError = null;
				this.commonService.showErrors(error);
			});
		} else {
			this.pricingFormLoading = false;
			this.paymentFormError = this.validatorService.validationError(this.priceFormObj, this._formErrorMessage);
			this.toasterService.pop('error', 'Error', 'Please fill all required fields');
			console.error(this.paymentFormError);
		}
	}

}

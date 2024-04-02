import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';

@Component({
	selector: 'app-review-rating',
	templateUrl: './review-rating.component.html',
	styleUrls: ['./review-rating.component.scss'],
	providers: [NgbRatingConfig]
})
export class ReviewRatingComponent implements OnInit, OnDestroy {

	public modelType: string;
	public modelSlug: string;
	public modelObj: any;
	public currentRate: Number = 0;
	public allRatings: Array<any> = [];
	public loggedUser: any = null;

	public formObj: FormGroup;

	public formError: any = {};

	public formLoading: Boolean = false;
	public isCreateMode: Boolean = true;

	constructor(
		public validatorService: NgReactiveFormValidatorService,
		public httpService: HttpRequestService,
		public commonService: CommonService,
		public formBuilder: FormBuilder,
		public route: ActivatedRoute,
		config: NgbRatingConfig,
		public router: Router
	) {
		config.max = 5;
	}

	ngOnInit() {
		this.formObj = this.formBuilder.group({
			id: [null],
			rating_id: [null],
			rating_count: [null, Validators.required],
			user_id: [null, Validators.required],
			reviewable_id: [null, Validators.required],
			reviewable_type: [null, Validators.required],
			experience: ['Default Text'],
			review_note: [null, [Validators.required, Validators.maxLength(254)]]
		});

		this.commonService.scrollToElement('mini-cart');

		this.route.params.subscribe((params) => {
			if (params) {
				this.modelType = params.type || '';
				this.modelSlug = params.slug || '';
			}
		});

		this.getAllRatings();
		this.getReviewDetail();
		this.getModelBySlug();
	}

	ngOnDestroy() {
	}

	getAllRatings() {
		this.httpService.setModule('ratings').search({}).subscribe((res) => {
			if (res) {
				this.allRatings = res.data;
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	getReviewDetail() {
		let paramsObj = null;
		let userObj = null;
		this.route.params.pipe(
			mergeMap((params) => {
				if (params) {
					paramsObj = params;
					if ('id' in paramsObj) {
						this.isCreateMode = false;
						return this.httpService.getUserObservable();
					} else {
						return of(null);
					}
				}
				return of(null);
			}),
			mergeMap((user) => {
				if (user) {
					userObj = user;
					// this.formObj.patchValue({
					// 	user_id: user.user.id
					// });

					return this.httpService.setModule('reviews').findOne(paramsObj.id, {rating: true});
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				if (parseInt(userObj.user.id, 10) !== parseInt(response.data.user_id, 10)) {
					this.router.navigate(['/404-not-found']);
				}
				let formParams = this.formObj.value;
				formParams = {
					...formParams,
					...response.data,
					rating_count: response.data.rating.count
				};
				delete formParams.rating;
				this.formObj.patchValue(formParams);
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	getModelBySlug() {
		let paramsObj = null;
		this.route.params.pipe(
			mergeMap((params) => {
				if (params) {
					paramsObj = params;
					return this.httpService.getUserObservable();
				}
				return of(null);
			}),
			mergeMap((user) => {
				if (user) {
					this.loggedUser = user;

					if (user) {
						const roleIdx = user.roles.indexOf('customer');
						if (roleIdx < 0) {
							switch (paramsObj.type) {
								case 'course':
									this.router.navigate(['/course-details', paramsObj.slug]);
									break;
								case 'event':
									this.router.navigate(['/event-details', paramsObj.slug]);
									break;
								case 'product':
									this.router.navigate(['/product-details', paramsObj.slug]);
									break;
								default:
									break;
							}
						}
					}


					this.formObj.patchValue({
						user_id: user.user.id
					});
					if (paramsObj.type === 'course') {
						return this.httpService.setModule('course').findOne(paramsObj.slug, {
							course_modules : true,
							course_lectures: true,
							course_standers: true,
							user: true,
							categories:true,
							course_coupons: true,
							offer:true,
							review_count:true,
							whislist:true,
							user_id:this.httpService.getUser().id,
							fetch_price:true,
							isApproved: true,
						});
					} else if (paramsObj.type === 'event') {
						return this.httpService.setModule('event').findOne(paramsObj.slug);
					} else if (paramsObj.type === 'shop') {
						return this.httpService.setModule('product').findOne(paramsObj.slug);
					} else {
						return of(null);
					}
				} else {
					throw {
						status: 'error',
						statusText: 'Unauthorized',
						statusCode: 401
					};
				}
			})
		).subscribe((response) => {
			if (response) {
				this.modelObj = response.data;
				//console.log(this.modelObj,'modelObj');
				switch (paramsObj.type) {
					case 'course':
						this.formObj.patchValue({
							reviewable_id: this.modelObj.id,
							reviewable_type: 'courses'
						});
						break;
					case 'event':
					case 'product':
						this.formObj.patchValue({
							reviewable_id: this.modelObj.id,
							reviewable_type: 'products'
						});
						break;
					default:
						break;
				}
			}
		}, (error) => {
			if (error) {
				if (error.statusCode === 401) {
					switch (paramsObj.type) {
						case 'course':
							this.router.navigate(['/course-details', paramsObj.slug]);
							break;
						case 'event':
							this.router.navigate(['/event-details', paramsObj.slug]);
							break;
						case 'product':
							this.router.navigate(['/product-details', paramsObj.slug]);
							break;
						default:
							break;
					}
				} else {
					this.commonService.showErrors(error);
				}
			}
		});
	}

	saveForm() {
		this.formLoading = true;

		const formParams = this.formObj.value;
		//console.log(this.allRatings);
		const rating = this.allRatings.find((el) => {
			return (parseInt(el.count, 10) === parseInt(formParams.rating_count, 10));
		});

		if (rating) {
			this.formObj.patchValue({
				rating_id: rating.id
			});
		}
	
		// console.log(this.formObj.value);

		if (this.formObj.valid) {
			if (this.isCreateMode) {
				// console.log('a');
				this.saveRating();
			} else {
				// console.log('b');
				this.updateRating();
			}
		} else {
			this.formLoading = false;
			this.formError = this.validatorService.validationError(this.formObj, {});
			const formErrorStr = this.validatorService.getErrorList(this.formObj, {});
			this.commonService.showMessage({type: 'error', title: '', message: formErrorStr});
		}
	}

	saveRating() {
		this.httpService.setModule('reviews').create(this.formObj.value).subscribe((res) => {
			if (res) {
				this.formLoading = false;
				this.commonService.showMessage({type: 'success', title: '', message: 'Thank you for your valuable feedback'});
				switch (this.modelType) {
					case 'course':
						this.router.navigate(['/course-details', this.modelSlug]);
						break;
					case 'event':
						this.router.navigate(['/event-details', this.modelSlug]);
						break;
					case 'product':
						this.router.navigate(['/event-details', this.modelSlug]);
						break;
					default:
						this.commonService.showMessage({type: 'warning', title: '', message: 	'Invalid route to redirect'});
						break;
				}
			}
		}, (error) => {
			this.formLoading = false;
			this.commonService.showErrors(error);
		});
	}

	updateRating() {
		this.httpService.setModule('reviews').update(this.formObj.value).subscribe((res) => {
			if (res) {
				this.formLoading = false;
				this.commonService.showMessage({type: 'success', title: '', message: 'Thank you for your valuable feedback'});
				switch (this.modelType) {
					case 'course':
						this.router.navigate(['/course-details', this.modelSlug]);
						break;
					case 'event':
						this.router.navigate(['/event-details', this.modelSlug]);
						break;
					case 'product':
						this.router.navigate(['/event-details', this.modelSlug]);
						break;
					default:
						this.commonService.showMessage({type: 'warning', title: '', message: 	'Invalid route to redirect'});
						break;
				}
			}
		}, (error) => {
			this.formLoading = false;
			this.commonService.showErrors(error);
		});
	}

	// getClass(fill, index) {
	// 	const styleObj = {
	// 		color: '#d3d3d3'
	// 	};
	// 	if (fill === 100) {
	// 		const rating = this.allRatings.find((el) => {
	// 			return (el.count === (index + 1));
	// 		});

	// 		console.log(rating);
	// 		if (rating) {
	// 			styleObj.color = rating.color_code;
	// 		}
	// 	}

	// 	return styleObj;
	// }

}

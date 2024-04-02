import { Component, OnInit, AfterViewInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToasterService} from 'angular2-toaster';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { CommonService } from '../../../../global/services/common.service';
import { HttpRequestService } from '../../../../services/http-request.service';
import { S3BucketService } from '../../../../services/s3-bucket.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-annoucement-manage',
  templateUrl: './annoucement-manage.component.html',
  styleUrls: ['./annoucement-manage.component.scss']
})
export class AnnoucementManageComponent implements OnInit, AfterViewInit {

  public formObj: FormGroup;
	public isCreateMode: boolean;
	public id: string;
	private toasterService: ToasterService;

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
		
	};
	public formError: any = {};
	public formErrorMsg: string;

	

	

	public formLoading: Boolean = false;

	constructor(
		toasterService: ToasterService,
		private httpService: HttpRequestService,
		private s3Service: S3BucketService,
		private commonService: CommonService,
		public formBuilder: FormBuilder,
		public router: Router,
		public route: ActivatedRoute,
		public validatorService: NgReactiveFormValidatorService,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService
	) {
		this.toasterService = toasterService;
		
	}

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.ngxService.start();
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
		
		});

		this.httpService.getUserObservable().subscribe((user) => {
			if (user) {
				// console.log(user);
				this.formObj.patchValue({
					user_id: user.user.id,
				});
			}
		});

		if (!this.isCreateMode) {
			this.setFormData();
		}
		this.ngxService.stop();
		

	}

	ngAfterViewInit() {
	
	}

	setFormData() {
		this.route.params.pipe(
			mergeMap((params) => {
				if (params) {
					return this.httpService.setModule('announcements').findOne(params.id, );
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				const data = Object.assign({}, response.data);
				// console.log(data);
				// console.log(response);
				this.formObj.patchValue(data);
			
			}
		}, (error) => {
			// console.log(error);
		});
	}



	saveForm() {
		this.formLoading = true;
		// console.log(this.formObj.value);
		if (this.isCreateMode) {
			this.formObj.patchValue({
				slug: this.commonService.generateSlug(this.formObj.value['title'])
			});
		}

		if (this.formObj.valid) {
			if (this.isCreateMode) {
				this.createAnnoucement();
			} else {
				this.updateAnnoucement();
			}
		} else {
			this.formLoading = false;
			this.formError = this.validatorService.validationError(this.formObj, this._formErrorMessage);
			this.toasterService.pop('error', 'Error', 'Please fill all required fields');
			console.error(this.formError);
		}
	}

	createAnnoucement() {
		this.httpService.setModule('announcements').create(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Annoucement saved');
				this.router.navigate(['/dashboard', 'annoucement']);
			}
		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
	}

	updateAnnoucement() {
		const params = this.formObj.value;
    delete params.slug;
    // console.log(params);
		this.httpService.setModule('announcements').update(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Annoucement updated');
				this.router.navigate(['/dashboard', 'annoucement']);
			}
		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
	}

}

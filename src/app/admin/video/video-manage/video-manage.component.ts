import { Component, OnInit, AfterViewInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToasterService} from 'angular2-toaster';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';

import { NgxUiLoaderService } from 'ngx-ui-loader'; 



@Component({
  selector: 'app-video-manage',
  templateUrl: './video-manage.component.html',
  styleUrls: ['./video-manage.component.scss']
})
export class VideoManageComponent implements OnInit {
  public formObj: FormGroup;
	public isCreateMode: boolean;
	public id: string;
	private toasterService: ToasterService;
  public thumbnail: any;
  public imageSrc: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  public fileInstance: any  = null;
	private _formErrorMessage = {
		youtube_id: {
			required: 'Youtube id is required',
		},
	};
	public formError: any = {};
	public formErrorMsg: string;

	public notificationRecords: any= [];
	public formLoading: Boolean = false;

	constructor(
		toasterService: ToasterService,
		private httpService: HttpRequestService,
	
		private commonService: CommonService,
		public formBuilder: FormBuilder,
		public router: Router,
		public route: ActivatedRoute,
    public validatorService: NgReactiveFormValidatorService,
    private ngxService: NgxUiLoaderService,
  
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		if (this.route.snapshot.params['id']) {
			this.id = this.route.snapshot.params['id'];
			this.isCreateMode = false;
		} else {
			this.isCreateMode = true;
		}


		this.formObj = this.formBuilder.group({
			id: [null],
      youtube_id: [null, Validators.required],
      type: ['events'],
      is_active: [1],
      created_by:[this.httpService.getUser().id]
		});

		this.ngxService.start();
		if (!this.isCreateMode) {
			this.setFormData();
		}
		this.ngxService.stop();
		this.getNotificationRecords();
	}

	ngAfterViewInit() {

	}
	getNotificationRecords() {
   
		this.httpService.get(`utility/lastest-dashboard-notifications/${this.httpService.getUser().id}?profile=true&user=true&role=${this.httpService.getUserRole()[0]}`).subscribe((response) => {
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
	setFormData() {
		this.route.params.pipe(
			mergeMap((params) => {
				if (params) {
					return this.httpService.setModule('video').findOne(params.id);
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				const data = Object.assign({}, response.data);
				this.formObj.patchValue(data);
			}
		}, (error) => {
		//	console.log(error);
		});
	}
 
	saveForm() {
		this.formLoading = true;
    
  
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
		this.httpService.setModule('video').create(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Video saved');
				this.router.navigate(['/admin', 'videos']);
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
		this.httpService.setModule('video').update(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Video updated');
				this.router.navigate(['/admin', 'videos']);
			}
		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
	}
}

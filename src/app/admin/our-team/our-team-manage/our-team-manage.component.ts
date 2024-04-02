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
import { S3BucketService } from '../../../services/s3-bucket.service';
@Component({
  selector: 'app-our-team-manage',
  templateUrl: './our-team-manage.component.html',
  styleUrls: ['./our-team-manage.component.scss']
})
export class OurTeamManageComponent implements OnInit {
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
		name: {
			required: 'Name is required',
		},
		designation: {
			required: 'Designation is required',
		},
		image: {
			required: 'Image is required',
		},
		
	};
	public formError: any = {};
	public formErrorMsg: string;

	

	
	public notificationRecords: any= [];
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
    protected s3: S3BucketService
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
			name: [null, Validators.required],
			designation: [null, Validators.required],
			image: [null],
			is_active: [1],
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
					return this.httpService.setModule('ourTeam').findOne(params.id);
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				const data = Object.assign({}, response.data);
        this.imageSrc = data.image;
        this.thumbnail = data.image;
        this.croppedImage = data.image;
        this.formObj.value.image = data.image;
				// console.log(data);
				// console.log(response);
				this.formObj.patchValue(data);
			}
		}, (error) => {
			console.log(error);
		});
	}
  public uploadFile (event) {
    this.imageChangedEvent = event;
  }
  imageCropped(event) {
    // console.log(event);
     this.croppedImage = event.base64;
    // console.log(this.croppedImage);
     this.fileInstance = event.file;
   //  console.log(this.fileInstance.type);
   }
   imageLoaded() {
      // show cropper
   }
   loadImageFailed() {
     // show message
     this.fileInstance = '';
     this.croppedImage = '';
   }

  public uploadToS3 () {
    this.ngxService.start();
  //  const file 		= this.fileInstance.target.files[0];
  const file 		= this.fileInstance;
    this.s3.cropedImageUpload(file).send((err, data) => {
      if (err) {
        this.ngxService.stop();
        console.log(err);
      } else {
        console.log(data.Location);
        this.ngxService.stop();
        this.thumbnail = data.Location;
        this.formObj.value.image = this.thumbnail;
      }
    });
  }
	saveForm() {
		this.formLoading = true;
    
    console.log(this.formObj.value);
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
		this.httpService.setModule('ourTeam').create(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Member saved');
				this.router.navigate(['/admin', 'our-team']);
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
		this.httpService.setModule('ourTeam').update(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Member updated');
				this.router.navigate(['/admin', 'our-team']);
			}
		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
	}


}

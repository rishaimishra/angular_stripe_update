import { Component, OnInit, AfterViewInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToasterService} from 'angular2-toaster';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';
import { S3BucketService } from '../../../services/s3-bucket.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-notification-manage',
  templateUrl: './notification-manage.component.html',
  styleUrls: ['./notification-manage.component.scss']
})
export class NotificationManageComponent implements OnInit {

  public formObj: FormGroup;
	public isCreateMode: boolean;
	public id: string;
  private toasterService: ToasterService;
  public roles: Array<any> = [
		{
			name:'customer',
			role:'All'
		},
		{
			name:'vendor',
			role:'All'
		},
		{
			name:'reseller',
			role:'All'
		}
	];
  public sendData = [];
  
	private _formErrorMessage = {
		role: {
			required: 'Role is required',
		},
		data: {
			required: 'Data is required',
		},
		
	};
	public formError: any = {};
	public formErrorMsg: string;
	public selectedRole: Array<any>;
	

	

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
      data: [null, Validators.required],
      sender_id:'',
      role:['', Validators.required],
      type:'manual'
		
		});
		this.ngxService.start();
		this.httpService.getUserObservable().subscribe((user) => {
			this.ngxService.stop();
			if (user) {
		
				this.formObj.patchValue({
					sender_id: user.user.id,
				});
			}
		}, (error) => {
			this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	
		// if (!this.isCreateMode) {
		// 	this.setFormData();
		// }

		

	}

	ngAfterViewInit() {
   // this.getRoles();
	}

	// setFormData() {
	// 	this.route.params.pipe(
	// 		mergeMap((params) => {
	// 			if (params) {
	// 				return this.httpService.setModule('notifications').findOne(params.id, );
	// 			} else {
	// 				return of(null);
	// 			}
	// 		})
	// 	).subscribe((response) => {
	// 		if (response) {
	// 			const data = Object.assign({}, response.data);
	// 			// console.log(data);
	// 			// console.log(response);
	// 			this.formObj.patchValue(data);
			
	// 		}
	// 	}, (error) => {
	// 		console.log(error);
	// 	});
  // }
  
  // getRoles() {
	// 	this.httpService.get('role').subscribe((response) => {
	// 		if (response) {
	// 			if (response['data']) {
	// 				this.roles = response['data'];
	// 			}
	// 		}
	// 	}, (error) => {
	// 		console.log(error);
	// 	});
	// }



	saveForm() {
		this.formLoading = true;
	
		if (this.formObj.valid) {
			if (this.isCreateMode) {
				this.createNotification();
			} else {
			//	this.updateNotification();
			}
		} else {
			this.formLoading = false;
			this.formError = this.validatorService.validationError(this.formObj, this._formErrorMessage);
			this.toasterService.pop('error', 'Error', 'Please fill all required fields');
			console.error(this.formError);
		}
	}

	createNotification() {

    // console.log(this.selectedRole);

		// this.sendData= this.selectedRole.map( (element) => {
		// 	// let newElement= this.formObj.value;
		
		// 	// newElement.role = element;
		// 	// element = newElement;
		// 	//  console.log(element);
		//   // return newElement;
		//  //this.sendData.push(newElement);
		// });
		this.formObj.value.role='';
		

		this.sendData= this.selectedRole.map( (element) => {
			let newObj={
				data:'',
				sender_id:'',
				role:'',
				type:''
			};
			newObj.data=this.formObj.value.data;
			newObj.sender_id=this.formObj.value.sender_id;
			newObj.role=element;
			newObj.type=this.formObj.value.type;
			return newObj;
		});
    console.log(this.sendData);

	
		this.httpService.post(`notification/create`, this.sendData).subscribe((response) => {
			if (response['status'] === 'success') {
				this.formLoading = false;
				this.toasterService.pop('success', 'Notifications saved');
				this.router.navigate(['/admin', 'notifications']);
			}

		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
  }
	// updateNotification() {
	// 	const params = this.formObj.value;
    
	// 	console.log(params);
		
	// 	this.httpService.setModule('notifications').update(this.formObj.value).subscribe((response) => {
	// 		if (response) {
	// 			this.formLoading = false;
	// 			this.toasterService.pop('success', 'Bank Details updated');
	// 			this.router.navigate(['/dashboard', 'bank-details']);
	// 		}
	// 	}, (error) => {
	// 		// this.formLoading = false;
	// 		// this.formError = null;
	// 		console.log(error);
	// 		// this.commonService.showErrors(error);
	// 	});
	// }


}

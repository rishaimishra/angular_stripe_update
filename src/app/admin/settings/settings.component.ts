import { Component, OnInit, AfterViewInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToasterService} from 'angular2-toaster';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { CommonService } from '../../global/services/common.service';
import { HttpRequestService } from '../../services/http-request.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public formObj: FormGroup;
  public isCreateMode: boolean;
  public id: string;
  private toasterService: ToasterService;

  public sendData = [];
  public updateData= [];
  
	private _formErrorMessage = {
	
		sxl_to_usd_rate: {
			required: 'Data is required',
		},
		vendor_commission: {
			required: 'Data is required',
		},
		reseller_commission: {
			required: 'Data is required',
		},
		kycUrl: {
			required: 'Data is required',
		},
		kycReferenceVideoUrl: {
			required: 'Data is required',
		},
		ticketBookingTimeDiff: {
			required: 'Data is required',
		},
		metaTitel: {
			required: 'Data is required',
		},
		metaDescription: {
			required: 'Data is required',
		},
		metaKeywords: {
			required: 'Data is required',
		},
		address: {
			required: 'Data is required',
		},
		mail_address: {
			required: 'Data is required',
		},
		phone_number: {
			required: 'Data is required',
		},
		cybersource_secrete_key: {
			required: 'Data is required',
		},
		
	};
	public formError: any = {};
	public formErrorMsg: string;
	public selectedRole: Array<any>;
	

	

	public formLoading: Boolean = false;
	public notificationRecords: any= [];
	constructor(
		toasterService: ToasterService,
		private httpService: HttpRequestService,
		private commonService: CommonService,
		public formBuilder: FormBuilder,
		public router: Router,
		public route: ActivatedRoute,
		public validatorService: NgReactiveFormValidatorService
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.formObj = this.formBuilder.group({
			sxl_to_usd_rate: [null, Validators.required],
			vendor_commission: [null, Validators.required],
			reseller_commission: [null, Validators.required],
			kycUrl: [null, Validators.required],
			kycReferenceVideoUrl: [null, Validators.required],
			ticketBookingTimeDiff: [null, Validators.required],
			metaTitel: [null, Validators.required],
			metaDescription: [null, Validators.required],
			metaKeywords: [null, Validators.required],
			address: [null, Validators.required],
			mail_address: [null, Validators.required],
			phone_number:[null, Validators.required],
			freshdesk_email:[null, Validators.required],
			freshdesk_password:[null, Validators.required],
			freshdesk_url:[null, Validators.required],
			freshdesk_agent_id:[null, Validators.required],
			cybersource_secrete_key:[null, Validators.required],
		});

		let params={};
		this.httpService.setModule('siteSettings').list(params).subscribe((response) => {
				if (response) {
					
					// console.log(response);
					let getSettingsValue = response['data'].reduce(function(result, item) {
						//console.log(item,'item');
						result[item['access_key']] = item['value'];
						return result;
					  }, {});
					// console.log(getSettingsValue,'getSettingsValue');
					this.formObj.patchValue(getSettingsValue);  
				}
		}, (error) => {
				
				// console.log(error);
				this.commonService.showErrors(error);
		});
		

		// this.httpService.getUserObservable().subscribe((user) => {
		// 	if (user) {
		
		// 		this.formObj.patchValue({
		// 			sender_id: user.user.id,
		// 		});
		// 	}
		// });
		this.getNotificationRecords();
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
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

ngAfterViewInit() {

}



	

	updateSettings() {

		const params = this.formObj.value;
		this.updateData =[];
		// console.log(params);
		this.formLoading = true;
		if (this.formObj.valid) {
			this.formError = null;
			for (let key in params) {
				if (params.hasOwnProperty(key)) {
					let settingParam= 	{
											"access_key": key,
											"value": params[key]
										};
					this.updateData.push(settingParam);
				}
			}
			// console.log(this.updateData);
			this.httpService.setModule('siteSettings').create(this.updateData).subscribe((response) => {
				if (response) {
					this.formLoading = false;
					this.toasterService.pop('success', 'Settings updated');
					
				}
			}, (error) => {
				this.formLoading = false;
				this.formError = null;
				this.commonService.showErrors(error);
			});

		}else {
			this.formLoading = false;
			this.formError = this.validatorService.validationError(this.formObj, this._formErrorMessage);
			this.toasterService.pop('error', 'Error', 'Please fill all required fields');
			// console.error(this.formError);
		}
		
		// this.httpService.setModule('notifications').update(this.formObj.value).subscribe((response) => {
		// 	if (response) {
		// 		this.formLoading = false;
		// 		this.toasterService.pop('success', 'Bank Details updated');
		// 		this.router.navigate(['/dashboard', 'bank-details']);
		// 	}
		// }, (error) => {
		// 	// this.formLoading = false;
		// 	// this.formError = null;
		// 	console.log(error);
		// 	// this.commonService.showErrors(error);
		// });
	}
}

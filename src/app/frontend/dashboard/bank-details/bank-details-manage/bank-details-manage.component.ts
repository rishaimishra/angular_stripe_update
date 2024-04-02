import { Component, OnInit, AfterViewInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToasterService} from 'angular2-toaster';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { CommonService } from '../../../../global/services/common.service';
import { HttpRequestService } from '../../../../services/http-request.service';
import { S3BucketService } from '../../../../services/s3-bucket.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-bank-details-manage',
  templateUrl: './bank-details-manage.component.html',
  styleUrls: ['./bank-details-manage.component.scss']
})
export class BankDetailsManageComponent implements OnInit {

  public formObj: FormGroup;
	public isCreateMode: boolean;
	public id: string;
  private toasterService: ToasterService;
  
  public accountType = [
    {
      name: 'Savings Account',
      value: 'Savings Account',
    },
    {
      name: 'Current Account',
      value: 'Current Accounts',
    },
    {
      name: 'Salary Account',
      value: 'Salary Accounts',
    },
    {
      name: 'Deposits',
      value: 'Deposits',
    },
    {
      name: 'Safe Deposit Locker',
      value: 'Safe Deposit Locker',
    },
    {
      name: 'Rural Account',
      value: 'Rural Accounts',
    },
    {
      name: 'Regular Saving',
      value: 'Regular Savings',
    },
    {
      name: 'Recurring Deposit Account',
      value: 'Recurring Deposit Account',
    },
    {
      name:'Fixed Deposit Account',
      value:'Fixed Deposit Account',
    },
    {
      name:'DEMAT Account',
      value:'DEMAT Account',
    },
    {
      name:'NRI Account',
      value:'NRI Accounts',
    },


  ];

	private _formErrorMessage = {
		user_id: {
			required: 'User is required',
		},
		bank_name: {
			required: 'Bank name is required',
		},
		branch_name: {
			required: 'Branch name is required',
		},
		branch_address: {
			required: 'Branch address is required',
    },
    branch_code: {
			required: 'Branch code is required',
    },
    account_no: {
			required: 'Account number is required',
    },
    account_holder_name: {
			required: 'Account holder name is required',
    },
    account_type: {
			required: 'Account type  is required',
    },
    
    wire_transfer_code: {
			required: 'Wire transfer code is required',
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
		if (this.route.snapshot.params['id']) {
			this.id = this.route.snapshot.params['id'];
			this.isCreateMode = false;
		} else {
			this.isCreateMode = true;
		}
		this.ngxService.start();

		this.formObj = this.formBuilder.group({
		  id: [null],
      user_id: [null, Validators.required],
      bank_name: [null, Validators.required],
      branch_name: [null, Validators.required],
      branch_address: [null, Validators.required],	
      branch_code: [null, Validators.required],
      account_no: [null, Validators.required],
      account_holder_name: [null, Validators.required],
      account_type: [null, Validators.required],
      wire_transfer_code: [null, Validators.required],
      is_default:1
		
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
					return this.httpService.setModule('bankDetails').findOne(params.id, );
				} else {
					return of(null);
				}
			})
		).subscribe((response) => {
			if (response) {
				const data = Object.assign({}, response.data);
				// console.log(data);
				 console.log(response);
				this.formObj.patchValue(data);
			
			}
		}, (error) => {
			// console.log(error);
		});
	}



	saveForm() {
		this.formLoading = true;
		// console.log(this.formObj.value);
		// console.log(this.isCreateMode);

		if (this.formObj.valid) {
			if (this.isCreateMode) {
				this.createBankDetails();
			} else {
				this.updateBankDetails();
			}
		} else {
			this.formLoading = false;
			this.formError = this.validatorService.validationError(this.formObj, this._formErrorMessage);
			this.toasterService.pop('error', 'Error', 'Please fill all required fields');
			console.error(this.formError);
		}
	}

	createBankDetails() {
		this.httpService.setModule('bankDetails').create(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Bank Details saved');
				this.router.navigate(['/dashboard', 'bank-details']);
			}
		}, (error) => {
			this.formLoading = false;
			this.formError = null;
			this.commonService.showErrors(error);
		});
	}

	updateBankDetails() {
		const params = this.formObj.value;
    
		// console.log(params);
		
		this.httpService.setModule('bankDetails').update(this.formObj.value).subscribe((response) => {
			if (response) {
				this.formLoading = false;
				this.toasterService.pop('success', 'Bank Details updated');
				this.router.navigate(['/dashboard', 'bank-details']);
			}
		}, (error) => {
			// this.formLoading = false;
			// this.formError = null;
			// console.log(error);
			// this.commonService.showErrors(error);
		});
	}

}

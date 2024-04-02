import { Component, OnInit, Input } from '@angular/core';
import {
	NgbModal,
	ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
	FormBuilder,
	Validators,
	FormGroup
} from '@angular/forms';
import { HttpRequestService } from '../../../services/http-request.service';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
	selector: 'app-payout',
	templateUrl: './payout.component.html',
	styleUrls: ['./payout.component.scss']
})
export class PayoutComponent implements OnInit {

	@Input() walletId: any;
	@Input() walletBalance: any;

	payoutForm: FormGroup;
	public messages: any = [];
	private toasterService: ToasterService;
	constructor(
		toasterService: ToasterService,
		public activeModal: NgbActiveModal,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private http: HttpRequestService,
		private commonService: CommonService,
		private ngxService: NgxUiLoaderService,
		private myRoute: Router,
		public SeoService:SeoServiceService
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.payoutForm = this.fb.group({
			request_amount: ['', [Validators.required, Validators.min(10)]],
			user_id: [this.http.getUser().id,],
			wallet_id: [this.walletId]
		});
	}

	payout() {

		if (this.payoutForm.valid) {
			// console.log(this.registrationForm.value);
			const form_data = this.payoutForm.value;

			//this.ngxService.start();

			this.http.post(`payout`, form_data).subscribe((response) => {
				//  this.ngxService.stop();
				if (response['status'] === 'success') {
					this.toasterService.pop('success', 'Payout Request successfully');
					// this.errorMsg = false;
					this.activeModal.close();
					//  this.myRoute.navigate(['dashboard/my-wallet']);

				}
			}, (errors) => {
				// console.log(errors);
				// this.ngxService.stop();
				// this.messages = errors;
				// this.successMsg = '';
				// this.errorMsg = true;

				//this.toasterService.pop('error', 'Error', errors.error.message);
				this.commonService.showErrors(errors);
			});
		}
	}

	checkRequestAmount(event: any) {
		const pattern = /[0-9\+\-\ ]/;

		const inputChar = String.fromCharCode(event.charCode);
		if (event.keyCode !== 8 && !pattern.test(inputChar)) {
			event.preventDefault();
		} else {
			const val = this.payoutForm.value.request_amount + event.key;
			// console.log(val);
			if (val > this.walletBalance) {
				event.preventDefault();
			}
		}
	}

}

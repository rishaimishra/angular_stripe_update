import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as $ from 'jquery';
import { S3BucketService } from '../../../services/s3-bucket.service';
import { mergeMap } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { CommonService } from '../../../global/services/common.service';
import { SeoServiceService }  from '../../../services/seo-service.service';
@Component({
	selector: 'app-agreement',
	templateUrl: './agreement.component.html',
	styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {

	private toasterService: ToasterService;
	public isChecked: boolean = false;
	public pdfSrc: string = '/assets/pdf/test2.pdf';
	public pdf: any;
	public tutorName: string = "TEST";
	public tutorAddress: string = "";
	public resource: string;
	public pdfData: any;
	public isAgree: boolean = false;
	public user: any;
	constructor(
		public httpService: HttpRequestService,
		private ngxService: NgxUiLoaderService,
		protected s3: S3BucketService,
		private commonService: CommonService,
		public SeoService:SeoServiceService
	) { }

	ngOnInit() {
		// console.log(this.httpService.getUser());

		//  this.tutorName = localStorage.getItem('name');

		this.getUserInfo();

		let elmnts = document.getElementById("pdfElement");
		// console.log(elmnts);
  		elmnts.scrollLeft = 0;
		elmnts.scrollTop = 1000;
		// console.log(localStorage.getItem('tutorAgreement'));
		this.SeoService.getMetaInfo();
		// console.log(this.isAgree);
		window.scroll(0,0);
	}

	getUserInfo() {
		window.scroll(0,0);
		this.ngxService.start();
		this.httpService.get(`profile/${this.httpService.getUser().id}?search_by=user_id&user=true`).subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.user = response['data'];
				// console.log(this.user);
				this.tutorName = this.user.first_name +' '+ this.user.last_name;
				if(this.tutorAddress){
					this.tutorAddress += this.user.address ;
				}
				
				if(this.user.city) {
					this.tutorAddress += ','+this.user.city.name;
				}
				if(this.user.state) {
					this.tutorAddress += ','+this.user.state.name;
				}
				if(this.user.country) {
					this.tutorAddress += ','+this.user.country.name;
				}
				// console.log(this.user.user.agreement_pdf);
				if(this.user.user.agreement_pdf != null ) {
					this.isAgree = true;
				} else {
					this.isAgree = false;
				}

				// console.log(this.isAgree);
			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}

	getCheckBoxValue(event) {

		if(this.isAgree) {
			// console.log(event);
			event.target.checked= true;
		} else {
			this.isChecked = event.target.checked;
		}
		
	}

	onRightClick(event) {
		return false;
	}

	onSubmitConfirm() {

		if(this.isChecked) {
			if(this.tutorAddress=='' || this.tutorName == ''){
				this.commonService.showMessage({type: 'error', title: '', message: 'Please update your profile'});
			}
		this.ngxService.start();
		this.generatePdf().pipe(
			mergeMap((pdfBuffer) => {
				// console.log(pdfBuffer,'pdf');
				if (pdfBuffer) {
				
					return this.s3.uploadHtmlToPdf(pdfBuffer);
				}
				this.ngxService.stop();
				return of(null);
			}),
			mergeMap((response) => {
				// console.log(response,'pdf1');
				if (response) {
					const params = {
						user_id: this.httpService.getUser().id,
						agreement_pdf: response.Location,
						in_agreement: 1
					};
					return this.httpService.setModule('tutorAggrement').create(params);
				}
				this.ngxService.stop();
				return of(null);
			})
		).subscribe((res) => {
			this.ngxService.stop();
			if (res) {
				// console.log(res);
				localStorage.setItem('tutorAgreement',res.agreement_pdf);
				this.isAgree = true;
				this.isChecked =false;
				this.commonService.showMessage({type: 'success', title: '', message: 'Submited successfully'});
			}
		}, (error) => {
			this.ngxService.stop();
			if (error) {
				// this.common
				this.commonService.showErrors(error);
				console.error(error, ' error');
			}
		})
	}
	}

	

	generatePdf(): Observable<any> {
		let data = document.getElementById('contentToConvert');
		let HTML_Width = $(".contentToConvert").width();
		let HTML_Height = $(".contentToConvert").height();
		let top_left_margin = 15;
		let PDF_Width = HTML_Width + (top_left_margin * 2);
		let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
		let canvas_image_width = HTML_Width;
		let canvas_image_height = HTML_Height;
		let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

		// console.log(HTML_Width,'width');
		// console.log(HTML_Height,'height');
		// console.log(PDF_Width,'PDF_Width');
		// console.log(PDF_Height,'PDF_Height');
		// console.log(canvas_image_width,'canvas_image_width');
		// console.log(canvas_image_height,'canvas_image_height');
		// console.log(totalPDFPages,'totalPDFPages');

		const canvasPromise = html2canvas(data).then(canvas => {
			// Few necessary setting options

			// console.log(canvas.height + "  " + canvas.width, 'canvas width height');

			var imgData = canvas.toDataURL("image/jpeg", 1.0);
			this.pdf = new jspdf('p', 'pt', [PDF_Width, PDF_Height]);
			this.pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);


			for (var i = 1; i <= totalPDFPages; i++) {
				this.pdf.addPage(PDF_Width, PDF_Height);
				this.pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
			}

			// this.pdfData = imgData;
			//this.pdf.save("HTML-Document.pdf");
			// console.log(this.pdf.output('arraybuffer'));
			return new Promise((res, rej) => {
				res(this.pdf.output('arraybuffer'));
			});
		});
		return from(canvasPromise);
	}
}

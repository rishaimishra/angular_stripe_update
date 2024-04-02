import { Component, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { TestimonialCollection } from '../../../_collection/testimonial.collection';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { S3BucketService } from '../../../services/s3-bucket.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CommonService } from '../../../global/services/common.service';
@Component({
	selector: 'app-testimonial-create',
	templateUrl: './testimonial-create.component.html',
	styleUrls: ['./testimonial-create.component.css']
})
export class TestimoniaCreateComponent implements OnInit {

	public error_messages: any = [];
	public success_messages: any = [];

	public formData: any = new TestimonialCollection();

	public fileInstance: any = null;
	public thumbnail: any;
	public imageSrc: string;
	imageChangedEvent: any = '';
	croppedImage: any = '';
	public notificationRecords: any= [];
	public imageType = ['png','jpeg','jpg','gif'];
	constructor(
		protected http: HttpRequestService,
		protected router: Router,
		protected s3: S3BucketService,
		private ngxService: NgxUiLoaderService,
		private commonService: CommonService,
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.ngxService.start();
		this.ngxService.stop();
		this.getNotificationRecords();
	}
	getNotificationRecords() {
   
		this.http.get(`utility/lastest-dashboard-notifications/${this.http.getUser().id}?profile=true&user=true&role=${this.http.getUserRole()[0]}`).subscribe((response) => {
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
	public saveTestimonial(instance) {

		const form_data = instance.value;
		form_data['avatar'] = this.thumbnail;
		
		this.http.post(`testimonial`, form_data).subscribe((response) => {
			
			if (response['status'] === 'success') {
				if (response['status'] === 'success') {
					this.router.navigate(['/admin/testimonial']);
				}
			}
		}, (errors) => {
			console.log(errors.error);
			this.commonService.showErrors(errors);
		});
	}
	public uploadFile(event) {
		const fileName = event.target.files[0];
		const fileExt = fileName.name.split('.').slice(-1)[0];
		if (this.imageType.indexOf(fileExt) !== -1) {
			this.imageChangedEvent = event;
		} else {
        	alert('Only png,jpeg,jpg,gif format are supported');
      	}
	}
	imageCropped(event) {
		this.croppedImage = event.base64;
		this.fileInstance = event.file;
	}
	imageLoaded() {
		// show cropper
	}
	loadImageFailed() {
		// show message
		this.fileInstance = '';
		this.croppedImage = '';
	}

	public uploadToS3() {
		this.ngxService.start();
		const file = this.fileInstance;
		this.s3.cropedImageUpload(file).send((err, data) => {
			if (err) {
				this.ngxService.stop();
				//console.log(err);
			} else {
				// console.log(data.Location);
				this.ngxService.stop();
				this.thumbnail = data.Location;
			}
		});
	}
}

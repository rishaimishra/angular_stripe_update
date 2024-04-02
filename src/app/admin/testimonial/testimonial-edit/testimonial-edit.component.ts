import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { TestimonialCollection } from '../../../_collection/testimonial.collection';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { S3BucketService } from '../../../services/s3-bucket.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CommonService } from '../../../global/services/common.service';

@Component({
	selector: 'app-testimonial-edit',
	templateUrl: './testimonial-edit.component.html',
	styleUrls: ['./testimonial-edit.component.css']
})

export class TestimoniaEditComponent implements OnInit {

	public error_messages: any = [];
	public testimonial_id: number;
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
		protected activeRoute: ActivatedRoute,
		private ngxService: NgxUiLoaderService,
		protected s3: S3BucketService,
		private commonService: CommonService,
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.getParames();
		this.getTestimonial();
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
	public getParames = function () {
		const route_params = this.activeRoute.snapshot.params;
		this.testimonial_id = route_params.id;
	};

	public getTestimonial() {
		this.ngxService.start();
		this.http.get(`testimonial/${this.testimonial_id}`).subscribe(response => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.formData = response['data'];
			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
		});
	}

	public savetTestimonial(instance) {
		const form_data = instance.value;

		if (this.thumbnail === undefined) {
			form_data['avatar'] = form_data.avatar;
		} else {
			form_data['avatar'] = this.thumbnail;
		}

		this.http.put(`testimonial/${this.testimonial_id}`, form_data).subscribe((response) => {
			if (response['status'] === 'success') {
				this.router.navigate(['/admin/testimonial']);
			}
		}, (errors) => {
			// this.error_messages = errors;
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
				// console.log(err);
			} else {
				// console.log(data.Location);
				this.ngxService.stop();
				this.thumbnail = data.Location;
			}
		});
	}

}

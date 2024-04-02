import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserCollection } from '../../../_collection/user.collection';
import { ProfileCollection } from '../../../_collection/profile.collection';
import { HttpRequestService } from '../../../services/http-request.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { S3BucketService } from '../../../services/s3-bucket.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService

@Component({
	selector: 'app-update-profile',
	templateUrl: './update-profile.component.html',
	styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {

	public error_messages: any = [];
	public success_messages: any = [];
	public user_id: number;
	public user: any;
	public userData: any = new UserCollection();
	public profileData: any = new ProfileCollection();

	public fileInstance: any = null;
	public thumbnail: any;
	public imageSrc: string;
	imageChangedEvent: any = '';
	croppedImage: any = '';
	public notificationRecords: any= [];
	constructor(
		protected http: HttpRequestService,
		protected router: Router,
		protected activeRoute: ActivatedRoute,
		private ngxService: NgxUiLoaderService,
		protected s3: S3BucketService
	) { }

	ngOnInit() {
		window.scroll(0,0);
		this.getUser();
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

	public getUser() {
		this.ngxService.start();
		this.http.get(`user/${this.http.getUser('id')}`).subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.userData = response['data'];
				this.getUserProfile();

			}
		}, (error) => {
			this.ngxService.stop();
		  });
	}
	public getUserProfile() {
		const queryParams = {
			search_by: 'user_id'
		};

		this.http.get(`profile/${this.http.getUser('id')}`, queryParams).subscribe((response) => {
			 console.log(response);
			if (response['status'] === 'success') {
				this.profileData = response['data'];
			}

		});
	}

	public updateUser(instance) {
		this.success_messages = '';
		const form_data = instance.value;
		form_data['avatar'] = this.thumbnail;

		this.http.put(`user/${this.http.getUser('id')}`, form_data).subscribe((response) => {
			if (response['status'] === 'success') {
				this.updateProfile(instance);
			}
		}, (errors) => {
			this.error_messages = errors;
		});
	}
	public updateProfile(instance) {
		const form_data = instance.value;
		form_data['user_id'] = this.http.getUser('id');
		form_data['social_links'] = '';
		form_data['country_id'] = 1;
		form_data['state_id'] = 101;
		form_data['city_id'] = 351;

		this.http.put(`profile/${this.http.getUser('id')}?update_by=user_id`, form_data).subscribe((response) => {
			if (response['status'] === 'success') {
				this.success_messages = 'Successfully update your profile';
			}
		}, (errors) => {
			this.error_messages = errors;
			this.success_messages = '';
		});
	}

	public uploadFile(event) {
		this.imageChangedEvent = event;
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

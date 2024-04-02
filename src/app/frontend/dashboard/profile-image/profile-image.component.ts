import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstantService } from '../../../services/global-constant.service';
import { S3BucketService } from '../../../services/s3-bucket.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-profile-image',
	templateUrl: './profile-image.component.html',
	styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent implements OnInit {

	public messages: any = [];
	public errorMsg: any = '';
	public successMsg: any = '';
	public thumbnail: any = '';
	isVisable = false;
	isFormVisable = true;
	isImageChange = false;
	public fileInstance: any = null;
	public imageSrc: string;

	imageChangedEvent: any = '';
	croppedImage: any = '';

	constructor(
		private modalService: NgbModal,
		private myRoute: Router,
		private http: HttpRequestService,
		public activeModal: NgbActiveModal,
		private constant: GlobalConstantService,
		protected s3: S3BucketService,
		private ngxService: NgxUiLoaderService,

	) { }

	ngOnInit() {

	}
	closeImageModal() {
		this.activeModal.close('Modal Closed');
		if (this.isImageChange) {
			 window.location.reload();
		}

	}
	public uploadToS3() {
		this.ngxService.start();
		const file = this.fileInstance;
		this.s3.cropedImageUpload(file).send((err, data) => {
			if (err) {
				// console.log(err);
			} else {
				// console.log(data.Location);

				this.thumbnail = data.Location;

				const form_data = {
					avatar: data.Location
				};

				this.http.put(`user/${this.http.getUser('id')}`, form_data).subscribe((response) => {
					this.ngxService.stop();
					if (response['status'] === 'success') {
						// console.log('success');
						this.successMsg = 'Profile Image Update Successfully';
						localStorage.setItem('profileImage', data.Location);
						this.isFormVisable = false;
						this.isImageChange = true;
					}
				}, (errors) => {
					this.errorMsg = errors;
				});

			}
		});
	}
	public uploadFile(event) {
		if(event.target.files[0].type === 'image/jpeg' || event.target.files[0].type === 'image/png' || event.target.files[0].type === 'image/jpg' ){
			this.isVisable = true;
			this.imageChangedEvent = event;
		} else
		{
			this.isVisable = false;
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
}

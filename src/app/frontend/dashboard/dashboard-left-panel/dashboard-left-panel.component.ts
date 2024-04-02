import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from '../../../services/http-request.service';

import { ProfileImageComponent } from '../profile-image/profile-image.component';
import { getAuthServiceConfigs } from '../../frontend.module';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../global/services/common.service';
@Component({
	selector: 'app-dashboard-left-panel',
	templateUrl: './dashboard-left-panel.component.html',
	styleUrls: ['./dashboard-left-panel.component.scss']
})
export class DashboardLeftPanelComponent implements OnInit {

	public userProfileImage: any = [];
	public userHeadLine: any = [];
	public userName: any = [];
	public userDetails; any = [];
	public nameExists: any = [];
	public checkWalletShowStatus = false;

	public notificationRecords: any = [];
	public currentRoute : string='' ;

	constructor(
		private modalService: NgbModal,
		protected http: HttpRequestService,
		private router: Router,
		private commonService: CommonService,
		protected activeRoute: ActivatedRoute,
	) { }

	ngOnInit() {
		this.userDetails = this.http.getUser();
		this.nameExists = (this.userDetails.profile.first_name === undefined) ? this.getUserName() : this.userDetails.profile.full_name;

		this.userProfileImage = (localStorage.getItem('profileImage') != null) ? localStorage.getItem('profileImage') : this.userDetails.avatar;

		this.userHeadLine = (localStorage.getItem('profileDetail') != null) ? JSON.parse(localStorage.getItem('profileDetail')).head_line : this.userDetails.profile.head_line;

		this.userName = (localStorage.getItem('profileDetail') != null) ? JSON.parse(localStorage.getItem('profileDetail')).first_name + ' ' + JSON.parse(localStorage.getItem('profileDetail')).last_name : this.nameExists;

		this.checkWalletShowStatus = this.checkWalletShowStatusNew();

		// console.log(this.activeRoute.snapshot.url.length);
		if(this.activeRoute.snapshot.url.length){
			// console.log(this.activeRoute.snapshot.url[0].path);
			this.currentRoute=this.activeRoute.snapshot.url[0].path;
		}
		
	}

	get userFullName() {
		return localStorage.getItem('name');
	}

	get showHideDashboard() {
		return localStorage.getItem('showHideDashboardStatus');
	}


	changeRoute() {
		if(window.innerWidth < 991) {
			let showHideDashboardStatus;
			if(localStorage.getItem('showHideDashboardStatus') =='0') {
					showHideDashboardStatus =1 ;
			} else {
					showHideDashboardStatus =0 ;
			};
			localStorage.setItem('showHideDashboardStatus',showHideDashboardStatus);
		}
		this.getNotificationRecords();
		// this.router.navigate([path]);
	}
	getNotificationRecords() {

		this.http.get(`utility/lastest-dashboard-notifications/${this.userDetails.id}?profile=true&user=true&role=${this.http.getUserRole()[0]}`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.notificationRecords = response['data'];

				localStorage.setItem('notificationRecords', JSON.stringify(this.notificationRecords));
				localStorage.setItem('notificationCount', this.notificationRecords.length);
				//console.log(this.notificationRecords);
				// console.log(JSON.parse(localStorage.getItem('notificationRecords')));
			}
		}, (errors) => {
			this.commonService.showErrors(errors);
		});
	}


	get checkVendor(): any {
		if (localStorage.getItem('userRole') === 'vendor') {
			return true;
		} else {
			return false;
		}
	}

	get checkReseller(): any {
		if (localStorage.getItem('userRole') === 'reseller') {
			return true;
		} else {
			return false;
		}
	}

	get checkCustomer(): any {
		if (localStorage.getItem('userRole') === 'customer') {
			return true;
		} else {
			return false;
		}
	}

	public getUserName() {
		const userName = localStorage.getItem('name').split('@');
		if (userName.length > 0) {
			return userName[0]
		}
		else {
			return userName;
		}
	}


	profileImageModal() {
		let ngbModalOptions: NgbModalOptions = {
			backdrop: 'static',
			keyboard: false
		};

		const modalRef = this.modalService.open(ProfileImageComponent, ngbModalOptions);
		modalRef.result.then((result) => {
			// console.log(result);
		}).catch((error) => {
			// console.log(error);
		});
	}

	public checkWalletShowStatusNew() {
		if (localStorage.getItem('userRole') === 'vendor' || localStorage.getItem('userRole') === 'reseller') {
			return true;
		} else if ((localStorage.getItem('userRole') === 'customer')) {
			this.http.get(`wallets?user=${this.http.getUser().id}`).subscribe((response) => {

				if (response['status'] === 'success') {

					if (!response['data'][0]) {
						return false;
					} else if (response['data'][0] && response['data'][0].amount == 0) {
						return false;
					} else {

						this.checkWalletShowStatus = true;
						return true;
					}
				}

			}, (errors) => {
				// console.log(errors);
			});
		}
	}

}

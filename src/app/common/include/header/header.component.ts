import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginComponent } from '../../../frontend/pages/login/login.component';
import { LogoutMsgComponent } from '../logout-msg/logout-msg.component';
import { RegistrationComponent } from '../../../frontend/pages/registration/registration.component';
import { HttpRequestService } from '../../../services/http-request.service';

import { CommonService } from '../../../global/services/common.service';

import { Router, ActivatedRoute, NavigationEnd as NavEnd } from '@angular/router';

import { elementAt } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';

import { environment } from '../../../../environments/environment'
import { mergeMap } from 'rxjs/operators';
import { SeoServiceService }  from '../../../services/seo-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

	public userDetails: any = [];
	public nameExists: any = [];

	public userProfileImage: any = [];
	public userHeadLine: any = [];
	public userName: any = [];
	public searchKeyParam: any = '';

	public firstTime: boolean = true;
	public fillList: boolean = true;

	searchFrom: FormGroup;

	public status: Boolean = false;
	public notificationShowstatus: Boolean =false;
	public wishlistShowstatus: Boolean = false;
	public  dashboardShowstatus:Boolean =false;
	public status2: Boolean = false;
	public categoryStatus: Boolean = false;
	public subcategoryStatus: Boolean = false;

	public eventMenuStatus: Boolean = false;
	public eventCountryStatus: Boolean = false;
	public eventSpeakerStatus: Boolean = false;
	public eventParentCategoryStatus:Boolean = false;
	public eventchildCategoryStatus: Boolean = false;

	private cartSubscription: Subscription;
	public cartObj: any;
	public autoCompleteData: Array<any> = [];

	public submitted: boolean = false;

	public checkVendorPage: any = [];
	public shortName:string='DB';
	public notificationRecords: any = [];
	public notificationCounts: any = '';
	public innerWidth:any;
	public wishListsearchParams: any = {
		product_details: true,
		images: true,
		user_id: null,
		order_by: '-id',
		limit: 2,
		page: 1
	};
	public wishListRecords: any = [];
	public wishListCounts: any = '';
	public queryParams: any = {};
	public list: Array<any>=[];
	public allEventCategorylist: Array<any>=[];
	public categoriesTree: Array<any> = [];
	public courseParentCategory;
	public courseChildCategory;
	public eventParentCategory;
	public eventChildCategory;
	public eventCountries: Array<any> = [];
	public eventSpeakers: Array<any> = [];

	constructor(
		private modalService: NgbModal,
		private myRoute: Router,
		public http: HttpRequestService,
		public commonService: CommonService,
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		public SeoService:SeoServiceService
	) {
		myRoute.events.subscribe((event) => {
			if (event instanceof NavEnd) {
				this.checkVendorPage = event.url;
			}
		});

	}

	ngOnInit() {
		this.innerWidth =  window.innerWidth;
		this.cartSubscription = this.commonService.cartData$.subscribe((data) => {
			if (!data) {
				this.commonService.getCart().subscribe((cart) => {
					this.cartObj = cart;
				});
			} else {
				this.cartObj = data;
			}
		});

		this.searchFrom = this.fb.group({
			searchKey: [, Validators.required],
		});



		if (this.firstTime) {
			this.activatedRoute.queryParams.subscribe(queryParams => {
				this.submitted = false;
				if (queryParams.string) {
					this.searchKeyParam = queryParams.string;
					this.searchFrom.controls['searchKey'].setValue(this.searchKeyParam);
				} else {

					this.searchKeyParam = '';
					if (this.searchFrom) {
						this.searchFrom.controls['searchKey'].setValue(this.searchKeyParam);
					}
				}

			});
			this.firstTime = false;
		}




		this.userDetails = this.http.getUser();
		// console.log(this.userDetails);

		if (this.userDetails !== false) {
			if (this.userDetails.profile !== undefined) {
				this.nameExists = (this.userDetails.profile.first_name === undefined) ? this.getUserName() : this.userDetails.profile.full_name;

			this.userProfileImage = (localStorage.getItem('profileImage') != null) ? localStorage.getItem('profileImage') : this.userDetails.avatar;

			this.userHeadLine = (localStorage.getItem('profileDetail') != null) ? JSON.parse(localStorage.getItem('profileDetail')).head_line : this.userDetails.profile.head_line;

			this.userName = (localStorage.getItem('profileDetail') != null) ? JSON.parse(localStorage.getItem('profileDetail')).first_name + ' ' + JSON.parse(localStorage.getItem('profileDetail')).last_name : this.nameExists;

			// if(this.userDetails.profile) {
			// 	this.shortName = this.userDetails.profile.first_name.substr(0,1) + this.userDetails.profile.last_name.substr(0,1);
			// }
		}
	}
		this.logoutFromDashboard();

		this.onChanges();
		if(this.http.isLoggednIn()){
			this.getNotificationRecords();
			this.getWishListRecords();
			
		}
		this.getAllCategories('courses');
		this.getAllCategories('events');
		this.getCountries();
		this.getSpeakers();
	}
	public getAllCategories(categoryType){ 
	    let  params = {
			tree: true,
			is_active: true,
			type:categoryType,
		 };
		this.http.get('category', params).subscribe((response)=>{
			// console.log(response);
			
			if(response['status'] === 'success') {
				if(categoryType == 'courses') {
					this.list = response['data'];
					// console.log(this.list);
					this.inputChildren(this.list);		
				} else if(categoryType == 'events') {
					this.allEventCategorylist = response['data'];
					this.inputChildren(this.allEventCategorylist);
				}
					
			}
		}, (error) => {
			this.commonService.showErrors(error);
		  })
	}
	inputChildren(categories, label = 0) {
	//	console.log(categories , 'input children');
		categories.map((el) => {
			el.label = label;
			if(!el.children){
				el.children=[];
			} else {
				this.inputChildren(el.children, (label + 1));
			}
		});
	}

	ngOnDestroy() {
		this.cartSubscription.unsubscribe();
	}

	public clearCartData() {
		this.cartObj = null;
	}

	clickEvent() {
		this.status = !this.status;
		//  console.log(this.status,'cE');
		// console.log(this.categoryStatus,'cE');
	}
	notificationClickEvent() {
		if(!this.notificationShowstatus) {
			if(this.wishlistShowstatus) {
				this.wishlistShowstatus = !this.wishlistShowstatus;
			}
			if(this.dashboardShowstatus) {
				this.dashboardShowstatus = !this.dashboardShowstatus;
			}
		}
		this.notificationShowstatus = !this.notificationShowstatus;
	}

	wishlistClickEvent() {
		if(!this.wishlistShowstatus) {
			if(this.notificationShowstatus) {
				this.notificationShowstatus = !this.notificationShowstatus;
			}
			if(this.dashboardShowstatus) {
				this.dashboardShowstatus = !this.dashboardShowstatus;
			}
		}
		this.wishlistShowstatus = !this.wishlistShowstatus;
	}
	dashboardClickEvent() {
		if(!this.dashboardShowstatus) {
			if(this.notificationShowstatus) {
				this.notificationShowstatus = !this.notificationShowstatus;
			}
			if(this.wishlistShowstatus) {
				this.wishlistShowstatus = !this.wishlistShowstatus;
			}
		}
		this.dashboardShowstatus = !this.dashboardShowstatus;
	}

	cartClickEvent() {
		
		if(this.notificationShowstatus) {
			this.notificationShowstatus = !this.notificationShowstatus;
		}
		if(this.wishlistShowstatus) {
			this.wishlistShowstatus = !this.wishlistShowstatus;
		}
		if(this.dashboardShowstatus) {
			this.dashboardShowstatus = !this.dashboardShowstatus;
		}
	}

	clickCourseCategoryEvent() {
		this.categoryStatus = !this.categoryStatus;
		if (this.categoryStatus) {
			this.geNextCourseCategory(0);
		}
	}

	clickSubCategoryEvent(parentId?){
		this.subcategoryStatus = !this.subcategoryStatus;
		if (this.subcategoryStatus) {
			this.geNextCourseCategory(parentId);
		}
	
	}
	clickEventMenu() {
		this.eventMenuStatus = !this.eventMenuStatus;

	}

	clickEventCountry () {
		this.eventCountryStatus = !this.eventCountryStatus;
		if (this.eventCountryStatus) {
			this.getCountries();
		}
	
	}
	clickEventSpeaker () {
		this.eventSpeakerStatus = !this.eventSpeakerStatus;
		if (this.eventSpeakerStatus) {
			this.getSpeakers();
		}
	
	}
	clickEventParentCategory () {
		this.eventParentCategoryStatus = !this.eventParentCategoryStatus;
		if(this.eventParentCategoryStatus) {
			this.getNextEventCategory(0);
		}
	
	}

	clickEventChildCategory (parentId?) {
		this.eventchildCategoryStatus = !this.eventchildCategoryStatus;
		if(this.eventchildCategoryStatus) {
			this.getNextEventCategory(parentId);
		}
	
	}

	geNextCourseCategory(parentId?) {
		let  params = {
			// tree: true,
			is_active: true,
			type:'courses',
			fetchParentId:parentId,
			parentIdWithChild:true
		 };
		this.http.get('category', params).subscribe((response)=>{
			// console.log(response['data']);
			
			if(response['status'] === 'success'){
				if(!parentId) {
					this.courseParentCategory = response['data'];
				//	this.inputChildren(this.courseParentCategory);
					// console.log((this.courseParentCategory),'mobile course parent cat');
				} else {
					this.courseChildCategory = response['data'];
				//	this.inputChildren(this.courseChildCategory);
				}
			
				
			}
		}, (error) => {
			this.commonService.showErrors(error);
		  })
	}
	
	getNextEventCategory(parentId=0) {
		let  params = {
		//	tree: true,
			is_active: true,
			type:'events',
			fetchParentId:parentId,
			parentIdWithChild:true
		 };
		this.http.get('category', params).subscribe((response)=>{
			// console.log(response['data']);
			
			if(response['status'] === 'success'){
				if(!parentId) {
					this.eventParentCategory = response['data'];
					//this.inputChildren(this.eventParentCategory);
				} else {
					this.eventChildCategory = response['data'];
				//	this.inputChildren(this.eventChildCategory);
				}
			
				
			}
		}, (error) => {
			this.commonService.showErrors(error);
		  })
	}
	
	redirectFromParentCategoryCourseList (){
		this.status = !this.status;
		this.categoryStatus = !this.categoryStatus;
	}
	redirectFromChildCategoryCourseList (){
		this.status = !this.status;
		this.categoryStatus = !this.categoryStatus;
		this.subcategoryStatus = !this.subcategoryStatus;
	}

	redirectFromEventMainList () {
		this.status = !this.status;
		this.eventMenuStatus = !this.eventMenuStatus;
	}

	redirectFromEventCountryList (item) {
		this.status = !this.status;
		this.eventMenuStatus = !this.eventMenuStatus;
		this.eventCountryStatus = !this.eventCountryStatus;
		this.setCurrentCountry(item);
	}

	redirectFromEventSpeakerList (item) {
		this.status = !this.status;
		this.eventMenuStatus = !this.eventMenuStatus;
		this.eventSpeakerStatus = !this.eventSpeakerStatus;
		this.setCurrentSpeaker(item);
	}

	redirectFromEventParentCategoryList () {
		this.status = !this.status;
		this.eventMenuStatus = !this.eventMenuStatus;
		this.eventParentCategoryStatus = !this.eventParentCategoryStatus;
	}

	redirectFromEventChildCategoryList () {
		this.status = !this.status;
		this.eventMenuStatus = !this.eventMenuStatus;
		this.eventParentCategoryStatus = !this.eventParentCategoryStatus;
		this.eventchildCategoryStatus = !this.eventchildCategoryStatus;
	}

	getCountries () {

		const params = {
			id:'countries',
		};
		this.http.setModule('productLeftPanel').update(params).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.eventCountries = response.data;
			
				}
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});


	}

	getSpeakers () {
		const params = {
			id:'event_speakers',
		};
		this.http.setModule('productLeftPanel').update(params).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.eventSpeakers = response.data;
					//  console.log(this.eventSpeakers,'speakers');
				}
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	setCurrentCountry (countryName = 'All') {
		// console.log(countryName, 'country Name');
		localStorage.setItem('selectedCountryForList',countryName);
	}
	
	setCurrentSpeaker (speakerName = 'All') {
		// console.log(speakerName, 'speaker Name');
		localStorage.setItem('selectedSpeakerForList',speakerName);
	}
	get checkUser(): any {
		if (localStorage.getItem('userRole') === 'customer') {
			return true;
		} else {
			return false;
		}
	}
	getNotificationRecords() {
		this.http.get(`utility/lastest-dashboard-notifications/${this.userDetails.id}?profile=true&user=true&role=${this.http.getUserRole()[0]}`).subscribe((response) => {
			if (response['status'] === 'success') {
				this.notificationRecords = response['data'];

			localStorage.setItem('notificationRecords', JSON.stringify(this.notificationRecords));
			localStorage.setItem('notificationCount',this.notificationRecords.length);
		
		  }
		}, (errors) => {
		//	this.commonService.showErrors(errors);
		});
	}
	get notificationCount() {

		this.notificationCounts = parseInt(localStorage.getItem('notificationCount'));
		return this.notificationCounts;
	}
	get notificationRecordInHeader() {

		this.notificationRecords = JSON.parse(localStorage.getItem('notificationRecords'));
		// console.log(this.notificationRecords);
		return this.notificationRecords;
	}

	getWishListRecords() {
		
		this.http.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					this.wishListsearchParams.user_id = user.user.id;
					return this.http.setModule('wishlist').search(this.wishListsearchParams);
				}
			})
		).subscribe((response) => {
			if (response) {
				this.wishListRecords = response.data;
				localStorage.setItem('wishListRecords', JSON.stringify(this.wishListRecords));
				localStorage.setItem('wishListCount',this.wishListRecords.length);
				
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	get wishlistCount() {

		this.wishListCounts = parseInt(localStorage.getItem('wishListCount'));
		return this.wishListCounts;
	}
	get wishlistRecordInHeader() {

		this.wishListRecords = JSON.parse(localStorage.getItem('wishListRecords'));
		return this.wishListRecords;
	}
	// clickEventTopSearch(searchValue) {
	// 	console.log(searchValue.value);
	// 	 this.myRoute.navigate(['/search'], { queryParams: { string: searchValue.value }});
	// }

	onChanges(): void {

		
		this.searchFrom.valueChanges.pipe(debounceTime(1000)).subscribe(val => {
			// console.log(val.searchKey);
			//  console.log(val.searchKey.length);

			if (val.searchKey.length > 2 && this.fillList) {
				
				this.http.get(`utility/product/search/autocomplete?string=${val.searchKey}`).subscribe((response) => {

					if (response['status'] === 'success') {
					//	console.log('qq');
						if (this.fillList) {
							this.autoCompleteData = response['data'].map(element => {
								return element.search_name;
							});
							this.fillList = false;
						}

						// if (!this.fillList) {
						// 	this.autoCompleteData = [];
						// }
					}

					// console.log(this.autoCompleteData);
				}, (error) => {

					this.commonService.showErrors(error);
				});
				
			} else {
				this.autoCompleteData = [];
			}

		});
	}

	searchSubmit() {

		this.submitted = true;
		if (this.searchFrom.valid) {
			this.fillList = false;
			this.myRoute.navigate(['/search'], { queryParams: { string: this.searchFrom.value.searchKey } });
		}
	}

	listElementSelect(item) {
		this.autoCompleteData = [];
		this.searchFrom.controls['searchKey'].setValue(item);

		this.searchSubmit();
	}
	newChange() {
		this.fillList = true;
	}

	loginFormModal() {

		const ngbModalOptions: NgbModalOptions = {
			backdrop: 'static',
			keyboard: false
		};


		const modalRef = this.modalService.open(LoginComponent, ngbModalOptions);

		modalRef.result.then((result) => {

			if (localStorage.getItem('userRole') === 'admin') {
				this.myRoute.navigate(['/admin/dashboard']);
			} else if (localStorage.getItem('userRole') === 'vendor') {
				this.myRoute.navigate(['/dashboard']);
			} else if (localStorage.getItem('userRole') === 'customer') {
				this.myRoute.navigate(['/dashboard/profile']);
			} else {
				this.myRoute.navigate(['/dashboard']);
			}

		}).catch((error) => {

		});
	}

	logoutMgsModal() {
		const modalRefm = this.modalService.open(LogoutMsgComponent);
	}

	get name(): any {
		const userName = localStorage.getItem('name').split('@');
		if (userName.length > 0) {
			return userName[0];
		} else {
			return userName;
		}

	}

	get userRole(): any {

		return localStorage.getItem('userRole');
	}

	get checkAdmin(): any {
		if (localStorage.getItem('userRole') === 'admin') {
			return true;
		} else {
			return false;
		}
	}

	public getUserName() {
		const userName = localStorage.getItem('name').split('@');
		if (userName.length > 0) {
			return userName[0];
		} else {
			return userName;
		}
	}

	registerFormModal() {
		const ngbModalOptions: NgbModalOptions = {
			backdrop: 'static',
			keyboard: false
		};
		const modalRef = this.modalService.open(RegistrationComponent, ngbModalOptions);
		modalRef.componentInstance.role = 'customer';
		modalRef.result.then((result) => {
			// console.log(result);
			if(result.provider=='normal'){
				this.myRoute.navigate(['/consumer-registration-succcess']);
			} else {
				this.myRoute.navigate(['/']);
			}
			

		}).catch((error) => {
			//  console.log(error);
		});
	}

	logOut() {
		this.http.doLogout();
		localStorage.removeItem('profileDetail');
		localStorage.removeItem('profileImage');
		this.commonService.removeCart();
		this.logoutMgsModal();
		this.SeoService.getMetaInfo();
	}

	logoutFromDashboard() {
		if (this.myRoute.url === '/home/logout') {
			this.logOut();
		}
	}

	getUserID(id ,userRole){
		if(userRole == 'vendor') {
			return environment.vendorIdPrefix + id;
		} else if(userRole == 'customer') {
			return environment.custmerIdPrefix + id;
		}  else if(userRole == 'reseller') {
			return environment.resellerIdPrefix + id;
		}
		
	}

}

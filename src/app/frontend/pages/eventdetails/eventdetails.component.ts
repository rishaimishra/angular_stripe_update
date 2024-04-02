import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgReactiveFormValidatorService } from 'ng-reactive-form-validator';

import { LoginComponent } from '../../../frontend/pages/login/login.component';

import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EventTicketComponent } from '../../pages/event-ticket/event-ticket.component';

import { CommonService } from '../../../global/services/common.service';
import { Constant } from '../../../global/constant';
import * as moment from 'moment';
import { environment as env } from '../../../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { EncrDecrService } from '../../../services/encr-decr.service';
@Component({
	selector: 'app-eventdetails',
	templateUrl: './eventdetails.component.html',
	styleUrls: ['./eventdetails.component.scss'],

})
export class EventdetailsComponent implements OnInit {

	public eventSlug: any;
	public eventData: any;

	public lat:number=22.5726;
	public lng:number= 88.3639;

	featureSide = { items: 1, dots: false, nav: true, margin: 0 };
	public images = [];
	galleryOptions: NgxGalleryOptions[];
	galleryImages: NgxGalleryImage[];

	public cartForm: FormGroup;
	public ticketCategories: Array<any> = [];
	public availableQuantity: number;
	public selectedTicketCategory:any;

	public price:any={
		usd_price: 0.0,
		sxl_price: 0.0,
		total_price: 0.0,
	};
	public fetureEvents: any;
	public upcommingEvents: any;
	public speakers;
	public ticketBookingStatus:any;
	public image: any = 'assets/images/event-banner.jpg';
	constructor(
		public http: HttpRequestService,
		public ngxService: NgxUiLoaderService,
		public config: NgbRatingConfig,
		private activatedRoute: ActivatedRoute,
		public formBuilder: FormBuilder,
		public validatorService: NgReactiveFormValidatorService,
		public commonService: CommonService,
		private modalService: NgbModal,
		private myRoute: Router,
		private meta:Meta,
		private titleService: Title,
		private EncrDecr: EncrDecrService 
	) {
		config.max = 5;
		config.readonly = true;
	}

	ngOnInit(): void {

		this.cartForm = this.formBuilder.group({
			quantity: [1, [Validators.required, Validators.min(1)]]
		});

		this.activatedRoute.params.subscribe(routeParams => {
			// this.loadUserDetail(routeParams.id);
			// console.log(routeParams.slug);
			this.eventSlug = routeParams.slug;
			this.getEventDetails();
			this.getFetureEvents();
			this.getUpcommingEvents();

		});

		this.galleryOptions = [
			{
				width: '100%',
				height: '460px',
				thumbnailsColumns: 4,
				imageAnimation: NgxGalleryAnimation.Slide
			},
			// max-width 800
			{
				breakpoint: 800,
				width: '100%',
				height: '400px',
				imagePercent: 80,
				thumbnailsPercent: 20,
				thumbnailsMargin: 10,
				thumbnailMargin: 10
			},
			// max-width 400
			{
				breakpoint: 400,

			}
		];

	}

	getEventDetails() {
		this.ngxService.start();
		this.http.get(`event/${this.eventSlug}?images=true&event=true&event_country=true&event_state=true&event_city=true&offers=true&categories=true&user=true&profile=true&fetch_price=true&event_speaker=true&isApproved=true`).subscribe((response) => {
			window.scroll(0, 0);
			if (response['status'] === 'success') {

				this.selectedTicketCategory = '';
				this.availableQuantity = 0;
				this.price.usd_price = 0.0;
				this.price.sxl_price = 0.0;
				this.price.total_price = 0.0;
				this.cartForm.patchValue({quantity: 0});
				this.ticketCategories=[];

				/**
				 * set meta info
				 */

				this.titleService.setTitle(response['data'].title);
				this.meta.addTag({ name: 'description', content: response['data'].meta_description });
				this.meta.updateTag({ name: 'description', content:  response['data'].meta_description });
				this.meta.addTag({ name: 'Keywords', content: response['data'].meta_keywords });
				this.meta.updateTag({ name: 'Keywords', content:  response['data'].meta_keywords });

				
				this.eventData = response['data'];
				if(this.eventData.event.banner_image != null) {
					this.image = this.eventData.event.banner_image;
				}
				 // console.log(this.eventData, 'Event Data');
				// this.eventData.event.start_time = this.commonService.timeConvert(this.eventData.event.start_time);
				// this.eventData.event.end_time = this.commonService.timeConvert(this.eventData.event.end_time);

				this.speakers = Array.prototype.map.call(this.eventData.event_speakers , s => s.name).toString();

				let calDiff = + Date.now() - +new Date(this.eventData.event.end_date).getTime();
				let DiffInDays = Math.round(Math.abs(calDiff/(1000*60*60*24)));
				// console.log(DiffInDays);
				if(DiffInDays == 0){
						this.ticketBookingStatus = 'ongoing';
				} else if(moment().isAfter(moment(this.eventData.event.end_date))) {
					this.ticketBookingStatus = 'past';
				} else if (moment().isAfter(moment(this.eventData.event.start_date))) {
					this.ticketBookingStatus = 'ongoing';
				} else {

					let diffc = + Date.now() - +new Date(this.eventData.event.start_date).getTime();
					let days = Math.round(Math.abs(diffc/(1000*60*60*24)));

					let ticketBookingTimeDiff =  localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).ticketBookingTimeDiff : env.ticketBookingTimeDiff;

					if (ticketBookingTimeDiff>days) {
						this.ticketBookingStatus = 'close';

					} else {
						this.ticketCategories = this.eventData.pricable.filter((el) => {
							return el.quantity>0;
						});
						if (this.ticketCategories.length> 0) {
							this.ticketBookingStatus = 'open';
						} else {
							this.ticketBookingStatus = 'full';
						}
					}

				}

				// this.ticketCategories = this.eventData.pricable;
			

				if(this.eventData.length==0){
					this.myRoute.navigate(['/404-not-found'],);
				}
				this.ngxService.stop();

				//const latLong=https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
				

				// console.log(this.eventData);
				const gallaryImage = {
					small: 'assets/images/noimg-125x105.jpg',
					medium: 'assets/images/noimg-530x345.jpg',
					big: 'assets/images/noimg-530x345.jpg'
				};
				if (this.eventData.images.length > 0) {
					this.galleryImages = this.eventData.images.map((value) => {

						const imgObj = {
							small: value.thumbnail,
							medium: value.banner,
							big: value.original,
						};
						return imgObj;

					});
				}


			}
		}, (errors) => {
			this.ngxService.stop();
		});
	}

	getFetureEvents() {
		let params= {
			pagination: true,
            limit: 3,
            is_publish: true,
            images: true,
            is_featured: 1,
			event: true,
			is_delete:true,
			is_active: true,
			isApproved: true,
		};
		this.http.setModule('event').list(params).subscribe((response) => {
			if (response) {
				this.fetureEvents = response.data;
				// console.log(this.fetureEvents);
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	getUpcommingEvents() {
		let params= {
			pagination: true,
            limit: 3,
            is_publish: true,
            images: true,
			coming_soon: true,
			event: true,
			is_delete:true,
			is_active:true,
			isApproved: true,
		};
		this.http.setModule('event').list(params).subscribe((response) => {
			if (response) {
				this.upcommingEvents = response.data;
				//console.log(this.fetureEvents);
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	ticketCategoryChange(evemt) {
		let itemKey= evemt.target.value;
		// console.log(itemKey);
		 // console.log(this.ticketCategories[itemKey]);
		// this.selectedTicketCategory = item;
		// this.availableQuantity = item.quantity;
		// this.price.usd_price = item.usd_price;
		// this.price.sxl_price = item.sxl_price;
		// this.price.total_price = item.total_price;
		// this.cartForm.patchValue({quantity: 1});

		if(itemKey == '-1'){
			this.selectedTicketCategory = '';
			this.availableQuantity = 0;
			this.price.usd_price = 0.0;
			this.price.sxl_price = 0.0;
			this.price.total_price = 0.0;
			this.cartForm.patchValue({quantity: 0});

		} else {
			this.selectedTicketCategory = this.ticketCategories[itemKey];
			this.availableQuantity = this.ticketCategories[itemKey].quantity;
			this.price.usd_price = this.ticketCategories[itemKey].usd_price;
			this.price.sxl_price = this.ticketCategories[itemKey].sxl_price;
			this.price.total_price = this.ticketCategories[itemKey].total_price;
			this.cartForm.patchValue({quantity: 1});
		}

	}
	eventTicketModal() {
		const modalRef = this.modalService.open(EventTicketComponent);

		modalRef.result.then((result) => {

		}).catch((error) => {

		});
	}

	minusQuantity(event) {
		if (event && (this.cartForm.value['quantity'] > 1)) {
			this.cartForm.patchValue({
				quantity: (this.cartForm.value['quantity'] - 1)
			});
		}
	}

	plusQuantity(event) {
		if (event && (this.cartForm.value['quantity'] < this.availableQuantity)) {
			this.cartForm.patchValue({
				quantity: (this.cartForm.value['quantity'] + 1)
			});
		}
	}

	saveToCart() {
		if(this.selectedTicketCategory){
			if (this.cartForm.valid  ) {
				const formVal = this.cartForm.value;
				if (formVal.quantity <= this.availableQuantity) {
					 this.addToCart();
				} else {
					this.commonService.showMessage({ type: 'warning', title: '', message: 'You have entered quantity more than stock' });
				}
			} else {
				const errorStr = this.validatorService.getErrorList(this.cartForm, {});
				this.commonService.showMessage({ type: 'warning', title: '', message: errorStr });
			}
		} else {
			this.commonService.showMessage({ type: 'warning', title: '', message: 'Please select a ticket category.' });
		}
		
	}

	addToCart() {
		const formVal = this.cartForm.value;
		this.eventData.pricable = [];
		this.eventData.pricable[0]=this.selectedTicketCategory;
		this.eventData.price = this.price;
		const cartParams = {
			id: (new Date()).getTime(),
			type: 'event',
			mode: 'add',
			coupon: null,
			discount: null,
			quantity: formVal.quantity,
			details: this.eventData
		};
		// console.log(cartParams);

		this.commonService.setCart(cartParams).subscribe((response) => {
			this.commonService.showMessage({ type: 'success', title: '', message: 'Item added to  cart' });
			this.commonService.scrollToElement('mini-cart');
		}, (error) => {
			if (error) {
				// console.log(error);
				if (error.statusText === 'Unauthorized') {
					this.commonService.scrollToElement('mini-cart');
					const modalRef = this.modalService.open(LoginComponent);
					modalRef.result.then((result) => {
						this.ngxService.stop()
					}).catch((error) => {
						this.ngxService.stop()
						//console.log(error);
					});
				} else {
					this.commonService.showMessage({ type: 'warning', title: '', message: error.message });
				}
			}
		});
	}

}

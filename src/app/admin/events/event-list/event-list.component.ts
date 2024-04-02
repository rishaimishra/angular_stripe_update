import { Component, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToasterService } from 'angular2-toaster';
import { environment } from '../../../../environments/environment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonService } from '../../../global/services/common.service';
import {ExcelService} from '../../../global/services/excel.service';
import * as moment from 'moment';
import { from } from 'rxjs';
@Component({
	selector: 'app-event-list',
	templateUrl: './event-list.component.html',
	styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
	public error_messages: any = [];
	public user: any;
	public pagination: any = [];
	public limit: Number = 10;
	public data: any = [];
	public attendees: any =[];
	public exceldata: any = [];
	private toasterService: ToasterService;
	public trashBtn = '<i class="fa fa-trash"></i>';
	public featureYes = "<i class='fa fa-check-circle' aria-hidden='true'></i>";
	public featureNo = "<i class='fa fa-circle-thin' aria-hidden='true'></i>";
	searchForm: FormGroup;

	public searchParams: any = {
		// pagination: true,
		fetch_price: true,
		//order_by: 'id',
		//limit: this.http.adminPerPage,
		//: 1,
		event:true,
		date_filter : true,
		images:true,
		event_country:true,
		categories:1,
		user:true,
		is_delete: true,
		attendee_info:true

	
	};



	constructor(
		private fb: FormBuilder,
		toasterService: ToasterService,
		protected http: HttpRequestService,
		protected activeRoute: ActivatedRoute,
		private render: Renderer,
		private ngxService: NgxUiLoaderService,
		private myRoute: Router,
		private commonService: CommonService,
		private excelService: ExcelService,
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.user = this.http.getUser();
		this.ngxService.start();

		this.activeRoute.queryParams.subscribe((response) => {
			const page = response.page ? response.page : 1;
			this.getEvents(page);
			this.ngxService.stop();
		});
		this.searchForm = this.fb.group({
			string: [''],
		  });
	}
	getEventID(id){
		return environment.eventIdPrefix + id;
	}
	public getEvents(page: number = 1, limit: number = 1) {
		// this.http.get(`event?categories=1&user=true&fetch_price=true&date_filter=true&images=true&event_country=true`).subscribe((response) => {
		// 	if (response['status'] === 'success') {
		// 		this.data = response['data'];
		// 	}
		// }, (errors) => {
		// 	this.error_messages = errors;
		// });
		// window.scroll(0,0);
		//console.log(this.searchParams,'searchParams');
		this.http.setModule('event').search(this.searchParams).subscribe((response) => {
			if (response) {
				this.data = response.data;
				// console.log(this.data);
				this.data.map((el) => {
					if (moment(el.event.start_date,'YYYY-MM-DD').diff(moment(),'days') > (environment.ticketBookingTimeDiff-1)){
						el.TicketExportStatus = false;
					} else {
						el.TicketExportStatus = true;
					}
				});
			}
		}, (errors) => {
			this.error_messages = errors;
		});
	}

	public editEvent(event): void {
		localStorage.removeItem('eventEditId');
		localStorage.setItem('eventEditId', event.id.toString());
		this.myRoute.navigate(['/dashboard/event-edit']);
	}

	public changeStatus(statusType, eventId, index) {
		// console.log(statusType);
		this.ngxService.start();
		let status;
		if (statusType === 'draft') {
			status = 'publish';
		} else {
			status = 'draft';
		}
		const formdata = {
			id: eventId,
			status: status,
			user_id: this.user.id,
		};
		this.http.post(`utility/product/status`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {
				// console.log('h');
				this.ngxService.stop();
				const updateData = response['data'];
				this.data[index].status = updateData.status;
			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Unable to publish the event as it is not yet been completed by the vendor.');
		});
	}

	public changeApproveStatus( eventId, index) {
		// console.log(statusType);
		this.ngxService.start();
		
		const formdata = {
			type:"event_tickets",
			id:eventId,
			approved_by:this.user.id
		};
		this.http.post(`utility/admin/approved`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {

				this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].status = updateData.status;

				this.data.find(function (element) {
					if (element.id === eventId) {
						element.status = 'publish';
						element.approved_status = 1;
					}
				});

			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Error', 'Unable to publish the event.');
		});
	}

	public changeFeatureStaus(featureType, eventId, index) {
		// console.log(statusType);

		this.ngxService.start();
		let is_featured;
		if (featureType === 0) {
			is_featured = '1';
		} else {
			is_featured = '0';
		}
		const formdata = {
			id: eventId,
			is_featured: is_featured
		};
		this.http.post(`utility/product/status/featured`, formdata).subscribe((response) => {
			if (response['status'] === 'success') {
				// console.log('h');
				this.ngxService.stop();
				const updateData = response['data'];
				this.data[index].is_featured = updateData.is_featured;
			}
		}, (errors) => {
			this.ngxService.stop();
			//this.error_messages = errors;
			this.commonService.showErrors(errors);
		});
	}
	search() {
		const form_data = this.searchForm.value;
		this.searchParams.page = 1;
			this.searchParams.string = form_data['string'];
			this.getEvents();
	}

	changeActiveStaus(isActiveStatus, eventId, index) {
		this.ngxService.start();
		let url3rdSegment;
		if (isActiveStatus === 0) {
			url3rdSegment = 'active';
		} else {
			url3rdSegment = 'in_active';
		}

		this.http.get(`utility/action/${url3rdSegment}/event_tickets/${eventId}/admin/${this.user.id}`).subscribe((response) => {
			if (response['status'] === 'success') {

				this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].is_featured = updateData.is_featured;

				this.data.find(function (element) {
					if (element.id === eventId) {
						element.is_active = updateData.is_active;
					}
				});

			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Event already purches by someone');
		});
	}

	changeFirstSellingStaus (isFirstSellingStatus, eventId, index) {
		this.ngxService.start();
		let url5thSegment;
		if (isFirstSellingStatus==1) {
			url5thSegment = 0;
		} else {
			url5thSegment = 1;
		}

		this.http.get(`utility/is-fast-selling/${eventId}/products/${url5thSegment}`).subscribe((response) => {
			if (response['status'] === 'success') {

				this.ngxService.stop();
				const updateData = response['data'];
				// this.data[index].is_featured = updateData.is_featured;

				this.data.find(function (element) {
					if (element.id === eventId) {
						
						element.is_fast_selling = updateData.is_fast_selling;
						// console.log(updateData.is_fast_selling,'fs');
						// console.log(element.is_fast_selling,'element fs');
					}
				});

			}
		}, (errors) => {
			this.ngxService.stop();
			this.error_messages = errors;
			this.toasterService.pop('error', 'Event already purches by someone');
		});
	}
	deleteRecord(id) {
		this.http.get(`utility/soft-delete/event_tickets/${id}/admin/${this.user.id}` ).subscribe((response) => {    
			if (response) {
			   this.toasterService.pop('success', 'Event deleted');
  
			  const idx = this.data.findIndex((el) => {
				return (el.id ===id);
			  });
			  if (idx > -1) {
				this.data.splice(idx, 1);
			  }
			}
		  }, (error) => {
			this.commonService.showErrors(error);
		});
	}
	public goToTop() {
		window.scroll(0,0);
	}

	public eventTicketsList(eventId) {
		 console.log(eventId);
		this.ngxService.start();
		this.http.get(`attendee-info?event_id=${eventId}`).subscribe((response) => {
			this.ngxService.stop();
			if (response['status'] === 'success') {
				response['data'].forEach((data) => {
					data.attendee_details.forEach((el) => {
						el.user = data.user;
						this.attendees.push(el);
					}); 
				});
				
				// console.log(this.attendees);
				//window.scroll(0,0);

				this.exceldata = this.attendees.map((element) => {
					let attendeeInfo = {
						attendeeTicketNumber:'',
						attendeeFirstName:'',
						attendeeLastName:'',
						attendeeEmail:'',
						attendeeContactNumber:'',
						attendeeCountry:'',
						ticketPurchesBy:'',
						ticketPurchaserEmail:'',
					};
					attendeeInfo.attendeeTicketNumber = element.ticket_number;
					attendeeInfo.attendeeFirstName = element.first_name;
					attendeeInfo.attendeeLastName = element.last_name;
					attendeeInfo.attendeeEmail = element.email;
					attendeeInfo.attendeeContactNumber = `${element.phone_code}-${element.phone_number}`;
					attendeeInfo.attendeeCountry = element.country.name;
					attendeeInfo.ticketPurchesBy = element.user.profile.full_name;
					attendeeInfo.ticketPurchaserEmail = element.user.email;
					return attendeeInfo;
				});
				this.excelService.exportAsExcelFile(this.exceldata, 'attendeeInfo');

			}
		}, (errors) => {
			this.ngxService.stop();
      		this.commonService.showErrors(errors);
		});
	}

}

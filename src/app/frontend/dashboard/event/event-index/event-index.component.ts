import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { HttpRequestService } from '../../../../services/http-request.service';
import { CommonService } from '../../../../global/services/common.service';
import { environment } from '../../../../../environments/environment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KycModalComponent } from '../../kyc-modal/kyc-modal.component';
import { SeoServiceService }  from '../../../../services/seo-service.service';


@Component({
	selector: 'app-event-index',
	templateUrl: './event-index.component.html',
	styleUrls: ['./event-index.component.css']
})
export class EventIndexComponent implements OnInit, AfterViewInit {

	private toasterService: ToasterService;
	public records: Array<any> = [];
	public user: any;
	public statusArr: Array<any> = [
		{
			code: 'draft',
			name: 'Draft',
			cssClass: 'badge badge-warning'
		},
		{
			code: 'publish',
			name: 'Publish',
			cssClass: 'badge badge-success'
		},
		{
			code: 'unpublish',
			name: 'Unpublish',
			cssClass: 'badge badge-danger'
		}
	];

	public searchParams: any = {
		pagination: true,
		fetch_price: true,
		order_by: '-id',
		limit: this.httpService.vendorPerPage,
		page: 1,
		date_filter : true,
		images:true,
		event_country:true,
		is_delete: true,
		user_id:this.httpService.getUser().id,
		event:true
	};

	public paginationObj: any;
	searchForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		toasterService: ToasterService,
		private commonService: CommonService,
		private httpService: HttpRequestService,
		private modalService: NgbModal,
		public SeoService:SeoServiceService
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		this.user = this.httpService.getUser();
		this.searchForm = this.fb.group({
			string: [''],
		  });
		this.getEvents();
	}

	ngAfterViewInit() {
	}
	getEventID(id){
		return environment.eventIdPrefix + id;
	}
	public getEvents() {
		this.httpService.setModule('event').search(this.searchParams).subscribe((response) => {
			if (response) {
				window.scroll(0,0);
				this.records = response.data;
				this.paginationObj = response.pagination;
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}

	_statusSelection(record) {
		let selectedStatus = null;
		if (record) {
			selectedStatus = this.statusArr.find((el) => (el.code === record.status));
		}
		return selectedStatus;
	}

	getStatusTest(record: any) {
		let status = '';

		const selectedStatus = this._statusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.name;
		}
		return status;
	}

	setEventStatus(record: any) {
		let status: string;
		if (record) {
			if (record.status == 'draft') {
				status = 'publish';
			} else {
				status = 'draft';
			}
			let statusData: any = {
				id: record.id,
				status: status,
				type:'products',
				user_id: this.user.id,
			};
			//if (confirm('Are you sure want to change event status?')) {
				this.httpService.post(`utility/product/status`, statusData).subscribe((response) => {
					if (response) {

						this.toasterService.pop('success', 'Successfully change the status.');
						this.getEvents();
					}
					// console.log(response);
				}, (error) => {
					this.commonService.showErrors(error);
				});

			//}
		}
	}
	kycModal(courseId) {
		const modalRef = this.modalService.open(KycModalComponent);
		modalRef.componentInstance.entityType = 'event';
	}
	getStatusClass(record: any) {
		let status = '';

		const selectedStatus = this._statusSelection(record);
		if (selectedStatus) {
			status = selectedStatus.cssClass;
		}
		return status;
	}

	pagination(event) {
		if (event) {
			this.searchParams.page = event.page;
			this.getEvents();
		}
	}

	deleteRecord(id) {
		this.httpService.get(`utility/soft-delete/event_tickets/${id}/vendor/${this.user.id}` ).subscribe((response) => {    
			if (response) {
			   this.toasterService.pop('success', 'Event deleted');
  
			  const idx = this.records.findIndex((el) => {
				return (el.id ===id);
			  });
			  if (idx > -1) {
				this.records.splice(idx, 1);
			  }
			}
		  }, (error) => {
			this.commonService.showErrors(error);
		});
	}

	search() {
		
		const form_data = this.searchForm.value;
		this.searchParams.page = 1;
			this.searchParams.string = form_data['string'];
			this.getEvents();
		}
}

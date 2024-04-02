import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment as env } from '../../../../environments/environment';
import { SeoServiceService }  from '../../../services/seo-service.service';
import { EncrDecrService } from '../../../services/encr-decr.service';
@Component({
	selector: 'app-dashboard-content',
	templateUrl: './dashboard-content.component.html',
	styleUrls: ['./dashboard-content.component.scss',
		'../dashboard-left-panel/dashboard-left-panel.component.scss']
})
export class DashboardContentComponent implements OnInit {

	private toasterService: ToasterService;

	public dashboardData: any;
	public topSellingCourses: Array<any> = [];
	public topSellingEvents: Array<any> = [];
	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public orderOverview: Array<any> = [];
	public courses: Array<any> = [];
	public events: Array<any> = [];

	public barChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public lineChartLegend:boolean = true;
  	public lineChartType:string = 'line';


	public barChartData: any[] = [
		{ data: [], label: 'Courses' },
		{ data: [], label: 'Events' }
	];

	// events
	public chartClicked(e: any): void {
		// console.log(e);
	}

	public chartHovered(e: any): void {
		// console.log(e);
	}
	public kycStatus:boolean;
	public kycUrl: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).kycUrl : env.kycUrl;
  	public kycReferenceVideoUrl: string = localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).kycReferenceVideoUrl : env.kycReferenceVideoUrl;
	constructor(
		private myRoute: Router,
		toasterService: ToasterService,
		private commonService: CommonService,
		private httpService: HttpRequestService,
		private ngxService: NgxUiLoaderService,
		public SeoService:SeoServiceService,
		private EncrDecr: EncrDecrService 
	) {
		this.toasterService = toasterService;
	}

	ngOnInit() {
		window.scroll(0,0);
		this.SeoService.getMetaInfo();
		if (localStorage.getItem('userRole') === 'customer') {
			this.myRoute.navigate(['/dashboard/profile']);
		}
		this.getDashboardData();
	
		if(this.httpService.getUserRole()[0]=='vendor' || this.httpService.getUserRole()[0]=='reseller') {
			this.kycStatus = this.httpService.checkKyc();
			// console.log(this.kycStatus);

		}
		

	}

	public getDashboardData() {
		window.scrollTo(0, 0);
		this.ngxService.start();


		this.httpService.get(`dashboard/${this.httpService.getUser().id}?search_by=vendor`).subscribe((response) => {
			//  console.log(response, 'dashboar data');
			this.ngxService.stop();
			if (response['status'] === 'success') {
				this.dashboardData = response['data'];
				this.orderOverview = response['data']['order_overview'];
				// console.log(this.orderOverview, ' Oder overview');
				this.courses = this.orderOverview.filter((element) => (
					element.productable_type === 'courses'
				));

				this.events = this.orderOverview.filter((element) => (
					element.productable_type === 'products'
				));
				// console.log(this.courses);


				// this gives an object with dates as keys
				const groups = this.courses.reduce((groups, course) => {
					let courseMonth = course.created_at.split('T')[0].split('-')[1];

					if (!groups[courseMonth]) {
						groups[courseMonth] = [];
					}
					groups[courseMonth].push(course);
					return groups;
				}, {});

				const eventGroups = this.events.reduce((eventGroups, event) => {
					let eventMonth = event.created_at.split('T')[0].split('-')[1];

					if (!eventGroups[eventMonth]) {
						eventGroups[eventMonth] = [];
					}
					eventGroups[eventMonth].push(event);
					return eventGroups;
				}, {});


				// Edit: to add it in the array format instead
				const groupCoursesArrays = Object.keys(groups).map((date) => {
					return {
						date,
						courses: groups[date].length
					};
				});
			
				const groupEventsArrays = Object.keys(eventGroups).map((date) => {
					return {
						date,
						courses: eventGroups[date].length
					};
				});

				let perMonthCourseCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				let perMonthEventCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

				groupCoursesArrays.forEach((element) => {

					perMonthCourseCount[parseInt(element.date) - 1] = element.courses;

				});

				groupEventsArrays.forEach((element) => {

					perMonthEventCount[parseInt(element.date) - 1] = element.courses;

				});

				this.barChartData = [
					{ data: perMonthCourseCount, label: 'Courses' },
					{ data: perMonthEventCount, label: 'Events' },
				];

				this.topSellingCourses = response['data']['top_sellings_courses'];
				this.topSellingEvents = response['data']['top_sellings_events'];
			}
		}, (error) => {
			// console.log(error);
			this.ngxService.stop();
		});
	}

}

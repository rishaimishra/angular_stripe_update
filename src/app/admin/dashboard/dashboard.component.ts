import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { HttpRequestService } from '../../services/http-request.service';
import { CommonService } from '../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	private toasterService: ToasterService;

	public dashboardData:any;
	public annoucements: Array<any> = [];
	public notifications: Array<any> = [];
  public barChartOptions:any = {
		scaleShowVerticalLines: false,
		responsive: true
		};
	public orderOverview: Array<any> = [];
	public courses: Array<any> = [];
	public events: Array<any> = [];

	public barChartLabels:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	public barChartType:string = 'bar';
	public barChartLegend:boolean = true;

	public lineChartLegend:boolean = true;
  public lineChartType:string = 'line'

	 
	public barChartData:any[] = [
		{data: [], label: 'Courses'},
		{ data: [], label: 'Events' }
	];
	 
	  // events
	public chartClicked(e:any):void {
		// console.log(e);
	}
	 
	public chartHovered(e:any):void {
		// console.log(e);
	}
	public notificationRecords: any= [];
  constructor(
		private myRoute: Router,
		toasterService: ToasterService,
		private commonService: CommonService,
    private httpService: HttpRequestService,
		private ngxService: NgxUiLoaderService,
		
	) { 
		this.toasterService = toasterService;
	}

  ngOnInit() {
		window.scroll(0,0);
	
		if(localStorage.getItem('userRole') === 'customer') {
			this.myRoute.navigate(['/dashboard/profile']);
		}
		this.getDashboardData();
		this.getNotificationRecords();
	}
	getNotificationRecords() {
   
		this.httpService.get(`utility/lastest-dashboard-notifications/${this.httpService.getUser().id}?profile=true&user=true&role=${this.httpService.getUserRole()[0]}`).subscribe((response) => {
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
	public getDashboardData() {
    window.scrollTo(0,0);
    this.ngxService.start();
	

		this.httpService.get(`dashboard/${this.httpService.getUser().id}`).subscribe((response) => {
			// console.log(response,'Dashboard data');
			this.ngxService.stop();
      if (response['status'] === 'success') {
				this.dashboardData =  response['data'];
				this.orderOverview = response['data']['order_overview'];
				this.courses =  this.orderOverview.filter((element) => (
					element.productable_type == 'courses'
				));
				this.events = this.orderOverview.filter((element) => (
					element.productable_type === 'products'
				));
			//	console.log(this.courses);


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
			//	console.log(groupCoursesArrays);
				let perMonthCourseCount = [0,0,0,0,0,0,0,0,0,0,0,0];
				let perMonthEventCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

				groupCoursesArrays.forEach((element)=>{

					perMonthCourseCount[parseInt(element.date)-1]=element.courses;

				});

				groupEventsArrays.forEach((element) => {

					perMonthEventCount[parseInt(element.date) - 1] = element.courses;

				});
			//	console.log(perMonthCourseCount);

				this.barChartData = [
					{data: perMonthCourseCount, label: 'Courses'},
					{ data: perMonthEventCount, label: 'Events' },
				];
			
			//	this.annoucements = response['data']['announcement'];
			//	this.notifications = response['data']['notification'];
      }
    }, (error) => {
      // console.log(error);
      this.ngxService.stop();
		});
  }


}
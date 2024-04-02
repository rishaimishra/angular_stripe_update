import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../global/services/common.service';
import { SeoServiceService }  from '../../../services/seo-service.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-events-landing-page',
  templateUrl: './events-landing-page.component.html',
  styleUrls: ['./events-landing-page.component.scss']
})
export class EventsLandingPageComponent implements OnInit {

  public pageType = 'home';
	public slides: any = [];
	public topCategories: any = [];
	public testimonialListing: any = [];
	public productListing: any = [];
	public featuredEventListing: any = [];
	public upcomingEventListing: any = [];
	public featuredCourseCategory: any = [];
	public featuredCourses: any = [];
	public customerViewingCourses: any = [];
	public promotedCourses: any = [];
	public loader: Boolean = true;
	public upcommingEvents: any = [];
	public pastEvents: any = [];
	Math: any;
	public videos: Array<any> = [];
	
	videoCarousel = {
		items: 1,
		dots: false,
		responsiveClass: true,
		nav: true,
		margin: 20,
		responsive: {
			0: { items: 1 },
			400: { items: 1, margin: 10 },
			1023: { items: 2, margin: 10 },
			1138: { items: 2, margin: 10 }
		}
	};


	featuredEvents = {
		items: 4,
		dots: false,
		responsiveClass: true,
		nav: true, 
		margin: 25,
		responsive: { 0: { items: 1 }, 400: { items: 1, margin: 10 }, 1023: { items: 3, margin: 10 }, 1138: { items: 4 } }
	};

	constructor(
		private http: HttpRequestService,
		private ngxService: NgxUiLoaderService,
		config: NgbRatingConfig,
		private commonService: CommonService,
		public SeoService:SeoServiceService
	) {
		config.max = 5;
		config.readonly = true;
		this.Math=Math;
	}

	ngOnInit() {
		this.SeoService.getMetaInfo();

		this.getFeaturedEvents();
		this.getUpcommingEvents();
		this.getPastEvents();
		this.getVideos();
	}

	
	
	public getFeaturedEvents() {
		const params = {
			pagination: true,
			limit: 10,
			is_publish: true,
			images: true,
			is_featured: 1,
			event: true,
			event_speaker:true,
			fetch_price: true,
			is_delete:true,
			is_active:true,
			date_filter:true,
			isApproved:true
    };
    this.ngxService.start();
		this.http.get(`event`, params).subscribe((response) => {
      this.ngxService.stop();
			if (response) {
				if (response) {
					this.featuredEventListing = response['data'];
				}
			}
		}, (error) => {
      this.ngxService.stop();
			//console.log(error);
		});
	}

	getVideos() {
		let params= {
			is_active: true,
    };
    this.ngxService.start();
		this.http.setModule('video').list(params).subscribe((response) => {
      this.ngxService.stop();
			if (response) {
				this.videos = response.data;
				this.videos.map((el) => {
					el.youtube_url='https://www.youtube.com/embed/'+el.youtube_id;
				});
				// console.log(this.videos);
			}
		}, (error) => {
      this.ngxService.stop();
			this.commonService.showErrors(error);
		});
  }

	getUpcommingEvents() {
		let params= {
			pagination: true,
            limit: 10,
            is_publish: true,
            images: true,
			coming_soon: true,
			event: true,
			event_speaker:true,
			fetch_price: true,
			is_delete: true,
			is_active: true,
			date_filter:true,
			isApproved:true
    };
    this.ngxService.start();
		this.http.setModule('event').list(params).subscribe((response) => {
      this.ngxService.stop();
			if (response) {
				this.upcommingEvents = response.data;
				// console.log(this.upcommingEvents.length);
			}
		}, (error) => {
      this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}

	getPastEvents() {
		let params= {
			pagination: true,
            limit: 10,
            is_publish: true,
            images: true,
			event: true,
			event_speaker:true,
			fetch_price: true,
			is_delete: true,
			is_active: true,
			past_event:true,
			date_filter:true,
			isApproved:true
    };
    this.ngxService.start();
		this.http.setModule('event').list(params).subscribe((response) => {
      this.ngxService.stop();
			if (response) {
				this.pastEvents = response.data;
				 // console.log(this.pastEvents.length);
			}
		}, (error) => {
      this.ngxService.stop();
			this.commonService.showErrors(error);
		});
	}
	

}

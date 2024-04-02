import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd as Event } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { HttpRequestService } from '../../../services/http-request.service';
import { FrontendListingService } from '../../../services/frontend-listing.service';
import { of } from 'rxjs';

@Component({
	selector: 'app-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

	public banner: any;
	
	constructor(
		public router: Router,
		private http: HttpRequestService,
		public listingService: FrontendListingService
	) {
		router.events.pipe(
			mergeMap((event) => {
				if (event instanceof Event) {
					const urlStr = event.url.replace(/^\/|\/$/g, '');
					const urlArr = urlStr.split('/');
					// console.log(urlArr.shift());
					const code = urlArr.shift();
					return this.listingService.getBannerBySlug(code);
				} else {
					return of(null);
				}
			})
		).subscribe((data) => {
			if (data) {
				this.banner = data;
			}
		});
	}

	ngOnInit() {	
	
	}


}

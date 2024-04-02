import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { HttpRequestService } from './http-request.service';

@Injectable({
	providedIn: 'root'
})
export class FrontendListingService {

	private _categoryFilter: BehaviorSubject<any> = new BehaviorSubject(null);
	public categoryFilter$ = this._categoryFilter.asObservable();

	constructor(
		public httpService: HttpRequestService
	) { }

	private themeComponent: any = {
		banner: [
			{
				page: 'courses',
				apiData: {
					page: 'course-listing',
					is_active: true
				},
				title: 'Courses',
				description: 'Etiam vehicula sapien ac aliquet porttitor. Donec eget arcu neque. Fusce sed nisl non..'
			},
			{
				page: 'events',
				apiData: {
					page: 'event-listing',
					is_active: true
				},
				title: 'Events',
				description: 'Etiam vehicula sapien ac aliquet porttitor. Donec eget arcu neque. Fusce sed nisl non..'
			},
			{
				page: 'products',
				apiData: {
					page: 'product-listing',
					is_active: true
				},
				title: 'Products',
				description: 'Etiam vehicula sapien ac aliquet porttitor. Donec eget arcu neque. Fusce sed nisl non..'
			}
		],
		leftPanel: {
			courses: [
				{
					title: 'Browse by Categories',
					template: 'categoriesFilter',
					cssClass: 'courseMainLp'
				},
				{
					title: 'Browse by Instructor',
					template: 'instructorFilter',
					cssClass: 'shopMainLp'
				}
				// {
				// 	title: 'Featured Courses',
				// 	template: 'featuredCourses',
				// 	cssClass: 'courseMainLp'
				// }
			],
			events: [
				{
					title: 'Browse by Categories',
					template: 'categoriesFilter',
					cssClass: 'eventMainLp'
				},
				{
					title: 'Featured Events',
					template: 'featuredEvents',
					cssClass: 'eventMainLp'
				},
				{
					title: 'Browse By Country',
					template: 'countryFilter',
					cssClass: 'eventMainLp'
				},
				{
					title: 'Browse By Speaker',
					template: 'speakerFilter',
					cssClass: 'eventMainLp'
				}

			],
			products: [
				{
					title: 'Browse by Vendor',
					template: 'vendorFilter',
					cssClass: 'shopMainLp'
				},
				{
					title: 'Browse by Categories',
					template: 'categoriesFilter',
					cssClass: 'shopMainLp'
				}
			]
		}
	};

	getBannerBySlug(slug: string): Observable<any> {
		let banner = null;

		if (slug) {
			banner = this.themeComponent.banner.find((el) => {
				return (el.page === slug);
			});

			if (banner.apiData) {
				return this.httpService.setModule('pageSlider').search(banner.apiData).pipe(
					mergeMap((response) => {
						if (response) {
							const data = (response.data.length > 0) ? response.data[0] : null;
							return of(data);
						}
						return of(null);
					})
				);
			}
		}
		return of(banner);
	}

	getLeftPanelsBySlug(slug: string): Observable<any> {
		let leftPanel = null;

		if ((slug) && (slug in this.themeComponent.leftPanel)) {
			leftPanel = this.themeComponent.leftPanel[slug];
		}
		return of(leftPanel);
	}

	setCategory(category) {
		// const previousValue = this._categoryFilter.getValue();
		// console.log(category);
		this._categoryFilter.next(category);
	}

}

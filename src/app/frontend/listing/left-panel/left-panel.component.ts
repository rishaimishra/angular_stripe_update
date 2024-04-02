import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd as Event } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { CommonService } from '../../../global/services/common.service';
import { HttpRequestService } from '../../../services/http-request.service';

import { FrontendListingService } from '../../../services/frontend-listing.service';
import { environment } from '../../../../environments/environment';
import { EncrDecrService } from '../../../services/encr-decr.service';
@Component({
	selector: 'app-left-panel',
	templateUrl: './left-panel.component.html',
	styleUrls: ['./left-panel.component.scss'],
	providers: [NgbRatingConfig]
})
export class LeftPanelComponent implements OnInit {

	public leftPanels: Array<any> = [];
	public listingModule: string;

	@ViewChild('vendorFilter')
	vendorFilterTpl: TemplateRef<any>;

	@ViewChild('categoriesFilter')
	categoriesFilterTpl: TemplateRef<any>;

	@ViewChild('instructorFilter')
	instructorFilterTpl: TemplateRef<any>;

	@ViewChild('featuredEvents')
	featuredEventsTpl: TemplateRef<any>;

	@ViewChild('featuredCourses')
	featuredCoursesTpl: TemplateRef<any>;

	@ViewChild('countryFilter')
	countryFilterTpl: TemplateRef<any>;

	@ViewChild('speakerFilter')
	speakerFilterTpl: TemplateRef<any>;

	public featureSide: any = { items: 1, dots: false, nav: true, margin: 0 };

	public categories: Array<any> = [];
	public vendors: Array<any> = [];
	public eventCountries: Array<any> = [];
	public eventSpeakers: Array<any> = [];

	constructor(
		public router: Router,
		public route: ActivatedRoute,
		public listingService: FrontendListingService,
		private httpService: HttpRequestService,
		config: NgbRatingConfig,
		private commonService: CommonService,
		private EncrDecr: EncrDecrService
	) {
		config.max = 5;
		config.readonly = true;

		// router.events.pipe(
		// 	mergeMap((event) => {
		// 		if (event instanceof Event) {
		// 			const urlStr = event.url.replace(/^\/|\/$/g, '');
		// 			const urlArr = urlStr.split('/');
		// 			// console.log(urlArr.shift());
		// 			const code = urlArr.shift();
		// 			// const code = event.url.replace(/\//g, '');
		// 			// console.log(code);
		// 			this.listingModule = code;
		// 			return this.listingService.getLeftPanelsBySlug(code);
		// 		} else {
		// 			return of(null);
		// 		}
		// 	})
		// ).subscribe((data) => {
		// 	if (data) {
		// 		this.leftPanels = data;
		// 	}
		// });

		this.route.data.pipe(
			mergeMap((data) => {
				if ('listType' in data) {
					const code = data.listType;
					this.listingModule = data.listType;
					// console.log(code);
					this.listingModule = code;
					return this.listingService.getLeftPanelsBySlug(code);
				} else {
					return of(null);
				}
			})
		).subscribe((data) => {
			if (data) {
				this.leftPanels = data;
			}
		});
	}

	ngOnInit() {
		if (this.leftPanels.length > 0) {
			this.leftPanels.forEach((panel) => {
				switch (panel.template) {
					case 'vendorFilter':
						this.getVendors();
						break;
					case 'categoriesFilter':
						this.getCategories();
						break;
					case 'instructorFilter':
						this.getVendors();
						break;
					case 'featuredEvents':
						break;
					case 'featuredCourses':
						break;
					case 'countryFilter':
						this.getCountries();
						break;
					case 'speakerFilter':
						this.getSpeakers();
						break;
					default:
						break;
				}
			});
		}

	}

	getTemplateRef(template) {
		let tpl = null;
		switch (template) {
			case 'vendorFilter':
				tpl = this.vendorFilterTpl;
				break;
			case 'categoriesFilter':
				tpl = this.categoriesFilterTpl;
				break;
			case 'instructorFilter':
				tpl = this.instructorFilterTpl;
				break;
			case 'featuredEvents':
				tpl = this.featuredEventsTpl;
				break;
			case 'featuredCourses':
				tpl = this.featuredCoursesTpl;
				break;
			case 'countryFilter':
				tpl = this.countryFilterTpl;
				break;
			case 'speakerFilter':
				tpl = this.speakerFilterTpl;
				break;	
			default:
				break;
		}
		return tpl;
	}

	getCategories() {
		const params = {
			is_active: true,
			count: true
		};

		let routeParams = null;
		this.route.params.pipe(
			mergeMap((data) => {
				if ('category' in data) {
					routeParams = { category: data.category };
				} else {
					routeParams = data;
				}
				// params['type'] = this.listingModule;
				// return this.httpService.setModule('category').search(params);
				const params = {
					id:this.listingModule,
				};
				return this.httpService.setModule('productLeftPanel').update(params);
			})
		).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.categories = response.data;

					if (routeParams) {
						const category = this.categories.find((el) => {
							return (el.slug === routeParams.category);
						});

						// console.log(category);
						if (category) {
							this.listingService.setCategory(category);
						} else {
							this.listingService.setCategory(routeParams);
						}
					}
				}
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	getCountries () {

		const params = {
			id:'countries',
		};
		// this.httpService.setModule('eventCountry').list(params).subscribe((response) => {
		// 	if (response) {
		// 		if (response.data) {
		// 			this.eventCountries = response.data;
		// 		}
		// 	}
		// }, (error) => {
		// 	this.commonService.showErrors(error);
		// });
		this.httpService.setModule('productLeftPanel').update(params).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.eventCountries = response.data;
				//	console.log(this.eventCountries);
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
		this.httpService.setModule('productLeftPanel').update(params).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.eventSpeakers = response.data;
					
					// this.eventSpeakers.map((el)=>{
					// 	el.id = this.EncrDecr.set(environment.encrDecrKey,JSON.stringify(el.id));
					// }); 
					// console.log(this.eventSpeakers,'speakers');
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
	getVendors() {
		const params = {
			role: 'vendor',
			profile: true,
			is_active: 1,
			course_count: true
		};
		this.httpService.setModule('user').search(params).subscribe((response) => {
			if (response) {
				if (response.data) {
					this.vendors = response.data.filter(el => {
						if (el.profile) {
							return (Object.keys(el.profile).length > 0);
						} else {
							return false;
						}
					});
				}
			}
		}, (error) => {
			this.commonService.showErrors(error);
		});
	}
	getUserID(id) {
		return environment.vendorIdPrefix + id;
	}

	getUserName(user) {
		let name = '';

		if (user) {
			name += user.profile.first_name || '';
		//	name += (user.profile.middle_name) ? ' ' : '';
		//	name += user.profile.middle_name || '';
			name += (user.profile.last_name) ? ' ' : '';
			name += user.profile.last_name || '';
		}
		return name;
	}
	getSlug(user) {
		let name = '';

		if (user) {
			if (user.profile.middle_name !== null) {
				name += user.profile.first_name + '-' + user.profile.middle_name  + '-' + user.profile.last_name + '-' + user.id;
			} else {
				name += user.profile.first_name + '-' + user.profile.last_name + '-' + user.id;
			}
			name = name.replace(/\s+/g, '-').toLowerCase();
		} else {
			name = '';
		}
		return name.toLowerCase();
	}
}

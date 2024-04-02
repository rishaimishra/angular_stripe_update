import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-announcements',
	templateUrl: './announcements.component.html',
	styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
	@Input() courseDetail: any;
	featureSide = { items: 1, dots: false, nav: true, margin: 0 };
	// see more area
	seeMoreArea: Boolean = false;
	public loadMore: Boolean = false;

	constructor() { }

	ngOnInit() {
		// console.log(this.courseDetail);
	}

	seeMore() {
		this.seeMoreArea = true;
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

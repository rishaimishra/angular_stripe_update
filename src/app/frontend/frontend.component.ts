import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd as Event } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment as env } from '../../environments/environment';
import { HttpRequestService } from '../services/http-request.service';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../global/services/common.service';

import { LogoutMsgComponent } from '../common/include/logout-msg/logout-msg.component';

@Component({
	selector: 'app-frontend',
	templateUrl: './frontend.component.html',
	styleUrls: ['./frontend.component.scss']
})
export class FrontendComponent implements OnInit, OnDestroy {

	public logoutSubscription: Subscription;

	constructor(
		public router: Router,
		public modalService: NgbModal,
		public commonService: CommonService,
		public httpService: HttpRequestService
	) {

		if (document.getElementById('dynamicStyle')) {
			document.getElementById('dynamicStyle').remove();
		}

		router.events.subscribe((event: Event) => {
			if (event instanceof Event) {
				this.resetTimer(event);
			}
		});
	}

	ngOnInit() {
		this.logoutSubscription = interval(1000).pipe(
			mergeMap((times) => {
				return this.httpService.getLastActivateTime();
			})
		).subscribe((data) => {
			if (data) {
				if (data.diffObj.seconds >= env.idleDurationSeconds) {
					this.modalService.open(LogoutMsgComponent);
					this.commonService.removeCart();
					localStorage.clear();
					this.router.navigate(['/']);
				}
			}
		});
	}

	ngOnDestroy() {
		this.logoutSubscription.unsubscribe();
	}

	@HostListener('document:keyup', ['$event'])
	@HostListener('document:click', ['$event'])
	@HostListener('document:wheel', ['$event'])
	resetTimer(event) {
		// user action occured
		let logUser = null;
		// console.log(event);
		this.httpService.getUserObservable().pipe(
			mergeMap((user) => {
				if (user) {
					logUser = user;
				}
				return this.httpService.getLastActivateTime();
			})
		)
		.subscribe((data) => {
			if (logUser) {
				if (data) {
					if (data.diffObj.seconds >= env.idleDurationSeconds) {
						this.modalService.open(LogoutMsgComponent);
						this.commonService.removeCart();
						localStorage.clear();
						this.router.navigate(['/']);
					}
				}

				this.httpService.setLastActivateTime();
			}
		});
	}

}

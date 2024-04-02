import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd as Event } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment as env } from '../../../environments/environment';
import { HttpRequestService } from '../../services/http-request.service';
import { mergeMap } from 'rxjs/operators';
import { CommonService } from '../../global/services/common.service';

import { LogoutMsgComponent } from '../../common/include/logout-msg/logout-msg.component';

@Component({
	selector: 'app-product-layout',
	templateUrl: './product-layout.component.html',
	styleUrls: ['./product-layout.component.scss']
})
export class ProductLayoutComponent implements OnInit, OnDestroy {

	public logoutSubscription: Subscription;

	constructor(
		public router: Router,
		public modalService: NgbModal,
		public commonService: CommonService,
		public httpService: HttpRequestService
	) {
		if (!document.getElementById('dynamicStyle')) {
			const link = document.createElement('link');
			link.id = 'dynamicStyle';
			link.rel = 'stylesheet';
			link.href = './assets/custom.css';
			document.head.appendChild(link);
		}

		router.events.subscribe((event: Event) => {
			if (event instanceof Event) {
				this.resetTimer(event);
			}
		});
	}

	ngOnInit() {
		// require('style-loader!../../../assets/custom.css');

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

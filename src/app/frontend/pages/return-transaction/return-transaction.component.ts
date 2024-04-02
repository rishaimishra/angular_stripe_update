import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-return-transaction',
	templateUrl: './return-transaction.component.html',
	styleUrls: ['./return-transaction.component.scss']
})
export class ReturnTransactionComponent implements OnInit, AfterViewInit {

	constructor(
		public router: Router,
		public route: ActivatedRoute
	) {
		window.onload = function() { window.history.forward(); };
		window.onpageshow = function (evt) {
			if (evt.persisted) {
				window.history.forward();
			}
		};

		this.route.queryParams.subscribe((params) => {
			// console.log(params);
		});
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
	}

}

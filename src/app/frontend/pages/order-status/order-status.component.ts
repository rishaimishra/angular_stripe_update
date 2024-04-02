import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonService } from '../../../global/services/common.service';

@Component({
	selector: 'app-order-status',
	templateUrl: './order-status.component.html',
	styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

	public orderTemplate: string;
	public messageObj: any = null;

	constructor(
		public route: ActivatedRoute,
		public commonService: CommonService
	) { }

	ngOnInit() {
		this.messageObj = this.commonService.getFlashMessage();
		// console.log(this.messageObj);
		this.route.data.subscribe((data) => {
			if (data) {
				this.orderTemplate = data.status;
			}
		});

	}

}

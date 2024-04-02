import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { environment as env } from '../../../environments/environment';
import { EncrDecrService } from './../../services/encr-decr.service';
@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit, OnChanges {

	@Input() itemDetails: any;
	@Input() viewClass: any;
	public item: any;
	public speakers: any;
	public noImage: any = env.noImage;
	public ticketBookingStatus:any;
	public ticketCategories :Array<any> =[];
	constructor(
		private EncrDecr: EncrDecrService 
	) { }

	ngOnInit() {
		
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes) {
			if (changes.itemDetails) {
				this.item = changes.itemDetails.currentValue;
				this.speakers = Array.prototype.map.call(this.item.event_speakers , s => s.name).toString();

				let calDiff = + Date.now() - +new Date(this.item.event.end_date).getTime();
				let DiffInDays = Math.round(Math.abs(calDiff/(1000*60*60*24)));
				// console.log(DiffInDays);
					if(DiffInDays == 0){
						this.ticketBookingStatus = 'ongoing';
					} else if(moment().isAfter(moment(this.item.event.end_date))) {
						this.ticketBookingStatus = 'past';
					} else if (moment().isAfter(moment(this.item.event.start_date))) {
						this.ticketBookingStatus = 'ongoing';
					}else {
						let diffc = + Date.now() - +new Date(this.item.event.start_date).getTime();
						let days = Math.round(Math.abs(diffc/(1000*60*60*24)));
						// console.log(this.item,'item');
						// console.log(days,'days');
						let ticketBookingTimeDiff =  localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).ticketBookingTimeDiff : env.ticketBookingTimeDiff;

						if (ticketBookingTimeDiff>days) {
							this.ticketBookingStatus = 'close';
						} else {
							this.ticketCategories = this.item.pricable.filter((el) => {
								return el.quantity>0;
							});
							if (this.ticketCategories.length> 0) {
								this.ticketBookingStatus = 'open';
							} else {
								this.ticketBookingStatus = 'full';
							}
							//this.ticketBookingStatus = 'open';
						}
					}
			}
			if (changes.viewClass) {
				this.viewClass = changes.viewClass.currentValue;
			}
		}
	}

	getCoverThumbnailImage(images) {
		let imgUrl = '';
		// console.log(images);
		if (images.length > 0) {
			const img = images[0];
			// console.log(img);
			imgUrl = img.thumbnail;
		}
		return imgUrl;
	}

}

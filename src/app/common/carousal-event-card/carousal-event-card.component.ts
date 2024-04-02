import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { environment as env } from '../../../environments/environment';
import { EncrDecrService } from './../../services/encr-decr.service';
@Component({
  selector: 'app-carousal-event-card',
  templateUrl: './carousal-event-card.component.html',
  styleUrls: ['./carousal-event-card.component.scss']
})
export class CarousalEventCardComponent implements OnInit,OnChanges {
  @Input() item: any;
  @Input() cardType: any;

  public speakers: any;
  constructor(
    private EncrDecr: EncrDecrService 
  ) { }
  public ticketBookingStatus:any;
  public ticketCategories :Array<any> =[];
  ngOnInit() {
  
    let calDiff = + Date.now() - +new Date(this.item.event.end_date).getTime();
				let DiffInDays = Math.round(Math.abs(calDiff/(1000*60*60*24)));
				// console.log(DiffInDays);
		if(DiffInDays == 0){
			this.ticketBookingStatus = 'ongoing';
		} else if(moment().isAfter(moment(this.item.event.end_date))) {
      this.ticketBookingStatus = 'past';
    } else if (moment().isAfter(moment(this.item.event.start_date))) {
      this.ticketBookingStatus = 'ongoing';
    } else {
      let diffc = + Date.now() - +new Date(this.item.event.start_date).getTime();
      let days = Math.round(Math.abs(diffc/(1000*60*60*24)));
     // console.log(days);

     let ticketBookingTimeDiff =  localStorage.getItem('siteSettings') != null ? JSON.parse(this.EncrDecr.get(env.encrDecrKey,decodeURIComponent(localStorage.getItem('siteSettings')))).ticketBookingTimeDiff : env.ticketBookingTimeDiff;

      if (ticketBookingTimeDiff >days) {
        this.ticketBookingStatus = 'close';
      } else {
       // this.ticketBookingStatus = 'open';
        this.ticketCategories = this.item.pricable.filter((el) => {
          return el.quantity>0;
        });
        if (this.ticketCategories.length> 0) {
          this.ticketBookingStatus = 'open';
        } else {
          this.ticketBookingStatus = 'full';
        }
      }
    }
    this.speakers = Array.prototype.map.call(this.item.event_speakers , s => s.name).toString();
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes) {
     // console.log(this.cardType);
    }
   }
  getEventFeaturedThumbnailImage(images) {
		let imgUrl = '';
		if (images.length > 0) {
			const img = images[0];
			// console.log(img);
			imgUrl = img.thumbnail;
		} else {
      imgUrl = 'assets/images/noimg_400_400.jpg';
    }
		return imgUrl;
	}
}

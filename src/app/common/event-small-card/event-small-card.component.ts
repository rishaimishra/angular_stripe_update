import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-event-small-card',
  templateUrl: './event-small-card.component.html',
  styleUrls: ['./event-small-card.component.scss']
})
export class EventSmallCardComponent implements OnInit {
	@Input() item: any;
  constructor() { }

  ngOnInit() {
  }

}

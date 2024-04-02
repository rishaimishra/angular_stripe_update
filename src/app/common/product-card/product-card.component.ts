import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

import { environment as env } from '../../../environments/environment';

@Component({
	selector: 'app-product-card',
	templateUrl: './product-card.component.html',
	styleUrls: ['./product-card.component.scss'],
	providers: [NgbRatingConfig]
})
export class ProductCardComponent implements OnInit, OnChanges {

	@Input() itemDetails: any;
	@Input() viewClass: any;
	public item: any;

	public noImage: any = env.noImage;
	public productPrice: any;
	constructor(
		config: NgbRatingConfig
	) {
		config.max = 5;
		config.readonly = true;
	}

	ngOnInit() {

		if(this.itemDetails.pricable.length>0) {
			
			this.productPrice = this.itemDetails.pricable[0] ;
		} else {
			this.productPrice = 0;
		}
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes) {
			// console.log(changes);
			if (changes.itemDetails) {
				this.item = changes.itemDetails.currentValue;
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

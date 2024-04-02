import { Component, OnInit ,Input, OnChanges, SimpleChanges } from '@angular/core';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-product-by-vendor',
  templateUrl: './product-by-vendor.component.html',
  styleUrls: ['./product-by-vendor.component.scss']
})
export class ProductByVendorComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() currentProductId:any;

  public productPrice: any;
  public item: any;

  constructor(config: NgbRatingConfig) {
    config.max = 5;
    config.readonly = true;
   }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
		if (changes) {
      console.log(changes);
			if (changes.data) {
				this.item = changes.data.currentValue;
				// console.log(this.item, 'onChange');
				/*****************************
				 * New code for price start
				 *****************************/
				if(this.item.pricable.length>0) {
					this.productPrice = this.item.pricable[0] ;
				} else {
					this.productPrice = 0;
				}
				// console.log(this.productPrice);
				/*****************************
				 * New code for price end
				 *****************************/
			}
		}
  }
  
}

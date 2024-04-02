import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  constructor() { }

  shopList : number = 1;

  ngOnInit() {
  }

  listingView()
  {
    this.shopList = 0;    
  }

  gridView()
  {
    this.shopList = 1;
  }

  // featuredCourse = {
  //   items: 5, dots: false,
  //   responsiveClass: true,
  //   nav: true,
  //   margin: 20,
  //   responsive: { 0: { items: 1 }, 400: { items: 2, margin: 10 }, 1023: { items: 4, margin: 10 }, 1138: { items: 5 } }
  // };

  productCrousel = {
    items: 5, dots: false,
    responsiveClass: true,
    nav: true,
    margin: 20,
    responsive: { 0: { items: 1 }, 400: { items: 2, margin: 10 }, 1023: { items: 4, margin: 10 }, 1138: { items: 5 } }
  };
  

}

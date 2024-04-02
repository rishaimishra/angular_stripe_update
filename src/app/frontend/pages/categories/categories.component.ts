import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  featuredCourse={items: 5, dots: false, responsiveClass:true, nav: true, margin:20, responsive:{0: {items: 1}, 400: {items: 2, margin:10}, 1023: {items: 4, margin:10}, 1138: {items: 5}}};
  popInstructure={items: 5, dots: false, responsiveClass:true, nav: true, margin:20, responsive:{0: {items: 1}, 400: {items: 2, margin:10}, 1023: {items: 4, margin:10}, 1138: {items: 5}}};

}

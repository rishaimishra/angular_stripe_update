import { Component, OnInit } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  featureSide = {items: 1, dots: false, nav: true, margin: 0};
  constructor() { }

  ngOnInit() {
  }


  // see more area

  seeMoreArea: boolean=false;

  seeMore(){
    this.seeMoreArea=true;
  }

}

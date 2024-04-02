import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

//  navigation toggle start

  showNav: boolean=false;
  
  navBtn(){
    this.showNav=true;
  }

  cnacelBtn(){
    this.showNav=false;
  }

 

//  navigation toggle end

}

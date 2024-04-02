import { Injectable } from '@angular/core';
import { HttpRequestService } from './http-request.service';
import { CommonService } from '../global/services/common.service';
import { CanActivate } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CourseEditGurd implements CanActivate {
  public status:boolean;
  constructor(
    protected http: HttpRequestService,
    private commonService: CommonService,
  ) { 
    this.http.isCourseEditable().subscribe(response => {
      if(response) {
        this.status=true;
      } 
    }, (errors) => {
		      //  console.log('11');
        this.commonService.showMessage({type: 'error',title:'',message:'Someone has already purchased this course'});
        this.status=false;
		});
  }
  canActivate() {

    return this.http.isCourseEditable();
    
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { HttpRequestService } from '../../services/http-request.service';
import { CommonService } from '../../global/services/common.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {

  private toasterService: ToasterService;
  public courseSlug: number;
  public courseData: any;
  public userDetails; any = [];

  constructor(
    private myRoute: Router,
    toasterService: ToasterService,
    private commonService: CommonService,
    private httpService: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private _location: Location
  ) {
    this.toasterService = toasterService;
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.courseSlug = this.activatedRoute.snapshot.params['id'];
    this.userDetails = this.httpService.getUser();
    if (this.courseSlug != undefined) {
      this.getCourseDetails();
    }
  }

  backClicked() {
    this._location.back();
  }

  getCourseDetails() {
    this.ngxService.start();
    this.httpService.get(`course/${this.courseSlug}?course_modules=true&course_lectures=true&categories=true&user=true`).subscribe((response) => {
      if (response['status'] === 'success') {
        this.courseData = response['data'];
        console.log(this.courseData);
        this.ngxService.stop();
      }
    }, (errors) => {
      window.scroll(0, 0);
      this.ngxService.stop();
    });
  }

}

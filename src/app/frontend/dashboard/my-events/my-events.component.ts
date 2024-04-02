import { Component, OnInit, Renderer } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment as env } from '../../../../environments/environment';

import { HttpRequestService } from '../../../services/http-request.service';
import { CommonService } from '../../../global/services/common.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { SeoServiceService }  from '../../../services/seo-service.service';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {


  public records: Array<any> = [];
  public sendData: any = null;
  public loggedUser: any = null;

  public searchParams: any = {
    order_by: '-id',
    limit: this.httpService.vendorPerPage,
    page: 1,
    my_order: true,
    pagination: true,
    // images:true,
    // event_country:true,
    // fetch_price: true,
  };
  searchForm: FormGroup;
  public paginationObj: any;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private httpService: HttpRequestService,
    config: NgbRatingConfig,
    private ngxService: NgxUiLoaderService,
    public SeoService:SeoServiceService
  ) { }

  ngOnInit() {
    window.scroll(0,0);
    this.SeoService.getMetaInfo();
    this.getEvents();
  }

  getEvents() {
    this.ngxService.start();
    this.httpService.getUserObservable().pipe(
      mergeMap((user) => {
        if (user) {            
          return this.httpService.get(`utility/my-event/`+user.user.id, this.searchParams);
        }
      })
    ).subscribe((response) => {
      this.ngxService.stop();
      if (response) {    
        window.scroll(0,0);    
        this.records = response['data'];
        this.paginationObj = response['pagination'];
      }
    }, (error) => {
      this.ngxService.stop();
      this.commonService.showErrors(error);
    });
  }

  pagination(event) {
    if (event) {
      this.searchParams.page = event.page;
      this.getEvents();
    }
  }

  timeFormate(time: any) {
    if (time) {
      return this.commonService.timeConvert(time);
    } else {
      return time;
    }
  }

  getOrderID(id){
		return environment.orderIdPrefix + id;
	}
}

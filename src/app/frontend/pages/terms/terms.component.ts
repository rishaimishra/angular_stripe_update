import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpRequestService } from '../../../services/http-request.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SeoServiceService }  from '../../../services/seo-service.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TermsComponent implements OnInit {

  constructor(
    private http: HttpRequestService,
    private ngxService: NgxUiLoaderService,
    public SeoService:SeoServiceService
    ) { }

  title: any;
  content: any;
  ngOnInit() {
    this.getData();
    window.scroll(0,0);
    this.SeoService.getMetaInfo();
  }

  getData() {
    this.ngxService.start();
    this.http.get('cms-page/terms').subscribe((response) => {
      this.ngxService.stop();
      if (response['status'] === 'success') {
        this.title = response['data'].title;
        this.content = response['data'].content;
      }
    },(errors) => {
			this.ngxService.stop();
			// this.commonService.showErrors(errors);
			});
  }

}
